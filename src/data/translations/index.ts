import en from './en';
import hi from './hi';
import ta from './ta';
import te from './te';
import mr from './mr';
import kn from './kn';
import ml from './ml';
import bn from './bn';
import gu from './gu';
import pa from './pa';
import orDict from './or';
import asDict from './as';

export type SupportedLanguage =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'or'
  | 'as';

export const LANGUAGES: { code: SupportedLanguage; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
];

const DICTIONARIES: Record<SupportedLanguage, Record<string, string>> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  mr,
  bn,
  gu,
  pa,
  or: orDict,
  as: asDict,
};

export function translate(lang: string, key: string): string {
  const selected = DICTIONARIES[lang as SupportedLanguage];
  if (selected && selected[key]) {
    return selected[key];
  }
  const fallback = DICTIONARIES.en;
  return fallback[key] ?? key;
}
