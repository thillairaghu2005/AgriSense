import type { State } from '@/types';

export const STATES: State[] = [
  {
    id: 'tn',
    name: 'Tamil Nadu',
    lat: 11.1271,
    lon: 78.6569,
    districts: [
      { id: 'tn-coimbatore', name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
      { id: 'tn-madurai', name: 'Madurai', lat: 9.9252, lon: 78.1198 },
      { id: 'tn-tiruchirappalli', name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047 },
      { id: 'tn-salem', name: 'Salem', lat: 11.6643, lon: 78.1460 },
      { id: 'tn-tirunelveli', name: 'Tirunelveli', lat: 8.7139, lon: 77.7567 },
      { id: 'tn-thanjavur', name: 'Thanjavur', lat: 10.7870, lon: 79.1378 },
      { id: 'tn-erode', name: 'Erode', lat: 11.3410, lon: 77.7172 },
      { id: 'tn-vellore', name: 'Vellore', lat: 12.9165, lon: 79.1325 },
    ],
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    lat: 19.7515,
    lon: 75.7139,
    districts: [
      { id: 'mh-pune', name: 'Pune', lat: 18.5204, lon: 73.8567 },
      { id: 'mh-nagpur', name: 'Nagpur', lat: 21.1458, lon: 79.0882 },
      { id: 'mh-nashik', name: 'Nashik', lat: 19.9975, lon: 73.7898 },
      { id: 'mh-aurangabad', name: 'Aurangabad', lat: 19.8762, lon: 75.3433 },
      { id: 'mh-solapur', name: 'Solapur', lat: 17.6599, lon: 75.9064 },
      { id: 'mh-amravati', name: 'Amravati', lat: 20.9374, lon: 77.7796 },
    ],
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    lat: 26.8467,
    lon: 80.9462,
    districts: [
      { id: 'up-lucknow', name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
      { id: 'up-agra', name: 'Agra', lat: 27.1767, lon: 78.0081 },
      { id: 'up-varanasi', name: 'Varanasi', lat: 25.3176, lon: 82.9739 },
      { id: 'up-meerut', name: 'Meerut', lat: 28.9845, lon: 77.7064 },
      { id: 'up-kanpur', name: 'Kanpur', lat: 26.4499, lon: 80.3319 },
      { id: 'up-allahabad', name: 'Prayagraj', lat: 25.4358, lon: 81.8463 },
    ],
  },
  {
    id: 'ap',
    name: 'Andhra Pradesh',
    lat: 15.9129,
    lon: 79.7400,
    districts: [
      { id: 'ap-guntur', name: 'Guntur', lat: 16.3067, lon: 80.4365 },
      { id: 'ap-krishna', name: 'Krishna', lat: 16.2160, lon: 80.8400 },
      { id: 'ap-kurnool', name: 'Kurnool', lat: 15.8281, lon: 78.0373 },
      { id: 'ap-visakhapatnam', name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
      { id: 'ap-westgodavari', name: 'West Godavari', lat: 16.7107, lon: 81.0952 },
    ],
  },
  {
    id: 'ts',
    name: 'Telangana',
    lat: 18.1124,
    lon: 79.0193,
    districts: [
      { id: 'ts-hyderabad', name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
      { id: 'ts-warangal', name: 'Warangal', lat: 17.9784, lon: 79.5941 },
      { id: 'ts-karimnagar', name: 'Karimnagar', lat: 18.4386, lon: 79.1288 },
      { id: 'ts-nizamabad', name: 'Nizamabad', lat: 18.6725, lon: 78.0941 },
    ],
  },
  {
    id: 'ka',
    name: 'Karnataka',
    lat: 15.3173,
    lon: 75.7139,
    districts: [
      { id: 'ka-bangalore', name: 'Bangalore Rural', lat: 13.2847, lon: 77.5857 },
      { id: 'ka-mysore', name: 'Mysore', lat: 12.2958, lon: 76.6394 },
      { id: 'ka-hubli', name: 'Dharwad', lat: 15.4589, lon: 75.0078 },
      { id: 'ka-belgaum', name: 'Belagavi', lat: 15.8497, lon: 74.4977 },
      { id: 'ka-tumkur', name: 'Tumkur', lat: 13.3422, lon: 77.1017 },
    ],
  },
  {
    id: 'pb',
    name: 'Punjab',
    lat: 31.1471,
    lon: 75.3412,
    districts: [
      { id: 'pb-ludhiana', name: 'Ludhiana', lat: 30.9010, lon: 75.8573 },
      { id: 'pb-amritsar', name: 'Amritsar', lat: 31.6340, lon: 74.8723 },
      { id: 'pb-jalandhar', name: 'Jalandhar', lat: 31.3260, lon: 75.5762 },
      { id: 'pb-patiala', name: 'Patiala', lat: 30.3398, lon: 76.3869 },
    ],
  },
  {
    id: 'hr',
    name: 'Haryana',
    lat: 29.0588,
    lon: 76.0856,
    districts: [
      { id: 'hr-hisar', name: 'Hisar', lat: 29.1492, lon: 75.7217 },
      { id: 'hr-rohtak', name: 'Rohtak', lat: 28.8955, lon: 76.6066 },
      { id: 'hr-karnal', name: 'Karnal', lat: 29.6857, lon: 76.9905 },
      { id: 'hr-ambala', name: 'Ambala', lat: 30.3782, lon: 76.7767 },
    ],
  },
  {
    id: 'gj',
    name: 'Gujarat',
    lat: 22.2587,
    lon: 71.1924,
    districts: [
      { id: 'gj-ahmedabad', name: 'Ahmedabad', lat: 23.0225, lon: 72.5714 },
      { id: 'gj-surat', name: 'Surat', lat: 21.1702, lon: 72.8311 },
      { id: 'gj-rajkot', name: 'Rajkot', lat: 22.3039, lon: 70.8022 },
      { id: 'gj-vadodara', name: 'Vadodara', lat: 22.3072, lon: 73.1812 },
      { id: 'gj-junagadh', name: 'Junagadh', lat: 21.5222, lon: 70.4579 },
    ],
  },
  {
    id: 'wb',
    name: 'West Bengal',
    lat: 22.9868,
    lon: 87.8550,
    districts: [
      { id: 'wb-kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
      { id: 'wb-murshidabad', name: 'Murshidabad', lat: 24.1750, lon: 88.2800 },
      { id: 'wb-bardhaman', name: 'Bardhaman', lat: 23.2324, lon: 87.8615 },
      { id: 'wb-nadia', name: 'Nadia', lat: 23.4710, lon: 88.5565 },
    ],
  },
];

export function getStateById(id: string): State | undefined {
  return STATES.find(s => s.id === id);
}

export function getDistrictsByState(stateId: string) {
  return STATES.find(s => s.id === stateId)?.districts ?? [];
}

export function getLocationCoordinates(stateId?: string, districtId?: string): { lat: number; lon: number; label: string } {
  const state = STATES.find(s => s.id === stateId) ?? STATES[0];
  if (districtId) {
    const district = state.districts.find(d => d.id === districtId);
    if (district && district.lat && district.lon) {
      return { lat: district.lat, lon: district.lon, label: `${district.name}, ${state.name}` };
    }
  }
  return {
    lat: state.lat ?? 11.1271,
    lon: state.lon ?? 78.6569,
    label: state.name,
  };
}
