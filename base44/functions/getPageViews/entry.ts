import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const views = await base44.asServiceRole.entities.PageView.list("-created_date", 2000);
    return Response.json({ views });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});