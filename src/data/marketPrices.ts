import type { MarketPrice, MspPrice } from '@/types';

export const MARKET_PRICES: MarketPrice[] = [
  // Tamil Nadu
  { id: 'mp-1', cropId: 'rice', cropName: 'Rice (Paddy)', state: 'Tamil Nadu', district: 'Thanjavur', market: 'Thanjavur APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1900, maxPrice: 2100, modalPrice: 2000, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-2', cropId: 'rice', cropName: 'Rice (Paddy)', state: 'Tamil Nadu', district: 'Madurai', market: 'Madurai Regulated Market', date: '2026-10-14', unit: 'quintal', minPrice: 1850, maxPrice: 2050, modalPrice: 1950, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-8', cropId: 'groundnut', cropName: 'Groundnut', state: 'Tamil Nadu', district: 'Tirunelveli', market: 'Tirunelveli APMC', date: '2026-10-14', unit: 'quintal', minPrice: 4700, maxPrice: 5500, modalPrice: 5100, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-tn-3', cropId: 'cotton', cropName: 'Cotton (MCU-5)', state: 'Tamil Nadu', district: 'Coimbatore', market: 'Coimbatore Market Committee', date: '2026-10-14', unit: 'quintal', minPrice: 6500, maxPrice: 7300, modalPrice: 6900, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-tn-4', cropId: 'maize', cropName: 'Maize (Hybrid)', state: 'Tamil Nadu', district: 'Erode', market: 'Erode Regulated Market', date: '2026-10-14', unit: 'quintal', minPrice: 1800, maxPrice: 2100, modalPrice: 1950, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-tn-5', cropId: 'tomato', cropName: 'Tomato', state: 'Tamil Nadu', district: 'Salem', market: 'Salem Uzhavar Sandhai', date: '2026-10-14', unit: 'quintal', minPrice: 1100, maxPrice: 1600, modalPrice: 1350, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Punjab
  { id: 'mp-3', cropId: 'wheat', cropName: 'Wheat (PBW 550)', state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Grain Market', date: '2026-10-14', unit: 'quintal', minPrice: 2200, maxPrice: 2400, modalPrice: 2275, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-pb-2', cropId: 'rice', cropName: 'Basmati Rice (1121)', state: 'Punjab', district: 'Amritsar', market: 'Amritsar Bhagtanwala Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 3400, maxPrice: 3850, modalPrice: 3620, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-pb-3', cropId: 'potato', cropName: 'Potato (Kufri Jyoti)', state: 'Punjab', district: 'Jalandhar', market: 'Jalandhar Main Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 900, maxPrice: 1300, modalPrice: 1120, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-pb-4', cropId: 'mustard', cropName: 'Mustard (Sarson)', state: 'Punjab', district: 'Patiala', market: 'Patiala Anaj Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 5100, maxPrice: 5700, modalPrice: 5450, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Haryana
  { id: 'mp-4', cropId: 'wheat', cropName: 'Wheat', state: 'Haryana', district: 'Karnal', market: 'Karnal APMC', date: '2026-10-14', unit: 'quintal', minPrice: 2150, maxPrice: 2350, modalPrice: 2250, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-hr-2', cropId: 'cotton', cropName: 'Cotton (American)', state: 'Haryana', district: 'Hisar', market: 'Hisar Grain Market', date: '2026-10-14', unit: 'quintal', minPrice: 6400, maxPrice: 7100, modalPrice: 6750, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-hr-3', cropId: 'mustard', cropName: 'Mustard Seed', state: 'Haryana', district: 'Rohtak', market: 'Rohtak APMC', date: '2026-10-14', unit: 'quintal', minPrice: 5050, maxPrice: 5650, modalPrice: 5380, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-hr-4', cropId: 'rice', cropName: 'Basmati Rice', state: 'Haryana', district: 'Ambala', market: 'Ambala City Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 3200, maxPrice: 3600, modalPrice: 3450, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Maharashtra
  { id: 'mp-5', cropId: 'cotton', cropName: 'Cotton', state: 'Maharashtra', district: 'Nagpur', market: 'Nagpur Cotton Market', date: '2026-10-14', unit: 'quintal', minPrice: 6200, maxPrice: 7100, modalPrice: 6700, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-12', cropId: 'onion', cropName: 'Onion (Red Nashik)', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1200, maxPrice: 2200, modalPrice: 1700, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-13', cropId: 'chickpea', cropName: 'Chickpea (Chana)', state: 'Maharashtra', district: 'Aurangabad', market: 'Aurangabad APMC', date: '2026-10-14', unit: 'quintal', minPrice: 4800, maxPrice: 5400, modalPrice: 5100, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-14', cropId: 'sugarcane', cropName: 'Sugarcane', state: 'Maharashtra', district: 'Pune', market: 'Pune Sugar Co-op Mandi', date: '2026-10-14', unit: 'tonne', minPrice: 2900, maxPrice: 3200, modalPrice: 3050, sourceLabel: 'Illustrative sample — FRP reference only' },
  { id: 'mp-mh-5', cropId: 'soybean', cropName: 'Soybean (Yellow)', state: 'Maharashtra', district: 'Amravati', market: 'Amravati Krishi Utpanna Bazar', date: '2026-10-14', unit: 'quintal', minPrice: 4200, maxPrice: 4650, modalPrice: 4480, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-mh-6', cropId: 'pomegranate', cropName: 'Pomegranate (Bhagwa)', state: 'Maharashtra', district: 'Solapur', market: 'Solapur Fruit Market', date: '2026-10-14', unit: 'quintal', minPrice: 7500, maxPrice: 11000, modalPrice: 9200, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Uttar Pradesh
  { id: 'mp-up-1', cropId: 'wheat', cropName: 'Wheat (Kalyan Sona)', state: 'Uttar Pradesh', district: 'Lucknow', market: 'Lucknow Dubagga Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 2180, maxPrice: 2360, modalPrice: 2260, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-up-2', cropId: 'potato', cropName: 'Potato (Desi Red)', state: 'Uttar Pradesh', district: 'Agra', market: 'Agra Khandauli Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 850, maxPrice: 1250, modalPrice: 1050, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-up-3', cropId: 'rice', cropName: 'Paddy (Govind)', state: 'Uttar Pradesh', district: 'Varanasi', market: 'Varanasi Chandpur Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 1950, maxPrice: 2200, modalPrice: 2080, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-up-4', cropId: 'sugarcane', cropName: 'Sugarcane (Co-0238)', state: 'Uttar Pradesh', district: 'Meerut', market: 'Meerut Sugar Market', date: '2026-10-14', unit: 'tonne', minPrice: 3100, maxPrice: 3400, modalPrice: 3250, sourceLabel: 'Illustrative sample — State SAP format' },
  { id: 'mp-up-5', cropId: 'mustard', cropName: 'Mustard (Yellow)', state: 'Uttar Pradesh', district: 'Kanpur', market: 'Kanpur Grain Market', date: '2026-10-14', unit: 'quintal', minPrice: 5150, maxPrice: 5750, modalPrice: 5420, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-up-6', cropId: 'chickpea', cropName: 'Gram (Desi)', state: 'Uttar Pradesh', district: 'Prayagraj', market: 'Prayagraj Mandi Parishad', date: '2026-10-14', unit: 'quintal', minPrice: 4900, maxPrice: 5500, modalPrice: 5200, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Andhra Pradesh
  { id: 'mp-10', cropId: 'maize', cropName: 'Maize (Yellow)', state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur APMC Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 1700, maxPrice: 2000, modalPrice: 1850, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ap-2', cropId: 'rice', cropName: 'Rice (BPT 5204 Samba)', state: 'Andhra Pradesh', district: 'Krishna', market: 'Vijayawada Market Yard', date: '2026-10-14', unit: 'quintal', minPrice: 2100, maxPrice: 2450, modalPrice: 2280, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ap-3', cropId: 'groundnut', cropName: 'Groundnut (Pod)', state: 'Andhra Pradesh', district: 'Kurnool', market: 'Kurnool Agricultural Market', date: '2026-10-14', unit: 'quintal', minPrice: 5100, maxPrice: 5900, modalPrice: 5500, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ap-4', cropId: 'cotton', cropName: 'Cotton (Bunny)', state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur Mirchi Yard (Cotton Wing)', date: '2026-10-14', unit: 'quintal', minPrice: 6350, maxPrice: 7150, modalPrice: 6780, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Telangana
  { id: 'mp-ts-1', cropId: 'rice', cropName: 'Paddy (Telangana Sona / RNR)', state: 'Telangana', district: 'Karimnagar', market: 'Karimnagar Agricultural Market', date: '2026-10-14', unit: 'quintal', minPrice: 2050, maxPrice: 2350, modalPrice: 2200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ts-2', cropId: 'cotton', cropName: 'Cotton (Long Staple)', state: 'Telangana', district: 'Warangal', market: 'Warangal Enamamula Market Yard', date: '2026-10-14', unit: 'quintal', minPrice: 6450, maxPrice: 7250, modalPrice: 6890, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ts-3', cropId: 'turmeric', cropName: 'Turmeric (Finger)', state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad Turmeric Market', date: '2026-10-14', unit: 'quintal', minPrice: 12500, maxPrice: 16800, modalPrice: 14200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ts-4', cropId: 'tomato', cropName: 'Tomato (Hybrid)', state: 'Telangana', district: 'Hyderabad', market: 'Bowenpally Agricultural Market', date: '2026-10-14', unit: 'quintal', minPrice: 950, maxPrice: 1550, modalPrice: 1280, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Karnataka
  { id: 'mp-9', cropId: 'maize', cropName: 'Maize (Feed Grade)', state: 'Karnataka', district: 'Dharwad', market: 'Dharwad APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1750, maxPrice: 2050, modalPrice: 1900, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-11', cropId: 'tomato', cropName: 'Tomato', state: 'Karnataka', district: 'Mysore', market: 'Mysore APMC Bandipalya', date: '2026-10-14', unit: 'quintal', minPrice: 800, maxPrice: 1600, modalPrice: 1200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ka-3', cropId: 'ragi', cropName: 'Finger Millet (Ragi)', state: 'Karnataka', district: 'Bangalore Rural', market: 'Doddaballapur APMC', date: '2026-10-14', unit: 'quintal', minPrice: 3100, maxPrice: 3650, modalPrice: 3400, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-ka-4', cropId: 'sugarcane', cropName: 'Sugarcane', state: 'Karnataka', district: 'Belagavi', market: 'Belagavi Sugar APMC', date: '2026-10-14', unit: 'tonne', minPrice: 2950, maxPrice: 3250, modalPrice: 3120, sourceLabel: 'Illustrative sample — FRP format' },
  { id: 'mp-ka-5', cropId: 'groundnut', cropName: 'Groundnut (TMV-2)', state: 'Karnataka', district: 'Tumkur', market: 'Tumkur APMC Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 4900, maxPrice: 5650, modalPrice: 5300, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // Gujarat
  { id: 'mp-6', cropId: 'cotton', cropName: 'Cotton (Shankar 6)', state: 'Gujarat', district: 'Rajkot', market: 'Rajkot APMC Bedi Yard', date: '2026-10-14', unit: 'quintal', minPrice: 6300, maxPrice: 7200, modalPrice: 6800, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-7', cropId: 'groundnut', cropName: 'Groundnut (Bold / Java)', state: 'Gujarat', district: 'Junagadh', market: 'Junagadh APMC Yard', date: '2026-10-14', unit: 'quintal', minPrice: 4800, maxPrice: 5600, modalPrice: 5200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-gj-3', cropId: 'wheat', cropName: 'Wheat (Lokwan)', state: 'Gujarat', district: 'Ahmedabad', market: 'Ahmedabad Jamalpur APMC', date: '2026-10-14', unit: 'quintal', minPrice: 2250, maxPrice: 2550, modalPrice: 2380, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-gj-4', cropId: 'banana', cropName: 'Banana (Grand Naine)', state: 'Gujarat', district: 'Surat', market: 'Surat APMC Sardar Market', date: '2026-10-14', unit: 'quintal', minPrice: 1400, maxPrice: 1950, modalPrice: 1680, sourceLabel: 'Illustrative sample — Agmarknet format' },

  // West Bengal
  { id: 'mp-wb-1', cropId: 'rice', cropName: 'Rice (Swarna Paddy)', state: 'West Bengal', district: 'Bardhaman', market: 'Bardhaman Sadar Mandi', date: '2026-10-14', unit: 'quintal', minPrice: 1920, maxPrice: 2180, modalPrice: 2050, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-wb-2', cropId: 'jute', cropName: 'Raw Jute (TD-5)', state: 'West Bengal', district: 'Murshidabad', market: 'Murshidabad Berhampore Market', date: '2026-10-14', unit: 'quintal', minPrice: 4800, maxPrice: 5400, modalPrice: 5120, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-wb-3', cropId: 'potato', cropName: 'Potato (Jyoti)', state: 'West Bengal', district: 'Kolkata', market: 'Kolkata Koley Market', date: '2026-10-14', unit: 'quintal', minPrice: 980, maxPrice: 1350, modalPrice: 1180, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-wb-4', cropId: 'mustard', cropName: 'Mustard (Toria)', state: 'West Bengal', district: 'Nadia', market: 'Nadia Ranaghat Market', date: '2026-10-14', unit: 'quintal', minPrice: 5100, maxPrice: 5600, modalPrice: 5350, sourceLabel: 'Illustrative sample — Agmarknet format' },
];

export const MSP_PRICES: MspPrice[] = [
  { cropId: 'rice', cropName: 'Rice (Common)', season: 'kharif', year: '2025–26', pricePerQuintal: 2300, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'wheat', cropName: 'Wheat', season: 'rabi', year: '2025–26', pricePerQuintal: 2425, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'groundnut', cropName: 'Groundnut', season: 'kharif', year: '2025–26', pricePerQuintal: 6783, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'cotton', cropName: 'Cotton (Medium Staple)', season: 'kharif', year: '2025–26', pricePerQuintal: 7121, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'maize', cropName: 'Maize', season: 'kharif', year: '2025–26', pricePerQuintal: 2225, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'chickpea', cropName: 'Chickpea (Bengal Gram)', season: 'rabi', year: '2025–26', pricePerQuintal: 5650, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
];

const STATE_CODE_TO_NAME: Record<string, string> = {
  tn: 'Tamil Nadu',
  mh: 'Maharashtra',
  up: 'Uttar Pradesh',
  ap: 'Andhra Pradesh',
  ts: 'Telangana',
  ka: 'Karnataka',
  pb: 'Punjab',
  hr: 'Haryana',
  gj: 'Gujarat',
  wb: 'West Bengal',
};

export function filterMarketPrices(
  prices: MarketPrice[],
  stateQuery?: string,
  districtQuery?: string,
  cropId?: string
): MarketPrice[] {
  const normState = stateQuery?.toLowerCase().trim();
  const stateFullName = normState && STATE_CODE_TO_NAME[normState]
    ? STATE_CODE_TO_NAME[normState].toLowerCase()
    : normState;

  const rawDistrict = districtQuery?.toLowerCase().trim();
  // Strip 'pb-', 'tn-', 'mh-' prefix from district ID if needed
  const cleanDistrict = rawDistrict?.replace(/^[a-z]{2}-/, '');

  return prices.filter(p => {
    const pState = p.state.toLowerCase();
    const pDistrict = p.district.toLowerCase();

    const matchesState =
      !normState ||
      pState === normState ||
      (stateFullName && pState === stateFullName) ||
      pState.includes(normState);

    const matchesDistrict =
      !cleanDistrict ||
      pDistrict === cleanDistrict ||
      pDistrict.includes(cleanDistrict);

    const matchesCrop = !cropId || p.cropId === cropId;

    return matchesState && matchesDistrict && matchesCrop;
  });
}
