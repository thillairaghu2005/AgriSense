import type { SchemeApplication, ApplicationStatus } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

export const INITIAL_APPLICATIONS: SchemeApplication[] = [
  {
    id: 'AGRI-2026-TN-98241',
    schemeId: 'tn-drip',
    schemeCode: 'TN-MICRO-IRRIGATION',
    schemeName: 'Tamil Nadu Comprehensive Micro Irrigation Scheme (100% SF/MF Subsidy)',
    farmerName: 'Ramasamy K.',
    aadhaarMasked: 'XXXX-XXXX-4892',
    mobileNumber: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    block: 'Kumbakonam',
    village: 'Thiruvidaimarudur',
    surveyNumber: '142/3A',
    landAreaAcres: 2.5,
    category: 'SF/MF',
    subsidyRequestedAmount: 85000,
    appliedDate: '2026-08-14T09:30:00Z',
    status: 'dbt_disbursed',
    timeline: [
      {
        stage: 'Application Submitted',
        timestamp: '2026-08-14 09:30',
        officerName: 'Self-Registered via Uzhavan App',
        remarks: 'Online application submitted with Patta/Chitta and water source certificate.',
        completed: true,
      },
      {
        stage: 'Block Document Verification',
        timestamp: '2026-08-18 11:15',
        officerName: 'Thiru R. Muruganathan',
        officerDesignation: 'Assistant Agricultural Officer (AAO), Kumbakonam',
        remarks: 'Land title and Small Farmer status (< 5 acres) verified via Tamil Nilam portal.',
        completed: true,
      },
      {
        stage: 'Field Inspection & Geotagging',
        timestamp: '2026-08-25 15:40',
        officerName: 'Er. S. Anandhan',
        officerDesignation: 'Assistant Agricultural Engineer (AED), Thanjavur',
        remarks: 'Borewell yield verified (3.5 inch output). Drip layout plan prepared for 2.5 acres Banana.',
        completed: true,
      },
      {
        stage: 'District Committee Sanction',
        timestamp: '2026-09-02 10:20',
        officerName: 'Dr. M. Senthamizhan',
        officerDesignation: 'Assistant Director of Horticulture (ADH), Thanjavur',
        remarks: 'Sanction order approved under 100% state-central micro-irrigation quota.',
        completed: true,
      },
      {
        stage: 'Equipment Installation & Geotag',
        timestamp: '2026-09-15 16:00',
        officerName: 'Jain Irrigation Systems Ltd Empaneled Engineer',
        remarks: 'Drip laterals, sand filter, and venturi injector installed and water pressure tested.',
        completed: true,
      },
      {
        stage: 'DBT Settlement',
        timestamp: '2026-09-22 14:10',
        officerName: 'State Treasury PFMS Gateway',
        remarks: 'Full 100% subsidy ₹85,000 credited to vendor account; zero farmer contribution receipt generated.',
        completed: true,
      },
    ],
    documentsUploaded: [
      { docType: 'Patta / Chitta', fileName: 'patta_chitta_142_3a.pdf', uploadDate: '2026-08-14', verified: true, fileSizeMb: 1.2 },
      { docType: 'Aadhaar Card', fileName: 'aadhaar_card_masked.pdf', uploadDate: '2026-08-14', verified: true, fileSizeMb: 0.8 },
      { docType: 'Small Farmer Certificate', fileName: 'sf_certificate_tahsildar.pdf', uploadDate: '2026-08-14', verified: true, fileSizeMb: 0.9 },
      { docType: 'Water Source Certificate', fileName: 'tneb_eb_bill_borewell.pdf', uploadDate: '2026-08-14', verified: true, fileSizeMb: 0.5 },
    ],
    sanctionOrderNo: 'TN/MI/THJ/2026/08912',
    dbtUtrNumber: 'PFMS202609228812903',
    dbtDisbursedDate: '2026-09-22',
    officerRemarks: 'All components functional with 5-year manufacturer replacement warranty.',
  },
  {
    id: 'AGRI-2026-TN-61042',
    schemeId: 'smam',
    schemeCode: 'SMAM',
    schemeName: 'Sub-Mission on Agricultural Mechanization (50% Power Tiller Subsidy)',
    farmerName: 'Ramasamy K.',
    aadhaarMasked: 'XXXX-XXXX-4892',
    mobileNumber: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    block: 'Kumbakonam',
    village: 'Thiruvidaimarudur',
    surveyNumber: '142/3A',
    landAreaAcres: 2.5,
    category: 'SF/MF',
    subsidyRequestedAmount: 75000,
    appliedDate: '2026-09-10T14:00:00Z',
    status: 'district_approved',
    timeline: [
      {
        stage: 'Application Submitted',
        timestamp: '2026-09-10 14:00',
        officerName: 'Self-Registered via agrimachinery.nic.in',
        remarks: 'Applied for 14 HP Rotary Power Tiller with proforma quotation from VST Tillers dealer.',
        completed: true,
      },
      {
        stage: 'Block Document Verification',
        timestamp: '2026-09-16 12:30',
        officerName: 'Thiru K. Saravanan',
        officerDesignation: 'Assistant Executive Engineer (AED), Kumbakonam',
        remarks: 'Landholding records and no-prior machinery subsidy within 5 years verified.',
        completed: true,
      },
      {
        stage: 'District Committee Sanction',
        timestamp: '2026-09-28 15:00',
        officerName: 'Executive Engineer (AED), Thanjavur District',
        remarks: 'Permit slip issued to purchase machine from authorized dealer.',
        completed: true,
      },
      {
        stage: 'Machinery Inspection & Geotag',
        timestamp: 'Pending',
        remarks: 'Awaiting delivery from dealer; inspection scheduled upon arrival.',
        completed: false,
      },
      {
        stage: 'DBT Credit to Bank',
        timestamp: 'Pending',
        remarks: '₹75,000 subsidy will be credited within 10 days of physical engine number verification.',
        completed: false,
      },
    ],
    documentsUploaded: [
      { docType: 'Land Records 7/12 / Chitta', fileName: 'patta_chitta_142_3a.pdf', uploadDate: '2026-09-10', verified: true, fileSizeMb: 1.2 },
      { docType: 'Dealer Proforma Invoice', fileName: 'vst_power_tiller_invoice.pdf', uploadDate: '2026-09-10', verified: true, fileSizeMb: 0.7 },
      { docType: 'Aadhaar Card', fileName: 'aadhaar_card_masked.pdf', uploadDate: '2026-09-10', verified: true, fileSizeMb: 0.8 },
    ],
    sanctionOrderNo: 'SMAM/TN/2026/PERMIT/4481',
    officerRemarks: 'Purchase permit valid up to 45 days. Complete purchase and submit serial number.',
  },
  {
    id: 'AGRI-2026-TN-41908',
    schemeId: 'pmfby',
    schemeCode: 'PMFBY',
    schemeName: 'PMFBY Crop Insurance (Kharif Samba Paddy Cover)',
    farmerName: 'Ramasamy K.',
    aadhaarMasked: 'XXXX-XXXX-4892',
    mobileNumber: '98421-55820',
    state: 'tn',
    district: 'tn-thanjavur',
    block: 'Kumbakonam',
    village: 'Thiruvidaimarudur',
    surveyNumber: '142/3A',
    landAreaAcres: 2.5,
    category: 'SF/MF',
    subsidyRequestedAmount: 78000, // Sum Insured
    appliedDate: '2026-07-28T10:15:00Z',
    status: 'sanctioned',
    timeline: [
      {
        stage: 'Application Submitted',
        timestamp: '2026-07-28 10:15',
        officerName: 'State Bank of India (KCC Auto-Enrolment)',
        remarks: 'Enrolled under PMFBY Kharif 2026 for Samba Paddy (2.5 acres). Premium: ₹1,560 (2% farmer share).',
        completed: true,
      },
      {
        stage: 'Policy Issued',
        timestamp: '2026-08-05 09:00',
        officerName: 'Agriculture Insurance Company of India (AIC)',
        remarks: 'Policy Certificate No AIC/TN/2026/894102 generated; sum insured ₹78,000.',
        completed: true,
      },
      {
        stage: 'Mid-Season Crop Monitoring',
        timestamp: '2026-09-20 11:00',
        officerName: 'Remote Sensing Satellite & WINDS Weather Station',
        remarks: 'Crop health index normal (NDVI 0.68). No localized loss report filed.',
        completed: true,
      },
    ],
    documentsUploaded: [
      { docType: 'Sowing Adangal Certificate', fileName: 'samba_adangal_kumbakonam.pdf', uploadDate: '2026-07-28', verified: true, fileSizeMb: 0.6 },
      { docType: 'Premium Debit Receipt', fileName: 'sbi_premium_receipt.pdf', uploadDate: '2026-07-28', verified: true, fileSizeMb: 0.4 },
    ],
    sanctionOrderNo: 'AIC/TN/2026/894102',
    officerRemarks: 'Active policy cover until harvest and 14 days post-harvest.',
  },
];

