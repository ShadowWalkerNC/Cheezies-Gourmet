import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { passcode, action, itemId, payload } = body;

    if (passcode !== "cheezies2024") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let result;
    if (action === "create") {
      result = await base44.asServiceRole.entities.MenuItem.create(payload);
    } else if (action === "update") {
      result = await base44.asServiceRole.entities.MenuItem.update(itemId, payload);
    } else if (action === "delete") {
      await base44.asServiceRole.entities.MenuItem.delete(itemId);
      result = { deleted: true };
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});