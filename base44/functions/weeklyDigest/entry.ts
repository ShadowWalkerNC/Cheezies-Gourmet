import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "oglmf@hotmail.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const weekOf = now.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York"
    });
    const prevWeekStart = oneWeekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });
    const prevWeekEnd = now.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/New_York" });

    // Fetch all data in parallel
    const [users, menuItems, truckLocations] = await Promise.all([
      base44.asServiceRole.entities.User.list(),
      base44.asServiceRole.entities.MenuItem.list(),
      base44.asServiceRole.entities.TruckLocation.list("-updated_date", 10),
    ]);

    // User stats
    const totalUsers = users.length;
    const newUsersThisWeek = users.filter(u => new Date(u.created_date) >= oneWeekAgo).length;
    const newUsersPrevWeek = users.filter(u => {
      const d = new Date(u.created_date);
      return d >= twoWeeksAgo && d < oneWeekAgo;
    }).length;
    const userGrowthDelta = newUsersThisWeek - newUsersPrevWeek;
    const userGrowthSign = userGrowthDelta >= 0 ? "+" : "";

    // Menu stats
    const activeItems = menuItems.filter(i => i.is_active !== false).length;
    const featuredItems = menuItems.filter(i => i.is_featured).length;
    const sectionCounts = menuItems.reduce((acc, item) => {
      if (item.is_active !== false) acc[item.section] = (acc[item.section] || 0) + 1;
      return acc;
    }, {});
    const sectionLines = Object.entries(sectionCounts)
      .map(([section, count]) => `  • ${section}: ${count} items`)
      .join("\n");

    // Truck location stats
    const latestLocation = truckLocations[0];
    const statusLabel = latestLocation?.status === "open" ? "🟢 Open" :
                        latestLocation?.status === "en_route" ? "🟡 En Route" : "🔴 Closed";
    const currentAddress = latestLocation?.address || "Not set";

    // Location updates this week
    const locationUpdatesThisWeek = truckLocations.filter(
      l => new Date(l.updated_date) >= oneWeekAgo
    ).length;

    // Admin users
    const adminUsers = users.filter(u => u.role === "admin").length;
    const regularUsers = totalUsers - adminUsers;

    // Verify owner is a registered user (required to send emails)
    const ownerExists = users.some(u => u.email === OWNER_EMAIL);
    if (!ownerExists) {
      return Response.json({ success: false, message: `Owner (${OWNER_EMAIL}) must be a registered app user. Please invite them via the dashboard.` });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      from_name: "Cheezies Gourmet Analytics",
      subject: `📊 Weekly Analytics Report — ${prevWeekStart} to ${prevWeekEnd}`,
      body: `
══════════════════════════════════════
  🧀 CHEEZIES GOURMET — WEEKLY REPORT
  Week of ${weekOf}
══════════════════════════════════════

👥 AUDIENCE & USERS
────────────────────────────────────
  Total registered users:   ${totalUsers}
  New this week:            ${newUsersThisWeek} (${userGrowthSign}${userGrowthDelta} vs prior week)
  Admin accounts:           ${adminUsers}
  Regular users:            ${regularUsers}

🚚 TRUCK OPERATIONS
────────────────────────────────────
  Current status:           ${statusLabel}
  Current location:         ${currentAddress}
  Location updates (7d):    ${locationUpdatesThisWeek}
  Open days configured:     ${latestLocation?.open_days?.join(", ") || "Not set"}
  Hours:                    ${latestLocation?.hours_open || "?"} – ${latestLocation?.hours_close || "?"}

🍽️ MENU OVERVIEW
────────────────────────────────────
  Active menu items:        ${activeItems}
  Featured (on home page):  ${featuredItems}
  Items by section:
${sectionLines || "  (no items)"}

📋 WEEKLY CHECKLIST
────────────────────────────────────
  [ ] Post today's location on Facebook & Instagram
  [ ] Reply to any catering or event requests
  [ ] Check for new newsletter signups
  [ ] Verify menu items are up to date
  [ ] Update truck hours if schedule changed

💡 TIP OF THE WEEK
────────────────────────────────────
  Posting your location before 11am drives the most
  lunchtime foot traffic. Consistent daily posts on
  Facebook + Instagram = more regulars!

──────────────────────────────────────
  Cheezies Gourmet Admin Dashboard
  cheeziesgourmet.com/admin
══════════════════════════════════════
      `.trim(),
    });

    return Response.json({ success: true, message: "Weekly analytics digest sent", stats: { totalUsers, newUsersThisWeek, activeItems } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});