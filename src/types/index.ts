// Shared TypeScript types for AgriSense — Agriculture Schemes & Farmer Welfare Platform for India

// ─── User Roles ──────────────────────────────────────────────────
export type UserRole = 'farmer' | 'officer' | 'manager' | 'admin';

// ─── Profile ────────────────────────────────────────────────────
export type FarmerCategory = 'marginal' | 'small' | 'semi_medium' | 'medium' | 'large';
export type SocialCategory = 'general' | 'obc' | 'sc' | 'st';
export type IrrigationSource = 'canal' | 'borewell' | 'open_well' | 'drip' | 'sprinkler' | 'rainfed';

export interface FarmerProfile {
  displayName: string;
  preferredLanguage: string;
  state: string;
  district: string;
  block?: string;
  village?: string;
  pincode?: string;
  landArea: number; // in chosen unit
  landAreaUnit: 'acres' | 'hectares' | 'bigha';
  soilType: SoilType;
  farmerCategory?: FarmerCategory; // calculated or chosen
  socialCategory?: SocialCategory;
  gender?: 'male' | 'female' | 'other';
  mobileNumber?: string;
  aadhaarMasked?: string;
  surveyNumber?: string; // Khasra/Khatauni/Chitta
  pattaNumber?: string;
  bankName?: string;
  bankAccountMasked?: string;
  bankIfsc?: string;
  irrigationSource?: IrrigationSource;
  cropsGrown?: string[];
  kccCardHolder?: boolean;
  pmKisanRegId?: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
}

// ─── Crops ──────────────────────────────────────────────────────
export type Season = 'kharif' | 'rabi' | 'zaid' | 'annual';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'black' | 'red' | 'alluvial' | 'laterite';
export type CropCategory = 'cereal' | 'pulse' | 'oilseed' | 'vegetable' | 'fruit' | 'cash_crop' | 'spice' | 'fiber' | 'plantation' | 'fodder';

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
  type: 'heavy_rain' | 'heat_wave' | 'strong_wind' | 'frost' | 'pest_risk' | 'cyclone';
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
export type SchemeCategory =
  | 'income_support'
  | 'insurance'
  | 'credit'
  | 'subsidy'
  | 'irrigation'
  | 'mechanisation'
  | 'fertiliser'
  | 'seed_distribution'
  | 'plantation_agroforestry'
  | 'soil_health'
  | 'organic_farming'
  | 'horticulture'
  | 'livestock'
  | 'fisheries'
  | 'pension'
  | 'weather'
  | 'disaster_relief'
  | 'market'
  | 'solar_energy'
  | 'water_management'
  | 'other';

