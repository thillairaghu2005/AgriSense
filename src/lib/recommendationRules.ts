import type { CropRecommendationInput, CropRecommendation } from '@/types';
import { CROPS } from '@/data/crops';

export function generateRecommendations(input: CropRecommendationInput): CropRecommendation[] {
  const recommendations: CropRecommendation[] = [];

  for (const crop of CROPS) {
    // Must match season
    if (!crop.seasons.includes(input.season) && input.season !== 'annual' && !crop.seasons.includes('annual')) {
      continue;
    }

    let score = 0;
    const reasons: string[] = [];
    const assumptions: string[] = [];
    const missingData: string[] = [];

    // Soil match
    if (crop.suitableSoils.includes(input.soilType)) {
      score += 30;
      reasons.push(`${input.soilType.charAt(0).toUpperCase() + input.soilType.slice(1)} soil is suitable for this crop.`);
    } else {
      score += 5;
      assumptions.push(`Soil type "${input.soilType}" may not be optimal; crop may still grow with amendments.`);
    }

    // Season match
    if (crop.seasons.includes(input.season)) {
      score += 25;
      reasons.push(`${input.season.charAt(0).toUpperCase() + input.season.slice(1)} is a recommended season for this crop.`);
    }

    // pH match
    if (input.soilPh !== undefined) {
      if (input.soilPh >= crop.idealPhRange[0] && input.soilPh <= crop.idealPhRange[1]) {
        score += 20;
        reasons.push(`Your soil pH (${input.soilPh}) falls within the ideal range (${crop.idealPhRange[0]}–${crop.idealPhRange[1]}).`);
      } else {
        score -= 10;
        assumptions.push(`Soil pH (${input.soilPh}) is outside ideal range (${crop.idealPhRange[0]}–${crop.idealPhRange[1]}). Soil amendments may be needed.`);
      }
    } else {
      score += 10; // neutral
      missingData.push('soil pH');
      assumptions.push(`pH not provided — assumed to be within an acceptable range for this crop.`);
    }

    // State suitability
    if (crop.suitableStates.includes(input.state)) {
      score += 15;
      reasons.push(`This crop is commonly grown in the selected state.`);
    } else {
      assumptions.push(`This crop may not be common in your state but can be tried under suitable conditions.`);
    }

    // NPK: simple heuristic
    if (!input.nitrogenLevel) missingData.push('nitrogen level');
    if (!input.phosphorusLevel) missingData.push('phosphorus level');
    if (!input.potassiumLevel) missingData.push('potassium level');

    score = Math.min(100, Math.max(0, score));

    if (score >= 20) {
      recommendations.push({
        cropId: crop.id,
        score,
        reasons,
        assumptions,
        missingData,
        estimatedDurationDays: crop.durationDays,
        waterNeedsMmPerSeason: crop.waterNeedsMmPerSeason,
        cultivationNotes: crop.sowingGuidance,
      });
    }
  }

  // Sort by score descending, return top 3
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
}
