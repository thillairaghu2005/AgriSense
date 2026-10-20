import type { RegionWeather, HourlyForecast } from '@/data/weather';
import type { WeatherDay, WeatherAlert } from '@/types';
import { getWeatherForRegion } from '@/data/weather';

// Mapping WMO Weather interpretation codes (WW) to AgriSense condition types
export function mapWmoCode(code: number): {
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain' | 'thunderstorm' | 'foggy';
  description: string;
} {
  switch (code) {
    case 0:
      return { condition: 'sunny', description: 'Clear sunny sky' };
    case 1:
      return { condition: 'sunny', description: 'Mainly sunny' };
    case 2:
      return { condition: 'partly_cloudy', description: 'Partly cloudy' };
    case 3:
      return { condition: 'cloudy', description: 'Overcast skies' };
    case 45:
    case 48:
      return { condition: 'foggy', description: 'Fog and low visibility' };
    case 51:
    case 53:
    case 55:
      return { condition: 'rainy', description: 'Light passing drizzle' };
    case 61:
    case 63:
      return { condition: 'rainy', description: 'Moderate rain' };
    case 65:
      return { condition: 'heavy_rain', description: 'Continuous heavy rain' };
    case 80:
    case 81:
      return { condition: 'rainy', description: 'Scattered rain showers' };
    case 82:
      return { condition: 'heavy_rain', description: 'Intense rain showers' };
    case 95:
      return { condition: 'thunderstorm', description: 'Thunderstorm activity' };
    case 96:
    case 99:
      return { condition: 'thunderstorm', description: 'Severe thunderstorm with hail' };
    default:
      return { condition: 'partly_cloudy', description: 'Variable cloudiness' };
  }
}

// Generate tailored agronomic advice based on meteorological parameters
function getAgronomicAdvice(condition: string, maxTemp: number, rainProb: number, rainMm: number): string {
  if (condition === 'thunderstorm' || condition === 'heavy_rain' || rainMm >= 25) {
    return 'Heavy precipitation warning: Suspend chemical spraying, maintain field drainage bunds, and shelter harvested produce.';
  }
  if (rainProb >= 60 || rainMm >= 10) {
    return 'Rainfall expected: Postpone top-dressing fertilizers and pesticide spraying to avoid nutrient runoff.';
  }
  if (maxTemp >= 38) {
    return 'High temperature stress alert: Irrigate crops during evening or early morning to reduce moisture depletion.';
  }
  if (maxTemp >= 33 && rainProb < 20) {
    return 'Warm and dry conditions: Suitable for weeding, hoeing, and light irrigation cycles.';
  }
  if (rainProb < 20) {
    return 'Optimal dry weather window: Favorable for harvesting, sun-drying grain, and foliar spray application.';
  }
  return 'Normal field conditions: Continue regular crop monitoring and check for early pest infestation.';
}

// Compute agricultural spray window suitability
function computeSpraySuitability(windSpeedKmh: number, rainProb: number, condition: string): {
  suitability: 'ideal' | 'caution' | 'not_recommended';
  reason: string;
} {
  if (condition === 'heavy_rain' || condition === 'thunderstorm' || windSpeedKmh > 24 || rainProb > 50) {
    return {
      suitability: 'not_recommended',
      reason: `Unfavorable conditions (Wind: ${Math.round(windSpeedKmh)} km/h, Rain chance: ${rainProb}%). High risk of chemical drift and rain wash-off.`,
    };
  }
  if (windSpeedKmh > 14 || rainProb > 25 || condition === 'rainy') {
    return {
      suitability: 'caution',
      reason: `Moderate conditions (Wind: ${Math.round(windSpeedKmh)} km/h, Rain chance: ${rainProb}%). Apply spray only during calm early morning hours using anti-drift nozzles.`,
    };
  }
  return {
    suitability: 'ideal',
    reason: `Favorable window: Gentle wind (${Math.round(windSpeedKmh)} km/h) and minimal rain probability (${rainProb}%). Optimal for canopy absorption.`,
  };
}

