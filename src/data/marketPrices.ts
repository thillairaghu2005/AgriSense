import type { MarketPrice, MspPrice } from '@/types';

export const MARKET_PRICES: MarketPrice[] = [
  { id: 'mp-1', cropId: 'rice', cropName: 'Rice (Paddy)', state: 'Tamil Nadu', district: 'Thanjavur', market: 'Thanjavur APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1900, maxPrice: 2100, modalPrice: 2000, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-2', cropId: 'rice', cropName: 'Rice (Paddy)', state: 'Tamil Nadu', district: 'Madurai', market: 'Madurai Regulated Market', date: '2026-10-14', unit: 'quintal', minPrice: 1850, maxPrice: 2050, modalPrice: 1950, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-3', cropId: 'wheat', cropName: 'Wheat', state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Grain Market', date: '2026-10-14', unit: 'quintal', minPrice: 2200, maxPrice: 2400, modalPrice: 2275, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-4', cropId: 'wheat', cropName: 'Wheat', state: 'Haryana', district: 'Karnal', market: 'Karnal APMC', date: '2026-10-14', unit: 'quintal', minPrice: 2150, maxPrice: 2350, modalPrice: 2250, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-5', cropId: 'cotton', cropName: 'Cotton', state: 'Maharashtra', district: 'Nagpur', market: 'Nagpur Cotton Market', date: '2026-10-14', unit: 'quintal', minPrice: 6200, maxPrice: 7100, modalPrice: 6700, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-6', cropId: 'cotton', cropName: 'Cotton', state: 'Gujarat', district: 'Rajkot', market: 'Rajkot APMC', date: '2026-10-14', unit: 'quintal', minPrice: 6300, maxPrice: 7200, modalPrice: 6800, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-7', cropId: 'groundnut', cropName: 'Groundnut', state: 'Gujarat', district: 'Junagadh', market: 'Junagadh APMC', date: '2026-10-14', unit: 'quintal', minPrice: 4800, maxPrice: 5600, modalPrice: 5200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-8', cropId: 'groundnut', cropName: 'Groundnut', state: 'Tamil Nadu', district: 'Tirunelveli', market: 'Tirunelveli APMC', date: '2026-10-14', unit: 'quintal', minPrice: 4700, maxPrice: 5500, modalPrice: 5100, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-9', cropId: 'maize', cropName: 'Maize', state: 'Karnataka', district: 'Dharwad', market: 'Dharwad APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1750, maxPrice: 2050, modalPrice: 1900, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-10', cropId: 'maize', cropName: 'Maize', state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1700, maxPrice: 2000, modalPrice: 1850, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-11', cropId: 'tomato', cropName: 'Tomato', state: 'Karnataka', district: 'Mysore', market: 'Mysore APMC', date: '2026-10-14', unit: 'quintal', minPrice: 800, maxPrice: 1600, modalPrice: 1200, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-12', cropId: 'onion', cropName: 'Onion', state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon APMC', date: '2026-10-14', unit: 'quintal', minPrice: 1200, maxPrice: 2200, modalPrice: 1700, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-13', cropId: 'chickpea', cropName: 'Chickpea', state: 'Maharashtra', district: 'Aurangabad', market: 'Aurangabad APMC', date: '2026-10-14', unit: 'quintal', minPrice: 4800, maxPrice: 5400, modalPrice: 5100, sourceLabel: 'Illustrative sample — Agmarknet format' },
  { id: 'mp-14', cropId: 'sugarcane', cropName: 'Sugarcane', state: 'Maharashtra', district: 'Pune', market: 'Pune Sugar Co-op', date: '2026-10-14', unit: 'tonne', minPrice: 2900, maxPrice: 3200, modalPrice: 3050, sourceLabel: 'Illustrative sample — FRP reference only' },
];

export const MSP_PRICES: MspPrice[] = [
  { cropId: 'rice', cropName: 'Rice (Common)', season: 'kharif', year: '2025–26', pricePerQuintal: 2300, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'wheat', cropName: 'Wheat', season: 'rabi', year: '2025–26', pricePerQuintal: 2425, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'groundnut', cropName: 'Groundnut', season: 'kharif', year: '2025–26', pricePerQuintal: 6783, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'cotton', cropName: 'Cotton (Medium Staple)', season: 'kharif', year: '2025–26', pricePerQuintal: 7121, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'maize', cropName: 'Maize', season: 'kharif', year: '2025–26', pricePerQuintal: 2225, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
  { cropId: 'chickpea', cropName: 'Chickpea (Bengal Gram)', season: 'rabi', year: '2025–26', pricePerQuintal: 5650, announcedBy: 'Cabinet Committee on Economic Affairs (CCEA)', sourceLabel: 'Illustrative based on public MSP announcements — verify with CACP' },
];

export function filterMarketPrices(prices: MarketPrice[], state?: string, cropId?: string): MarketPrice[] {
  return prices.filter(p =>
    (!state || p.state === state) &&
    (!cropId || p.cropId === cropId)
  );
}
