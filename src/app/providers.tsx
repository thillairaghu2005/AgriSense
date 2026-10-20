import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { FarmerProfile, AppContextValue, UserRole } from '@/types';
import { storageGet, storageSet, storageClearAll, STORAGE_KEYS } from '@/lib/storage';
import { translate } from '@/data/translations';
import { ToastProvider } from '@/components/feedback/Toast';

const DEFAULT_PROFILE: FarmerProfile = {
  displayName: 'Ramasamy K.',
  preferredLanguage: 'en',
  state: 'tn',
  district: 'tn-thanjavur',
  block: 'Kumbakonam',
  village: 'Thiruvidaimarudur',
  pincode: '612101',
  landArea: 2.5,
  landAreaUnit: 'acres',
  soilType: 'alluvial',
  farmerCategory: 'small',
  socialCategory: 'obc',
  gender: 'male',
  mobileNumber: '98421-55820',
  aadhaarMasked: 'XXXX-XXXX-4892',
  surveyNumber: '142/3A',
  pattaNumber: 'TN-THJ-8821',
  bankName: 'State Bank of India',
  bankAccountMasked: 'XXXXXX5912',
  bankIfsc: 'SBIN0001234',
  irrigationSource: 'borewell',
  cropsGrown: ['paddy', 'black_gram', 'banana'],
  kccCardHolder: true,
  pmKisanRegId: 'TN19284758',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  },
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(() =>
    storageGet(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE)
  );
  const [language, setLanguageState] = useState<string>(() =>
    storageGet(STORAGE_KEYS.LANGUAGE, DEFAULT_PROFILE.preferredLanguage)
  );
  const [state, setStateVal] = useState<string>(() =>
    storageGet(STORAGE_KEYS.STATE, DEFAULT_PROFILE.state)
  );
  const [district, setDistrictVal] = useState<string>(() =>
    storageGet(STORAGE_KEYS.DISTRICT, DEFAULT_PROFILE.district)
  );
  const [role, setRoleState] = useState<UserRole>(() =>
    storageGet(STORAGE_KEYS.USER_ROLE, 'farmer')
  );

  // Sync accessibility classes to document root
  useEffect(() => {
    const root = document.documentElement;
    if (profile.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (profile.accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (profile.accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [profile.accessibility]);

  const updateProfile = useCallback((updates: Partial<FarmerProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      storageSet(STORAGE_KEYS.PROFILE, next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    storageSet(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const setState = useCallback((s: string) => {
    setStateVal(s);
    storageSet(STORAGE_KEYS.STATE, s);
  }, []);

  const setDistrict = useCallback((d: string) => {
    setDistrictVal(d);
    storageSet(STORAGE_KEYS.DISTRICT, d);
  }, []);

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    storageSet(STORAGE_KEYS.USER_ROLE, newRole);
  }, []);

  const t = useCallback((key: string) => translate(language, key), [language]);

  const resetDemoData = useCallback(() => {
    storageClearAll();
    setProfile(DEFAULT_PROFILE);
    setLanguageState(DEFAULT_PROFILE.preferredLanguage);
    setStateVal(DEFAULT_PROFILE.state);
    setDistrictVal(DEFAULT_PROFILE.district);
    setRoleState('farmer');
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        updateProfile,
        language,
        setLanguage,
        state,
        setState,
        district,
        setDistrict,
        role,
        setRole,
        t,
        resetDemoData,
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

