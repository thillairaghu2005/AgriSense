import { useState } from 'react';
import { useApp } from '@/app/providers';
import { getWeatherForRegion } from '@/data/weather';
import { STATES } from '@/data/locations';
import { Card, PageHeader, DemoLabel, Badge, InfoBanner } from '@/components/ui/Card';
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, ShieldCheck, ShieldAlert, Clock, Sprout } from 'lucide-react';
import { WeatherIcon } from '@/components/ui/WeatherIcon';

export default function WeatherPage() {
  const { state: selectedState, t } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);
  const weather = getWeatherForRegion(selectedState);
  const stateName = STATES.find(s => s.id === selectedState)?.name ?? selectedState;
  const dayData = weather.forecast[selectedDay];

  const sprayStyles = {
    ideal: {
      label: 'Ideal Spray Window',
      icon: <ShieldCheck className="w-5 h-5 text-[var(--color-primary-600)] flex-shrink-0" />,
      bg: 'bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-900)]',
    },
    caution: {
      label: 'Use Caution for Spraying',
      icon: <AlertTriangle className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
      bg: 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
    },
    not_recommended: {
      label: 'Spraying Not Recommended',
      icon: <ShieldAlert className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
      bg: 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]',
    },
  }[weather.spraySuitability];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('weather.title')}
        subtitle={`${stateName} (${weather.regionLabel}) — Agro-meteorological sample advisory`}
        badge={<DemoLabel label={t('demo.notLive')} />}
      />

      <InfoBanner variant="warning">
        {t('demo.weatherNote')} For operational field actions, consult the <strong>India Meteorological Department (imd.gov.in)</strong> or Gramin Krishi Mausam Sewa (GKMS).
      </InfoBanner>

      {/* Agricultural Spraying & Field Operation Index */}
      <div className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${sprayStyles.bg}`}>
        <div className="flex items-start gap-3">
          {sprayStyles.icon}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">Agricultural Field Suitability</span>
              <Badge>{sprayStyles.label}</Badge>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
              {weather.sprayReason}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium flex-shrink-0 bg-white px-3 py-1.5 rounded-md">
          <Sprout className="w-4 h-4 text-[var(--color-primary-600)]" />
          <span>Soil Moisture: <strong className="capitalize">{weather.soilMoistureIndex}</strong></span>
        </div>
      </div>

      {/* Current conditions cards without container boxes around icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex justify-center mb-1">
            <WeatherIcon condition={weather.forecast[0].condition} className="w-8 h-8 text-[var(--color-primary-600)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.currentTempC}°C</p>
          <p className="text-xs text-[var(--color-text-muted)]">{weather.currentCondition}</p>
        </div>
        <div className="card text-center">
          <Droplets className="w-6 h-6 text-[var(--color-primary-600)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.humidity}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">{t('weather.humidity')}</p>
        </div>
        <div className="card text-center">
          <Wind className="w-6 h-6 text-[var(--color-primary-600)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.windSpeedKmh}</p>
          <p className="text-xs text-[var(--color-text-muted)]">km/h {t('weather.wind')}</p>
        </div>
        <div className="card text-center">
          <Thermometer className="w-6 h-6 text-[var(--color-primary-600)] mx-auto mb-1" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.forecast[0].maxTempC}°/{weather.forecast[0].minTempC}°C</p>
          <p className="text-xs text-[var(--color-text-muted)]">Today High/Low</p>
        </div>
      </div>

      {/* Hourly Trend for Field Operations */}
      {weather.hourly && weather.hourly.length > 0 && (
        <Card>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-primary-600)]" />
            Today&apos;s Operational Timeline (Hourly)
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {weather.hourly.map(item => (
              <div key={item.time} className="flex flex-col items-center p-2.5 rounded-lg bg-[var(--color-surface-1)] text-center">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">{item.time}</span>
                <div className="my-1.5">
                  <WeatherIcon condition={item.condition} className="w-5 h-5 text-[var(--color-primary-600)]" />
                </div>
                <span className="text-xs font-bold text-[var(--color-text-primary)]">{item.tempC}°C</span>
                <span className="text-[10px] text-[var(--color-text-muted)] font-medium mt-0.5">{item.rainProbability}% Rain</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7-day forecast */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-[var(--color-primary-600)]" />
          {t('weather.forecast')}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weather.forecast.map((day, idx) => (
            <button
              key={day.dateLabel}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg min-w-[84px] transition-all ${
                selectedDay === idx
                  ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-800)] font-semibold border border-[var(--color-primary-200)]'
                  : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)]'
              }`}
              aria-pressed={selectedDay === idx}
            >
              <span className="text-xs text-[var(--color-text-muted)]">{day.dateLabel}</span>
              <div className="my-1">
                <WeatherIcon condition={day.condition} className="w-5 h-5 text-[var(--color-primary-600)]" />
              </div>
              <span className="text-xs font-bold text-[var(--color-text-primary)]">{day.maxTempC}°</span>
              <span className="text-xs text-[var(--color-text-muted)]">{day.minTempC}°</span>
              <span className="text-[10px] text-[var(--color-text-muted)] font-medium">{day.rainProbability}%</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Selected day detail */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">{dayData.dateLabel} — Details</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Condition', value: dayData.description },
              { label: 'Temperature', value: `${dayData.maxTempC}° / ${dayData.minTempC}°C` },
              { label: t('weather.humidity'), value: `${dayData.humidity}%` },
              { label: t('weather.wind'), value: `${dayData.windSpeedKmh} km/h` },
              { label: t('weather.rainProb'), value: `${dayData.rainProbability}%` },
              { label: t('weather.rainfall'), value: `${dayData.expectedRainfallMm} mm` },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-xs py-1">
                <span className="text-[var(--color-text-muted)]">{row.label}</span>
                <span className="font-medium text-[var(--color-text-primary)]">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">{t('weather.farmingAdvice')}</h3>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{dayData.farmingAdvice}</p>
          <p className="mt-3 text-[10px] text-[var(--color-text-muted)] italic">
            Agrometeorological advisory aligned with regional ICAR and IMD guidelines.
          </p>
        </Card>
      </div>

      {/* Alerts */}
      {weather.alerts.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-text-primary)]" />
            {t('weather.alerts')}
          </h2>
          <div className="space-y-3">
            {weather.alerts.map(alert => (
              <div key={alert.id} className="p-3.5 rounded-lg bg-[var(--color-surface-2)]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-bold text-[var(--color-text-primary)]">{alert.title}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{alert.message}</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5 font-medium">Valid: {alert.validFrom} – {alert.validUntil}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