export interface SchemeTimeline {
  activityMonth: string;
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

export interface SchemeEligibilityRules {
  minLandAcres?: number;
  maxLandAcres?: number;
  farmerCategories?: ('marginal' | 'small' | 'semi_medium' | 'medium' | 'large' | 'sc_st' | 'women' | 'tenant' | 'all')[];
  eligibleStates?: string[]; // empty for all India
  eligibleCrops?: string[];
  ageMin?: number;
  ageMax?: number;
  annualIncomeCap?: number;
  irrigationRequired?: boolean;
  kccRequired?: boolean;
  summary: string;
}

export interface Scheme {
  id: string;
  code: string; // e.g. PM-KISAN, PMFBY, SMAM
  name: string;
  level: SchemeLevel;
  stateApplicability: string[]; // empty = all India, or e.g. ['tn', 'mh']
  category: SchemeCategory;
  shortDescription: string;
  objectives: string[];
  eligibilitySummary: string;
  eligibilityRules?: SchemeEligibilityRules;
  beneficiaryCategories: string[]; // e.g. ["Small & Marginal Farmers", "Women Farmers"]
  benefits: string;
  financialAssistance: string;
  subsidyPercentage?: string | number; // e.g. "50% to 80%" or 50
  maxBenefitAmount?: string; // e.g. "Rs. 6,000 / year" or "Rs. 2,00,000"
  fundingBudget?: string;
  coverageStates?: string;
  renewalPeriod?: string;
  targetBeneficiaries?: string;
  documents: string[];
  applicationSteps: string[];
  deadlines?: string;
  implementingDepartment: string;
  officialUrl: string;
  helplineNumber: string;
  districtWiseAvailability?: string[];
  applicationStatusTracking: boolean;
  timeline?: SchemeTimeline[];
  seedInfo?: SeedInfo[];
  keyFeatures?: string[];
  sourceUrl: string;
  lastVerifiedDate: string;
  updateTimestamp: string;
  isVerified: boolean; // True for official verified portals, false for demo additions
}

// ─── Seed Distribution & Catalog ─────────────────────────────────
export type SeedClass = 'Breeder' | 'Foundation' | 'Certified' | 'Hybrid' | 'Truthfully Labelled';

export interface SeedVariety {
  id: string;
  cropId: string;
  cropName: string;
  varietyName: string;
  seedType: SeedClass;
  recommendedSeason: Season[];
  sowingPeriod: string;
  soilSuitability: string[];
  climateRequirements: {
    tempRange: string;
    rainfallMm: string;
    agroZone: string;
  };
  seedRateKgPerAcre: number;
  seedRateKgPerHectare: number;
  spacingCm: string;
  germinationPeriodDays: string;
  minGerminationPercentage: number;
  nurseryPreparation: string;
  plantingMethod: string;
  fertilizerSchedule: {
    basal: string;
    topDressing1: string;
    topDressing2?: string;
    micronutrients: string;
  };
  irrigationRequirements: string;
  pestDiseaseResistance: string[];
  expectedYieldQuintalsPerAcre: [number, number];
  harvestingPeriodDays: [number, number];
  maturitySigns: string;
  pricePerKg: number;
  subsidyPercentage: number;
  stockAvailability: {
    farmOrSupplierId: string;
    farmName: string;
    state: string;
    district: string;
    availableKg: number;
    isGovtFarm: boolean;
  }[];
}

export interface SeedFarm {
  id: string;
  name: string;
  type: 'Central NSC Centre' | 'State Agricultural Seed Farm' | 'University Seed Centre' | 'KVK Seed Hub';
  state: string;
  district: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  operatingHours: string;
  stockCrops: string[];
}

export interface SeedRequisition {
  id: string;
  farmerName: string;
  aadhaarMasked: string;
  varietyId: string;
  varietyName: string;
  cropName: string;
  quantityKg: number;
  totalCost: number;
  subsidyAmount: number;
  farmerShare: number;
  seedFarmId: string;
  seedFarmName: string;
  bookingDate: string;
  status: 'booked' | 'ready_for_pickup' | 'distributed' | 'cancelled';
  otpCode: string;
}

// ─── Plantation & Agroforestry Programs ───────────────────────────
export type PlantationType = 'orchard' | 'timber_agroforestry' | 'bamboo' | 'reforestation' | 'medicinal';

export interface MaintenanceSupportTier {
  year: number;
  amountPerAcre: number;
  targetSurvivalRate: number; // e.g. 80%
  description: string;
}

export interface PlantationProgram {
  id: string;
  name: string;
  speciesName: string;
  botanicalName: string;
  type: PlantationType;
  suitableAgroClimaticZones: string[];
  spacing: string;
  pitSize: string;
  saplingsPerAcre: number;
  plantingSeason: string;
  saplingCost: number;
  subsidyPerPlantOrAcre: string;
  subsidyScheme: string;
  maintenanceSupportYears: number;
  maintenanceSchedule: MaintenanceSupportTier[];
  commercialGestationYears: number;
  expectedReturnsPerAcre: string;
  careGuidelines: string[];
  participatingNurseries: {
    id: string;
    name: string;
    type: 'Govt Department Nursery' | 'Certified Private Nursery';
    district: string;
    state: string;
    stockCount: number;
    contact: string;
  }[];
}

export interface SaplingBooking {
  id: string;
  farmerName: string;
  programId: string;
  speciesName: string;
  saplingCount: number;
  nurseryId: string;
  nurseryName: string;
  totalAmount: number;
  subsidyAmount: number;
  farmerPayable: number;
  bookingDate: string;
  status: 'confirmed' | 'ready_for_dispatch' | 'delivered';
}

// ─── Application & Workflow ───────────────────────────────────────
export type ApplicationStatus =
  | 'submitted'
  | 'under_verification'
  | 'field_inspected'
  | 'district_approved'
  | 'sanctioned'
  | 'dbt_disbursed'
  | 'rejected';

export interface ApplicationTimelineEvent {
  stage: string;
  timestamp: string;
  officerName?: string;
  officerDesignation?: string;
  remarks: string;
  completed: boolean;
}

export interface DocumentUpload {
  docType: string;
  fileName: string;
  uploadDate: string;
  verified: boolean;
  fileSizeMb?: number;
}

export interface SchemeApplication {
  id: string; // e.g. AGRI-2026-TN-98241
  schemeId: string;
  schemeCode: string;
  schemeName: string;
  farmerName: string;
  aadhaarMasked: string;
  mobileNumber: string;
  state: string;
  district: string;
  block: string;
  village: string;
  surveyNumber: string;
  landAreaAcres: number;
  category: 'SF/MF' | 'SC' | 'ST' | 'General' | 'OBC' | 'Women';
  subsidyRequestedAmount: number;
  appliedDate: string;
  status: ApplicationStatus;
  timeline: ApplicationTimelineEvent[];
  documentsUploaded: DocumentUpload[];
  sanctionOrderNo?: string;
  dbtUtrNumber?: string;
  dbtDisbursedDate?: string;
  officerRemarks?: string;
}

// ─── Grievances ──────────────────────────────────────────────────
export type GrievanceCategory =
  | 'dbt_delay'
  | 'insurance_claim'
  | 'seed_shortage'
  | 'fertilizer_pricing'
  | 'soil_card'
  | 'solar_pump'
  | 'other';

export type GrievanceStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface GrievanceTicket {
  id: string; // e.g. GRV-2026-1049
  farmerName: string;
  mobile: string;
  state: string;
  district: string;
  category: GrievanceCategory;
  schemeId?: string;
  subject: string;
  description: string;
  filedDate: string;
  status: GrievanceStatus;
  assignedOfficer: string;
  resolutionNotes?: string;
  updatedDate?: string;
}

// ─── DBT Beneficiary Record ──────────────────────────────────────
export interface DbtRecord {
  id: string;
  farmerName: string;
  village: string;
  district: string;
  state: string;
  schemeCode: string;
  schemeName: string;
  installmentNo: string;
  amount: number;
  bankName: string;
  accountMasked: string;
  utrNumber: string;
  disbursedDate: string;
  status: 'credited' | 'processing' | 'failed';
}

// ─── Government Official Resources ────────────────────────────────
export interface GovernmentResource {
  id: string;
  title: string;
  department: string;
  level: 'central' | 'state';
  state?: string;
  category: 'Portal' | 'Circular' | 'Guideline' | 'Form' | 'Helpline' | 'Database';
  url: string;
  description: string;
  helpline?: string;
  lastVerifiedDate: string;
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
  lat?: number;
  lon?: number;
}

export interface State {
  id: string;
  name: string;
  lat?: number;
  lon?: number;
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
  role: UserRole;
  setRole: (r: UserRole) => void;
  t: (key: string) => string;
  resetDemoData: () => void;
}
