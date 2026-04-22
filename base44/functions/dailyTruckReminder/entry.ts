import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "oglmf@hotmail.com";

// Runs every weekday morning to remind owner to post today's truck location
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const day = new Date().toLocaleDateString("en-US", { weekday: "long", timeZone: "America/New_York" });
    const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });

    // Verify owner is a registered user
    const users = await base44.asServiceRole.entities.User.list();
    const owner = users.find(u => u.email === OWNER_EMAIL);
    if (!owner) {
      return Response.json({ success: false, message: `Owner (${OWNER_EMAIL}) must be a registered app user to receive emails.` });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `📍 Reminder: Post Today's Truck Location – ${day}, ${date}`,
      body: `Good morning! 🧀

Don't forget to post today's truck location on your social media channels:

• Facebook: https://www.facebook.com/profile.php?id=61572987417963
• Instagram: https://instagram.com/cheeziesohio
• TikTok: https://tiktok.com/@cheeziesohio

Your customers are already checking to find you! 🚚

— Cheezies Gourmet App`,
    });

    return Response.json({ success: true, message: "Daily reminder sent" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});