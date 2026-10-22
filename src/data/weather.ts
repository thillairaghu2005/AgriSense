import type { WeatherDay, WeatherAlert } from '@/types';

export interface HourlyForecast {
  time: string;
  tempC: number;
  rainProbability: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain' | 'thunderstorm' | 'foggy';
}

export interface RegionWeather {
  regionId: string;
  regionLabel: string;
  currentTempC: number;
  currentCondition: string;
  humidity: number;
  windSpeedKmh: number;
  lastUpdatedLabel: string;
  spraySuitability: 'ideal' | 'caution' | 'not_recommended';
  sprayReason: string;
  soilMoistureIndex: 'dry' | 'optimal' | 'saturated';
  hourly: HourlyForecast[];
  forecast: WeatherDay[];
  alerts: WeatherAlert[];
}

const REGIONAL_PROFILES: Record<string, RegionWeather> = {
  // Northern Plains (Punjab, Haryana)
  pb: {
    regionId: 'pb',
    regionLabel: 'Punjab (Northern Plains)',
    currentTempC: 22,
    currentCondition: 'Pleasant & Clear',
    humidity: 54,
    windSpeedKmh: 9,
    lastUpdatedLabel: 'Illustrative agrometeorological advisory — IMD format',
    spraySuitability: 'ideal',
    sprayReason: 'Low wind (< 10 km/h) and dry canopy. Excellent window for morning foliar spray.',
    soilMoistureIndex: 'optimal',
    hourly: [
      { time: '06:00', tempC: 17, rainProbability: 0, condition: 'sunny' },
      { time: '09:00', tempC: 21, rainProbability: 0, condition: 'sunny' },
      { time: '12:00', tempC: 25, rainProbability: 5, condition: 'sunny' },
      { time: '15:00', tempC: 24, rainProbability: 5, condition: 'partly_cloudy' },
      { time: '18:00', tempC: 21, rainProbability: 0, condition: 'sunny' },
      { time: '21:00', tempC: 18, rainProbability: 0, condition: 'sunny' },
    ],
    forecast: [
      {
        dateLabel: 'Today',
        minTempC: 16,
        maxTempC: 26,
        humidity: 54,
        windSpeedKmh: 9,
        rainProbability: 5,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Clear sunny sky with gentle breeze.',
        farmingAdvice: 'Optimum conditions for wheat sowing and light crown-root irrigation.',
      },
      {
        dateLabel: 'Tomorrow',
        minTempC: 15,
        maxTempC: 25,
        humidity: 58,
        windSpeedKmh: 11,
        rainProbability: 10,
        expectedRainfallMm: 0,
        condition: 'partly_cloudy',
        description: 'Mild daytime temperatures and partly cloudy afternoon.',
        farmingAdvice: 'Suitable for urea top-dressing in early-sown rabi crops.',
      },
      {
        dateLabel: 'Wed',
        minTempC: 14,
        maxTempC: 24,
        humidity: 62,
        windSpeedKmh: 14,
        rainProbability: 25,
        expectedRainfallMm: 1,
        condition: 'cloudy',
        description: 'Overcast skies due to western disturbance.',
        farmingAdvice: 'Monitor mustard for aphid infestation under cloudy conditions.',
      },
      {
        dateLabel: 'Thu',
        minTempC: 14,
        maxTempC: 23,
        humidity: 68,
        windSpeedKmh: 12,
        rainProbability: 35,
        expectedRainfallMm: 3,
        condition: 'rainy',
        description: 'Light scattered rain likely in northern districts.',
        farmingAdvice: 'Postpone chemical spraying if showers develop.',
      },
      {
        dateLabel: 'Fri',
        minTempC: 13,
        maxTempC: 24,
        humidity: 60,
        windSpeedKmh: 10,
        rainProbability: 10,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Sunshine resumes. Drop in night temperatures.',
        farmingAdvice: 'Inspect field moisture. Resume intercultural operations.',
      },
      {
        dateLabel: 'Sat',
        minTempC: 12,
        maxTempC: 23,
        humidity: 55,
        windSpeedKmh: 8,
        rainProbability: 5,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Cool crisp mornings and clear daylight.',
        farmingAdvice: 'Ideal weather for potato weeding and earthing up.',
      },
      {
        dateLabel: 'Sun',
        minTempC: 12,
        maxTempC: 23,
        humidity: 52,
        windSpeedKmh: 7,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Dry stable weather across all plains.',
        farmingAdvice: 'Continue scheduled irrigation rotation.',
      },
    ],
    alerts: [
      {
        id: 'alert-pb-1',
        type: 'pest_risk',
        severity: 'medium',
        title: 'Mustard Aphid Alert',
        message: 'Persistent cloud cover and mild temperatures favor aphid multiplication. Scout crop weekly.',
        validFrom: 'Wed',
        validUntil: 'Fri',
      },
    ],
  },

  // Western Arid / Semi-Arid (Gujarat, Rajasthan)
  gj: {
    regionId: 'gj',
    regionLabel: 'Gujarat (Western Belt)',
    currentTempC: 34,
    currentCondition: 'Hot & Dry',
    humidity: 42,
    windSpeedKmh: 15,
    lastUpdatedLabel: 'Illustrative agrometeorological advisory — IMD format',
    spraySuitability: 'caution',
    sprayReason: 'Moderate wind speed (15 km/h). Spray early morning (before 9 AM) to avoid chemical drift.',
    soilMoistureIndex: 'dry',
    hourly: [
      { time: '06:00', tempC: 24, rainProbability: 0, condition: 'sunny' },
      { time: '09:00', tempC: 28, rainProbability: 0, condition: 'sunny' },
      { time: '12:00', tempC: 34, rainProbability: 0, condition: 'sunny' },
      { time: '15:00', tempC: 35, rainProbability: 0, condition: 'sunny' },
      { time: '18:00', tempC: 31, rainProbability: 0, condition: 'sunny' },
      { time: '21:00', tempC: 27, rainProbability: 0, condition: 'sunny' },
    ],
    forecast: [
      {
        dateLabel: 'Today',
        minTempC: 23,
        maxTempC: 35,
        humidity: 42,
        windSpeedKmh: 15,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Dry sunny day with warm afternoon gusts.',
        farmingAdvice: 'Irrigate groundnut and cotton in night or early dawn to minimize evaporative loss.',
      },
      {
        dateLabel: 'Tomorrow',
        minTempC: 24,
        maxTempC: 36,
        humidity: 40,
        windSpeedKmh: 16,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Bright sunshine and continued dry conditions.',
        farmingAdvice: 'Ensure drip fertigation emitters are free of salt clogging.',
      },
      {
        dateLabel: 'Wed',
        minTempC: 23,
        maxTempC: 35,
        humidity: 45,
        windSpeedKmh: 13,
        rainProbability: 5,
        expectedRainfallMm: 0,
        condition: 'partly_cloudy',
        description: 'Light high-altitude cloud cover.',
        farmingAdvice: 'Maintain soil mulching in horticultural orchards.',
      },
      {
        dateLabel: 'Thu',
        minTempC: 22,
        maxTempC: 34,
        humidity: 48,
        windSpeedKmh: 12,
        rainProbability: 10,
        expectedRainfallMm: 0,
        condition: 'partly_cloudy',
        description: 'Favorable temperature for field harvesting.',
        farmingAdvice: 'Good day for castor bean picking.',
      },
      {
        dateLabel: 'Fri',
        minTempC: 22,
        maxTempC: 34,
        humidity: 46,
        windSpeedKmh: 11,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Clear sunny sky.',
        farmingAdvice: 'Harvested pulses can be sun-dried safely.',
      },
      {
        dateLabel: 'Sat',
        minTempC: 21,
        maxTempC: 33,
        humidity: 44,
        windSpeedKmh: 10,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Warm and dry.',
        farmingAdvice: 'Inter-row cultivation for weed eradication.',
      },
      {
        dateLabel: 'Sun',
        minTempC: 21,
        maxTempC: 33,
        humidity: 40,
        windSpeedKmh: 12,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Clear weather continues.',
        farmingAdvice: 'Plan next irrigation cycle based on soil dryness.',
      },
    ],
    alerts: [
      {
        id: 'alert-gj-1',
        type: 'heat_wave',
        severity: 'low',
        title: 'High Evaporative Demand Warning',
        message: 'Afternoon temperatures above 35°C increase transpiration. Maintain mulch on fruit trees.',
        validFrom: 'Today',
        validUntil: 'Tomorrow',
      },
    ],
  },

  // Central / Deccan Plateau (Maharashtra, MP)
  mh: {
    regionId: 'mh',
    regionLabel: 'Maharashtra (Deccan Plateau)',
    currentTempC: 29,
    currentCondition: 'Partly Cloudy',
    humidity: 62,
    windSpeedKmh: 11,
    lastUpdatedLabel: 'Illustrative agrometeorological advisory — IMD format',
    spraySuitability: 'ideal',
    sprayReason: 'Moderate temperature and humidity. Ideal window for protective bio-pesticide spray.',
    soilMoistureIndex: 'optimal',
    hourly: [
      { time: '06:00', tempC: 20, rainProbability: 5, condition: 'partly_cloudy' },
      { time: '09:00', tempC: 24, rainProbability: 10, condition: 'partly_cloudy' },
      { time: '12:00', tempC: 29, rainProbability: 15, condition: 'cloudy' },
      { time: '15:00', tempC: 30, rainProbability: 20, condition: 'partly_cloudy' },
      { time: '18:00', tempC: 27, rainProbability: 10, condition: 'partly_cloudy' },
      { time: '21:00', tempC: 23, rainProbability: 5, condition: 'sunny' },
    ],
    forecast: [
      {
        dateLabel: 'Today',
        minTempC: 19,
        maxTempC: 30,
        humidity: 62,
        windSpeedKmh: 11,
        rainProbability: 20,
        expectedRainfallMm: 0,
        condition: 'partly_cloudy',
        description: 'Intermittent sunshine and cloud patches.',
        farmingAdvice: 'Suitable for foliar nutrition of cotton and soyabean pod management.',
      },
      {
        dateLabel: 'Tomorrow',
        minTempC: 20,
        maxTempC: 31,
        humidity: 64,
        windSpeedKmh: 12,
        rainProbability: 35,
        expectedRainfallMm: 2,
        condition: 'rainy',
        description: 'Localized light rain showers expected in the evening.',
        farmingAdvice: 'Complete pesticide application before 2 PM.',
      },
      {
        dateLabel: 'Wed',
        minTempC: 19,
        maxTempC: 29,
        humidity: 68,
        windSpeedKmh: 14,
        rainProbability: 40,
        expectedRainfallMm: 5,
        condition: 'rainy',
        description: 'Overcast with patchy rainfall.',
        farmingAdvice: 'Avoid fertilizer broadcasting right before heavy rain.',
      },
      {
        dateLabel: 'Thu',
        minTempC: 18,
        maxTempC: 29,
        humidity: 65,
        windSpeedKmh: 10,
        rainProbability: 20,
        expectedRainfallMm: 0,
        condition: 'cloudy',
        description: 'Clearing skies by late afternoon.',
        farmingAdvice: 'Inspect sugarcane for stem borer symptoms.',
      },
      {
        dateLabel: 'Fri',
        minTempC: 18,
        maxTempC: 30,
        humidity: 58,
        windSpeedKmh: 9,
        rainProbability: 10,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Bright pleasant sunshine.',
        farmingAdvice: 'Good day for onion nursery seedbed preparation.',
      },
      {
        dateLabel: 'Sat',
        minTempC: 17,
        maxTempC: 30,
        humidity: 55,
        windSpeedKmh: 8,
        rainProbability: 5,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Clear sunny sky.',
        farmingAdvice: 'Gram (chickpea) field sowing is recommended under residual moisture.',
      },
      {
        dateLabel: 'Sun',
        minTempC: 17,
        maxTempC: 31,
        humidity: 52,
        windSpeedKmh: 9,
        rainProbability: 0,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Warm and dry.',
        farmingAdvice: 'Regular irrigation for pomegranate and citrus orchards.',
      },
    ],
    alerts: [],
  },

  // Southern Coastal / Delta (Tamil Nadu, AP, Telangana)
  tn: {
    regionId: 'tn',
    regionLabel: 'Tamil Nadu (Cauvery Delta & Coastal)',
    currentTempC: 31,
    currentCondition: 'Humid & Partly Cloudy',
    humidity: 78,
    windSpeedKmh: 16,
    lastUpdatedLabel: 'Illustrative agrometeorological advisory — IMD format',
    spraySuitability: 'not_recommended',
    sprayReason: 'Rain showers predicted within 24 hours (65% probability). High risk of chemical runoff.',
    soilMoistureIndex: 'saturated',
    hourly: [
      { time: '06:00', tempC: 25, rainProbability: 20, condition: 'partly_cloudy' },
      { time: '09:00', tempC: 28, rainProbability: 35, condition: 'cloudy' },
      { time: '12:00', tempC: 32, rainProbability: 50, condition: 'rainy' },
      { time: '15:00', tempC: 30, rainProbability: 65, condition: 'heavy_rain' },
      { time: '18:00', tempC: 28, rainProbability: 40, condition: 'rainy' },
      { time: '21:00', tempC: 26, rainProbability: 25, condition: 'cloudy' },
    ],
    forecast: [
      {
        dateLabel: 'Today',
        minTempC: 25,
        maxTempC: 32,
        humidity: 78,
        windSpeedKmh: 16,
        rainProbability: 45,
        expectedRainfallMm: 6,
        condition: 'rainy',
        description: 'Partly cloudy with afternoon thunder showers.',
        farmingAdvice: 'Inspect bunds in paddy fields. Drain excess water from nursery beds.',
      },
      {
        dateLabel: 'Tomorrow',
        minTempC: 24,
        maxTempC: 30,
        humidity: 84,
        windSpeedKmh: 19,
        rainProbability: 75,
        expectedRainfallMm: 22,
        condition: 'heavy_rain',
        description: 'Widespread moderate to heavy rain accompanied by gusty winds.',
        farmingAdvice: 'Postpone pesticide spraying and urea application completely.',
      },
      {
        dateLabel: 'Wed',
        minTempC: 24,
        maxTempC: 29,
        humidity: 86,
        windSpeedKmh: 20,
        rainProbability: 80,
        expectedRainfallMm: 26,
        condition: 'heavy_rain',
        description: 'Heavy rainfall persists under coastal low pressure.',
        farmingAdvice: 'Clear field drainage channels to avoid root waterlogging in banana and pulses.',
      },
      {
        dateLabel: 'Thu',
        minTempC: 25,
        maxTempC: 31,
        humidity: 80,
        windSpeedKmh: 14,
        rainProbability: 45,
        expectedRainfallMm: 8,
        condition: 'cloudy',
        description: 'Overcast with intermittent light drizzle.',
        farmingAdvice: 'Transplanted samba paddy benefits from current moisture levels.',
      },
      {
        dateLabel: 'Fri',
        minTempC: 25,
        maxTempC: 32,
        humidity: 72,
        windSpeedKmh: 12,
        rainProbability: 25,
        expectedRainfallMm: 2,
        condition: 'partly_cloudy',
        description: 'Rain easing. Clouds breaking up.',
        farmingAdvice: 'Scout paddy for leaf folder and blast once leaves dry out.',
      },
      {
        dateLabel: 'Sat',
        minTempC: 26,
        maxTempC: 33,
        humidity: 68,
        windSpeedKmh: 11,
        rainProbability: 15,
        expectedRainfallMm: 0,
        condition: 'partly_cloudy',
        description: 'Warm and sunny with occasional breeze.',
        farmingAdvice: 'Resume foliar micronutrient applications if required.',
      },
      {
        dateLabel: 'Sun',
        minTempC: 26,
        maxTempC: 34,
        humidity: 65,
        windSpeedKmh: 10,
        rainProbability: 10,
        expectedRainfallMm: 0,
        condition: 'sunny',
        description: 'Mostly sunny and humid.',
        farmingAdvice: 'Maintain 2 cm standing water level in vegetative paddy fields.',
      },
    ],
    alerts: [
      {
        id: 'alert-tn-1',
        type: 'heavy_rain',
        severity: 'high',
        title: 'Coastal Monsoon Advisory',
        message: 'Heavy rainfall (20–30 mm) expected over delta districts within 48 hours. Secure drainage canals.',
        validFrom: 'Today',
        validUntil: 'Wed',
      },
    ],
  },
};

