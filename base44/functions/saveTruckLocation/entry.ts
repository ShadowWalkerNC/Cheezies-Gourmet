import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { recordId, payload } = body;

    let result;
    if (recordId) {
      result = await base44.asServiceRole.entities.TruckLocation.update(recordId, payload);
    } else {
      result = await base44.asServiceRole.entities.TruckLocation.create(payload);
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});