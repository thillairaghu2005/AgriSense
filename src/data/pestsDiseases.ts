import type { PestDisease } from '@/types';

export const PESTS_DISEASES: PestDisease[] = [
  {
    id: 'rice-blast',
    name: 'Rice Blast',
    type: 'disease',
    affectedCropIds: ['rice'],
    symptoms: [
      'Diamond-shaped lesions with grey/white centres on leaves',
      'Dark brown borders around lesions',
      'Lesions on neck of panicle (neck rot) causing chaffy grains',
      'Collar rot at leaf sheath junction',
    ],
    causes: 'Fungal pathogen Magnaporthe oryzae. Favoured by cool nights, warm days, high humidity, and excess nitrogen fertiliser.',
    prevention: [
      'Use blast-resistant varieties',
      'Avoid excess nitrogen application',
      'Ensure proper spacing for air circulation',
      'Use balanced fertilisation',
      'Destroy stubble and ratoon after harvest',
    ],
    management: 'Consult local agricultural extension officer for approved fungicide recommendations. Avoid applying fungicides during flowering. General management includes timely application of systemic fungicides at early disease detection. Do not rely on this description as a prescription.',
    severity: 'high',
  },
  {
    id: 'brown-planthopper',
    name: 'Brown Planthopper (BPH)',
    type: 'pest',
    affectedCropIds: ['rice'],
    symptoms: [
      'Circular yellowing and wilting patches ("hopper burn")',
      'Brown insects clustered at base of plant near water line',
      'Plants dry out rapidly in affected patches',
      'Sticky honeydew on plants leads to sooty mould',
    ],
    causes: 'Nilaparvata lugens. Both nymphs and adults suck plant sap. Favoured by dense canopy, excess nitrogen, and pesticide-induced resurgence.',
    prevention: [
      'Plant resistant varieties',
      'Avoid excessive nitrogen',
      'Maintain field sanitation',
      'Avoid broad-spectrum insecticides that destroy natural enemies',
      'Use pheromone traps for monitoring',
    ],
    management: 'Consult local extension for recommended neonicotinoid or other approved insecticide when economic threshold is exceeded. Preserve natural enemies (spiders, carabid beetles). Pesticide misuse causes BPH resurgence.',
    severity: 'high',
  },
  {
    id: 'cotton-bollworm',
    name: 'Pink Bollworm',
    type: 'pest',
    affectedCropIds: ['cotton'],
    symptoms: [
      'Entry holes in flowers and young bolls',
      'Rosetted flowers (failed to open properly)',
      'Pink-coloured larvae inside bolls',
      'Internal boll damage reducing fibre quality',
    ],
    causes: 'Pectinophora gossypiella larvae. Major pest of cotton. Populations increase with delayed harvest and ratoon cotton.',
    prevention: [
      'Use Bt cotton varieties',
      'Early sowing and early harvest to avoid pest buildup',
      'Destroy crop stubble immediately after harvest',
      'Avoid ratoon cotton in affected areas',
      'Use pheromone traps for monitoring',
    ],
    management: 'Spray recommended insecticides when trap catches exceed action threshold. Consult local agriculture officer. Avoid repeated use of same chemical class.',
    severity: 'high',
  },
  {
    id: 'late-blight-tomato',
    name: 'Late Blight of Tomato',
    type: 'disease',
    affectedCropIds: ['tomato'],
    symptoms: [
      'Water-soaked, dark green to brown lesions on leaves',
      'White fungal growth on undersides of leaves in humid conditions',
      'Brown lesions on fruit surface; fruit becomes soft and rotten',
      'Rapid spread in cool, moist weather',
    ],
    causes: 'Phytophthora infestans. Spreads rapidly in cool (10–15°C nights), wet, and humid conditions.',
    prevention: [
      'Use certified disease-free seeds and transplants',
      'Avoid overhead irrigation; use drip',
      'Ensure good air circulation with correct spacing',
      'Remove and destroy infected plant material',
      'Use resistant varieties where available',
    ],
    management: 'Apply copper-based or systemic fungicides preventively in high-risk periods. Rotate chemical groups. Consult local extension for approved product list and dosage guidance.',
    severity: 'high',
  },
  {
    id: 'aphids',
    name: 'Aphids',
    type: 'pest',
    affectedCropIds: ['wheat', 'cotton', 'tomato', 'chickpea'],
    symptoms: [
      'Colonies of small soft-bodied insects on young shoots and undersides of leaves',
      'Curling, yellowing, or distorted leaves',
      'Sticky honeydew deposits on leaves',
      'Black sooty mould on honeydew deposits',
      'Ants tending aphid colonies',
    ],
    causes: 'Various aphid species. Vector for viral diseases. Populations explode in dry warm conditions and when natural enemies are absent.',
    prevention: [
      'Preserve natural enemies (ladybirds, lacewings, parasitic wasps)',
      'Avoid broad-spectrum insecticides early in season',
      'Use yellow sticky traps for monitoring',
      'Intercrop with repellent plants where feasible',
    ],
    management: 'For moderate infestations, use water jet or neem-based sprays. For severe infestations, consult local extension for approved systemic or contact insecticides. Always follow label directions.',
    severity: 'medium',
  },
  {
    id: 'fall-armyworm',
    name: 'Fall Armyworm (FAW)',
    type: 'pest',
    affectedCropIds: ['maize'],
    symptoms: [
      'Window-pane feeding on young leaves',
      'Pin-hole and ragged leaf damage',
      'Frass (excrement) visible inside leaf whorls',
      'Caterpillars with inverted Y mark on head capsule',
      'Damage to tassels and silk',
    ],
    causes: 'Spodoptera frugiperda. Invasive pest spreading across India. Larvae bore into maize whorl and can cause significant yield loss.',
    prevention: [
      'Early sowing to escape peak pest pressure',
      'Use egg mass parasitoids and entomopathogenic fungi where available',
      'Apply sand or soil into whorl for young caterpillars',
      'Pheromone traps for adult monitoring',
    ],
    management: 'Apply approved insecticides into maize whorl when infestation exceeds threshold (10% damaged plants in vegetative stage). Rotate chemical groups to prevent resistance. Consult local extension office.',
    severity: 'high',
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    type: 'disease',
    affectedCropIds: ['wheat', 'chickpea'],
    symptoms: [
      'White powdery growth on upper leaf surfaces',
      'Infected leaves turn yellow and senesce prematurely',
      'Powdery patches on stems and heads in severe cases',
      'Yield loss through reduced photosynthesis',
    ],
    causes: 'Blumeria graminis (wheat) or Erysiphe cichoracearum (other crops). Favoured by cool, humid weather with moderate temperatures.',
    prevention: [
      'Use resistant varieties',
      'Avoid excess nitrogen',
      'Ensure good air circulation',
      'Remove crop debris after harvest',
    ],
    management: 'Apply approved fungicides (sulphur-based or systemic triazoles) at early disease onset. Two to three sprays at 10-day intervals may be needed. Consult local extension for approved schedule.',
    severity: 'medium',
  },
  {
    id: 'onion-thrips',
    name: 'Thrips (Onion)',
    type: 'pest',
    affectedCropIds: ['onion'],
    symptoms: [
      'Silver-white patches and streaks on leaves',
      'Leaves curl and distort under severe infestation',
      'Tiny yellow-brown insects visible inside leaf folds',
      'Stunted plant growth',
    ],
    causes: 'Thrips tabaci. Piercing-sucking pest. Populations spike in dry, hot conditions.',
    prevention: [
      'Intercrop with coriander to attract predatory insects',
      'Maintain proper soil moisture to reduce dust',
      'Use blue sticky traps for monitoring and control',
      'Avoid pesticide misuse that destroys natural enemies',
    ],
    management: 'Apply recommended insecticides when threshold (5 thrips per leaf) is exceeded. Target spray inside leaf folds. Rotate chemical groups. Consult local extension.',
    severity: 'medium',
  },
];

export function searchPestsDiseases(query: string, cropId?: string, type?: string): PestDisease[] {
  const q = query.toLowerCase().trim();
  return PESTS_DISEASES.filter(pd => {
    const matchesQuery = !q || pd.name.toLowerCase().includes(q) || pd.symptoms.some(s => s.toLowerCase().includes(q));
    const matchesCrop = !cropId || pd.affectedCropIds.includes(cropId);
    const matchesType = !type || pd.type === type;
    return matchesQuery && matchesCrop && matchesType;
  });
}
