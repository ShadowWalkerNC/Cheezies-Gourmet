import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_PASSCODE = "cheezies2024";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { passcode, action, itemId, payload, entity } = body;

    // Allow either admin user OR valid passcode
    let authorized = false;
    try {
      const user = await base44.auth.me();
      if (user && user.role === 'admin') authorized = true;
    } catch {}
    if (!authorized && passcode === ADMIN_PASSCODE) authorized = true;

    if (!authorized) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const entityName = entity === "WeeklySpecial" ? "WeeklySpecial" : "MenuItem";

    let result;
    if (action === "create") {
      result = await base44.asServiceRole.entities[entityName].create(payload);
    } else if (action === "update") {
      result = await base44.asServiceRole.entities[entityName].update(itemId, payload);
    } else if (action === "delete") {
      await base44.asServiceRole.entities[entityName].delete(itemId);
      result = { deleted: true };
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});