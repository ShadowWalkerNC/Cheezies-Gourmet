import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "cheeziesgourmet@gmail.com";

// Runs every Monday to send a weekly activity summary
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all users
    const users = await base44.asServiceRole.entities.User.list();
    const totalUsers = users.length;

    // Calculate new users this past week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newUsers = users.filter(u => new Date(u.created_date) >= oneWeekAgo).length;

    const weekOf = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });

    // Find owner in registered users and send email
    const owner = users.find(u => u.email === OWNER_EMAIL);
    if (!owner) {
      return Response.json({ success: false, message: `Owner (${OWNER_EMAIL}) must be a registered app user to receive emails. Please invite them via the dashboard.` });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `📊 Weekly Summary – Week of ${weekOf}`,
      body: `Hey! Here's your Cheezies Gourmet weekly summary 🧀

📱 App Activity:
• Total registered users: ${totalUsers}
• New users this week: ${newUsers}

📌 Weekly Checklist:
• [ ] Post daily truck locations on social media
• [ ] Respond to any outstanding catering inquiries
• [ ] Check in on any merch notification signups
• [ ] Update your Square menu if anything changed

💡 Tip: Consistent location posts drive the most traffic to the truck!

Keep crushing it! 🚚🔥

— Cheezies Gourmet App`,
    });

    return Response.json({ success: true, message: "Weekly digest sent" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});