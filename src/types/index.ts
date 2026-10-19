// Shared TypeScript types for the AgriSense application

// ─── Profile ────────────────────────────────────────────────────
export interface FarmerProfile {
  displayName: string;
  preferredLanguage: string;
  state: string;
  district: string;
  village?: string;
  landArea: number;
  landAreaUnit: 'acres' | 'hectares' | 'bigha';
  soilType: SoilType;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
}

// ─── Crops ──────────────────────────────────────────────────────
export type Season = 'kharif' | 'rabi' | 'zaid' | 'annual';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'black' | 'red' | 'alluvial' | 'laterite';
export type CropCategory = 'cereal' | 'pulse' | 'oilseed' | 'vegetable' | 'fruit' | 'cash_crop' | 'spice' | 'fiber';

export interface GrowthStage {
  name: string;
  daysFromSowing: number;
  description: string;
  tasks: string[];
}

export interface Crop {
  id: string;
  name: string;
  localNames: Record<string, string>;
  category: CropCategory;
  seasons: Season[];
  durationDays: [number, number]; // min, max
  waterNeedsMmPerSeason: [number, number];
  suitableSoils: SoilType[];
  suitableStates: string[];
  idealPhRange: [number, number];
  idealTempCelsius: [number, number];
  growthStages: GrowthStage[];
  sowingGuidance: string;
  harvestGuidance: string;
  irrigationNotes: string;
  fertiliserNotes: string;
  imageUrl?: string;
}

// ─── Crop Recommendation ─────────────────────────────────────────
export interface CropRecommendationInput {
  state: string;
  district: string;
  landArea: number;
  landAreaUnit: 'acres' | 'hectares' | 'bigha';
  season: Season;
  soilType: SoilType;
  soilPh?: number;
  nitrogenLevel?: 'low' | 'medium' | 'high';
  phosphorusLevel?: 'low' | 'medium' | 'high';
  potassiumLevel?: 'low' | 'medium' | 'high';
  annualRainfallMm?: number;
  avgTempCelsius?: number;
}

export interface CropRecommendation {
  cropId: string;
  score: number; // 0-100 illustrative score
  reasons: string[];
  assumptions: string[];
  missingData: string[];
  estimatedDurationDays: [number, number];
  waterNeedsMmPerSeason: [number, number];
  cultivationNotes: string;
}

// ─── Weather ─────────────────────────────────────────────────────
export interface WeatherDay {
  dateLabel: string;
  minTempC: number;
  maxTempC: number;
  humidity: number; // percentage
  windSpeedKmh: number;
  rainProbability: number; // percentage
  expectedRainfallMm: number;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy' | 'heavy_rain' | 'thunderstorm' | 'foggy';
  description: string;
  farmingAdvice: string;
}

export interface WeatherAlert {
  id: string;
  type: 'heavy_rain' | 'heat_wave' | 'strong_wind' | 'frost' | 'pest_risk';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  validFrom: string;
  validUntil: string;
}

// ─── Market Prices ───────────────────────────────────────────────
export interface MarketPrice {
  id: string;
  cropId: string;
  cropName: string;
  state: string;
  district: string;
  market: string; // APMC / mandi name
  date: string; // ISO date string
  unit: 'quintal' | 'kg' | 'tonne';
  minPrice: number; // INR
  maxPrice: number; // INR
  modalPrice: number; // INR
  sourceLabel: string;
}

export interface MspPrice {
  cropId: string;
  cropName: string;
  season: Season;
  year: string;
  pricePerQuintal: number;
  announcedBy: string;
  sourceLabel: string;
}

// ─── Government Schemes ──────────────────────────────────────────
export type SchemeLevel = 'central' | 'state';
export type SchemeCategory = 'insurance' | 'credit' | 'subsidy' | 'income_support' | 'irrigation' | 'mechanisation' | 'market' | 'organic' | 'seed' | 'other';

export interface SchemeTimeline {
  activityMonth: string;   // e.g. "June–July"
  activity: string;
}

