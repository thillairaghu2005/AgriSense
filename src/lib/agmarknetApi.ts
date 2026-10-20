import type { MarketPrice } from '@/types';
import { storageGet, storageSet, storageRemove, STORAGE_KEYS } from './storage';

export interface AgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety?: string;
  arrival_date: string;
  min_price: string | number;
  max_price: string | number;
  modal_price: string | number;
}

export interface AgmarknetApiResponse {
  records?: AgmarknetRecord[];
  total?: number;
  count?: number;
  status?: string;
  message?: string;
  error?: string;
}

// Normalize Agmarknet commodity strings to app crop IDs
export function normalizeCommodityToCrop(commodity: string): { cropId: string; cropName: string } {
  const c = commodity.toLowerCase();
  if (c.includes('paddy') || c.includes('rice') || c.includes('dhan')) {
    return { cropId: 'rice', cropName: 'Rice (Paddy)' };
  }
  if (c.includes('wheat') || c.includes('gehun')) {
    return { cropId: 'wheat', cropName: 'Wheat' };
  }
  if (c.includes('cotton') || c.includes('kapas')) {
    return { cropId: 'cotton', cropName: 'Cotton' };
  }
  if (c.includes('groundnut') || c.includes('peanut')) {
    return { cropId: 'groundnut', cropName: 'Groundnut' };
  }
  if (c.includes('maize') || c.includes('corn') || c.includes('makka')) {
    return { cropId: 'maize', cropName: 'Maize' };
  }
  if (c.includes('tomato')) {
    return { cropId: 'tomato', cropName: 'Tomato' };
  }
  if (c.includes('onion') || c.includes('pyaz')) {
    return { cropId: 'onion', cropName: 'Onion' };
  }
  if (c.includes('potato') || c.includes('aloo')) {
    return { cropId: 'potato', cropName: 'Potato' };
  }
  if (c.includes('chickpea') || c.includes('gram') || c.includes('chana')) {
    return { cropId: 'chickpea', cropName: 'Chickpea (Gram)' };
  }
  if (c.includes('soyabean') || c.includes('soybean')) {
    return { cropId: 'soyabean', cropName: 'Soyabean' };
  }
  if (c.includes('mustard') || c.includes('sarson')) {
    return { cropId: 'mustard', cropName: 'Mustard' };
  }
  if (c.includes('sugarcane') || c.includes('ganna')) {
    return { cropId: 'sugarcane', cropName: 'Sugarcane' };
  }
  return { cropId: c.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''), cropName: commodity };
}

export function getAgmarknetApiKey(): string {
  return storageGet(STORAGE_KEYS.AGMARKNET_API_KEY, '');
}

export function saveAgmarknetApiKey(key: string): void {
  storageSet(STORAGE_KEYS.AGMARKNET_API_KEY, key.trim());
}

export function removeAgmarknetApiKey(): void {
  storageRemove(STORAGE_KEYS.AGMARKNET_API_KEY);
}

// Build standard URL for Agmarknet on Data.gov.in
export function buildAgmarknetUrl(options: {
  apiKey: string;
  state?: string;
  district?: string;
  commodity?: string;
  limit?: number;
}): string {
  const isDev = import.meta.env.DEV;
  const baseUrl = isDev
    ? '/api/agmarknet'
    : 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

  const params = new URLSearchParams({
    'api-key': options.apiKey,
    format: 'json',
    limit: String(options.limit ?? 50),
  });

  if (options.state && options.state !== 'All') {
    params.append('filters[state]', options.state);
  }
  if (options.district && options.district !== 'All') {
    params.append('filters[district]', options.district);
  }
  if (options.commodity && options.commodity !== 'All') {
    params.append('filters[commodity]', options.commodity);
  }

  return `${baseUrl}?${params.toString()}`;
}

export async function fetchLiveMandiPrices(options: {
  apiKey?: string;
  state?: string;
  district?: string;
  commodity?: string;
  limit?: number;
}): Promise<{ prices: MarketPrice[]; total: number; source: string }> {
  const apiKey = options.apiKey || getAgmarknetApiKey();

  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const url = buildAgmarknetUrl({
    apiKey,
    state: options.state,
    district: options.district,
    commodity: options.commodity,
    limit: options.limit ?? 60,
  });

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Mandi API Error (${res.status}): ${res.statusText}`);
  }

  const data: AgmarknetApiResponse = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }

  const records = data.records ?? [];
  const prices: MarketPrice[] = records.map((rec, idx) => {
    const { cropId, cropName } = normalizeCommodityToCrop(rec.commodity);
    const minP = Number(rec.min_price) || 0;
    const maxP = Number(rec.max_price) || 0;
    const modP = Number(rec.modal_price) || Math.round((minP + maxP) / 2);

    return {
      id: `live-mandi-${rec.state}-${rec.market}-${cropId}-${idx}`,
      cropId,
      cropName,
      state: rec.state,
      district: rec.district || rec.market,
      market: rec.market.includes('APMC') || rec.market.includes('Market') ? rec.market : `${rec.market} APMC`,
      date: rec.arrival_date || new Date().toISOString().split('T')[0],
      unit: 'quintal',
      minPrice: minP,
      maxPrice: maxP,
      modalPrice: modP,
      sourceLabel: 'Live Mandi Feed • data.gov.in / Agmarknet',
    };
  });

  return {
    prices,
    total: data.total ?? prices.length,
    source: 'data.gov.in (Agmarknet)',
  };
}
