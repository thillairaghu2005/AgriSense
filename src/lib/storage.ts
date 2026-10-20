// Central localStorage helpers with versioned keys
// All keys are prefixed with farmer-app:v1: for namespace safety

const PREFIX = 'farmer-app:v1:';
const memoryStore = new Map<string, string>();

function hasStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function';
  } catch {
    return false;
  }
}

function getKey(name: string): string {
  return `${PREFIX}${name}`;
}

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const namespaced = getKey(key);
    let raw: string | null = null;
    if (hasStorage()) {
      raw = localStorage.getItem(namespaced);
    } else {
      raw = memoryStore.get(namespaced) ?? null;
    }
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    const namespaced = getKey(key);
    const serialized = JSON.stringify(value);
    if (hasStorage()) {
      localStorage.setItem(namespaced, serialized);
    } else {
      memoryStore.set(namespaced, serialized);
    }
  } catch {
    // Storage may be unavailable; continue with in-memory state
  }
}

export function storageRemove(key: string): void {
  try {
    const namespaced = getKey(key);
    if (hasStorage()) {
      localStorage.removeItem(namespaced);
    } else {
      memoryStore.delete(namespaced);
    }
  } catch {
    // Ignore
  }
}

export function storageClearAll(): void {
  try {
    if (hasStorage()) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX)) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } else {
      for (const k of Array.from(memoryStore.keys())) {
        if (k.startsWith(PREFIX)) memoryStore.delete(k);
      }
    }
  } catch {
    // Ignore
  }
}

// Named storage keys
export const STORAGE_KEYS = {
  PROFILE: 'profile',
  LANGUAGE: 'language',
  STATE: 'selected-state',
  DISTRICT: 'selected-district',
  TASKS: 'farm-tasks',
  TRANSACTIONS: 'transactions',
  SOIL_TESTS: 'soil-tests',
  NOTIFICATIONS: 'notifications',
  SCHEME_CHECKLISTS: 'scheme-checklists',
  BOOKMARKED_ARTICLES: 'bookmarked-articles',
  AGMARKNET_API_KEY: 'agmarknet-api-key',
  WEATHER_LIVE_ENABLED: 'weather-live-enabled',
  MARKET_LIVE_ENABLED: 'market-live-enabled',
  USER_ROLE: 'user-role',
  APPLICATIONS: 'scheme-applications',
  GRIEVANCES: 'grievance-tickets',
  SEED_REQUISITIONS: 'seed-requisitions',
  SAPLING_BOOKINGS: 'sapling-bookings',
};
