import type { GrievanceTicket, GrievanceCategory, GrievanceStatus } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export const INITIAL_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'GRV-2026-1049',
    farmerName: 'Ramasamy K.',
    mobile: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    category: 'dbt_delay',
    schemeId: 'pmkisan',
    subject: '17th PM-KISAN installment delayed due to Aadhaar NPCI bank mapping discrepancy',
    description: 'My PM-KISAN 17th installment of ₹2,000 was not credited to my State Bank account. Bank branch confirms NPCI mapping is active, but portal shows FTO not generated.',
    filedDate: '2026-08-10',
    status: 'resolved',
    assignedOfficer: 'Thiru K. Sundaram, District Nodal Officer (PM-KISAN), Thanjavur',
    resolutionNotes: 'Aadhaar seed mapping re-synchronized on PFMS portal on 14th Aug. Pending installment ₹2,000 credited under UTR Ref: SBIN00293849102.',
    updatedDate: '2026-08-16',
  },
  {
    id: 'GRV-2026-2184',
    farmerName: 'Ramasamy K.',
    mobile: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    category: 'insurance_claim',
    schemeId: 'pmfby',
    subject: 'Delay in localized inundation claim survey following unseasonal rainfall in Cauvery delta',
    description: 'Severe unseasonal rains flooded 1.5 acres of transplanted Samba paddy in Thiruvidaimarudur block. Intimation was filed within 48 hours on Crop Insurance App, but surveyor visit has been delayed beyond 7 days.',
    filedDate: '2026-09-04',
    status: 'in_progress',
    assignedOfficer: 'Thiru P. Arulmozhi, AIC District Loss Assessor & AAO',
    resolutionNotes: 'Loss assessor visited on 12th Sept; joint assessment report uploaded with 40% inundated loss recommendation.',
    updatedDate: '2026-09-14',
  },
  {
    id: 'GRV-2026-3091',
    farmerName: 'Ramasamy K.',
    mobile: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    category: 'seed_shortage',
    schemeId: 'tn-kaviadp',
    subject: 'Certified CO 51 paddy seed stock exhausted at Sakkottai Agricultural Extension Centre',
    description: 'Visited Agricultural Extension Centre on Monday for subsidized CO 51 paddy seeds for Kuruvai sowing, but stock was out. Need 30 kg certified seed quota.',
    filedDate: '2026-09-25',
    status: 'open',
    assignedOfficer: 'Assistant Director of Agriculture (ADA), Kumbakonam Block',
    resolutionNotes: 'Additional 10 quintals CO 51 dispatched from TNAU Seed Centre; farmer notified to pick up quota on Friday.',
    updatedDate: '2026-09-26',
  },
];

export function getGrievances(): GrievanceTicket[] {
  return storageGet(STORAGE_KEYS.GRIEVANCES, INITIAL_GRIEVANCES);
}

export function saveGrievances(tickets: GrievanceTicket[]): void {
  storageSet(STORAGE_KEYS.GRIEVANCES, tickets);
}

export function createGrievance(data: {
  farmerName: string;
  mobile: string;
  state: string;
  district: string;
  category: GrievanceCategory;
  schemeId?: string;
  subject: string;
  description: string;
}): GrievanceTicket {
  const current = getGrievances();
  const tokenNumber = Math.floor(1000 + Math.random() * 9000);
  const newTicket: GrievanceTicket = {
    ...data,
    id: `GRV-2026-${tokenNumber}`,
    filedDate: new Date().toISOString().split('T')[0],
    status: 'open',
    assignedOfficer: 'District Grievance Redressal Cell (Agriculture)',
    resolutionNotes: 'Grievance registered. Acknowledgment SMS sent to farmer mobile. Under review.',
    updatedDate: new Date().toISOString().split('T')[0],
  };

  const updated = [newTicket, ...current];
  saveGrievances(updated);
  return newTicket;
}

export function updateGrievanceStatus(
  id: string,
  newStatus: GrievanceStatus,
  resolutionNotes: string
): GrievanceTicket | undefined {
  const current = getGrievances();
  const idx = current.findIndex(g => g.id === id);
  if (idx === -1) return undefined;

  const ticket = current[idx];
  const updatedTicket: GrievanceTicket = {
    ...ticket,
    status: newStatus,
    resolutionNotes: resolutionNotes,
    updatedDate: new Date().toISOString().split('T')[0],
  };

  current[idx] = updatedTicket;
  saveGrievances(current);
  return updatedTicket;
}
