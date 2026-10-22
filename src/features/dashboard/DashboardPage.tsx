import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun, TrendingUp, BookOpen, ArrowRight,
  ShieldCheck, FileText, Clock, AlertTriangle, PackageCheck, Trees,
  DollarSign, Database, Download, ChevronRight,
  Landmark
} from 'lucide-react';
import { useApp } from '@/app/providers';
import Button from '@/components/ui/Button';
import { getWeatherForRegion, type RegionWeather } from '@/data/weather';
import { MARKET_PRICES } from '@/data/marketPrices';
import { SCHEMES } from '@/data/schemes';
import { SEED_VARIETIES, SEED_FARMS } from '@/data/seeds';
import { getApplications } from '@/data/applications';
import { getGrievances } from '@/data/grievances';
import { evaluateEligibility } from '@/lib/eligibilityEngine';
import { STATES, getLocationCoordinates } from '@/data/locations';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { fetchLiveWeatherData } from '@/lib/weatherApi';
import { storageGet, STORAGE_KEYS } from '@/lib/storage';
import type { UserRole, SchemeApplication } from '@/types';

export default function DashboardPage() {
  const { profile, state: selectedState, district: selectedDistrict, role, setRole } = useApp();
  const navigate = useNavigate();

  const isLiveWeather = storageGet(STORAGE_KEYS.WEATHER_LIVE_ENABLED, true);
  const [liveWeather, setLiveWeather] = useState<RegionWeather | null>(null);

  useEffect(() => {
    if (!isLiveWeather) return;
    const coords = getLocationCoordinates(selectedState, selectedDistrict);
    fetchLiveWeatherData(coords.lat, coords.lon, coords.label, selectedState)
      .then(setLiveWeather)
      .catch(() => {});
  }, [isLiveWeather, selectedState, selectedDistrict]);

  const weather = (isLiveWeather && liveWeather) ? liveWeather : getWeatherForRegion(selectedState);
  const stateName = STATES.find(s => s.id === selectedState)?.name ?? selectedState;

  // Applications and Grievances
  const applications = getApplications();
  const grievances = getGrievances();

  // Matched schemes for farmer
  const matchedSchemes = SCHEMES.map(s => ({
    scheme: s,
    eligibility: evaluateEligibility(profile, s),
  })).sort((a, b) => b.eligibility.matchScore - a.eligibility.matchScore);

  const topEligible = matchedSchemes.filter(m => m.eligibility.isEligible).slice(0, 3);
  const topPrices = MARKET_PRICES.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Specific Platform Header — What the product actually does */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-0.5 rounded border border-[var(--color-border)]">
                MoA&FW National Digital AgriStack
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                Registry ID: IN-AGRI-2026-TN
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1.5 tracking-tight">
              Integrated Agricultural Welfare & DBT Sanction Registry
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
              Real-time platform linking farmer land records with Direct Benefit Transfers (DBT), state subsidy sanction pipelines, certified seed farm allocations, and agro-meteorological advisories across 28 States & UTs.
            </p>
          </div>

          {/* Perspective Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
              Portal View:
            </span>
            <div className="flex items-center gap-1 bg-[var(--color-surface-2)] p-1 rounded-lg border border-[var(--color-border)]">
              {(
                [
                  { id: 'farmer', label: 'Farmer (Beneficiary)' },
                  { id: 'officer', label: 'Agri Officer' },
                  { id: 'manager', label: 'Scheme Manager' },
                  { id: 'admin', label: 'Govt Admin' },
                ] as { id: UserRole; label: string }[]
              ).map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    role === r.id
                      ? 'bg-white text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/50 border border-transparent'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Operational Status Strip */}
        <div className="mt-4 pt-3.5 flex flex-wrap items-center justify-between gap-y-2 text-xs text-[var(--color-text-muted)]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              <strong className="text-[var(--color-text-primary)]">Beneficiary:</strong> {profile.displayName}
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--color-text-primary)]">Land Parcel:</strong> Survey {profile.surveyNumber || '142/3A'} ({profile.landArea} {profile.landAreaUnit}, {profile.farmerCategory})
            </span>
            <span>•</span>
            <span>
              <strong className="text-[var(--color-text-primary)]">Location:</strong> {profile.village || 'Panchayat Village'}, {selectedDistrict || profile.district}, {stateName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-[11px] font-medium text-[var(--color-text-secondary)]">
              PFMS DBT Gateway Active
            </span>
            <span>•</span>
            <span className="inline-flex items-center text-[11px] font-medium text-[var(--color-text-secondary)]">
              Bhulekh Patta Synced
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROLE VIEW 1: FARMER / BENEFICIARY DASHBOARD
         ========================================================================= */}
      {role === 'farmer' && (
        <div className="space-y-6">
          {/* Operational Metrics Strip */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                <span>Direct Benefit (DBT) Credited</span>
                <Landmark className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                ₹18,000
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)] font-medium">
                3 installments credited via PFMS
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                <span>Eligible Govt Schemes</span>
                <BookOpen className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {topEligible.length} Schemes
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Instant match for {profile.farmerCategory}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                <span>Active Applications</span>
                <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {applications.length} In Progress
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                Stage 5/6 District verification
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-medium">
                <span>Certified Farm Supplies</span>
                <PackageCheck className="w-4 h-4 text-[var(--color-text-secondary)]" />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {SEED_VARIETIES.length} Varieties
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                50% subsidized farm stock
              </p>
            </div>
          </div>

          {/* Main Layout: Schemes & Applications (Typography and table, no cards inside cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Recommended Schemes for Your Land Profile */}
            <div className="lg:col-span-8 bg-white border border-[var(--color-border)] rounded-lg p-5">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Recommended Welfare Schemes for Your Land Profile
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Evaluated against your land holding ({profile.landArea} {profile.landAreaUnit}) and social category ({profile.farmerCategory})
                  </p>
                </div>
                <button
                  onClick={() => navigate('/schemes')}
                  className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all {SCHEMES.length} schemes <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clean List */}
              <div className="space-y-4 pt-2">
                {topEligible.map(({ scheme, eligibility }) => (
                  <div key={scheme.id} className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--color-text-primary)]">
                          {scheme.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                          {eligibility.matchScore}% Match
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {scheme.level === 'central' ? 'Central Govt' : 'State Govt'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                        {scheme.shortDescription}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                        <span className="text-[var(--color-text-secondary)]">
                          <strong>Assistance:</strong> {scheme.financialAssistance}
                        </span>
                        {scheme.subsidyPercentage && (
                          <span className="text-[var(--color-text-primary)] font-semibold">
                            Subsidy: {String(scheme.subsidyPercentage).includes('%') || isNaN(Number(scheme.subsidyPercentage)) ? scheme.subsidyPercentage : `${scheme.subsidyPercentage}%`}
                          </span>
                        )}
                        <span className="text-[var(--color-text-muted)]">
                          Deadline: {scheme.deadlines || 'Open Year-round'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/schemes?scheme=${scheme.id}`)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/applications?apply=${scheme.id}`)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Application Verification Status & Direct Action Hub */}
            <div className="lg:col-span-4 space-y-6">
              {/* Application Progress Feed */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
                <div className="flex items-center justify-between pb-3">
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Application Tracking
                  </h2>
                  <button
                    onClick={() => navigate('/applications')}
                    className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline"
                  >
                    View All ({applications.length})
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {applications.slice(0, 3).map((app: SchemeApplication) => (
                    <div key={app.id} className="py-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--color-text-primary)]">{app.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)] capitalize">
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 truncate">
                        {app.schemeName}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
                        <span>Submitted: {app.appliedDate.split('T')[0]}</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">Stage {app.timeline.length}/6</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    leftIcon={<FileText className="w-3.5 h-3.5" />}
                    onClick={() => navigate('/applications')}
                  >
                    Open Full Tracker & Verification History
                  </Button>
                </div>
              </div>

              {/* Subsidized Inputs Quick Hub */}
              <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                  Subsidized Farm Inputs Hub
                </h3>

                <button
                  onClick={() => navigate('/seed-distribution')}
                  className="w-full flex items-center justify-between p-2.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-1)] text-xs text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">Certified Seed Requisition (50% Subsidy)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                </button>

                <button
                  onClick={() => navigate('/plantations')}
                  className="w-full flex items-center justify-between p-2.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-1)] text-xs text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Trees className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">Fruit Orchard Grafts & Timber Saplings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                </button>

                <button
                  onClick={() => navigate('/grievances')}
                  className="w-full flex items-center justify-between p-2.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-surface-1)] text-xs text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">Lodge Welfare Grievance (48h SLA)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>
          </div>

          {/* Weather Advisory & Mandi Modal Prices (Structured Tables) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Agro-Meteorological Advisory Table */}
            <div className="lg:col-span-5 bg-white border border-[var(--color-border)] rounded-lg p-5">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Agro-Meteorological Advisory ({stateName})
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/weather')}
                  className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline flex items-center gap-0.5"
                >
                  Full Advisory <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3">
                <table className="table-clean" aria-label="3-Day Weather Advisory">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Sky Condition</th>
                      <th className="text-right">Max Temp</th>
                      <th className="text-right">Rain Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weather.forecast.slice(0, 4).map(day => (
                      <tr key={day.dateLabel}>
                        <td className="font-medium">{day.dateLabel}</td>
                        <td className="capitalize">
                          <span className="flex items-center gap-1.5">
                            <WeatherIcon condition={day.condition} className="w-3.5 h-3.5 text-neutral-600" />
                            {day.condition}
                          </span>
                        </td>
                        <td className="text-right font-semibold">{day.maxTempC}°C</td>
                        <td className="text-right font-semibold text-[var(--color-text-primary)]">{day.rainProbability}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)] mt-3">
                <strong>Agronomic Advisory:</strong> If rainfall probability exceeds 40%, postpone urea top-dressing and pesticide spraying to prevent runoff loss.
              </p>
            </div>

            {/* Mandi Modal Prices vs MSP Benchmarks Table */}
            <div className="lg:col-span-7 bg-white border border-[var(--color-border)] rounded-lg p-5">
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                    e-NAM Mandi Modal Prices vs MSP Benchmarks
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/market-prices')}
                  className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline flex items-center gap-0.5"
                >
                  All APMC Mandis <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="table-clean" aria-label="Mandi Modal Prices">
                  <thead>
                    <tr>
                      <th>Commodity</th>
                      <th>Mandi Market</th>
                      <th className="text-right">Modal Price (₹/Qtl)</th>
                      <th className="text-right">MSP Floor</th>
                      <th className="text-right">Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPrices.map(price => {
                      const msp = Math.round(price.modalPrice * 1.05);
                      const diff = price.modalPrice - msp;
                      return (
                        <tr key={price.id}>
                          <td className="font-bold text-[var(--color-text-primary)]">{price.cropName}</td>
                          <td className="text-[var(--color-text-muted)]">{price.market}</td>
                          <td className="text-right font-bold text-[var(--color-text-primary)]">₹{price.modalPrice.toLocaleString('en-IN')}</td>
                          <td className="text-right text-[var(--color-text-muted)]">₹{msp.toLocaleString('en-IN')}</td>
                          <td className="text-right font-semibold text-[var(--color-text-primary)]">
                            {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)] mt-3">
                Modal prices update every trading day at 17:00 IST via Agmarknet electronic gateway.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW 2: AGRICULTURAL OFFICER (ADA / AO) DASHBOARD
         ========================================================================= */}
      {role === 'officer' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-0.5 rounded border border-[var(--color-border)]">
                  Sub-Divisional Jurisdiction
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">Block Agriculture Office</span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                Field Inspection & Verification Queue — {selectedDistrict || 'Thanjavur'} Division
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Authorised Officer: Dr. K. Ramanathan, ADA (Agronomy) | Staff ID: AG-TN-2024-884
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => navigate('/applications')}
            >
              Open Full Verification Queue
            </Button>
          </div>

          {/* Metrics row */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Pending Field Inspections</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">14</span>
              <span className="text-xs text-[var(--color-text-muted)]">Geo-tagging required</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Certified Seed Farm Stock</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">128.5 Qtl</span>
              <span className="text-xs text-[var(--color-text-muted)]">CO-51 & CR-1009 available</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Assigned Block Grievances</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">{grievances.length}</span>
              <span className="text-xs text-[var(--color-text-muted)]">Target SLA: 48 hours</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Applications Recommended</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">82</span>
              <span className="text-xs text-[var(--color-text-muted)]">Forwarded to Collectorate</span>
            </div>
          </div>

          {/* Verification Table */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] pb-3">
              Pending Beneficiary Field Verification List
            </h3>
            <div className="overflow-x-auto mt-2">
              <table className="table-clean" aria-label="Field Verification List">
                <thead>
                  <tr>
                    <th>Application Ref</th>
                    <th>Beneficiary Name</th>
                    <th>Scheme</th>
                    <th>Survey & Area</th>
                    <th>Village / Block</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app: SchemeApplication) => (
                    <tr key={app.id}>
                      <td className="font-bold text-[var(--color-text-primary)]">{app.id}</td>
                      <td className="font-semibold">{app.farmerName}</td>
                      <td>{app.schemeName}</td>
                      <td>Survey {app.surveyNumber} ({app.landAreaAcres} ac)</td>
                      <td>{app.village || 'Thanjavur Block'}</td>
                      <td className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate('/applications')}
                        >
                          Verify Field
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW 3: SCHEME MANAGER DASHBOARD
         ========================================================================= */}
      {role === 'manager' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-0.5 rounded border border-[var(--color-border)]">
                  State / District Sanction Cell
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">Direct Benefit Transfer Directorate</span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                Scheme Implementation Directorate — {stateName}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Fund Disbursement, Sanction Approvals, and District Budget Clearance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => navigate('/analytics')}
              >
                Disbursement Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<DollarSign className="w-3.5 h-3.5" />}
                onClick={() => navigate('/dbt-ledger')}
              >
                DBT Public Ledger
              </Button>
            </div>
          </div>

          {/* Manager Metrics */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Approved Outlay</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">₹840.50 Cr</span>
              <span className="text-xs text-[var(--color-text-muted)]">FY 2026-27 Approved</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">DBT Disbursed via PFMS</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">₹692.10 Cr</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">82.3% Utilization</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Registered Beneficiaries</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">1,248,300</span>
              <span className="text-xs text-[var(--color-text-muted)]">Active DBT farmers</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Sanction Clearance Speed</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">3.8 Days</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Target SLA: 7 days</span>
            </div>
          </div>

          {/* Budget Utilization Matrix */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] pb-3">
              Scheme Budget Utilization Matrix
            </h3>
            <div className="space-y-4 mt-4">
              {[
                { name: 'PM-KISAN Samman Nidhi', total: 320, spent: 304, percent: 95 },
                { name: 'PM Krishi Sinchayee Yojana (Micro-Irrigation)', total: 180, spent: 148, percent: 82 },
                { name: 'Sub-Mission on Agricultural Mechanization (SMAM)', total: 110, spent: 88, percent: 80 },
                { name: 'Paramparagat Krishi Vikas Yojana (Organic PKVY)', total: 60, spent: 44, percent: 73 },
                { name: 'National Horticulture Mission (MIDH)', total: 95, spent: 72, percent: 76 },
              ].map(item => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--color-text-primary)]">{item.name}</span>
                    <span className="text-[var(--color-text-muted)]">
                      ₹{item.spent} Cr / ₹{item.total} Cr ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface-2)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
                    <div
                      className="bg-neutral-800 h-full rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW 4: CENTRAL ADMINISTRATOR DASHBOARD
         ========================================================================= */}
      {role === 'admin' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-0.5 rounded border border-[var(--color-border)]">
                  Ministry of Agriculture & Farmers Welfare
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">NIC AgriStack Core</span>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                Central Portal Administration & Master Scheme Engine
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                National Farmer Registry, API Integrations (Aadhaar, PFMS, Bhulekh/Patta), and Audit Logs
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Database className="w-3.5 h-3.5" />}
              onClick={() => navigate('/government-resources')}
            >
              Government Resources Directory
            </Button>
          </div>

          {/* Admin Metrics */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Active Schemes Master</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">{SCHEMES.length}</span>
              <span className="text-xs text-[var(--color-text-muted)]">Central & State registries</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">Registered Seed Farms</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">{SEED_FARMS.length}</span>
              <span className="text-xs text-[var(--color-text-muted)]">State & Central farms</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">PFMS Gateway Uptime</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">99.98%</span>
              <span className="text-xs text-[var(--color-text-muted)] font-medium">Zero failed settlement</span>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)] block">System Audit Events</span>
              <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-1 block">148,290</span>
              <span className="text-xs text-[var(--color-text-muted)]">SHA-256 integrity verified</span>
            </div>
          </div>

          {/* National Gateways Table */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] pb-3">
              Integrated National Dataspaces & Gateways Status
            </h3>
            <div className="overflow-x-auto mt-2">
              <table className="table-clean" aria-label="National Dataspaces Status">
                <thead>
                  <tr>
                    <th>Gateway Name</th>
                    <th>Protocol / Standard</th>
                    <th>Response Latency</th>
                    <th className="text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'PM-KISAN National Portal', api: 'REST / Aadhaar eKYC v2.5', status: 'Operational', response: '142ms' },
                    { name: 'Public Financial Management System (PFMS)', api: 'DBT Direct Disburse API', status: 'Operational', response: '210ms' },
                    { name: 'Digital Land Records (Bhulekh / Patta)', api: 'NIC LandRecord WSDL', status: 'Operational', response: '320ms' },
                    { name: 'National Agriculture Market (e-NAM)', api: 'Agmarknet Real-time Ticker', status: 'Operational', response: '180ms' },
                    { name: 'IMD Agro-Meteorological Weather Service', api: 'Mausam Weather API', status: 'Operational', response: '95ms' },
                  ].map(gw => (
                    <tr key={gw.name}>
                      <td className="font-semibold text-[var(--color-text-primary)]">{gw.name}</td>
                      <td className="text-xs text-[var(--color-text-muted)]">{gw.api}</td>
                      <td className="text-xs">{gw.response}</td>
                      <td className="text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                          {gw.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official Government Verification & Disclaimer Banner */}
      <div className="p-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0" />
          <span>
            <strong>Official Verification Notice:</strong> All central & state government schemes are sourced directly from MoA&FW, PM-KISAN, PMFBY, NHB, ICAR, and TNAU.
          </span>
        </div>
        <button
          onClick={() => navigate('/government-resources')}
          className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline whitespace-nowrap cursor-pointer"
        >
          View Source Circulars & Helplines →
        </button>
      </div>
    </div>
  );
}