// Cache container to prevent redundant fetches within 10 minutes
const cache = new Map<string, { data: RegionWeather; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchLiveWeatherData(
  lat: number,
  lon: number,
  locationLabel: string,
  regionId: string = 'live'
): Promise<RegionWeather> {
  const cacheKey = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP error: ${res.status}`);

    const json = await res.json();
    const current = json.current;
    const daily = json.daily;
    const hourly = json.hourly;

    const currentWmo = mapWmoCode(current.weather_code);
    const todayRainProb = daily?.precipitation_probability_max?.[0] ?? 0;
    const todayRainSum = daily?.precipitation_sum?.[0] ?? 0;

    const spray = computeSpraySuitability(current.wind_speed_10m, todayRainProb, currentWmo.condition);

    // Soil moisture estimation
    let soilMoistureIndex: 'dry' | 'optimal' | 'saturated' = 'optimal';
    if (todayRainSum > 20 || current.relative_humidity_2m > 85) {
      soilMoistureIndex = 'saturated';
    } else if (todayRainSum < 1 && current.temperature_2m > 33) {
      soilMoistureIndex = 'dry';
    }

    // Transform daily 7-day forecast
    const forecast: WeatherDay[] = [];
    const daysCount = daily?.time?.length ?? 0;
    for (let i = 0; i < Math.min(daysCount, 7); i++) {
      const wmo = mapWmoCode(daily.weather_code[i]);
      const maxT = Math.round(daily.temperature_2m_max[i]);
      const minT = Math.round(daily.temperature_2m_min[i]);
      const rainP = daily.precipitation_probability_max[i] ?? 0;
      const rainMm = daily.precipitation_sum[i] ?? 0;

      let dateLabel = 'Today';
      if (i === 1) dateLabel = 'Tomorrow';
      else if (i > 1) {
        const d = new Date(daily.time[i]);
        dateLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      }

      forecast.push({
        dateLabel,
        minTempC: minT,
        maxTempC: maxT,
        humidity: i === 0 ? current.relative_humidity_2m : 60,
        windSpeedKmh: i === 0 ? Math.round(current.wind_speed_10m) : 12,
        rainProbability: rainP,
        expectedRainfallMm: rainMm,
        condition: wmo.condition,
        description: wmo.description,
        farmingAdvice: getAgronomicAdvice(wmo.condition, maxT, rainP, rainMm),
      });
    }

    // Transform next operational hourly windows (6 slices: every 3 hours)
    const hourlyForecasts: HourlyForecast[] = [];
    if (hourly?.time && hourly.time.length > 0) {
      const currentHour = new Date().getHours();
      for (let step = 0; step < 6; step++) {
        const targetHour = (currentHour + step * 3) % 24;
        const hourStr = `${targetHour.toString().padStart(2, '0')}:00`;
        const idx = Math.min(step * 3, hourly.time.length - 1);
        const wmo = mapWmoCode(hourly.weather_code?.[idx] ?? 0);
        hourlyForecasts.push({
          time: hourStr,
          tempC: Math.round(hourly.temperature_2m?.[idx] ?? current.temperature_2m),
          rainProbability: hourly.precipitation_probability?.[idx] ?? 0,
          condition: wmo.condition,
        });
      }
    }

    // Dynamic Agricultural Alerts
    const alerts: WeatherAlert[] = [];
    if (daily.temperature_2m_max?.[0] >= 38) {
      alerts.push({
        id: `alert-heat-${Date.now()}`,
        type: 'heat_wave',
        severity: 'high',
        title: 'High Heat Wave Advisory',
        message: 'Max daytime temperatures exceeding 38°C. Provide protective mulching and irrigate standing crops in the late evening.',
        validFrom: 'Today 11:00',
        validUntil: 'Today 18:00',
      });
    }
    if (todayRainSum >= 25 || currentWmo.condition === 'thunderstorm') {
      alerts.push({
        id: `alert-rain-${Date.now()}`,
        type: 'heavy_rain',
        severity: 'high',
        title: 'Heavy Rainfall & Thunderstorm Warning',
        message: 'Intense precipitation expected. Clear drainage furrows, protect harvested produce, and postpone all chemical spraying.',
        validFrom: 'Today 06:00',
        validUntil: 'Tomorrow 12:00',
      });
    } else if (todayRainProb >= 70 && current.relative_humidity_2m >= 80) {
      alerts.push({
        id: `alert-pest-${Date.now()}`,
        type: 'pest_risk',
        severity: 'medium',
        title: 'High Humidity Pest & Fungus Risk',
        message: 'Sustained relative humidity above 80% creates favorable micro-climates for fungal blast, blight, and sucking pests. Inspect lower crop canopies.',
        validFrom: 'Today',
        validUntil: 'Next 48 Hours',
      });
    }

    const liveResult: RegionWeather = {
      regionId,
      regionLabel: locationLabel,
      currentTempC: Math.round(current.temperature_2m),
      currentCondition: currentWmo.description,
      humidity: current.relative_humidity_2m,
      windSpeedKmh: Math.round(current.wind_speed_10m),
      lastUpdatedLabel: `Live via Open-Meteo • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      spraySuitability: spray.suitability,
      sprayReason: spray.reason,
      soilMoistureIndex,
      hourly: hourlyForecasts,
      forecast,
      alerts,
    };

    cache.set(cacheKey, { data: liveResult, timestamp: now });
    return liveResult;
  } catch {
    // If live fetch fails, fall back to regional mock profile
    const fallback = getWeatherForRegion(regionId);
    return {
      ...fallback,
      lastUpdatedLabel: `${fallback.lastUpdatedLabel} (Offline fallback)`,
    };
  }
}
