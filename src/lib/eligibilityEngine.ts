import type { FarmerProfile, Scheme } from '@/types';

export interface EligibilityResult {
  scheme: Scheme;
  matchScore: number; // 0 - 100
  isEligible: boolean;
  passedCriteria: string[];
  warnings: string[];
  failedCriteria: string[];
  estimatedSubsidy?: string;
}

export function evaluateEligibility(farmer: FarmerProfile, scheme: Scheme): EligibilityResult {
  let score = 100;
  const passed: string[] = [];
  const warnings: string[] = [];
  const failed: string[] = [];

  // Convert land area to standard acres if needed
  let landInAcres = farmer.landArea;
  if (farmer.landAreaUnit === 'hectares') {
    landInAcres = farmer.landArea * 2.47105;
  } else if (farmer.landAreaUnit === 'bigha') {
    landInAcres = farmer.landArea * 0.625; // standard approximation
  }

  // 1. State Applicability
  if (scheme.stateApplicability && scheme.stateApplicability.length > 0) {
    if (scheme.stateApplicability.includes(farmer.state)) {
      passed.push(`Resident in eligible state: ${farmer.state.toUpperCase()}`);
    } else {
      failed.push(`Scheme is only applicable in: ${scheme.stateApplicability.map(s => s.toUpperCase()).join(', ')}`);
      score -= 50;
    }
  } else {
    passed.push('Central Scheme: Open to all Indian States & Union Territories');
  }

  // 2. Land Area limits
  const rules = scheme.eligibilityRules;
  if (rules?.maxLandAcres != null) {
    if (landInAcres <= rules.maxLandAcres) {
      passed.push(`Land area (${landInAcres.toFixed(1)} acres) meets ceiling of ${rules.maxLandAcres} acres`);
    } else {
      failed.push(`Land area (${landInAcres.toFixed(1)} acres) exceeds maximum ceiling of ${rules.maxLandAcres} acres`);
      score -= 40;
    }
  }

  if (rules?.minLandAcres != null) {
    if (landInAcres >= rules.minLandAcres) {
      passed.push(`Land area (${landInAcres.toFixed(1)} acres) meets minimum requirement of ${rules.minLandAcres} acres`);
    } else {
      failed.push(`Land area (${landInAcres.toFixed(1)} acres) is below minimum required of ${rules.minLandAcres} acres`);
      score -= 35;
    }
  }

  // 3. Farmer Category
  const farmerCat = farmer.farmerCategory || (landInAcres <= 2.5 ? 'marginal' : landInAcres <= 5.0 ? 'small' : 'medium');
  if (rules?.farmerCategories && rules.farmerCategories.length > 0 && !rules.farmerCategories.includes('all')) {
    const isCatMatched =
      rules.farmerCategories.includes(farmerCat as any) ||
      (farmer.gender === 'female' && rules.farmerCategories.includes('women')) ||
      ((farmer.socialCategory === 'sc' || farmer.socialCategory === 'st') && rules.farmerCategories.includes('sc_st'));

    if (isCatMatched) {
      passed.push(`Category '${farmerCat.toUpperCase()}' qualifies for preferential allocation`);
    } else {
      warnings.push(`Scheme gives priority to ${rules.farmerCategories.join(', ')}`);
      score -= 15;
    }
  } else {
    passed.push('Open to all farmer landholding classes');
  }

  // 4. Irrigation source
  if (rules?.irrigationRequired) {
    if (farmer.irrigationSource && farmer.irrigationSource !== 'rainfed') {
      passed.push(`Water source verified: ${farmer.irrigationSource.toUpperCase()}`);
    } else {
      warnings.push('Requires verified water source (borewell/open well/canal/farm pond)');
      score -= 20;
    }
  }

  // 5. Documentation readiness
  if (farmer.pattaNumber || farmer.surveyNumber) {
    passed.push(`Land record identified: ${farmer.surveyNumber || farmer.pattaNumber}`);
  } else {
    warnings.push('Land record survey number / Khasra needs to be updated in profile');
    score -= 10;
  }

  if (farmer.aadhaarMasked && farmer.bankAccountMasked) {
    passed.push('Aadhaar-linked active bank account verified for Direct Benefit Transfer (DBT)');
  } else {
    warnings.push('Ensure bank account is Aadhaar-seeded for DBT disbursal');
    score -= 5;
  }

  const finalScore = Math.max(0, Math.min(100, score));
  const isEligible = failed.length === 0 && finalScore >= 60;

  return {
    scheme,
    matchScore: finalScore,
    isEligible,
    passedCriteria: passed,
    warnings,
    failedCriteria: failed,
    estimatedSubsidy: scheme.subsidyPercentage ? `${scheme.subsidyPercentage} (${scheme.maxBenefitAmount || 'Standard Norm'})` : scheme.maxBenefitAmount,
  };
}

export function getRecommendedSchemes(farmer: FarmerProfile, allSchemes: Scheme[]): EligibilityResult[] {
  return allSchemes
    .map(scheme => evaluateEligibility(farmer, scheme))
    .sort((a, b) => b.matchScore - a.matchScore);
}
