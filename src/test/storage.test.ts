import { describe, it, expect, beforeEach } from 'vitest';
import { storageGet, storageSet, storageRemove, storageClearAll, STORAGE_KEYS } from '@/lib/storage';

describe('Local Storage Utility', () => {
  beforeEach(() => {
    storageClearAll();
  });

  it('stores and retrieves profile correctly', () => {
    const mockProfile = {
      displayName: 'Balwinder Singh',
      preferredLanguage: 'pa',
      state: 'pb',
      district: 'pb-ludhiana',
      landArea: 5,
      landAreaUnit: 'acres' as const,
      soilType: 'alluvial' as const,
      accessibility: {
        highContrast: false,
        largeText: true,
        reducedMotion: false,
      },
    };

    storageSet(STORAGE_KEYS.PROFILE, mockProfile);
    const retrieved = storageGet(STORAGE_KEYS.PROFILE, null);
    expect(retrieved).toEqual(mockProfile);
  });

  it('returns fallback value if key does not exist', () => {
    const fallback = { status: 'default' };
    const retrieved = storageGet('non-existent-key', fallback);
    expect(retrieved).toEqual(fallback);
  });

  it('removes keys properly', () => {
    storageSet('test-key', 'active');
    expect(storageGet('test-key', null)).toBe('active');
    storageRemove('test-key');
    expect(storageGet('test-key', null)).toBeNull();
  });
});
