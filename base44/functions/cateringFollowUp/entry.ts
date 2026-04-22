import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "cheeziesgourmet@gmail.com";

// Sends a follow-up reminder 48 hours after a catering inquiry if not yet acted on
// Called by scheduler — checks for recent catering inquiry users to prompt follow-up
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const now = new Date();
    const date = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York" });

    // Verify owner is a registered user
    const users = await base44.asServiceRole.entities.User.list();
    const owner = users.find(u => u.email === OWNER_EMAIL);
    if (!owner) {
      return Response.json({ success: false, message: `Owner (${OWNER_EMAIL}) must be a registered app user to receive emails.` });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject: `⏰ Catering Follow-Up Reminder – ${date}`,
      body: `Hi! This is your catering follow-up reminder 🧀

It's been 48 hours — if you've received any catering inquiries recently, now is a great time to follow up with those potential clients!

📋 Quick tips:
• A quick response dramatically increases booking rates
• If you already replied, great work — ignore this reminder!
• Call or email clients who haven't confirmed yet

Check your inbox for any catering inquiry emails from the past few days.

Keep those bookings rolling in! 🎉

— Cheezies Gourmet App`,
    });

    return Response.json({ success: true, message: "Catering follow-up reminder sent" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});