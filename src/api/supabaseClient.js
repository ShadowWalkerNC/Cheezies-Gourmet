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
    this.limitVal = undefined;
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
    this.filters[col] = { operator: 'eq', value: val };
    return this;
  }

  neq(col, val) {
    this.filters[col] = { operator: 'neq', value: val };
    return this;
  }

  gt(col, val) {
    this.filters[col] = { operator: 'gt', value: val };
    return this;
  }

  lt(col, val) {
    this.filters[col] = { operator: 'lt', value: val };
    return this;
  }

  gte(col, val) {
    this.filters[col] = { operator: 'gte', value: val };
    return this;
  }

  lte(col, val) {
    this.filters[col] = { operator: 'lte', value: val };
    return this;
  }

  limit(count) {
    this.limitVal = count;
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
      const idVal = typeof this.filters.id === 'object' ? this.filters.id.value : this.filters.id;
      url = `${url}/${idVal}`;
    } else if (this.method === 'GET') {
      const queryParams = new URLSearchParams();
      Object.entries(this.filters).forEach(([key, val]) => {
        const actualVal = (val && typeof val === 'object' && 'value' in val) ? val.value : val;
        queryParams.append(key, actualVal);
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
      
      // Perform local filtering
      let finalData = data;
      if (Array.isArray(finalData)) {
        finalData = finalData.filter(item => {
          return Object.entries(this.filters).every(([key, filterCond]) => {
            const itemVal = item[key];
            if (filterCond && typeof filterCond === 'object' && 'operator' in filterCond) {
              const { operator, value } = filterCond;
              if (operator === 'eq') return String(itemVal) === String(value);
              if (operator === 'neq') return String(itemVal) !== String(value);
              if (operator === 'gt') return itemVal > value;
              if (operator === 'lt') return itemVal < value;
              if (operator === 'gte') {
                const itemDate = new Date(itemVal);
                const valDate = new Date(value);
                if (!isNaN(itemDate.getTime()) && !isNaN(valDate.getTime())) {
                  return itemDate >= valDate;
                }
                return itemVal >= value;
              }
              if (operator === 'lte') {
                const itemDate = new Date(itemVal);
                const valDate = new Date(value);
                if (!isNaN(itemDate.getTime()) && !isNaN(valDate.getTime())) {
                  return itemDate <= valDate;
                }
                return itemVal <= value;
              }
            }
            return String(itemVal) === String(filterCond);
          });
        });
      }

      // Perform local sorting if client requested it
      if (Array.isArray(finalData) && this.orderCol) {
        finalData.sort((a, b) => {
          const valA = a[this.orderCol];
          const valB = b[this.orderCol];
          if (valA < valB) return this.orderAscending ? -1 : 1;
          if (valA > valB) return this.orderAscending ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (Array.isArray(finalData) && this.limitVal !== undefined) {
        finalData = finalData.slice(0, this.limitVal);
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
