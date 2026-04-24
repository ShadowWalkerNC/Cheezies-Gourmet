import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { passcode, recordId, payload } = body;

    if (passcode !== "cheezies2024") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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