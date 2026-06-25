import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { useTruckData, saveTruckData } from '../hooks/useTruckData';
import PnLDashboard from '../components/PnLDashboard';
import BroadcastTab from '../components/BroadcastTab';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TABS = ['Truck Status','Menu Items','Events','Reports','Broadcast','Catering','Contact'];
const SECTIONS = ['Signature Creations','Gourmet Melts','Sides & Refreshments','Add-Ons & Extras'];
const ALLOWED_EMAILS = ['cheeziesgourmet@gmail.com', 'shadowwalkernc@gmail.com'];

const inp = { background:'#fffbf0', border:'1.5px solid rgba(180,120,0,0.25)', borderRadius:10, padding:'10px 14px', color:'#2a1200', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' };
const FieldLabel = ({ text }) => <label className="text-xs font-black uppercase tracking-widest mb-1.5 block" style={{color:'#c9940a'}}>{text}</label>;

const STATUS_META = {
  new:       { label: 'New',       bg: 'rgba(201,148,10,0.12)',  color: '#7a4f00',  dot: '#c9940a'  },
  contacted: { label: 'Contacted', bg: 'rgba(59,130,246,0.1)',   color: '#1d4ed8',  dot: '#3b82f6'  },
  booked:    { label: 'Booked',    bg: 'rgba(22,163,74,0.1)',    color: '#15803d',  dot: '#16a34a'  },
  declined:  { label: 'Declined',  bg: 'rgba(185,28,28,0.08)',   color: '#b91c1c',  dot: '#ef4444'  },
};
const STATUS_ORDER = ['new', 'contacted', 'booked', 'declined'];

// ─── TRUCK STATUS TAB ──────────────────────────────────────
function TruckTab() {
  const truckData = useTruckData();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (truckData && !form) setForm(truckData); }, [truckData]);

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const toggleDay = (day) => setForm(f => ({
    ...f,
    open_days: f.open_days?.includes(day)
      ? f.open_days.filter(d => d !== day)
      : [...(f.open_days || []), day]
  }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await saveTruckData(form);
    setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  if (!form) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div>
        <FieldLabel text="Status" />
        <div className="flex gap-2">
          {['open','closed','en_route'].map(s => (
            <button type="button" key={s} onClick={() => set('status', s)}
              className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-full"
              style={{background:form.status===s?'#c9940a':'#fff', color:form.status===s?'#fff':'#7a4f00', border:`1.5px solid ${form.status===s?'#c9940a':'#e8e0d0'}`}}>
              {s.replace('_',' ')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel text="Today's Address" />
        <input value={form.address||''} onChange={e=>set('address',e.target.value)} placeholder="e.g. 123 Main St, Akron" style={inp} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel text="Latitude" /><input value={form.latitude||''} onChange={e=>set('latitude',e.target.value)} placeholder="41.0814" style={inp} /></div>
        <div><FieldLabel text="Longitude" /><input value={form.longitude||''} onChange={e=>set('longitude',e.target.value)} placeholder="-81.5190" style={inp} /></div>
      </div>
      <p className="text-xs" style={{color:'rgba(61,34,0,0.4)'}}>Tip: Google Maps → right-click location → copy lat/lng. Leave blank to hide map pin.</p>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel text="Opens" /><input value={form.hours_open||''} onChange={e=>set('hours_open',e.target.value)} placeholder="11:00 AM" style={inp} /></div>
        <div><FieldLabel text="Closes" /><input value={form.hours_close||''} onChange={e=>set('hours_close',e.target.value)} placeholder="6:00 PM" style={inp} /></div>
      </div>
      <div>
        <FieldLabel text="Open Days" />
        <div className="flex flex-wrap gap-2">
          {DAYS.map(day => (
            <button type="button" key={day} onClick={() => toggleDay(day)}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{background:form.open_days?.includes(day)?'#c9940a':'#fff', color:form.open_days?.includes(day)?'#fff':'#7a4f00', border:`1.5px solid ${form.open_days?.includes(day)?'#c9940a':'#e8e0d0'}`}}>
              {day.slice(0,3)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel text="Today's Note (optional)" />
        <textarea rows={2} value={form.note||''} onChange={e=>set('note',e.target.value)} placeholder="e.g. Cash only today!" style={{...inp, resize:'none'}} />
      </div>
      <button type="submit" disabled={saving} className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#1a0800',color:'#e8b800',opacity:saving?0.7:1}}>
        {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save & Publish'}
      </button>
    </form>
  );
}

// ─── MENU ITEMS TAB ──────────────────────────────────────
function MenuTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('menu_items').select('*').order('sort_order');
    if (data) setItems(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const saveItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { id, ...fields } = editing;
    if (id) {
      await supabase.from('menu_items').update(fields).eq('id', id);
    } else {
      await supabase.from('menu_items').insert(fields);
    }
    setSaving(false); setEditing(null); load();
  };

  const toggleActive = async (item) => {
    await supabase.from('menu_items').update({ is_active: !item.is_active }).eq('id', item.id);
    load();
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await supabase.from('menu_items').delete().eq('id', id);
    load();
  };

  const BLANK = { name:'', section:'Signature Creations', description:'', price:'', price_note:'', badge:'', badge_color:'#c9940a', image_url:'', is_featured:false, is_active:true, sort_order: items.length + 1 };

  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>;

  if (editing) return (
    <form onSubmit={saveItem} className="flex flex-col gap-4">
      <button type="button" onClick={() => setEditing(null)} className="text-sm font-bold text-left" style={{color:'#c9940a',background:'none',border:'none',cursor:'pointer'}}>← Back to list</button>
      <div><FieldLabel text="Name" /><input required value={editing.name} onChange={e=>setEditing(f=>({...f,name:e.target.value}))} style={inp} /></div>
      <div>
        <FieldLabel text="Section" />
        <select value={editing.section} onChange={e=>setEditing(f=>({...f,section:e.target.value}))} style={inp}>
          {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div><FieldLabel text="Description" /><textarea rows={3} value={editing.description||''} onChange={e=>setEditing(f=>({...f,description:e.target.value}))} style={{...inp,resize:'none'}} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel text="Price (e.g. $13)" /><input value={editing.price||''} onChange={e=>setEditing(f=>({...f,price:e.target.value}))} placeholder="$13" style={inp} /></div>
        <div><FieldLabel text="Price Note" /><input value={editing.price_note||''} onChange={e=>setEditing(f=>({...f,price_note:e.target.value}))} placeholder="Single / Double" style={inp} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel text="Badge Text" /><input value={editing.badge||''} onChange={e=>setEditing(f=>({...f,badge:e.target.value}))} placeholder="Best Seller" style={inp} /></div>
        <div><FieldLabel text="Badge Color" /><input type="color" value={editing.badge_color||'#c9940a'} onChange={e=>setEditing(f=>({...f,badge_color:e.target.value}))} style={{...inp,height:42,padding:4}} /></div>
      </div>
      <div><FieldLabel text="Image URL" /><input value={editing.image_url||''} onChange={e=>setEditing(f=>({...f,image_url:e.target.value}))} placeholder="https://..." style={inp} /></div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{color:'#2a1200'}}>
          <input type="checkbox" checked={!!editing.is_featured} onChange={e=>setEditing(f=>({...f,is_featured:e.target.checked}))} /> Featured on Home
        </label>
        <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{color:'#2a1200'}}>
          <input type="checkbox" checked={!!editing.is_active} onChange={e=>setEditing(f=>({...f,is_active:e.target.checked}))} /> Active (visible)
        </label>
      </div>
      <div><FieldLabel text="Sort Order" /><input type="number" value={editing.sort_order||0} onChange={e=>setEditing(f=>({...f,sort_order:parseInt(e.target.value)}))} style={inp} /></div>
      <button type="submit" disabled={saving} className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#1a0800',color:'#e8b800'}}>
        {saving ? 'Saving...' : editing.id ? 'Update Item' : 'Add Item'}
      </button>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => setEditing(BLANK)} className="w-full py-3 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#c9940a',color:'#fff',border:'none',cursor:'pointer'}}>+ Add Menu Item</button>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl" style={{background:'#fff',border:`1.5px solid ${item.is_active?'rgba(180,120,0,0.15)':'rgba(180,120,0,0.07)'}`,opacity:item.is_active?1:0.5}}>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{color:'#2a1200'}}>{item.name}</p>
              <p className="text-xs" style={{color:'rgba(61,34,0,0.45)'}}>{item.section} · {item.price}{item.is_featured?' · ⭐ Featured':''}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(item)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:item.is_active?'#fee2e2':'#dcfce7',color:item.is_active?'#b91c1c':'#15803d',border:'none',cursor:'pointer'}}>{item.is_active?'Hide':'Show'}</button>
              <button onClick={() => setEditing(item)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',border:'none',cursor:'pointer'}}>Edit</button>
              <button onClick={() => deleteItem(item.id)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'#fee2e2',color:'#b91c1c',border:'none',cursor:'pointer'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EVENTS TAB ──────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const BLANK = { title:'', event_date:'', time_start:'', time_end:'', location_name:'', address:'', description:'', image_url:'', facebook_event_url:'', is_featured:false, is_active:true };

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('event_date', {ascending: true});
    if (data) setEvents(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const saveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { id, ...fields } = editing;
    if (id) { await supabase.from('events').update(fields).eq('id', id); }
    else { await supabase.from('events').insert(fields); }
    setSaving(false); setEditing(null); load();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await supabase.from('events').delete().eq('id', id);
    load();
  };

  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>;

  if (editing) return (
    <form onSubmit={saveEvent} className="flex flex-col gap-4">
      <button type="button" onClick={() => setEditing(null)} className="text-sm font-bold text-left" style={{color:'#c9940a',background:'none',border:'none',cursor:'pointer'}}>← Back to list</button>
      <div><FieldLabel text="Title" /><input required value={editing.title} onChange={e=>setEditing(f=>({...f,title:e.target.value}))} style={inp} /></div>
      <div><FieldLabel text="Date" /><input type="date" value={editing.event_date||''} onChange={e=>setEditing(f=>({...f,event_date:e.target.value}))} style={inp} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><FieldLabel text="Start Time" /><input value={editing.time_start||''} onChange={e=>setEditing(f=>({...f,time_start:e.target.value}))} placeholder="10:00 AM" style={inp} /></div>
        <div><FieldLabel text="End Time" /><input value={editing.time_end||''} onChange={e=>setEditing(f=>({...f,time_end:e.target.value}))} placeholder="4:00 PM" style={inp} /></div>
      </div>
      <div><FieldLabel text="Location Name" /><input value={editing.location_name||''} onChange={e=>setEditing(f=>({...f,location_name:e.target.value}))} placeholder="Akron Civic" style={inp} /></div>
      <div><FieldLabel text="Address" /><input value={editing.address||''} onChange={e=>setEditing(f=>({...f,address:e.target.value}))} placeholder="182 S Main St, Akron" style={inp} /></div>
      <div><FieldLabel text="Description" /><textarea rows={3} value={editing.description||''} onChange={e=>setEditing(f=>({...f,description:e.target.value}))} style={{...inp,resize:'none'}} /></div>
      <div><FieldLabel text="Image URL" /><input value={editing.image_url||''} onChange={e=>setEditing(f=>({...f,image_url:e.target.value}))} placeholder="https://..." style={inp} /></div>
      <div><FieldLabel text="Facebook Event URL" /><input value={editing.facebook_event_url||''} onChange={e=>setEditing(f=>({...f,facebook_event_url:e.target.value}))} placeholder="https://facebook.com/events/..." style={inp} /></div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{color:'#2a1200'}}><input type="checkbox" checked={!!editing.is_featured} onChange={e=>setEditing(f=>({...f,is_featured:e.target.checked}))} /> Featured</label>
        <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" style={{color:'#2a1200'}}><input type="checkbox" checked={!!editing.is_active} onChange={e=>setEditing(f=>({...f,is_active:e.target.checked}))} /> Active</label>
      </div>
      <button type="submit" disabled={saving} className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#1a0800',color:'#e8b800'}}>
        {saving ? 'Saving...' : editing.id ? 'Update Event' : 'Add Event'}
      </button>
    </form>
  );

  return (
    <div className="flex flex-col gap-4">
      <button onClick={() => setEditing(BLANK)} className="w-full py-3 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#c9940a',color:'#fff',border:'none',cursor:'pointer'}}>+ Add Event</button>
      <div className="flex flex-col gap-2">
        {events.map(ev => (
          <div key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl" style={{background:'#fff',border:'1.5px solid rgba(180,120,0,0.15)'}}>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{color:'#2a1200'}}>{ev.title}</p>
              <p className="text-xs" style={{color:'rgba(61,34,0,0.45)'}}>{ev.event_date} · {ev.location_name||'No location'}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing(ev)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',border:'none',cursor:'pointer'}}>Edit</button>
              <button onClick={() => deleteEvent(ev.id)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'#fee2e2',color:'#b91c1c',border:'none',cursor:'pointer'}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CATERING INQUIRIES TAB ──────────────────────────────────────
function CateringTab() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    const { data } = await supabase.from('catering_inquiries').select('*').order('created_at', { ascending: false });
    if (data) setInquiries(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, newStatus) => {
    await supabase.from('catering_inquiries').update({ status: newStatus }).eq('id', id);
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    await supabase.from('catering_inquiries').delete().eq('id', id);
    setInquiries(prev => prev.filter(i => i.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filtered = statusFilter === 'all' ? inquiries : inquiries.filter(i => i.status === statusFilter);
  const newCount = inquiries.filter(i => i.status === 'new').length;

  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-base" style={{color:'#1a0800'}}>Catering Inquiries</p>
          <p className="text-xs" style={{color:'rgba(61,34,0,0.45)'}}>{inquiries.length} total{newCount > 0 ? ` · ${newCount} new` : ''}</p>
        </div>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',border:'none',cursor:'pointer'}}>↻ Refresh</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUS_ORDER].map(s => {
          const meta = s === 'all' ? null : STATUS_META[s];
          const isActive = statusFilter === s;
          const count = s === 'all' ? inquiries.length : inquiries.filter(i => i.status === s).length;
          return (
            <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1 rounded-full text-xs font-bold capitalize"
              style={{ background: isActive ? (meta?.bg ?? '#1a0800') : '#fff', color: isActive ? (meta?.color ?? '#e8b800') : 'rgba(61,34,0,0.5)', border: `1.5px solid ${isActive ? (meta?.dot ?? '#1a0800') : '#e8e0d0'}`, cursor: 'pointer' }}>
              {s === 'all' ? 'All' : STATUS_META[s].label} ({count})
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{background:'#fff',border:'1.5px solid rgba(180,120,0,0.12)'}}>
          <p className="text-3xl mb-2">📋</p>
          <p className="font-bold text-sm" style={{color:'rgba(61,34,0,0.5)'}}>No {statusFilter !== 'all' ? statusFilter : ''} inquiries yet</p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {filtered.map(inq => {
          const meta = STATUS_META[inq.status] ?? STATUS_META.new;
          const isOpen = expanded === inq.id;
          return (
            <div key={inq.id} className="rounded-2xl overflow-hidden" style={{background:'#fff', border:'1.5px solid rgba(180,120,0,0.15)'}}>
              <button type="button" onClick={() => setExpanded(isOpen ? null : inq.id)} className="w-full flex items-center gap-3 p-4 text-left" style={{background:'none',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{background: meta.dot}} />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm truncate" style={{color:'#1a0800'}}>{inq.name}</p>
                  <p className="text-xs truncate" style={{color:'rgba(61,34,0,0.5)'}}>{inq.event_type || 'No event type'} · {fmt(inq.event_date)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{background:meta.bg, color:meta.color}}>{meta.label}</span>
                  <span style={{color:'rgba(61,34,0,0.3)', fontSize:12}}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-5 flex flex-col gap-4" style={{borderTop:'1px solid rgba(180,120,0,0.08)'}}>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div><p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Email</p><a href={`mailto:${inq.email}`} className="text-sm font-bold" style={{color:'#1a0800',textDecoration:'none'}}>{inq.email}</a></div>
                    <div><p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Phone</p><a href={`tel:${inq.phone}`} className="text-sm font-bold" style={{color:'#1a0800',textDecoration:'none'}}>{inq.phone || '—'}</a></div>
                    <div><p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Guests</p><p className="text-sm font-bold" style={{color:'#1a0800'}}>{inq.guest_count || '—'}</p></div>
                    <div><p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Received</p><p className="text-sm font-bold" style={{color:'#1a0800'}}>{fmt(inq.created_at)}</p></div>
                  </div>
                  {inq.message && (<div><p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Message</p><p className="text-sm leading-relaxed" style={{color:'rgba(61,34,0,0.7)'}}>{inq.message}</p></div>)}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'#c9940a'}}>Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {STATUS_ORDER.map(s => { const m = STATUS_META[s]; const active = inq.status === s; return (<button key={s} onClick={() => updateStatus(inq.id, s)} disabled={active} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{background: active ? m.bg : '#fff', color: active ? m.color : 'rgba(61,34,0,0.5)', border:`1.5px solid ${active ? m.dot : '#e8e0d0'}`, cursor: active ? 'default' : 'pointer'}}>{m.label}</button>); })}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href={`mailto:${inq.email}?subject=Your Cheezies Catering Inquiry&body=Hi ${inq.name},%0A%0AThank you for your interest in Cheezies Gourmet catering!`} className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-center" style={{background:'#1a0800',color:'#e8b800',textDecoration:'none'}}>Reply via Email</a>
                    <button onClick={() => deleteInquiry(inq.id)} className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider" style={{background:'#fee2e2',color:'#b91c1c',border:'none',cursor:'pointer'}}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CONTACT SUBMISSIONS TAB ──────────────────────────────────────
function ContactTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    const { data } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await supabase.from('contact_submissions').delete().eq('id', id);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const handleExpand = (id) => {
    const isOpen = expanded === id;
    setExpanded(isOpen ? null : id);
    // Auto-mark as read on open
    const msg = messages.find(m => m.id === id);
    if (!isOpen && msg && !msg.read) markRead(id);
  };

  const fmt = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter(m => !m.read).length;
  const filtered = filter === 'unread' ? messages.filter(m => !m.read) : messages;

  if (loading) return <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" /></div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-black text-base" style={{color:'#1a0800'}}>Contact Messages</p>
          <p className="text-xs" style={{color:'rgba(61,34,0,0.45)'}}>
            {messages.length} total{unreadCount > 0 ? ` · ${unreadCount} unread` : ' · all read'}
          </p>
        </div>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',border:'none',cursor:'pointer'}}>↻ Refresh</button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {[['all', 'All'], ['unread', 'Unread']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: filter === val ? '#1a0800' : '#fff',
              color: filter === val ? '#e8b800' : 'rgba(61,34,0,0.5)',
              border: `1.5px solid ${filter === val ? '#1a0800' : '#e8e0d0'}`,
              cursor: 'pointer',
            }}
          >
            {label} ({val === 'all' ? messages.length : unreadCount})
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 rounded-2xl" style={{background:'#fff',border:'1.5px solid rgba(180,120,0,0.12)'}}>
          <p className="text-3xl mb-2">📩</p>
          <p className="font-bold text-sm" style={{color:'rgba(61,34,0,0.5)'}}>No {filter === 'unread' ? 'unread ' : ''}messages yet</p>
        </div>
      )}

      {/* Message cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(msg => {
          const isOpen = expanded === msg.id;
          return (
            <div
              key={msg.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#fff',
                border: `1.5px solid ${!msg.read ? 'rgba(201,148,10,0.4)' : 'rgba(180,120,0,0.12)'}`,
                boxShadow: !msg.read ? '0 2px 12px rgba(201,148,10,0.1)' : 'none',
              }}
            >
              {/* Row */}
              <button
                type="button"
                onClick={() => handleExpand(msg.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
                style={{background:'none',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}
              >
                {/* Unread dot */}
                <div className="w-2 h-2 rounded-full shrink-0" style={{background: msg.read ? 'transparent' : '#c9940a', border: msg.read ? '1.5px solid #e8e0d0' : 'none'}} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${!msg.read ? 'font-black' : 'font-bold'}`} style={{color:'#1a0800'}}>{msg.name}</p>
                  <p className="text-xs truncate" style={{color:'rgba(61,34,0,0.5)'}}>{msg.message?.slice(0, 60)}{msg.message?.length > 60 ? '…' : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!msg.read && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{background:'rgba(201,148,10,0.12)',color:'#7a4f00'}}>New</span>
                  )}
                  <span className="text-xs" style={{color:'rgba(61,34,0,0.35)'}}>{fmt(msg.created_at)}</span>
                  <span style={{color:'rgba(61,34,0,0.3)', fontSize:12}}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-4 pb-5 flex flex-col gap-4" style={{borderTop:'1px solid rgba(180,120,0,0.08)'}}>
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Email</p>
                      <a href={`mailto:${msg.email}`} className="text-sm font-bold" style={{color:'#1a0800',textDecoration:'none'}}>{msg.email}</a>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Phone</p>
                      {msg.phone
                        ? <a href={`tel:${msg.phone}`} className="text-sm font-bold" style={{color:'#1a0800',textDecoration:'none'}}>{msg.phone}</a>
                        : <p className="text-sm font-bold" style={{color:'rgba(61,34,0,0.35)'}}>Not provided</p>
                      }
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Source</p>
                      <p className="text-sm font-bold" style={{color:'#1a0800'}}>{msg.source || 'contact_form'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-1" style={{color:'#c9940a'}}>Received</p>
                      <p className="text-sm font-bold" style={{color:'#1a0800'}}>{fmt(msg.created_at)}</p>
                    </div>
                  </div>

                  {/* Full message */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{color:'#c9940a'}}>Message</p>
                    <p className="text-sm leading-relaxed p-3 rounded-xl" style={{color:'rgba(61,34,0,0.8)', background:'#fffbf0', border:'1px solid rgba(180,120,0,0.12)'}}>{msg.message}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your Message to Cheezies Gourmet&body=Hi ${msg.name},%0A%0AThanks for reaching out!`}
                      className="flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-center"
                      style={{background:'#1a0800',color:'#e8b800',textDecoration:'none'}}
                    >
                      Reply via Email
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-center"
                        style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',textDecoration:'none'}}
                      >
                        Call
                      </a>
                    )}
                    <button
                      onClick={() => deleteMsg(msg.id)}
                      className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
                      style={{background:'#fee2e2',color:'#b91c1c',border:'none',cursor:'pointer'}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(undefined);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [denied, setDenied] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    if (!ALLOWED_EMAILS.includes(email.trim().toLowerCase())) { setDenied(true); return; }
    setDenied(false);
    setSending(true);
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setSending(false);
    setSent(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setSent(false); setDenied(false); setEmail('');
  };

  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#fdf6e3'}}>
      <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{background:'#fdf6e3'}}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-4xl mb-3">🧀</p>
          <h1 className="font-black text-2xl mb-1" style={{color:'#1a0800'}}>Admin Login</h1>
          <p className="text-sm" style={{color:'rgba(61,34,0,0.5)'}}>We'll email you a magic link to sign in.</p>
        </div>
        {sent ? (
          <div className="text-center p-6 rounded-2xl" style={{background:'#fff',border:'1.5px solid rgba(180,120,0,0.2)'}}>
            <p className="text-2xl mb-3">📬</p>
            <p className="font-black text-base mb-1" style={{color:'#1a0800'}}>Check your email!</p>
            <p className="text-sm" style={{color:'rgba(61,34,0,0.55)'}}>Click the link we sent to <strong>{email}</strong> to sign in.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-xs font-bold" style={{color:'#c9940a',background:'none',border:'none',cursor:'pointer'}}>Use a different email</button>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
            <input type="email" required value={email} onChange={e => { setEmail(e.target.value); setDenied(false); }} placeholder="your@email.com" style={{...inp, borderColor: denied ? '#b91c1c' : 'rgba(180,120,0,0.25)'}} autoFocus />
            {denied && <p className="text-xs font-bold" style={{color:'#b91c1c'}}>⛔ That email is not authorized.</p>}
            <button type="submit" disabled={sending} className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#1a0800',color:'#e8b800',border:'none',cursor:'pointer',opacity:sending?0.7:1}}>
              {sending ? 'Sending...' : 'Send Magic Link ✨'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:'#fdf6e3'}}>
      <div className="flex items-center justify-between px-6 py-4" style={{background:'#fff',borderBottom:'1.5px solid #e8e0d0'}}>
        <div>
          <h1 className="font-black text-xl" style={{color:'#1a0800'}}>🧀 Cheezies Admin</h1>
          <p className="text-xs" style={{color:'rgba(61,34,0,0.4)'}}>{session.user.email}</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:'#f5f5f5',color:'#666',border:'none',cursor:'pointer'}}>Logout</button>
      </div>
      <div className="flex border-b overflow-x-auto" style={{background:'#fff',borderColor:'#e8e0d0'}}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="shrink-0 py-3 px-3 text-xs font-black uppercase tracking-wider"
            style={{background:'none',border:'none',borderBottom:`2.5px solid ${tab===i?'#c9940a':'transparent'}`,color:tab===i?'#c9940a':'rgba(61,34,0,0.45)',cursor:'pointer',whiteSpace:'nowrap'}}>
            {t}
          </button>
        ))}
      </div>
      <div className="max-w-lg mx-auto px-6 py-8">
        {tab === 0 && <TruckTab />}
        {tab === 1 && <MenuTab />}
        {tab === 2 && <EventsTab />}
        {tab === 3 && <PnLDashboard />}
        {tab === 4 && <BroadcastTab />}
        {tab === 5 && <CateringTab />}
        {tab === 6 && <ContactTab />}
      </div>
    </div>
  );
}
