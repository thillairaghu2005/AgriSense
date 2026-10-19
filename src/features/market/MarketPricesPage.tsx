import { useState, useMemo } from 'react';
import { MARKET_PRICES, MSP_PRICES } from '@/data/marketPrices';
import { CROPS } from '@/data/crops';
import { STATES } from '@/data/locations';
import { Card, PageHeader, DemoLabel, InfoBanner } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';

export default function MarketPricesPage() {
  const [cropFilter, setCropFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MARKET_PRICES.filter(p =>
      (!cropFilter || p.cropId === cropFilter) &&
      (!stateFilter || p.state === stateFilter) &&
      (!q || p.cropName.toLowerCase().includes(q) || p.market.toLowerCase().includes(q))
    );
  }, [cropFilter, stateFilter, query]);

  const selectedPrice = filtered.find(p => p.id === selectedPriceId) ?? filtered[0];
  const estimatedRevenue = selectedPrice ? quantity * selectedPrice.modalPrice : 0;

  const chartData = filtered.slice(0, 8).map(p => ({
    name: p.market.replace(' APMC', '').replace(' Regulated Market', '').slice(0, 12),
    modal: p.modalPrice,
    min: p.minPrice,
    max: p.maxPrice,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Market Prices"
        subtitle="Sample APMC / mandi prices across India"
        badge={<DemoLabel label="Illustrative — not live prices" />}
      />

      <InfoBanner variant="warning">
        <div className="flex gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>All prices shown are <strong>illustrative sample data</strong>, not actual mandi prices. For live prices, visit <strong>Agmarknet</strong> (agmarknet.gov.in) or your state agriculture marketing board.</span>
        </div>
      </InfoBanner>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search crop or market…" className="flex-1" />
        <select value={cropFilter} onChange={e => setCropFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]">
          <option value="">All Crops</option>
          {CROPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]">
          <option value="">All States</option>
          {STATES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-primary-600)]" /> Sample Price Comparison
          </h2>
          <DemoLabel />
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v ?? 0).toLocaleString('en-IN')}`, 'Modal Price']} />
                <Bar dataKey="modal" fill="#16a34a" name="Modal Price" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Prices table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" aria-label="Sample market prices">
            <thead>
              <tr>
                {['Crop', 'State', 'Market', 'Date', 'Unit', 'Min ₹', 'Max ₹', 'Modal ₹'].map(h => (
                  <th key={h} className="text-left py-2.5 px-2 text-[var(--color-text-muted)] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(price => (
                <tr key={price.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                  <td className="py-2.5 px-2 font-medium text-[var(--color-text-primary)] whitespace-nowrap">{price.cropName}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-muted)]">{price.state}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-muted)] whitespace-nowrap">{price.market}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-muted)]">{price.date}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-muted)]">{price.unit}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-secondary)]">₹{price.minPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-2 text-[var(--color-text-secondary)]">₹{price.maxPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-2 font-semibold text-[var(--color-text-primary)]">₹{price.modalPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-sm text-[var(--color-text-muted)]">No prices match your filters.</p>}
        </div>
      </Card>

      {/* Revenue estimator */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Revenue Estimator</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Estimate gross revenue using sample modal price. Actual revenue depends on produce grade, deductions, and transport.</p>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1" htmlFor="rev-qty">Quantity (quintals)</label>
            <input
              id="rev-qty"
              type="number" min={1} value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1" htmlFor="rev-crop">Price Reference</label>
            <select
              id="rev-crop"
              value={selectedPriceId}
              onChange={e => setSelectedPriceId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] bg-white"
            >
              {MARKET_PRICES.map(p => <option key={p.id} value={p.id}>{p.cropName} — {p.market} (₹{p.modalPrice}/qtl)</option>)}
            </select>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-[var(--color-text-muted)]">Estimated Gross Revenue</p>
            <p className="text-xl font-bold text-[var(--color-primary-700)]">₹{estimatedRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-[var(--color-text-muted)]">Estimate only — based on sample data</p>
          </div>
        </div>
      </Card>

      {/* MSP Info */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Minimum Support Price (MSP) Reference</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-3">MSP is the government procurement price and is distinct from actual mandi transaction prices.</p>
        <DemoLabel label="Illustrative — verify current MSP from CACP/PIB" />
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                {['Crop', 'Season', 'Year', 'MSP ₹/qtl', 'Announced By'].map(h => (
                  <th key={h} className="text-left py-2 px-2 text-[var(--color-text-muted)] font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MSP_PRICES.map(p => (
                <tr key={`${p.cropId}-${p.season}`}>
                  <td className="py-2 px-2 font-medium text-[var(--color-text-primary)]">{p.cropName}</td>
                  <td className="py-2 px-2 text-[var(--color-text-muted)] capitalize">{p.season}</td>
                  <td className="py-2 px-2 text-[var(--color-text-muted)]">{p.year}</td>
                  <td className="py-2 px-2 font-semibold text-[var(--color-text-primary)]">₹{p.pricePerQuintal.toLocaleString('en-IN')}</td>
                  <td className="py-2 px-2 text-[var(--color-text-muted)]">{p.announcedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
