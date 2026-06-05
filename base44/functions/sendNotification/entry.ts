import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "oglmf@hotmail.com";

// Simple in-memory rate limiter: max 5 requests per IP per 10 minutes
const rateLimitMap = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

Deno.serve(async (req) => {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

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
      if (!data?.name || !data?.email || !data?.eventType) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return Response.json({ error: "Invalid email" }, { status: 400 });
      }
      subject = `Catering Inquiry from ${data.name}`;
      body = `
Name: ${data.name}
Email: ${data.email}
Phone: ${data?.phone || "N/A"}
Event Type: ${data.eventType}
Guest Count: ${data?.guestCount}
Date: ${data?.date || "TBD"}
Message: ${data?.message || "N/A"}
      `.trim();

    } else if (type === "newsletter_signup") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data?.email || !emailRegex.test(data.email)) {
        return Response.json({ error: "Invalid email" }, { status: 400 });
      }
      // Check if email already subscribed
      const existing = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ email: data.email });
      if (existing.length > 0) {
        return Response.json({ error: "already_subscribed" }, { status: 409 });
      }
      // Save subscriber
      await base44.asServiceRole.entities.NewsletterSubscriber.create({
        email: data.email,
        birthday: data.birthday || null,
        promo_claimed: true,
        source: data.source || "popup",
      });
      subject = "New Newsletter Subscriber";
      body = `New subscriber: ${data.email}${data.birthday ? ` | Birthday: ${data.birthday}` : ""}`;
      // Also send welcome email with promo code to subscriber
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: data.email,
        subject: "🧀 Welcome to Cheezies — Here's Your Promo Code!",
        body: `Thanks for joining the Cheezies crew!\n\nUse code CHEEZIE26 on your next order for a special discount.\n\nOrder online: https://cheeziesgourmetohio.square.site/\n\nSee you at the truck! 🧀`,
      });

    } else if (type === "loyalty_signup") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data?.email || !emailRegex.test(data.email)) {
        return Response.json({ error: "Invalid email" }, { status: 400 });
      }
      subject = "New Loyalty Program Signup";
      body = `${data.email} wants to join the Square Loyalty program. Enroll them at the next visit.`;

    } else if (type === "merch_notify") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data?.email || !emailRegex.test(data.email)) {
        return Response.json({ error: "Invalid email" }, { status: 400 });
      }
      subject = "Merch Drop Notification Request";
      body = `${data.email} wants to be notified for the merch drop.`;

    } else if (type === "contact_message") {
      if (!data?.name || !data?.email || !data?.message) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return Response.json({ error: "Invalid email" }, { status: 400 });
      }
      subject = `New Message from ${data.name}`;
      body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data?.phone || "N/A"}\n\nMessage:\n${data.message}`;
      // Also send confirmation to the customer
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: data.email,
        subject: "We got your message — Cheezies Gourmet",
        body: `Hi ${data.name},\n\nThanks for reaching out! We received your message and will get back to you soon.\n\nYour message:\n"${data.message}"\n\n— Cheezies Gourmet\ncheeziesohio@gmail.com | 330-510-8875`,
      });

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