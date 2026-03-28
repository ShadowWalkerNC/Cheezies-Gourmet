import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "cheeziesgourmet@gmail.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { type, data } = await req.json();

    let subject, body;

    if (type === "account_deletion") {
      // Require auth for account deletion
      const user = await base44.auth.me();
      if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
      subject = "Account Deletion Request";
      body = `User ${user.email} (${user.full_name}) has requested account deletion.`;

    } else if (type === "catering_inquiry") {
      subject = `Catering Inquiry from ${data?.name || "Unknown"}`;
      body = `
Name: ${data?.name}
Email: ${data?.email}
Phone: ${data?.phone || "N/A"}
Event Type: ${data?.eventType}
Guest Count: ${data?.guestCount}
Date: ${data?.date || "TBD"}
Message: ${data?.message || "N/A"}
      `.trim();

    } else if (type === "newsletter_signup") {
      subject = "New Newsletter Subscriber";
      body = `New subscriber: ${data?.email}`;

    } else if (type === "merch_notify") {
      subject = "Merch Drop Notification Request";
      body = `${data?.email} wants to be notified for the merch drop.`;

    } else {
      return Response.json({ error: "Unknown notification type" }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: OWNER_EMAIL,
      subject,
      body,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});