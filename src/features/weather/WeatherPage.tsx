import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/app/providers';
import { getWeatherForRegion, type RegionWeather } from '@/data/weather';
import { STATES, getLocationCoordinates } from '@/data/locations';
import { Card, PageHeader, Badge, InfoBanner } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sprout,
  Navigation,
  RefreshCw,
  Radio,
  Wifi,
} from 'lucide-react';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { fetchLiveWeatherData } from '@/lib/weatherApi';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export default function WeatherPage() {
  const { state: selectedState, district: selectedDistrict, t } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);

  // Live vs Mock mode state
  const [isLive, setIsLive] = useState<boolean>(() =>
    storageGet(STORAGE_KEYS.WEATHER_LIVE_ENABLED, true)
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveWeather, setLiveWeather] = useState<RegionWeather | null>(null);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lon: number; label: string } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const stateName = STATES.find(s => s.id === selectedState)?.name ?? selectedState;

  // Compute active coordinates
  const activeCoord = gpsLocation || getLocationCoordinates(selectedState, selectedDistrict);

  // Fetch live weather data
  const loadWeatherData = useCallback(async () => {
    if (!isLive) return;
    setIsLoading(true);
    try {
      const data = await fetchLiveWeatherData(
        activeCoord.lat,
        activeCoord.lon,
        activeCoord.label,
        selectedState
      );
      setLiveWeather(data);
    } catch {
      // Fallback handled in weatherApi
    } finally {
      setIsLoading(false);
    }
  }, [isLive, activeCoord.lat, activeCoord.lon, activeCoord.label, selectedState]);

  useEffect(() => {
    if (!isLive) return;
    let ignore = false;
    fetchLiveWeatherData(
      activeCoord.lat,
      activeCoord.lon,
      activeCoord.label,
      selectedState
    )
      .then(data => {
        if (!ignore) setLiveWeather(data);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [isLive, activeCoord.lat, activeCoord.lon, activeCoord.label, selectedState]);

  // Handle GPS location request
  function handleUseGps() {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: 'Your Farm Location (GPS)',
        });
        setIsLive(true);
        storageSet(STORAGE_KEYS.WEATHER_LIVE_ENABLED, true);
      },
      err => {
        setIsLoading(false);
        setGpsError(`Could not access GPS (${err.message}). Using regional profile.`);
      },
      { timeout: 10000 }
    );
  }

  function toggleLiveMode(val: boolean) {
    setIsLive(val);
    storageSet(STORAGE_KEYS.WEATHER_LIVE_ENABLED, val);
    if (!val) {
      setGpsLocation(null);
    }
  }

  // Active weather object (live if available and active, otherwise static fallback)
  const weather: RegionWeather = (isLive && liveWeather)
    ? liveWeather
    : getWeatherForRegion(selectedState);

  const dayData = weather.forecast[selectedDay] || weather.forecast[0];

  const sprayStyles = {
    ideal: {
      label: 'Ideal Spray Window',
      icon: <ShieldCheck className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
      bg: 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]',
    },
    caution: {
      label: 'Use Caution for Spraying',
      icon: <AlertTriangle className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
      bg: 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]',
    },
    not_recommended: {
      label: 'Spraying Not Recommended',
      icon: <ShieldAlert className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
      bg: 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]',
    },
  }[weather.spraySuitability] || {
    label: 'Weather Evaluation',
    icon: <AlertTriangle className="w-5 h-5 text-[var(--color-text-primary)] flex-shrink-0" />,
    bg: 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t('weather.title')}
          subtitle={
            isLive
              ? `${activeCoord.label} — Live Open-Meteo Global Forecasting Model (${weather.lastUpdatedLabel})`
              : `${stateName} (${weather.regionLabel}) — Agro-meteorological sample advisory`
          }
          badge={
            isLive ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                LIVE OPEN-METEO
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {t('demo.notLive')}
              </span>
            )
          }
        />

        {/* Live Controls Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-[var(--color-surface-2)] rounded-lg text-xs font-medium border border-[var(--color-border)]">
            <button
              onClick={() => toggleLiveMode(true)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLive
                  ? 'bg-white text-[var(--color-text-primary)] font-semibold shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              Live API
            </button>
            <button
              onClick={() => toggleLiveMode(false)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                !isLive
                  ? 'bg-white text-[var(--color-text-primary)] font-semibold shadow-xs'
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
            onClick={handleUseGps}
            leftIcon={<Navigation className="w-3.5 h-3.5 text-[var(--color-primary-600)]" />}
            title="Fetch weather for your device GPS coordinates"
          >
            Use GPS
          </Button>

          {isLive && (
            <Button
              size="sm"
              variant="ghost"
              onClick={loadWeatherData}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          )}
        </div>
      </div>

      {gpsError && (
        <InfoBanner variant="warning">
          {gpsError}
        </InfoBanner>
      )}

      {isLive ? (
        <InfoBanner variant="info">
          Streaming <strong>live agrometeorological telemetry</strong> via Open-Meteo API for <strong>{activeCoord.label}</strong> (Lat: {activeCoord.lat.toFixed(3)}, Lon: {activeCoord.lon.toFixed(3)}). Agricultural spray windows and moisture levels are computed in real time.
        </InfoBanner>
      ) : (
        <InfoBanner variant="warning">
          {t('demo.weatherNote')} For operational field actions, consult the <strong>India Meteorological Department (imd.gov.in)</strong> or switch to <strong>Live API</strong> above.
        </InfoBanner>
      )}

      {/* Agricultural Spraying & Field Operation Index */}
      <div className={`p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${sprayStyles.bg}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/80 rounded-lg shadow-xs mt-0.5">
            {sprayStyles.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Agricultural Field Suitability
              </span>
              <Badge variant={weather.spraySuitability === 'ideal' ? 'green' : weather.spraySuitability === 'caution' ? 'amber' : 'red'}>
                {sprayStyles.label}
              </Badge>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90 font-medium">
              {weather.sprayReason}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold flex-shrink-0 bg-white px-3.5 py-2 rounded-lg shadow-xs border border-[var(--color-border)] text-[var(--color-text-primary)]">
          <Sprout className="w-4 h-4 text-[var(--color-primary-600)]" />
          <span>Soil Moisture: <strong className="capitalize text-[var(--color-primary-700)]">{weather.soilMoistureIndex}</strong></span>
        </div>
      </div>

      {/* Current conditions cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <WeatherIcon condition={weather.forecast[0]?.condition || 'sunny'} className="w-7 h-7 text-[var(--color-text-primary)] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.currentTempC}°C</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{weather.currentCondition}</p>
        </Card>
        <Card className="text-center p-4">
          <Droplets className="w-7 h-7 text-[var(--color-text-primary)] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.humidity}%</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t('weather.humidity')}</p>
        </Card>
        <Card className="text-center p-4">
          <Wind className="w-7 h-7 text-[var(--color-text-primary)] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{weather.windSpeedKmh}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">km/h {t('weather.wind')}</p>
        </Card>
        <Card className="text-center p-4">
          <Thermometer className="w-7 h-7 text-[var(--color-text-primary)] mx-auto mb-2" />
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">
            {weather.forecast[0]?.maxTempC}° / {weather.forecast[0]?.minTempC}°C
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Today High/Low</p>
        </Card>
      </div>

      {/* Hourly Trend for Field Operations */}
      {weather.hourly && weather.hourly.length > 0 && (
        <Card>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
            Today&apos;s Operational Timeline (Hourly)
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {weather.hourly.map(item => (
              <div key={item.time} className="flex flex-col items-center p-2.5 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xs hover:border-[var(--color-border-strong)] transition-all text-center">
                <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">{item.time}</span>
                <div className="my-1.5">
                  <WeatherIcon condition={item.condition} className="w-5 h-5 text-[var(--color-text-secondary)]" />
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
          <CloudSun className="w-4 h-4 text-[var(--color-text-secondary)]" />
          {t('weather.forecast')}
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weather.forecast.map((day, idx) => (
            <button
              key={`${day.dateLabel}-${idx}`}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-lg min-w-[84px] transition-all cursor-pointer ${
                selectedDay === idx
                  ? 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] font-semibold border border-[var(--color-border-strong)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-xs'
              }`}
              aria-pressed={selectedDay === idx}
            >
              <span className="text-xs text-[var(--color-text-muted)]">{day.dateLabel}</span>
              <div className="my-1">
                <WeatherIcon condition={day.condition} className="w-5 h-5 text-[var(--color-text-secondary)]" />
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
            Agrometeorological advisory dynamically generated for agricultural field protection.
          </p>
        </Card>
      </div>

      {/* Alerts */}
      {weather.alerts.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-text-secondary)]" />
            {t('weather.alerts')}
          </h2>
          <div className="space-y-3">
            {weather.alerts.map(alert => (
              <div key={alert.id} className="p-3.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)]">
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
