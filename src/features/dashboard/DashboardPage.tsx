import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun, TrendingUp, BookOpen, Sparkles, ArrowRight,
  ShieldCheck, FileText, CheckCircle2, Clock, AlertTriangle, PackageCheck, Trees,
  DollarSign, Users, Database, Download, ExternalLink, ChevronRight, Building2
} from 'lucide-react';
import { useApp } from '@/app/providers';
import { Card, StatCard, Badge } from '@/components/ui/Card';
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
import type { UserRole, SchemeApplication, SeedFarm } from '@/types';

export default function DashboardPage() {
  const { profile, state: selectedState, district: selectedDistrict, role, setRole, t } = useApp();
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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('dashboard.greeting.morning') : hour < 17 ? t('dashboard.greeting.afternoon') : t('dashboard.greeting.evening');

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Role Switcher Banner */}
      <div className="bg-emerald-50/70 text-[var(--color-text-primary)] p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-600)] flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary-800)]">Active Perspective</span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-white text-[var(--color-primary-800)] border border-emerald-300 shadow-xs">
                {role === 'farmer' ? 'Farmer / Beneficiary' : role === 'officer' ? 'Agricultural Officer (ADA/AO)' : role === 'manager' ? 'District Scheme Manager' : 'Central Administrator'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Switch roles to evaluate verification queues, sanction workflows, subsidy approvals, or farmer self-service.
            </p>
          </div>
        </div>

        {/* Quick Role Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-lg border border-emerald-200 shadow-xs">
          {(
            [
              { id: 'farmer', label: 'Farmer' },
              { id: 'officer', label: 'Agri Officer' },
              { id: 'manager', label: 'Scheme Manager' },
              { id: 'admin', label: 'Administrator' },
            ] as { id: UserRole; label: string }[]
          ).map(r => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                role === r.id
                  ? 'bg-[var(--color-primary-600)] text-white font-semibold shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-emerald-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ROLE VIEW 1: FARMER / BENEFICIARY DASHBOARD
         ========================================================================= */}
      {role === 'farmer' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                {greeting}, {profile.displayName}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 flex flex-wrap items-center gap-2">
                <span>{stateName} ({selectedDistrict || profile.district})</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span>{profile.landArea} {profile.landAreaUnit} ({profile.farmerCategory})</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
                <span className="text-emerald-700 font-medium">Aadhaar Linked & DBT Active</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => navigate('/applications')}
              >
                Track My Applications ({applications.length})
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<BookOpen className="w-3.5 h-3.5" />}
                onClick={() => navigate('/schemes')}
              >
                Apply for Schemes
              </Button>
            </div>
          </div>

          {/* Farmer Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Direct Benefit (DBT) Received"
              value="₹18,000"
              subtitle="PM-KISAN & State Aid"
              icon={<DollarSign className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Eligible Govt Schemes"
              value={`${topEligible.length} Instant Matches`}
              subtitle="Matched to your land profile"
              icon={<BookOpen className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Active Applications"
              value={applications.length}
              subtitle="Under review / verification"
              icon={<Clock className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Certified Seeds & Saplings"
              value={`${SEED_VARIETIES.length} Varieties`}
              subtitle="Subsidized govt farm supply"
              icon={<PackageCheck className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
          </div>

          {/* Scheme Recommendations & Application Tracker Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Matched Schemes */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Recommended Schemes for Your Farm</h2>
                  </div>
                  <button
                    onClick={() => navigate('/schemes')}
                    className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-medium flex items-center gap-0.5"
                  >
                    View all {SCHEMES.length} schemes <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {topEligible.map(({ scheme, eligibility }) => (
                    <div
                      key={scheme.id}
                      className="p-3.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] hover:bg-white hover:border-[var(--color-primary-300)] hover:shadow-xs transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs font-bold text-[var(--color-text-primary)]">{scheme.name}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {eligibility.matchScore}% Match
                            </span>
                            <Badge variant={scheme.level === 'central' ? 'blue' : 'green'}>
                              {scheme.level === 'central' ? 'Central Scheme' : 'State Scheme'}
                            </Badge>
                          </div>
                          <p className="text-xs text-[var(--color-text-muted)] mt-1 line-clamp-2">{scheme.shortDescription}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-[var(--color-text-secondary)]">
                            <span><strong className="text-[var(--color-text-primary)]">Assistance:</strong> {scheme.financialAssistance}</span>
                            {scheme.subsidyPercentage && (
                              <span className="text-emerald-700 font-semibold">
                                Subsidy: {String(scheme.subsidyPercentage).includes('%') || isNaN(Number(scheme.subsidyPercentage))
                                  ? scheme.subsidyPercentage
                                  : `${scheme.subsidyPercentage}%`}
                              </span>
                            )}
                          </div>
                        </div>
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
              </Card>
            </div>

            {/* Active Application Status Tracker */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Application Status</h2>
                  </div>
                  <button
                    onClick={() => navigate('/applications')}
                    className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {applications.slice(0, 3).map((app: SchemeApplication) => (
                    <div key={app.id} className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[var(--color-text-muted)]">{app.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 capitalize">
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[var(--color-text-primary)] mt-1 truncate">{app.schemeName}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1 flex items-center justify-between">
                        <span>Submitted: {app.appliedDate.split('T')[0]}</span>
                        <span className="text-[var(--color-primary-700)] font-medium">Stage {app.timeline.length}/6</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Subsidized Inputs Quick Hub */}
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Subsidized Inputs Hub</p>
                  <button
                    onClick={() => navigate('/seed-distribution')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] hover:bg-white hover:border-[var(--color-primary-400)] hover:shadow-xs transition-all cursor-pointer text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <PackageCheck className="w-4 h-4 text-[var(--color-primary-600)]" />
                      </div>
                      <span className="font-medium text-[var(--color-text-primary)]">Certified Seed Requisition</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  </button>

                  <button
                    onClick={() => navigate('/plantations')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] hover:bg-white hover:border-[var(--color-primary-400)] hover:shadow-xs transition-all cursor-pointer text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <Trees className="w-4 h-4 text-[var(--color-primary-600)]" />
                      </div>
                      <span className="font-medium text-[var(--color-text-primary)]">Orchard & Tree Saplings</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  </button>

                  <button
                    onClick={() => navigate('/grievances')}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] hover:bg-white hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer text-xs text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="font-medium text-[var(--color-text-primary)]">Lodge Scheme Grievance</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  </button>
                </div>
              </Card>
            </div>
          </div>

          {/* Weather & Mandi Tickers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weather Preview */}
            <div className="lg:col-span-1">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Agro-Meteorological Advisory</h2>
                  </div>
                  <button
                    onClick={() => navigate('/weather')}
                    className="text-xs text-[var(--color-primary-700)] hover:underline flex items-center gap-0.5"
                  >
                    Forecast <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {weather.forecast.slice(0, 3).map(day => (
                    <div key={day.dateLabel} className="flex items-center justify-between py-1 border-b border-[var(--color-border)] last:border-0">
                      <span className="text-xs font-medium text-[var(--color-text-secondary)]">{day.dateLabel}</span>
                      <WeatherIcon condition={day.condition} className="w-4 h-4 text-neutral-700" />
                      <div className="text-right">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">{day.maxTempC}°C</span>
                        <span className="text-[10px] text-[var(--color-text-muted)] ml-1.5">({day.rainProbability}% rain)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Market Prices */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">eNAM Mandi Modal Prices ({stateName})</h2>
                  </div>
                  <button
                    onClick={() => navigate('/market-prices')}
                    className="text-xs text-[var(--color-primary-700)] hover:underline flex items-center gap-0.5"
                  >
                    All Mandis <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs" aria-label="eNAM Mandi Prices">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Commodity</th>
                        <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Mandi Market</th>
                        <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">Modal Price (₹/Qtl)</th>
                        <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">MSP Benchmark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPrices.map(price => (
                        <tr key={price.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-1)]">
                          <td className="py-2.5 font-medium text-[var(--color-text-primary)]">{price.cropName}</td>
                          <td className="py-2.5 text-[var(--color-text-muted)]">{price.market}</td>
                          <td className="py-2.5 text-right font-bold text-[var(--color-text-primary)]">₹{price.modalPrice.toLocaleString('en-IN')}</td>
                          <td className="py-2.5 text-right text-emerald-700 font-semibold">₹{(price.modalPrice * 1.05).toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
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
                <Badge>Block Jurisdiction</Badge>
                <span className="text-xs text-[var(--color-text-muted)]">Sub-Divisional Agri Office</span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                Agricultural Officer Portal — {selectedDistrict || 'Thanjavur'} Division
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Officer In-Charge: Dr. K. Ramanathan, ADA (Agronomy) | Staff ID: AG-TN-2024-884
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => navigate('/applications')}
              >
                Open Verification Queue
              </Button>
            </div>
          </div>

          {/* Officer KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Pending Field Verifications"
              value="14"
              subtitle="Geo-tag inspection pending"
              icon={<Clock className="w-5 h-5 text-amber-600" />}
            />
            <StatCard
              label="Certified Seed Farm Stock"
              value="128.5 Qtl"
              subtitle="CO-51 & CR-1009 available"
              icon={<PackageCheck className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Assigned Block Grievances"
              value={grievances.length}
              subtitle="Target SLA: 48 hours"
              icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
            />
            <StatCard
              label="Applications Recommended"
              value="82"
              subtitle="Forwarded to District Collectorate"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            />
          </div>

          {/* Verification Queue & Seed Quota Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Farmer Application Verification Queue</h2>
                  </div>
                  <Badge>6 Awaiting ADA Signature</Badge>
                </div>

                <div className="divide-y divide-[var(--color-border)]">
                  {applications.map((app: SchemeApplication) => (
                    <div key={app.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--color-text-primary)]">{app.id}</span>
                          <span className="text-xs text-[var(--color-text-secondary)] font-medium">({app.farmerName})</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                            {app.district}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-primary)] font-semibold mt-1">{app.schemeName}</p>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          Land: {app.landAreaAcres} Acres | Survey: {app.surveyNumber}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate('/applications')}
                        >
                          Review Docs
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate('/applications')}
                        >
                          Verify Field
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Block Seed Farm Stock */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-[var(--color-primary-600)]" />
                    <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Govt Seed Farms (Block Quota)</h2>
                  </div>
                  <button
                    onClick={() => navigate('/seed-distribution')}
                    className="text-xs text-[var(--color-primary-700)] hover:underline"
                  >
                    Hub <ArrowRight className="w-3 h-3 inline" />
                  </button>
                </div>

                <div className="space-y-3">
                  {SEED_FARMS.slice(0, 3).map((farm: SeedFarm) => (
                    <div key={farm.id} className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{farm.name}</p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{farm.district}, {farm.state}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)] text-[11px]">
                        <span className="text-[var(--color-text-secondary)]">Stocked: {farm.stockCrops.join(', ')}</span>
                        <span className="font-semibold text-emerald-700">{farm.contactNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW 3: SCHEME MANAGER DASHBOARD
         ========================================================================= */}
      {role === 'manager' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge>State / District Cell</Badge>
                <span className="text-xs text-[var(--color-text-muted)]">Direct Benefit Transfer & Sanctions</span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                Scheme Implementation Directorate — {stateName}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
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

          {/* Manager KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total State Budget Allocation"
              value="₹840.50 Cr"
              subtitle="FY 2026-27 Approved Outlay"
              icon={<DollarSign className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="DBT Disbursed via PFMS"
              value="₹692.10 Cr"
              subtitle="82.3% Fund Utilization"
              icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            />
            <StatCard
              label="Registered Beneficiaries"
              value="1,248,300"
              subtitle="Active DBT linked farmers"
              icon={<Users className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Sanction Clearance Speed"
              value="3.8 Days"
              subtitle="Target SLA: 7 days"
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            />
          </div>

          {/* Budget Utilization Breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[var(--color-primary-600)]" />
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Scheme Budget Utilization Matrix</h2>
              </div>
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs text-[var(--color-primary-700)] hover:underline flex items-center gap-0.5"
              >
                Full Analytics <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
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
                    <span className="text-[var(--color-text-muted)] font-mono">
                      ₹{item.spent} Cr / ₹{item.total} Cr ({item.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[var(--color-surface-2)] h-2 rounded-full overflow-hidden border border-[var(--color-border)]">
                    <div
                      className="bg-[var(--color-primary-600)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          ROLE VIEW 4: ADMINISTRATOR (GOVT CENTRAL) DASHBOARD
         ========================================================================= */}
      {role === 'admin' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge>Ministry of Agriculture & Farmers Welfare</Badge>
                <span className="text-xs text-[var(--color-text-muted)]">NIC AgriStack Core</span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">
                Central Portal Administration & Master Scheme Engine
              </h1>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                National Farmer Registry, API Integrations (Aadhaar, PFMS, Bhulekh/Patta), and Audit Logs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Database className="w-3.5 h-3.5" />}
                onClick={() => navigate('/government-resources')}
              >
                Government Resources Directory
              </Button>
            </div>
          </div>

          {/* Admin KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Schemes Master"
              value={SCHEMES.length}
              subtitle="Central & state registries"
              icon={<BookOpen className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="Registered Seed Farms"
              value={SEED_FARMS.length}
              subtitle="Central & State Farms"
              icon={<Building2 className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
            <StatCard
              label="PFMS Gateway Uptime"
              value="99.98%"
              subtitle="Zero failed settlement"
              icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            />
            <StatCard
              label="System Audit Events"
              value="148,290"
              subtitle="SHA-256 integrity checked"
              icon={<Database className="w-5 h-5 text-[var(--color-primary-600)]" />}
            />
          </div>

          {/* Master Registry Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[var(--color-primary-600)]" />
                Integrated National Dataspaces & Gateways
              </h2>
              <div className="space-y-3">
                {[
                  { name: 'PM-KISAN National Portal', api: 'REST / Aadhaar eKYC v2.5', status: 'Operational', response: '142ms' },
                  { name: 'Public Financial Management System (PFMS)', api: 'DBT Direct Disburse API', status: 'Operational', response: '210ms' },
                  { name: 'Digital Land Records (Bhulekh / Patta)', api: 'NIC LandRecord WSDL', status: 'Operational', response: '320ms' },
                  { name: 'National Agriculture Market (e-NAM)', api: 'Agmarknet Real-time Ticker', status: 'Operational', response: '180ms' },
                  { name: 'IMD Agro-Meteorological Weather Service', api: 'Mausam Weather API', status: 'Operational', response: '95ms' },
                ].map(gw => (
                  <div key={gw.name} className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{gw.name}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] font-mono">{gw.api}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {gw.status}
                      </span>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-mono">{gw.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary-600)]" />
                Administrative Actions & Data Exports
              </h2>
              <div className="space-y-2.5">
                <button
                  onClick={() => navigate('/dbt-ledger')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-left text-xs"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Export DBT Direct Benefit Public Ledger</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Download full UTR transaction audit log as CSV</p>
                  </div>
                  <Download className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>

                <button
                  onClick={() => navigate('/analytics')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-left text-xs"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">State Welfare Analytics & PDF Report</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">District allocations, approvals and grievance SLAs</p>
                  </div>
                  <Download className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>

                <button
                  onClick={() => navigate('/schemes')}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] text-left text-xs"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">Manage Master Schemes Directory</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Verify official source URLs, deadlines, and guidelines</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Official Government Verification & Disclaimer Banner */}
      <div className="p-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--color-primary-600)] shrink-0" />
          <span>
            <strong>Official Verification Notice:</strong> All central & state government schemes are sourced directly from MoA&FW, PM-KISAN, PMFBY, NHB, ICAR, and TNAU.
          </span>
        </div>
        <button
          onClick={() => navigate('/government-resources')}
          className="text-xs font-semibold text-[var(--color-primary-700)] hover:underline whitespace-nowrap"
        >
          View Source Circulars & Helplines →
        </button>
      </div>
    </div>
  );
}
