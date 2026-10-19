import { useNavigate } from 'react-router-dom';
import { CloudSun, TrendingUp, CalendarDays, BookOpen, Sparkles, ArrowRight, Leaf, Sprout, Droplets } from 'lucide-react';
import { useApp } from '@/app/providers';
import { Card, StatCard, DemoLabel, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getWeatherForRegion } from '@/data/weather';
import { MARKET_PRICES } from '@/data/marketPrices';
import { SCHEMES } from '@/data/schemes';
import { STATES } from '@/data/locations';
import { WeatherIcon } from '@/components/ui/WeatherIcon';

export default function DashboardPage() {
  const { profile, state: selectedState } = useApp();
  const navigate = useNavigate();

  const weather = getWeatherForRegion(selectedState);
  const today = weather.forecast[0];
  const tomorrow = weather.forecast[1];

  const stateName = STATES.find(s => s.id === selectedState)?.name ?? selectedState;

  // Sample top market prices
  const topPrices = MARKET_PRICES.slice(0, 4);

  // Sample schemes (first 3)
  const featuredSchemes = SCHEMES.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header without emojis */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
            {greeting}, {profile.displayName}
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-2">
            <span>{stateName}</span>
            <DemoLabel />
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={() => navigate('/recommendations')}
        >
          Get Crop Recommendations
        </Button>
      </div>

      {/* Stat cards without container boxes around icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Weather"
          value={`${today.maxTempC}°C`}
          subtitle={today.description}
          icon={<WeatherIcon condition={today.condition} className="w-5 h-5 text-[var(--color-primary-600)]" />}
        />
        <StatCard
          label="Rain Probability"
          value={`${today.rainProbability}%`}
          subtitle={`${today.expectedRainfallMm} mm expected`}
          icon={<Droplets className="w-5 h-5 text-[var(--color-primary-600)]" />}
        />
        <StatCard
          label="Active Schemes"
          value={SCHEMES.length}
          subtitle="Central & state schemes"
          icon={<BookOpen className="w-5 h-5 text-[var(--color-primary-600)]" />}
        />
        <StatCard
          label="Crop Library"
          value="10+ Crops"
          subtitle="Kharif, Rabi & more"
          icon={<Sprout className="w-5 h-5 text-[var(--color-primary-600)]" />}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Preview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-[var(--color-primary-600)]" />
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Weather Preview</h2>
              </div>
              <button
                onClick={() => navigate('/weather')}
                className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-medium flex items-center gap-0.5"
              >
                Full forecast <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <DemoLabel label="Illustrative forecast — not live" />

            <div className="mt-3 space-y-2.5">
              {weather.forecast.slice(0, 4).map(day => (
                <div key={day.dateLabel} className="flex items-center justify-between py-1">
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] w-16">{day.dateLabel}</span>
                  <WeatherIcon condition={day.condition} className="w-4 h-4 text-neutral-700" />
                  <div className="text-right">
                    <p className="text-xs font-medium text-[var(--color-text-primary)]">{day.maxTempC}° / {day.minTempC}°</p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{day.rainProbability}% rain</p>
                  </div>
                </div>
              ))}
            </div>

            {weather.alerts.length > 0 && (
              <div className="mt-3 p-3 bg-[var(--color-surface-2)] rounded-lg">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">{weather.alerts[0].title}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{weather.alerts[0].message.slice(0, 80)}…</p>
              </div>
            )}
          </Card>
        </div>

        {/* Market Highlights */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--color-primary-600)]" />
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Market Highlights</h2>
              </div>
              <button
                onClick={() => navigate('/market-prices')}
                className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-medium flex items-center gap-0.5"
              >
                All prices <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <DemoLabel label="Illustrative sample prices — not live" />

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs" aria-label="Sample market prices">
                <thead>
                  <tr>
                    <th className="text-left py-2 text-[var(--color-text-muted)] font-medium">Crop</th>
                    <th className="text-left py-2 text-[var(--color-text-muted)] font-medium hidden sm:table-cell">Market</th>
                    <th className="text-right py-2 text-[var(--color-text-muted)] font-medium">Modal ₹/qtl</th>
                    <th className="text-right py-2 text-[var(--color-text-muted)] font-medium hidden sm:table-cell">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {topPrices.map(price => (
                    <tr key={price.id} className="hover:bg-[var(--color-surface-1)]">
                      <td className="py-2 font-medium text-[var(--color-text-primary)]">{price.cropName}</td>
                      <td className="py-2 text-[var(--color-text-muted)] hidden sm:table-cell">{price.market}</td>
                      <td className="py-2 text-right font-semibold text-[var(--color-text-primary)]">₹{price.modalPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2 text-right text-[var(--color-text-muted)] hidden sm:table-cell">₹{price.minPrice.toLocaleString('en-IN')} – ₹{price.maxPrice.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Schemes + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Schemes without icon box container */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--color-primary-600)]" />
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Government Schemes</h2>
              </div>
              <button
                onClick={() => navigate('/schemes')}
                className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-medium flex items-center gap-0.5"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {featuredSchemes.map(scheme => (
                <div
                  key={scheme.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-surface-1)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
                  onClick={() => navigate('/schemes')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate('/schemes')}
                >
                  <BookOpen className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] leading-tight">{scheme.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{scheme.shortDescription}</p>
                    <div className="mt-1">
                      <Badge>
                        {scheme.level === 'central' ? 'Central' : 'State'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary-600)]" />
              Quick Actions
            </h2>
            <div className="space-y-1.5">
              {[
                { label: 'Browse Crops', icon: Leaf, to: '/crops' },
                { label: 'View Calendar', icon: CalendarDays, to: '/calendar' },
                { label: 'Market Prices', icon: TrendingUp, to: '/market-prices' },
                { label: 'Full Weather', icon: CloudSun, to: '/weather' },
                { label: 'Get Recommendations', icon: Sparkles, to: '/recommendations' },
              ].map(action => (
                <button
                  key={action.to}
                  onClick={() => navigate(action.to)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)] hover:text-[var(--color-text-primary)] transition-colors group"
                >
                  <action.icon className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary-600)]" />
                  {action.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Farming tip banner with subtle green tint and dark text */}
      <div className="p-4 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-lg">
        <div className="flex items-start gap-3">
          <Sprout className="w-4 h-4 text-[var(--color-primary-700)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[var(--color-primary-900)]">Seasonal Advisory</p>
            <p className="text-xs text-[var(--color-primary-800)] mt-0.5">
              {tomorrow.rainProbability > 50
                ? `Rain expected tomorrow (${tomorrow.rainProbability}% probability). Consider postponing fertiliser application. Ensure drainage channels are clear.`
                : 'Favourable weather conditions ahead. Ideal time for field inspection and crop monitoring.'}
            </p>
            <p className="text-[10px] text-[var(--color-primary-700)]/80 mt-1">Illustrative advice based on sample forecast data</p>
          </div>
        </div>
      </div>
    </div>
  );
}
