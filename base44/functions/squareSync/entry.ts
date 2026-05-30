import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const token = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const ownerEmail = Deno.env.get("OWNER_EMAIL");

    const body = await req.json().catch(() => ({}));
    const action = body.action || "orders";

    if (action === "orders") {
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
              date_time_filter: { created_at: { start_at: startAt } },
              state_filter: { states: ["COMPLETED", "OPEN"] }
            },
            sort: { sort_field: "CREATED_AT", sort_order: "DESC" }
          },
          limit: 50
        })
      });

      const data = await res.json();
      const orders = data.orders || [];

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total_money?.amount || 0), 0);

      return Response.json({
        success: true,
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
      });

    } else if (action === "notify_new_orders") {
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

    } else if (action === "loyalty") {
      // Fetch Square Loyalty accounts
      const res = await fetch("https://connect.squareup.com/v2/loyalty/accounts/search", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-01-17"
        },
        body: JSON.stringify({ limit: 200 })
      });
      const data = await res.json();
      const accounts = (data.loyalty_accounts || []).map(a => ({
        id: a.id,
        customer_id: a.customer_id,
        balance: a.balance,
        lifetime_points: a.lifetime_points,
        created_at: a.created_at,
      }));
      return Response.json({ success: true, accounts, total: accounts.length });

    } else if (action === "sync_menu") {
      // Fetch categories first for mapping
      const catRes = await fetch("https://connect.squareup.com/v2/catalog/list?types=CATEGORY", {
        headers: { "Authorization": `Bearer ${token}`, "Square-Version": "2024-01-17" }
      });
      const catData = await catRes.json();
      const catById = {};
      for (const c of (catData.objects || [])) {
        catById[c.id] = c.category_data?.name || "";
      }

      // Fetch all catalog items
      const itemRes = await fetch("https://connect.squareup.com/v2/catalog/list?types=ITEM", {
        headers: { "Authorization": `Bearer ${token}`, "Square-Version": "2024-01-17" }
      });
      const itemData = await itemRes.json();
      const objects = itemData.objects || [];

      const sectionMap = {
        "gourmet grilled cheese": "Gourmet Melts",
        "sandwiches": "Signature Creations",
        "sides": "Sides & Refreshments",
        "other items": "Add-Ons & Extras",
        "beverage": "Sides & Refreshments",
        "bagged chips": "Sides & Refreshments",
      };

      const synced = [];
      for (const obj of objects) {
        if (obj.type !== "ITEM") continue;
        const d = obj.item_data || {};
        const name = d.name || "";
        if (!name) continue;
        // Skip sandwich-only variants
        if (name.toLowerCase().includes("sandwich only")) continue;

        const variation = (d.variations || [])[0];
        const priceCents = variation?.item_variation_data?.price_money?.amount;
        const price = priceCents ? `$${(priceCents / 100).toFixed(0)}` : "";

        const rawCat = (catById[d.category_id] || "").toLowerCase();
        let section = "Signature Creations";
        for (const [key, val] of Object.entries(sectionMap)) {
          if (rawCat.includes(key)) { section = val; break; }
        }

        synced.push({ name, desc: d.description || "", price, section, is_active: true });
      }

      // Replace all existing menu items
      const existing = await base44.asServiceRole.entities.MenuItem.list();
      for (const item of existing) {
        await base44.asServiceRole.entities.MenuItem.delete(item.id);
      }
      for (let i = 0; i < synced.length; i++) {
        await base44.asServiceRole.entities.MenuItem.create({ ...synced[i], sort_order: i });
      }

      return Response.json({ success: true, synced: synced.length });
    }

    return Response.json({ error: "Unknown action" }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});