export function getApplications(): SchemeApplication[] {
  return storageGet(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
}

export function saveApplications(apps: SchemeApplication[]): void {
  storageSet(STORAGE_KEYS.APPLICATIONS, apps);
}

export function createApplication(data: Omit<SchemeApplication, 'id' | 'appliedDate' | 'status' | 'timeline'>): SchemeApplication {
  const current = getApplications();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const stateCode = (data.state || 'IN').toUpperCase();
  const newApp: SchemeApplication = {
    ...data,
    id: `AGRI-2026-${stateCode}-${randomSuffix}`,
    appliedDate: new Date().toISOString(),
    status: 'submitted',
    timeline: [
      {
        stage: 'Application Submitted',
        timestamp: new Date().toLocaleString(),
        officerName: 'Online Portal',
        remarks: 'Application registered with uploaded land and identity documents. Reference generated.',
        completed: true,
      },
      {
        stage: 'Block Document Verification',
        timestamp: 'Pending',
        remarks: 'Forwarded to Assistant Agricultural Officer (AAO) for land and category verification.',
        completed: false,
      },
      {
        stage: 'Field Inspection & Geotagging',
        timestamp: 'Pending',
        remarks: 'Physical field inspection and GPS geotagging to be scheduled.',
        completed: false,
      },
      {
        stage: 'District Committee Sanction',
        timestamp: 'Pending',
        remarks: 'Approval by District Level Committee chaired by Assistant Director of Agriculture.',
        completed: false,
      },
      {
        stage: 'Direct Benefit Transfer (DBT)',
        timestamp: 'Pending',
        remarks: 'Sanction order issuance and PFMS bank credit.',
        completed: false,
      },
    ],
  };

  const updated = [newApp, ...current];
  saveApplications(updated);
  return newApp;
}

export function updateApplicationStatus(
  id: string,
  newStatus: ApplicationStatus,
  officerRemarks?: string,
  officerName?: string,
  officerDesignation?: string
): SchemeApplication | undefined {
  const current = getApplications();
  const idx = current.findIndex(a => a.id === id);
  if (idx === -1) return undefined;

  const app = current[idx];
  const updatedTimeline = [...app.timeline];

  // Map status to stage title
  const stageTitles: Record<ApplicationStatus, string> = {
    submitted: 'Application Submitted',
    under_verification: 'Block Document Verification',
    field_inspected: 'Field Inspection & Geotagging',
    district_approved: 'District Committee Sanction',
    sanctioned: 'Sanction Order Issued',
    dbt_disbursed: 'Direct Benefit Transfer (DBT)',
    rejected: 'Application Rejected',
  };

  const stageName = stageTitles[newStatus] || newStatus;
  const existingStageIndex = updatedTimeline.findIndex(t => t.stage.toLowerCase().includes(stageName.toLowerCase()));

  const nowFormatted = new Date().toLocaleString();

  if (existingStageIndex !== -1) {
    updatedTimeline[existingStageIndex] = {
      ...updatedTimeline[existingStageIndex],
      timestamp: nowFormatted,
      officerName: officerName || 'Agricultural Officer',
      officerDesignation: officerDesignation || 'Verification Authority',
      remarks: officerRemarks || 'Stage verified and marked completed.',
      completed: true,
    };
  } else {
    updatedTimeline.push({
      stage: stageName,
      timestamp: nowFormatted,
      officerName: officerName || 'Agricultural Officer',
      officerDesignation: officerDesignation || 'Verification Authority',
      remarks: officerRemarks || 'Status updated.',
      completed: true,
    });
  }

  const updatedApp: SchemeApplication = {
    ...app,
    status: newStatus,
    officerRemarks: officerRemarks || app.officerRemarks,
    timeline: updatedTimeline,
  };

  if (newStatus === 'dbt_disbursed' && !updatedApp.dbtUtrNumber) {
    updatedApp.dbtUtrNumber = `PFMS${Date.now().toString().slice(-11)}`;
    updatedApp.dbtDisbursedDate = new Date().toISOString().split('T')[0];
  }

  current[idx] = updatedApp;
  saveApplications(current);
  return updatedApp;
}