export interface SeedInfo {
  cropName: string;
  recommendedVarieties: string[];
  sowingDepthCm: string;
  seedRateKgPerHectare: string;
  spacingCm: string;
  germinationDays: string;
  seedTreatment: string;
}

export interface Scheme {
  id: string;
  name: string;
  level: SchemeLevel;
  stateApplicability: string[];  // empty = all India
  category: SchemeCategory;
  shortDescription: string;
  eligibilitySummary: string;
  benefits: string;
  subsidyAmount?: string;        // e.g. "50% of cost, max ₹10,000"
  fundingBudget?: string;        // e.g. "₹14,000 crore (2023-24)"
  coverageStates?: string;       // e.g. "All states" or specific list
  renewalPeriod?: string;        // e.g. "Annual", "One-time", "3 years"
  targetBeneficiaries?: string;  // e.g. "Small & marginal farmers"
  documents: string[];
  applicationSteps: string[];
  timeline?: SchemeTimeline[];   // activity calendar
  seedInfo?: SeedInfo[];         // seed plantation info where applicable
  keyFeatures?: string[];        // bullet highlights
  officialUrl: string;
  lastVerifiedDate: string;
  isVerified: boolean;
}

// ─── Farm Tasks / Calendar ───────────────────────────────────────
export type TaskType = 'sowing' | 'irrigation' | 'fertiliser' | 'pesticide' | 'weeding' | 'harvest' | 'field_prep' | 'other';
export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'skipped';

export interface FarmTask {
  id: string;
  title: string;
  cropId?: string;
  taskType: TaskType;
  dueDate: string; // ISO date string
  status: TaskStatus;
  notes: string;
  createdAt: string;
}

// ─── Finances ────────────────────────────────────────────────────
export type TransactionType = 'expense' | 'income';
export type ExpenseCategory = 'seed' | 'fertiliser' | 'pesticide' | 'labour' | 'irrigation' | 'equipment' | 'transport' | 'other';
export type IncomeCategory = 'crop_sale' | 'subsidy' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: ExpenseCategory | IncomeCategory;
  amount: number; // INR
  date: string; // ISO date string
  cropId?: string;
  notes: string;
  createdAt: string;
}

// ─── Soil ────────────────────────────────────────────────────────
export type SoilDataSource = 'laboratory' | 'illustrative_estimate';

export interface SoilTest {
  id: string;
  testDate: string;
  soilType: SoilType;
  ph?: number;
  nitrogen?: 'low' | 'medium' | 'high';
  phosphorus?: 'low' | 'medium' | 'high';
  potassium?: 'low' | 'medium' | 'high';
  organicCarbon?: number; // percentage
  source: SoilDataSource;
  labName?: string;
  notes: string;
  createdAt: string;
}

// ─── Pests & Diseases ────────────────────────────────────────────
export type PestOrDisease = 'pest' | 'disease';

export interface PestDisease {
  id: string;
  name: string;
  type: PestOrDisease;
  affectedCropIds: string[];
  symptoms: string[];
  causes: string;
  prevention: string[];
  management: string;
  severity: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

// ─── Notifications ───────────────────────────────────────────────
export type NotificationType = 'weather' | 'market' | 'crop_reminder' | 'scheme' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  isDismissed: boolean;
  destinationRoute?: string;
}

// ─── Articles / Knowledge ────────────────────────────────────────
export type ArticleCategory = 'seasonal_guide' | 'best_practice' | 'pest_management' | 'soil_health' | 'water_management' | 'market_tips' | 'scheme_guide';

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  season?: Season;
  summary: string;
  body: string;
  publishedDate: string;
  tags: string[];
  sourceLabel?: string;
}

// ─── Locations ───────────────────────────────────────────────────
export interface District {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  districts: District[];
}

// ─── App Context ─────────────────────────────────────────────────
export interface AppContextValue {
  profile: FarmerProfile;
  updateProfile: (updates: Partial<FarmerProfile>) => void;
  language: string;
  setLanguage: (lang: string) => void;
  state: string;
  setState: (s: string) => void;
  district: string;
  setDistrict: (d: string) => void;
  t: (key: string) => string;
  resetDemoData: () => void;
}
