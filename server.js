import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// Helper functions to read/write JSON db
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading db.json, returning empty structure:', error);
    return { users: [], menu_items: [], weekly_specials: [], truck_status: [], events: [], catering_inquiries: [], contact_submissions: [], push_subscriptions: [], broadcasts: [] };
  }
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Global subscriptions store for SSE (Server-Sent Events) to simulate Supabase real-time updates!
let clients = [];

function notifyChanges(table, eventType, data) {
  const message = JSON.stringify({ table, eventType, new: data });
  clients.forEach(client => {
    client.res.write(`data: ${message}\n\n`);
  });
}

// Server-Sent Events Endpoint
app.get('/api/realtime', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);
  
  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

// AUTH ENDPOINTS (Mock Supabase Auth)
app.post('/api/auth/otp', async (req, res) => {
  // Mock sending OTP, returning true
  res.json({ success: true, message: 'OTP verification code sent' });
});

app.post('/api/auth/verify', async (req, res) => {
  const { passcode, email } = req.body;
  if (passcode === '123456' || passcode === 'cheezies2024') {
    return res.json({
      session: {
        access_token: 'mock-supabase-jwt-token',
        user: { id: 'u1', email: email || 'owner@cheezies.com', role: 'admin' }
      }
    });
  }
  res.status(400).json({ error: 'Invalid verification code' });
});

// GENERIC CRUD GENERATOR HELPER
const setupRoutes = (table) => {
  app.get(`/api/${table}`, async (req, res) => {
    const db = await readDB();
    let data = db[table] || [];
    
    // Support basic query filtering if needed
    if (req.query.is_active) {
      data = data.filter(item => String(item.is_active) === req.query.is_active);
    }
    if (req.query.is_featured) {
      data = data.filter(item => String(item.is_featured) === req.query.is_featured);
    }
    
    res.json(data);
  });

  app.post(`/api/${table}`, async (req, res) => {
    const db = await readDB();
    if (!db[table]) db[table] = [];
    
    const newItem = {
      id: table === 'truck_status' ? 1 : Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...req.body
    };
    
    db[table].push(newItem);
    await writeDB(db);
    
    notifyChanges(table, 'INSERT', newItem);
    res.status(201).json(newItem);
  });

  app.put(`/api/${table}/:id`, async (req, res) => {
    const db = await readDB();
    const list = db[table] || [];
    const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);
    const idx = list.findIndex(item => item.id === id);
    
    if (idx === -1) {
      return res.status(404).json({ error: `${table} item not found` });
    }
    
    list[idx] = {
      ...list[idx],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    await writeDB(db);
    
    notifyChanges(table, 'UPDATE', list[idx]);
    res.json(list[idx]);
  });

  app.delete(`/api/${table}/:id`, async (req, res) => {
    const db = await readDB();
    const list = db[table] || [];
    const id = isNaN(req.params.id) ? req.params.id : Number(req.params.id);
    
    db[table] = list.filter(item => item.id !== id);
    await writeDB(db);
    
    notifyChanges(table, 'DELETE', { id });
    res.json({ success: true });
  });
};

// Setup REST tables
setupRoutes('menu_items');
setupRoutes('truck_status');
setupRoutes('events');
setupRoutes('catering_inquiries');
setupRoutes('contact_submissions');
setupRoutes('push_subscriptions');
setupRoutes('weekly_specials');

// Custom routes for specific table modifications
app.get('/api/truck_status/1', async (req, res) => {
  const db = await readDB();
  const list = db.truck_status || [];
  res.json(list[0] || {});
});

// Serve frontend build static files in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
