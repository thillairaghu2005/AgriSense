import type { State } from '@/types';

export const STATES: State[] = [
  {
    id: 'tn',
    name: 'Tamil Nadu',
    districts: [
      { id: 'tn-coimbatore', name: 'Coimbatore' },
      { id: 'tn-madurai', name: 'Madurai' },
      { id: 'tn-tiruchirappalli', name: 'Tiruchirappalli' },
      { id: 'tn-salem', name: 'Salem' },
      { id: 'tn-tirunelveli', name: 'Tirunelveli' },
      { id: 'tn-thanjavur', name: 'Thanjavur' },
      { id: 'tn-erode', name: 'Erode' },
      { id: 'tn-vellore', name: 'Vellore' },
    ],
  },
  {
    id: 'mh',
    name: 'Maharashtra',
    districts: [
      { id: 'mh-pune', name: 'Pune' },
      { id: 'mh-nagpur', name: 'Nagpur' },
      { id: 'mh-nashik', name: 'Nashik' },
      { id: 'mh-aurangabad', name: 'Aurangabad' },
      { id: 'mh-solapur', name: 'Solapur' },
      { id: 'mh-amravati', name: 'Amravati' },
    ],
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    districts: [
      { id: 'up-lucknow', name: 'Lucknow' },
      { id: 'up-agra', name: 'Agra' },
      { id: 'up-varanasi', name: 'Varanasi' },
      { id: 'up-meerut', name: 'Meerut' },
      { id: 'up-kanpur', name: 'Kanpur' },
      { id: 'up-allahabad', name: 'Prayagraj' },
    ],
  },
  {
    id: 'ap',
    name: 'Andhra Pradesh',
    districts: [
      { id: 'ap-guntur', name: 'Guntur' },
      { id: 'ap-krishna', name: 'Krishna' },
      { id: 'ap-kurnool', name: 'Kurnool' },
      { id: 'ap-visakhapatnam', name: 'Visakhapatnam' },
      { id: 'ap-westgodavari', name: 'West Godavari' },
    ],
  },
  {
    id: 'ts',
    name: 'Telangana',
    districts: [
      { id: 'ts-hyderabad', name: 'Hyderabad' },
      { id: 'ts-warangal', name: 'Warangal' },
      { id: 'ts-karimnagar', name: 'Karimnagar' },
      { id: 'ts-nizamabad', name: 'Nizamabad' },
    ],
  },
  {
    id: 'ka',
    name: 'Karnataka',
    districts: [
      { id: 'ka-bangalore', name: 'Bangalore Rural' },
      { id: 'ka-mysore', name: 'Mysore' },
      { id: 'ka-hubli', name: 'Dharwad' },
      { id: 'ka-belgaum', name: 'Belagavi' },
      { id: 'ka-tumkur', name: 'Tumkur' },
    ],
  },
  {
    id: 'pb',
    name: 'Punjab',
    districts: [
      { id: 'pb-ludhiana', name: 'Ludhiana' },
      { id: 'pb-amritsar', name: 'Amritsar' },
      { id: 'pb-jalandhar', name: 'Jalandhar' },
      { id: 'pb-patiala', name: 'Patiala' },
    ],
  },
  {
    id: 'hr',
    name: 'Haryana',
    districts: [
      { id: 'hr-hisar', name: 'Hisar' },
      { id: 'hr-rohtak', name: 'Rohtak' },
      { id: 'hr-karnal', name: 'Karnal' },
      { id: 'hr-ambala', name: 'Ambala' },
    ],
  },
  {
    id: 'gj',
    name: 'Gujarat',
    districts: [
      { id: 'gj-ahmedabad', name: 'Ahmedabad' },
      { id: 'gj-surat', name: 'Surat' },
      { id: 'gj-rajkot', name: 'Rajkot' },
      { id: 'gj-vadodara', name: 'Vadodara' },
      { id: 'gj-junagadh', name: 'Junagadh' },
    ],
  },
  {
    id: 'wb',
    name: 'West Bengal',
    districts: [
      { id: 'wb-kolkata', name: 'Kolkata' },
      { id: 'wb-murshidabad', name: 'Murshidabad' },
      { id: 'wb-bardhaman', name: 'Bardhaman' },
      { id: 'wb-nadia', name: 'Nadia' },
    ],
  },
];

export function getStateById(id: string): State | undefined {
  return STATES.find(s => s.id === id);
}

export function getDistrictsByState(stateId: string) {
  return STATES.find(s => s.id === stateId)?.districts ?? [];
}