import { STATES } from './locations';

export function getWeatherForRegion(stateId: string, districtId?: string): RegionWeather {
  const normState = (stateId || 'tn').toLowerCase();
  const stateObj = STATES.find(s => s.id === normState) || STATES[0];
  const districtObj = districtId ? stateObj.districts.find(d => d.id === districtId) : undefined;
  
  const regionLabel = districtObj
    ? `${districtObj.name}, ${stateObj.name}`
    : `${stateObj.name} (Regional Advisory)`;

  // Base profile selection
  let base: RegionWeather;
  if (['pb', 'hr'].includes(normState)) {
    base = REGIONAL_PROFILES.pb;
  } else if (['gj'].includes(normState)) {
    base = REGIONAL_PROFILES.gj;
  } else if (['mh'].includes(normState)) {
    base = REGIONAL_PROFILES.mh;
  } else {
    base = REGIONAL_PROFILES.tn;
  }

  // State-specific temperature & condition calibrations
  const stateCalibrations: Record<string, { temp: number; condition: string; humidity: number; wind: number; crop: string }> = {
    pb: { temp: 22, condition: 'Pleasant & Clear', humidity: 52, wind: 9, crop: 'wheat and rabi pulses' },
    hr: { temp: 23, condition: 'Clear Sky', humidity: 50, wind: 10, crop: 'mustard and rabi wheat' },
    up: { temp: 25, condition: 'Mild & Sunny', humidity: 58, wind: 8, crop: 'sugarcane and potato' },
    mh: { temp: 28, condition: 'Dry & Sunny', humidity: 48, wind: 12, crop: 'cotton and gram (chana)' },
    gj: { temp: 30, condition: 'Warm & Clear', humidity: 45, wind: 14, crop: 'groundnut and cotton' },
    ka: { temp: 25, condition: 'Partly Cloudy', humidity: 62, wind: 11, crop: 'finger millet (ragi) and maize' },
    ap: { temp: 30, condition: 'Humid Coastal', humidity: 72, wind: 13, crop: 'samba paddy and chilli' },
    ts: { temp: 29, condition: 'Sunny & Warm', humidity: 55, wind: 10, crop: 'cotton and maize' },
    wb: { temp: 27, condition: 'Humid & Overcast', humidity: 76, wind: 9, crop: 'paddy and vegetable nurseries' },
    tn: { temp: 29, condition: 'Coastal Humid Breeze', humidity: 78, wind: 14, crop: 'thaladi paddy and banana' },
  };

  const cal = stateCalibrations[normState] || { temp: 27, condition: 'Pleasant Weather', humidity: 60, wind: 10, crop: 'standing crops' };

  // District micro-adjustment
  const districtDelta = (districtObj && districtObj.lat != null) ? Math.round(((districtObj.lat * 10) % 5) - 2) : 0;
  const currentTemp = cal.temp + districtDelta;

  const adjustedForecast = base.forecast.map((f, idx) => ({
    ...f,
    maxTempC: f.maxTempC + (cal.temp - 29) + districtDelta,
    minTempC: f.minTempC + (cal.temp - 29) + districtDelta,
    farmingAdvice: idx === 0
      ? `Optimum conditions for ${cal.crop} in ${regionLabel}. Monitor soil moisture before scheduling irrigation.`
      : f.farmingAdvice,
  }));

  return {
    ...base,
    regionId: normState,
    regionLabel,
    currentTempC: currentTemp,
    currentCondition: cal.condition,
    humidity: Math.min(95, Math.max(30, cal.humidity + districtDelta * 2)),
    windSpeedKmh: cal.wind,
    lastUpdatedLabel: `Regional IMD Bulletin • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    forecast: adjustedForecast,
  };
}

export const WEATHER_CONDITION_ICONS: Record<string, string> = {
  sunny: 'Sunny',
  partly_cloudy: 'Partly Cloudy',
  cloudy: 'Cloudy',
  rainy: 'Rainy',
  heavy_rain: 'Heavy Rain',
  thunderstorm: 'Thunderstorm',
  foggy: 'Foggy',
};
