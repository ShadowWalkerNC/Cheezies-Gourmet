import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const token = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const ownerEmail = Deno.env.get("OWNER_EMAIL");

    const body = await req.json().catch(() => ({}));
    const action = body.action || "orders";

    if (action === "orders") {
      // Fetch recent orders from Square
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startAt = today.toISOString();

      const res = await fetch("https://connect.squareup.com/v2/orders/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-01-17"
        },
        body: JSON.stringify({
          query: {
            filter: {
              date_time_filter: {
                created_at: { start_at: startAt }
              },
              state_filter: { states: ["COMPLETED", "OPEN"] }
            },
            sort: { sort_field: "CREATED_AT", sort_order: "DESC" }
          },
          limit: 50
        })
      });

      const data = await res.json();
      const orders = data.orders || [];

      // Calculate summary
      const totalRevenue = orders.reduce((sum, o) => {
        const amount = o.total_money?.amount || 0;
        return sum + amount;
      }, 0);

      const summary = {
        order_count: orders.length,
        total_revenue_cents: totalRevenue,
        total_revenue_dollars: (totalRevenue / 100).toFixed(2),
        orders: orders.map(o => ({
          id: o.id,
          created_at: o.created_at,
          state: o.state,
          total: ((o.total_money?.amount || 0) / 100).toFixed(2),
          items: (o.line_items || []).map(i => ({ name: i.name, qty: i.quantity, price: ((i.total_money?.amount || 0) / 100).toFixed(2) }))
        }))
      };

      return Response.json({ success: true, ...summary });

    } else if (action === "notify_new_orders") {
      // Fetch orders from last 15 minutes and email owner
      const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();

      const res = await fetch("https://connect.squareup.com/v2/orders/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-01-17"
        },
        body: JSON.stringify({
          query: {
            filter: {
              date_time_filter: { created_at: { start_at: since } },
              state_filter: { states: ["COMPLETED", "OPEN"] }
            }
          },
          limit: 20
        })
      });

      const data = await res.json();
      const orders = data.orders || [];

      if (orders.length > 0 && ownerEmail) {
        const orderLines = orders.map(o => {
          const items = (o.line_items || []).map(i => `• ${i.name} x${i.quantity}`).join("\n");
          const total = ((o.total_money?.amount || 0) / 100).toFixed(2);
          return `Order #${o.id.slice(-6).toUpperCase()} — $${total}\n${items}`;
        }).join("\n\n");

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: ownerEmail,
          subject: `🧀 ${orders.length} New Square Order${orders.length > 1 ? "s" : ""} — Cheezies`,
          body: `You have ${orders.length} new order${orders.length > 1 ? "s" : ""} in the last 15 minutes:\n\n${orderLines}\n\nView all orders: https://squareup.com/dashboard/orders`
        });
      }

      return Response.json({ success: true, new_orders: orders.length });

    } else if (action === "customers") {
      // Fetch recent Square customers
      const res = await fetch("https://connect.squareup.com/v2/customers?sort_field=CREATED_AT&sort_order=DESC&limit=50", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Square-Version": "2024-01-17"
        }
      });
      const data = await res.json();
      const customers = (data.customers || []).map(c => ({
        id: c.id,
        name: `${c.given_name || ""} ${c.family_name || ""}`.trim(),
        email: c.email_address,
        phone: c.phone_number,
        created_at: c.created_at,
        visit_count: c.preferences?.email_unsubscribed ? 0 : 1
      }));

      return Response.json({ success: true, customers, total: customers.length });

    } else if (action === "sales_summary") {
      // Weekly sales summary
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const res = await fetch("https://connect.squareup.com/v2/orders/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-01-17"
        },
        body: JSON.stringify({
          query: {
            filter: {
              date_time_filter: { created_at: { start_at: weekAgo } },
              state_filter: { states: ["COMPLETED"] }
            }
          },
          limit: 500
        })
      });

      const data = await res.json();
      const orders = data.orders || [];

      // Group by day
      const byDay = {};
      orders.forEach(o => {
        const day = o.created_at.slice(0, 10);
        if (!byDay[day]) byDay[day] = { count: 0, revenue: 0 };
        byDay[day].count++;
        byDay[day].revenue += (o.total_money?.amount || 0) / 100;
      });

      const dailyBreakdown = Object.entries(byDay).sort().map(([date, d]) => ({
        date,
        orders: d.count,
        revenue: d.revenue.toFixed(2)
      }));

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_money?.amount || 0) / 100, 0);

      return Response.json({
        success: true,
        week_orders: orders.length,
        week_revenue: totalRevenue.toFixed(2),
        daily_breakdown: dailyBreakdown
      });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});