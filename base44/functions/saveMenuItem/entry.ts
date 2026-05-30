import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { action, itemId, payload } = body;

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