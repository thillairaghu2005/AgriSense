import { useState, useMemo, useEffect, useCallback } from 'react';
import { MARKET_PRICES, MSP_PRICES } from '@/data/marketPrices';
import { CROPS } from '@/data/crops';
import { STATES } from '@/data/locations';
import type { MarketPrice } from '@/types';
import { Card, PageHeader, InfoBanner } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SearchInput } from '@/components/forms/FormComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Info, Wifi, Radio, RefreshCw, Key, ExternalLink, Check, AlertCircle, X } from 'lucide-react';
import {
  fetchLiveMandiPrices,
  getAgmarknetApiKey,
  saveAgmarknetApiKey,
  removeAgmarknetApiKey,
} from '@/lib/agmarknetApi';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export default function MarketPricesPage() {
  const [cropFilter, setCropFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [query, setQuery] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [selectedPriceId, setSelectedPriceId] = useState<string>('');

  // Mode: Live Agmarknet vs Sample Seed Data
  const [isLive, setIsLive] = useState<boolean>(() =>
    storageGet(STORAGE_KEYS.MARKET_LIVE_ENABLED, false)
  );

  const [apiKey, setApiKey] = useState<string>(getAgmarknetApiKey);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keyInput, setKeyInput] = useState<string>(apiKey);

  const [livePrices, setLivePrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadLivePrices = useCallback(async () => {
    if (!isLive || !apiKey) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetchLiveMandiPrices({
        apiKey,
        state: stateFilter || undefined,
        limit: 100,
      });
      setLivePrices(res.prices);
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      setApiError(err.message || 'Failed to fetch live prices from Agmarknet API');
    } finally {
      setIsLoading(false);
    }
  }, [isLive, apiKey, stateFilter]);

  useEffect(() => {
    if (isLive && apiKey) {
      loadLivePrices();
    }
  }, [isLive, apiKey, loadLivePrices]);

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    saveAgmarknetApiKey(trimmed);
    setApiKey(trimmed);
    setShowKeyModal(false);
    if (trimmed && isLive) {
      loadLivePrices();
    }
  }

  function handleRemoveKey() {
    removeAgmarknetApiKey();
    setApiKey('');
    setKeyInput('');
    setShowKeyModal(false);
    setLivePrices([]);
  }

  function toggleLiveMode(val: boolean) {
    setIsLive(val);
    storageSet(STORAGE_KEYS.MARKET_LIVE_ENABLED, val);
    if (val && !apiKey) {
      setShowKeyModal(true);
    }
  }

  // Active dataset
  const activeDataset = (isLive && apiKey && livePrices.length > 0)
    ? livePrices
    : MARKET_PRICES;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return activeDataset.filter(p =>
      (!cropFilter || p.cropId === cropFilter) &&
      (!stateFilter || p.state === stateFilter) &&
      (!q || p.cropName.toLowerCase().includes(q) || p.market.toLowerCase().includes(q))
    );
  }, [activeDataset, cropFilter, stateFilter, query]);

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
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Market Prices"
          subtitle={
            isLive && apiKey
              ? `Live APMC / Mandi Daily Arrivals via Agmarknet ${lastUpdated ? `(Synced at ${lastUpdated})` : ''}`
              : 'Sample APMC / mandi prices across India'
          }
          badge={
            isLive && apiKey ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE AGMARKNET
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-300">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                Cached Mandi Benchmark
              </span>
            )
          }
        />

        {/* Live Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-[var(--color-surface-2)] rounded-lg text-xs font-medium">
            <button
              onClick={() => toggleLiveMode(true)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLive
                  ? 'bg-white text-[var(--color-primary-700)] font-semibold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              Live Mandi Feed
            </button>
            <button
              onClick={() => toggleLiveMode(false)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isLive
                  ? 'bg-white text-[var(--color-primary-700)] font-semibold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-neutral-500" />
              Sample Data
            </button>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowKeyModal(true)}
            leftIcon={<Key className="w-3.5 h-3.5 text-[var(--color-primary-600)]" />}
            title="Configure Data.gov.in API Key"
          >
            {apiKey ? 'API Key Configured' : 'Configure API Key'}
          </Button>

          {isLive && apiKey && (
            <Button
              size="sm"
              variant="ghost"
              onClick={loadLivePrices}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* API Key Modal / Drawer */}
      {showKeyModal && (
        <div className="p-4 rounded-lg border border-[var(--color-border)] bg-white shadow-xs text-xs animate-fade-in space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Key className="w-4 h-4 text-[var(--color-primary-700)]" />
                Data.gov.in Agmarknet API Key
              </h3>
              <p className="text-[var(--color-text-secondary)] mt-0.5">
                Government of India provides free public API access to daily wholesale mandi arrivals and prices across 3,000+ markets nationwide.
              </p>
            </div>
            <button
              onClick={() => setShowKeyModal(false)}
              className="text-neutral-500 hover:text-neutral-700 p-1 rounded-md cursor-pointer"
              aria-label="Close API key drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Paste your data.gov.in API key here (e.g., 579b464db66ec23bdd000001...)"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              className="flex-1 w-full px-3 py-2 text-xs bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="submit" size="sm" variant="primary" leftIcon={<Check className="w-3.5 h-3.5" />}>
                Save Key
              </Button>
              {apiKey && (
                <Button type="button" size="sm" variant="secondary" onClick={handleRemoveKey}>
                  Clear
                </Button>
              )}
            </div>
          </form>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-primary-700)]">
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Don&apos;t have a key?</span>
            <a
              href="https://data.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline inline-flex items-center gap-0.5 hover:text-[var(--color-primary-900)]"
            >
              Register on Data.gov.in for free <ExternalLink className="w-3 h-3" />
            </a>
            <span>(Resource: Agmarknet Daily Wholesale Prices).</span>
          </div>
        </div>
      )}

      {/* Status banner */}
      {isLive && !apiKey ? (
        <InfoBanner variant="warning">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>To fetch <strong>live daily prices</strong> from Agmarknet mandis, please configure your free <strong>data.gov.in API key</strong>. Displaying sample data in the meantime.</span>
            <Button size="sm" variant="primary" onClick={() => setShowKeyModal(true)}>
              Enter API Key
            </Button>
          </div>
        </InfoBanner>
      ) : isLive && apiError ? (
        <InfoBanner variant="warning">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>{apiError}. Falling back to sample reference dataset.</span>
          </div>
        </InfoBanner>
      ) : isLive && apiKey ? (
        <InfoBanner variant="info">
          Streaming live APMC mandi transaction records via <strong>data.gov.in / Agmarknet API</strong> ({filtered.length} records active).
        </InfoBanner>
      ) : (
        <InfoBanner variant="warning">
          <div className="flex gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>All prices shown are <strong>illustrative sample data</strong>, not actual mandi prices. To stream real-time prices, switch to <strong>Live Mandi Feed</strong> above.</span>
          </div>
        </InfoBanner>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search crop or market…" className="flex-1" />
        <select
          value={cropFilter}
          onChange={e => setCropFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
        >
          <option value="">All Crops</option>
          {CROPS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
        >
          <option value="">All States</option>
          {STATES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--color-primary-600)]" />
              {isLive && apiKey ? 'Live Mandi Price Comparison' : 'Sample Price Comparison'}
            </h2>
            {isLive && apiKey && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Agmarknet Live
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            Comparison of modal commodity prices across regional regulated APMC markets (₹ per quintal).
          </p>
          <div className="mt-4 h-56">
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
      <Card className="p-0 overflow-hidden shadow-xs border border-[var(--color-border)]">
        <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Mandi Wholesale Modal & Arrival Prices</h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Showing {filtered.length} commodity price records</p>
          </div>
          {isLive && apiKey && (
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live Feed
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs" aria-label="Market prices">
            <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
              <tr>
                {['Crop', 'State', 'Market', 'Date', 'Unit', 'Min ₹', 'Max ₹', 'Modal ₹', 'Source'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map(price => (
                <tr key={price.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[var(--color-text-primary)] whitespace-nowrap">{price.cropName}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{price.state}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)] whitespace-nowrap">{price.market}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)] font-mono">{price.date}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{price.unit}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">₹{price.minPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-secondary)]">₹{price.maxPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-800">₹{price.modalPrice.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-[10px] text-[var(--color-text-muted)] whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                      {price.sourceLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-8 text-sm text-[var(--color-text-muted)]">No prices match your filters.</p>
          )}
        </div>
      </Card>

      {/* Revenue estimator */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Revenue Estimator</h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          Estimate gross revenue using the selected mandi modal price. Actual returns depend on quality grade, moisture content, and transport.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1" htmlFor="rev-qty">Quantity (quintals)</label>
            <input
              id="rev-qty"
              type="number" min={1} value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1" htmlFor="rev-crop">Price Reference</label>
            <select
              id="rev-crop"
              value={selectedPriceId}
              onChange={e => setSelectedPriceId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] bg-white cursor-pointer"
            >
              {activeDataset.map(p => (
                <option key={p.id} value={p.id}>
                  {p.cropName} — {p.market} (₹{p.modalPrice}/qtl)
                </option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-right shadow-xs min-w-[200px]">
            <p className="text-xs font-medium text-emerald-800">Estimated Gross Revenue</p>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">₹{estimatedRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-600 mt-0.5">
              {isLive && apiKey ? 'Based on live modal price' : 'Estimate only — sample data'}
            </p>
          </div>
        </div>
      </Card>

      {/* MSP Info */}
      <Card className="p-0 overflow-hidden shadow-xs border border-[var(--color-border)]">
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Minimum Support Price (MSP) Benchmark</h2>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              CACP / CCEA Statutory Reference
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">MSP is the statutory benchmark price announced by the Government of India via CCEA.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
              <tr>
                {['Crop', 'Season', 'Year', 'MSP ₹/qtl', 'Announced By'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MSP_PRICES.map(p => (
                <tr key={`${p.cropId}-${p.season}`} className="hover:bg-[var(--color-surface-1)] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-[var(--color-text-primary)]">{p.cropName}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)] capitalize">{p.season}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)] font-mono">{p.year}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-700">₹{p.pricePerQuintal.toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-[var(--color-text-muted)]">{p.announcedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
