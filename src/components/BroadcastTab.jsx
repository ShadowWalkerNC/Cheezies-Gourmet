import { useState } from 'react';
import { supabase } from '../api/supabaseClient';

const inp = {
  background: '#fffbf0',
  border: '1.5px solid rgba(180,120,0,0.25)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#2a1200',
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const FieldLabel = ({ text }) => (
  <label className="text-xs font-black uppercase tracking-widest mb-1.5 block" style={{ color: '#c9940a' }}>
    {text}
  </label>
);

const TEMPLATES = [
  { label: '🚛 Now Open', text: "We're OPEN! Come find us at {address} today {hours}. Fresh cheezies ready 🧀" },
  { label: '⚠️ Closing Soon', text: "Last call! We're closing in 30 min at {address}. Get your cheezies while you can 🧀" },
  { label: '📍 Location Update', text: "New spot today! Find us at {address} from {hours}. See you there 🧀" },
  { label: '🎉 Special Event', text: "We'll be at {event} this {date}! Come hang out and grab a gourmet cheesie 🧀" },
  { label: '❌ Closed Today', text: "No truck today, sorry! Follow us to stay updated on our next pop-up 🧀" },
];

export default function BroadcastTab() {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('push');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const charLimit = channel === 'sms' ? 160 : 200;
  const remaining = charLimit - message.length;

  const applyTemplate = (text) => setMessage(text);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data } = await supabase
      .from('broadcast_log')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(20);
    if (data) setHistory(data);
    setLoadingHistory(false);
    setHistoryLoaded(true);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const { error } = await supabase.from('broadcast_log').insert({
        message: message.trim(),
        channel,
        sent_at: new Date().toISOString(),
        status: 'queued',
      });
      if (error) throw error;
      setResult({ ok: true, msg: `✅ Broadcast queued! Your ${channel === 'push' ? 'push notification' : 'SMS'} is on its way.` });
      setMessage('');
      if (historyLoaded) loadHistory();
    } catch (err) {
      setResult({ ok: false, msg: `❌ Failed to send: ${err.message}` });
    }
    setSending(false);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Channel Toggle */}
      <div>
        <FieldLabel text="Send Via" />
        <div className="flex gap-2">
          {[{ val: 'push', label: '🔔 Push Notification' }, { val: 'sms', label: '📱 SMS' }].map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setChannel(val)}
              className="flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-full"
              style={{
                background: channel === val ? '#c9940a' : '#fff',
                color: channel === val ? '#fff' : '#7a4f00',
                border: `1.5px solid ${channel === val ? '#c9940a' : '#e8e0d0'}`,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {channel === 'sms' && (
          <p className="text-xs mt-2" style={{ color: 'rgba(61,34,0,0.4)' }}>
            SMS sends to all opted-in subscribers via Twilio. Standard rates apply to recipients.
          </p>
        )}
        {channel === 'push' && (
          <p className="text-xs mt-2" style={{ color: 'rgba(61,34,0,0.4)' }}>
            Push notifications send to all app users who have allowed notifications.
          </p>
        )}
      </div>

      {/* Quick Templates */}
      <div>
        <FieldLabel text="Quick Templates" />
        <div className="flex flex-col gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => applyTemplate(t.text)}
              className="text-left px-3 py-2 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(201,148,10,0.08)', color: '#7a4f00', border: 'none', cursor: 'pointer' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer */}
      <form onSubmit={handleSend} className="flex flex-col gap-3">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <FieldLabel text="Message" />
            <span
              className="text-xs font-bold"
              style={{ color: remaining < 20 ? '#b91c1c' : 'rgba(61,34,0,0.35)' }}
            >
              {remaining} left
            </span>
          </div>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, charLimit))}
            placeholder="Type your message to followers..."
            style={{ ...inp, resize: 'none' }}
          />
        </div>

        {result && (
          <div
            className="p-3 rounded-xl text-sm font-bold"
            style={{
              background: result.ok ? '#dcfce7' : '#fee2e2',
              color: result.ok ? '#15803d' : '#b91c1c',
            }}
          >
            {result.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="w-full py-4 rounded-full font-black text-sm uppercase tracking-widest"
          style={{
            background: '#1a0800',
            color: '#e8b800',
            border: 'none',
            cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
            opacity: sending || !message.trim() ? 0.5 : 1,
          }}
        >
          {sending ? 'Sending...' : `Broadcast to All Followers 📣`}
        </button>
      </form>

      {/* Broadcast History */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel text="Broadcast History" />
          <button
            type="button"
            onClick={loadHistory}
            className="text-xs font-bold"
            style={{ color: '#c9940a', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {loadingHistory ? 'Loading...' : historyLoaded ? 'Refresh' : 'Load History'}
          </button>
        </div>
        {historyLoaded && (
          <div className="flex flex-col gap-2">
            {history.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: 'rgba(61,34,0,0.35)' }}>No broadcasts yet.</p>
            )}
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl"
                style={{ background: '#fff', border: '1.5px solid rgba(180,120,0,0.12)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      background: item.channel === 'sms' ? '#ede9fe' : '#dbeafe',
                      color: item.channel === 'sms' ? '#6d28d9' : '#1d4ed8',
                    }}
                  >
                    {item.channel === 'sms' ? '📱 SMS' : '🔔 Push'}
                  </span>
                  <span className="text-xs" style={{ color: 'rgba(61,34,0,0.4)' }}>
                    {new Date(item.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#2a1200' }}>{item.message}</p>
                {item.status && (
                  <p className="text-xs mt-1" style={{ color: item.status === 'sent' ? '#15803d' : 'rgba(61,34,0,0.4)' }}>
                    {item.status === 'sent' ? '✅ Delivered' : item.status === 'queued' ? '⏳ Queued' : item.status}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
