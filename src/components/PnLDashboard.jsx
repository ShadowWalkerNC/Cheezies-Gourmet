import { useState, useMemo } from 'react';

const getHealth = (pct, greenMax, yellowMax) => {
  if (pct <= greenMax) return { icon: '🟢', color: '#15803d', bg: '#dcfce7' };
  if (pct <= yellowMax) return { icon: '🟡', color: '#92400e', bg: '#fef3c7' };
  return { icon: '🔴', color: '#b91c1c', bg: '#fee2e2' };
};

const fmt = (n) =>
  (n < 0 ? '-$' : '$') +
  Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  <label
    className="text-xs font-black uppercase tracking-widest mb-1.5 block"
    style={{ color: '#c9940a' }}
  >
    {text}
  </label>
);

export default function PnLDashboard() {
  const [period, setPeriod] = useState('weekly');
  const [inputs, setInputs] = useState({
    grossSales: '',
    returns: '',
    discounts: '',
    foodCostPct: '30',
    numWorkers: '2',
    hourlyRate: '12',
    hoursPerDay: '6',
    laborDays: '',
    otherExpenses: '',
  });

  const set = (key, val) => setInputs((prev) => ({ ...prev, [key]: val }));

  const calc = useMemo(() => {
    const gross = parseFloat(inputs.grossSales) || 0;
    const ret = parseFloat(inputs.returns) || 0;
    const disc = parseFloat(inputs.discounts) || 0;
    const netSales = gross - ret - disc;
    const squareFees = gross * 0.027;
    const foodCost = netSales * ((parseFloat(inputs.foodCostPct) || 0) / 100);
    const laborPerDay =
      (parseFloat(inputs.numWorkers) || 0) *
      (parseFloat(inputs.hourlyRate) || 0) *
      (parseFloat(inputs.hoursPerDay) || 0);
    const labor = laborPerDay * (parseFloat(inputs.laborDays) || 0);
    const other = parseFloat(inputs.otherExpenses) || 0;
    const totalCosts = squareFees + foodCost + labor + other;
    const netProfit = netSales - totalCosts;
    const margin = netSales > 0 ? (netProfit / netSales) * 100 : 0;
    const foodPct = netSales > 0 ? (foodCost / netSales) * 100 : 0;
    const laborPct = netSales > 0 ? (labor / netSales) * 100 : 0;
    const feesPct = netSales > 0 ? (squareFees / netSales) * 100 : 0;
    const otherPct = netSales > 0 ? (other / netSales) * 100 : 0;
    return { netSales, squareFees, foodCost, labor, other, netProfit, margin, foodPct, laborPct, feesPct, otherPct };
  }, [inputs]);

  const rows = [
    { label: 'Food Cost', value: calc.foodCost, pct: calc.foodPct, limits: [33, 38] },
    { label: 'Labor', value: calc.labor, pct: calc.laborPct, limits: [25, 35] },
    { label: 'Square Fees', value: calc.squareFees, pct: calc.feesPct, limits: [3, 4] },
    { label: 'Other Expenses', value: calc.other, pct: calc.otherPct, limits: [10, 15] },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Period Toggle */}
      <div className="flex gap-2">
        {['weekly', 'monthly'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
            style={{
              background: period === p ? '#c9940a' : '#fff',
              color: period === p ? '#fff' : '#7a4f00',
              border: `1.5px solid ${period === p ? '#c9940a' : '#e8e0d0'}`,
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Sales Section */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: '#fff', border: '1.5px solid rgba(180,120,0,0.15)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#c9940a' }}>
          💰 Sales (from Square)
        </p>
        {[
          { label: 'Gross Sales', key: 'grossSales', placeholder: '0.00' },
          { label: 'Returns', key: 'returns', placeholder: '0.00' },
          { label: 'Discounts & Comps', key: 'discounts', placeholder: '0.00' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <FieldLabel text={label} />
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: 11, color: 'rgba(61,34,0,0.4)', fontSize: 14 }}>$</span>
              <input
                type="number"
                value={inputs[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                style={{ ...inp, paddingLeft: 28 }}
              />
            </div>
          </div>
        ))}
        <div
          className="flex justify-between items-center pt-2 mt-1"
          style={{ borderTop: '1.5px solid rgba(180,120,0,0.1)' }}
        >
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(61,34,0,0.5)' }}>
            Net Sales
          </span>
          <span className="font-black text-base" style={{ color: '#c9940a' }}>
            {fmt(calc.netSales)}
          </span>
        </div>
      </div>

      {/* Costs Section */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: '#fff', border: '1.5px solid rgba(180,120,0,0.15)' }}
      >
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#c9940a' }}>
          📦 Costs
        </p>
        <div>
          <FieldLabel text="Food Cost %" />
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={inputs.foodCostPct}
              onChange={(e) => set('foodCostPct', e.target.value)}
              style={{ ...inp, paddingRight: 28 }}
            />
            <span style={{ position: 'absolute', right: 14, top: 11, color: 'rgba(61,34,0,0.4)', fontSize: 14 }}>%</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '# Workers', key: 'numWorkers' },
            { label: 'Hourly Rate $', key: 'hourlyRate' },
            { label: 'Hours/Day', key: 'hoursPerDay' },
          ].map(({ label, key }) => (
            <div key={key}>
              <FieldLabel text={label} />
              <input
                type="number"
                value={inputs[key]}
                onChange={(e) => set(key, e.target.value)}
                style={inp}
              />
            </div>
          ))}
        </div>
        <div>
          <FieldLabel text="Days Worked This Period" />
          <input
            type="number"
            value={inputs.laborDays}
            onChange={(e) => set('laborDays', e.target.value)}
            placeholder="e.g. 4"
            style={inp}
          />
        </div>
        <div>
          <FieldLabel text="Other Expenses (fuel, commissary, supplies…)" />
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: 11, color: 'rgba(61,34,0,0.4)', fontSize: 14 }}>$</span>
            <input
              type="number"
              value={inputs.otherExpenses}
              onChange={(e) => set('otherExpenses', e.target.value)}
              placeholder="0.00"
              style={{ ...inp, paddingLeft: 28 }}
            />
          </div>
        </div>
      </div>

      {/* P&L Result Card */}
      <div className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: '#1a0800' }}>
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {period === 'weekly' ? 'Weekly' : 'Monthly'} P&L Snapshot
        </p>

        {rows.map(({ label, value, pct, limits }) => {
          const h = getHealth(pct, limits[0], limits[1]);
          return (
            <div key={label} className="flex items-center justify-between">
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                {h.icon} {label}
              </span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>
                {fmt(value)}{' '}
                <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                  ({pct.toFixed(1)}%)
                </span>
              </span>
            </div>
          );
        })}

        <div
          className="flex items-center justify-between pt-3 mt-1"
          style={{ borderTop: '1.5px solid rgba(255,255,255,0.1)' }}
        >
          <span className="font-black text-base" style={{ color: '#fff' }}>
            NET PROFIT
          </span>
          <span
            className="font-black text-2xl"
            style={{ color: calc.netProfit >= 0 ? '#4ade80' : '#f87171' }}
          >
            {fmt(calc.netProfit)}
          </span>
        </div>

        <div className="text-center">
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Margin: </span>
          <span
            className="font-black"
            style={{
              fontSize: 14,
              color: calc.margin >= 20 ? '#4ade80' : calc.margin >= 10 ? '#fbbf24' : '#f87171',
            }}
          >
            {calc.margin.toFixed(1)}%
          </span>
        </div>

        {/* Health Legend */}
        <div
          className="rounded-xl p-3 mt-1"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginBottom: 4 }}>
            HEALTH GUIDE
          </p>
          <div className="flex gap-3" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
            <span>🟢 On Target</span>
            <span>🟡 Watch It</span>
            <span>🔴 Over Budget</span>
          </div>
        </div>
      </div>
    </div>
  );
}
