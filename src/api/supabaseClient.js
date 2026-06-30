const API_BASE = '/api';

// SSE Event Stream for PostgreSQL Real-Time emulation
let eventSource = null;
const tableListeners = {};

function startRealTime() {
  if (eventSource) return;
  eventSource = new EventSource(`${API_BASE}/realtime`);
  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      const listeners = tableListeners[payload.table] || [];
      listeners.forEach(cb => cb(payload));
    } catch (e) {
      console.error('Error parsing SSE message:', e);
    }
  };
}

class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = {};
    this.isSingle = false;
    this.method = 'GET';
    this.body = null;
    this.orderCol = null;
    this.orderAscending = true;
  }

  select(cols) {
    this.method = 'GET';
    return this;
  }

  insert(payload) {
    this.method = 'POST';
    this.body = payload;
    return this;
  }

  update(payload) {
    this.method = 'PUT';
    this.body = payload;
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  eq(col, val) {
    this.filters[col] = val;
    return this;
  }

  order(col, options = {}) {
    this.orderCol = col;
    this.orderAscending = options.ascending !== false;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  async execute() {
    let url = `${API_BASE}/${this.table}`;
    const token = localStorage.getItem('supabase_mock_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    // If PUT or DELETE and we have an ID filter, append it to URL
    if ((this.method === 'PUT' || this.method === 'DELETE' || (this.method === 'GET' && this.isSingle)) && this.filters.id !== undefined) {
      url = `${url}/${this.filters.id}`;
    } else if (this.method === 'GET') {
      const queryParams = new URLSearchParams();
      Object.entries(this.filters).forEach(([key, val]) => {
        queryParams.append(key, val);
      });
      const qs = queryParams.toString();
      if (qs) url += `?${qs}`;
    }

    try {
      const res = await fetch(url, {
        method: this.method,
        headers,
        body: this.body ? JSON.stringify(this.body) : undefined
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        return { data: null, error: { message: error.error || 'Request failed' } };
      }

      const data = await res.json();
      
      // Perform local sorting if client requested it
      let finalData = data;
      if (Array.isArray(finalData) && this.orderCol) {
        finalData.sort((a, b) => {
          const valA = a[this.orderCol];
          const valB = b[this.orderCol];
          if (valA < valB) return this.orderAscending ? -1 : 1;
          if (valA > valB) return this.orderAscending ? 1 : -1;
          return 0;
        });
      }

      // If single element requested but backend returned list
      if (this.isSingle && Array.isArray(finalData)) {
        finalData = finalData[0] || null;
      }

      return { data: finalData, error: null };
    } catch (err) {
      return { data: null, error: { message: err.message } };
    }
  }

  // Thenable implementation to allow awaiting the builder directly
  then(onfulfilled, onrejected) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

class SupabaseChannel {
  constructor(name) {
    this.name = name;
    this.listeners = [];
  }

  on(eventType, filter, callback) {
    const table = filter.table;
    if (!tableListeners[table]) {
      tableListeners[table] = [];
    }
    tableListeners[table].push((payload) => {
      // Map SSE payloads to the structure expected by Supabase postgres_changes
      callback({
        eventType: payload.eventType,
        new: payload.new,
        old: payload.eventType === 'DELETE' ? { id: payload.new.id } : undefined
      });
    });
    return this;
  }

  subscribe() {
    startRealTime();
    return this;
  }
}

// Authentication Listeners
const authListeners = new Set();

const triggerAuthChange = (event, session) => {
  authListeners.forEach(cb => cb(event, session));
};

export const supabase = {
  from(table) {
    return new SupabaseQueryBuilder(table);
  },

  channel(name) {
    return new SupabaseChannel(name);
  },

  auth: {
    async getSession() {
      const token = localStorage.getItem('supabase_mock_token');
      const email = localStorage.getItem('supabase_mock_email') || 'owner@cheezies.com';
      if (token) {
        return {
          data: {
            session: {
              access_token: token,
              user: { id: 'u1', email, role: 'admin' }
            }
          },
          error: null
        };
      }
      return { data: { session: null }, error: null };
    },

    onAuthStateChange(callback) {
      authListeners.add(callback);
      // Run initial check
      this.getSession().then(({ data }) => {
        callback('INITIAL_SESSION', data.session);
      });
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback);
            }
          }
        }
      };
    },

    async signInWithOtp({ email, options }) {
      // Redirect login checks to mock otp
      try {
        const res = await fetch(`${API_BASE}/auth/otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        if (res.ok) {
          localStorage.setItem('supabase_mock_email', email);
          return { data: { success: true }, error: null };
        }
        return { data: null, error: { message: 'OTP failed' } };
      } catch (err) {
        return { data: null, error: { message: err.message } };
      }
    },

    async verifyOtp({ email, token, type }) {
      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passcode: token, email })
        });
        if (res.ok) {
          const body = await res.json();
          localStorage.setItem('supabase_mock_token', body.session.access_token);
          localStorage.setItem('supabase_mock_email', email);
          triggerAuthChange('SIGNED_IN', body.session);
          return { data: { session: body.session }, error: null };
        }
        return { data: null, error: { message: 'Invalid OTP passcode' } };
      } catch (err) {
        return { data: null, error: { message: err.message } };
      }
    },

    async signOut() {
      localStorage.removeItem('supabase_mock_token');
      localStorage.removeItem('supabase_mock_email');
      triggerAuthChange('SIGNED_OUT', null);
      return { error: null };
    }
  }
};
