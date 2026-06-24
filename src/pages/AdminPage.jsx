import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useTruckData, saveTruckData } from '@/hooks/useTruckData';

const ADMIN_PASSWORD = 'cheezies2024';
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SECTIONS = ['Signature Creations','Gourmet Melts','Sides & Refreshments','Add-Ons & Extras'];

const inp = { background:'#fffbf0', border:'1.5px solid rgba(180,120,0,0.25)', borderRadius:10, padding:'10px 14px', color:'#2a1200', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' };
const FieldLabel = ({ text }) => <label className="text-xs font-black uppercase tracking-widest mb-1.5 block" style={{color:'#c9940a'}}>{text}</label>;

// ─── TRUCK STATUS TAB ──────────────────────────────────────
function TruckTab() {
  const { data: truckData } = useTruckData();
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

// ─── MENU TAB ─────────────────────────────────────────────
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
    await supabase.from('menu_items').update({is_active: !item.is_active}).eq('id', item.id);
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
    <div>
      <button onClick={() => setEditing(BLANK)} className="mb-5 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#c9940a',color:'#fff',border:'none',cursor:'pointer'}}>+ Add Menu Item</button>
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

// ─── EVENTS TAB ────────────────────────────────────────────
function EventsTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const BLANK = { title:'', date:'', time_start:'', time_end:'', location_name:'', address:'', description:'', image_url:'', facebook_event_url:'', is_featured:false, is_active:true };

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date', {ascending: true});
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
      <div><FieldLabel text="Date" /><input type="date" value={editing.date||''} onChange={e=>setEditing(f=>({...f,date:e.target.value}))} style={inp} /></div>
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
    <div>
      <button onClick={() => setEditing(BLANK)} className="mb-5 px-5 py-2.5 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#c9940a',color:'#fff',border:'none',cursor:'pointer'}}>+ Add Event</button>
      {events.length === 0 ? (
        <p className="text-sm text-center py-8" style={{color:'rgba(61,34,0,0.4)'}}>No events yet. Add your first one!</p>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map(ev => (
            <div key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl" style={{background:'#fff',border:'1.5px solid rgba(180,120,0,0.15)'}}>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{color:'#2a1200'}}>{ev.title}</p>
                <p className="text-xs" style={{color:'rgba(61,34,0,0.45)'}}>{ev.date} · {ev.location_name||'No location'}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(ev)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'rgba(201,148,10,0.1)',color:'#7a4f00',border:'none',cursor:'pointer'}}>Edit</button>
                <button onClick={() => deleteEvent(ev.id)} className="text-xs px-3 py-1.5 rounded-full font-bold" style={{background:'#fee2e2',color:'#b91c1c',border:'none',cursor:'pointer'}}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ───────────────────────────────────────
const TABS = ['🚚 Truck Status', '🧀 Menu', '📅 Events'];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState(0);

  const login = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwErr(false); }
    else setPwErr(true);
  };

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{background:'#fffbf0'}}>
      <form onSubmit={login} className="w-full max-w-sm flex flex-col gap-4 p-8 rounded-2xl" style={{background:'#fff',border:'1.5px solid #e8e0d0',boxShadow:'0 4px 24px rgba(180,120,0,0.1)'}}>
        <h2 className="font-black text-2xl text-center" style={{color:'#1a0800'}}>🧀 Admin Login</h2>
        <input type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} style={inp} />
        {pwErr && <p className="text-xs text-red-500 text-center">Incorrect password</p>}
        <button type="submit" className="py-3 rounded-full font-black text-sm uppercase tracking-widest" style={{background:'#c9940a',color:'#fff'}}>Login</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:'#fffbf0'}}>
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between" style={{background:'#fff',borderBottom:'1.5px solid #e8e0d0'}}>
        <h1 className="font-black text-xl" style={{color:'#1a0800'}}>🧀 Cheezies Admin</h1>
        <button onClick={() => setAuthed(false)} className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:'#f5f5f5',color:'#666',border:'none',cursor:'pointer'}}>Logout</button>
      </div>
      <div className="flex border-b" style={{background:'#fff',borderColor:'#e8e0d0'}}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className="flex-1 py-3 text-xs font-black uppercase tracking-wider"
            style={{background:'none',border:'none',borderBottom:`2.5px solid ${tab===i?'#c9940a':'transparent'}`,color:tab===i?'#c9940a':'rgba(61,34,0,0.45)',cursor:'pointer'}}>{t}</button>
        ))}
      </div>
      <div className="max-w-lg mx-auto px-6 py-8">
        {tab === 0 && <TruckTab />}
        {tab === 1 && <MenuTab />}
        {tab === 2 && <EventsTab />}
      </div>
    </div>
  );
}
