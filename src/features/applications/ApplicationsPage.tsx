import { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApplications, createApplication } from '@/data/applications';
import { SCHEMES } from '@/data/schemes';
import { Card, PageHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import type { SchemeApplication, ApplicationStatus } from '@/types';
import {
  FileText, CheckCircle2, Clock, ShieldCheck, Printer,
  ArrowRight, ArrowLeft, Upload, AlertCircle, FileCheck, Trash2, Loader2
} from 'lucide-react';

export default function ApplicationsPage() {
  const { t, profile, district: selectedDistrict } = useApp();
  const [searchParams] = useSearchParams();
  const applyParam = searchParams.get('apply');

  const [applications, setApplications] = useState<SchemeApplication[]>(() => getApplications());
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isApplying, setIsApplying] = useState<boolean>(() => Boolean(applyParam));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Application Wizard state
  const [step, setStep] = useState(1);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(() => {
    if (applyParam && SCHEMES.some(s => s.id === applyParam)) return applyParam;
    return SCHEMES[0]?.id || '';
  });
  const [applicantName, setApplicantName] = useState(profile.displayName || 'Farmer');
  const [mobile, setMobile] = useState(profile.mobileNumber || '98421-55820');
  const [surveyNumber, setSurveyNumber] = useState(profile.surveyNumber || '142/3A');
  const [landArea, setLandArea] = useState<number>(profile.landArea || 2.5);
  const [category, setCategory] = useState<'SF/MF' | 'SC' | 'ST' | 'General' | 'OBC' | 'Women'>('SF/MF');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; docType: string; fileName: string; fileSizeMb: number; verified: boolean }[]>([
    { id: 'doc-land-record', docType: 'Land Records (Patta / Chitta / 7/12)', fileName: 'land_record.pdf', fileSizeMb: 1.2, verified: true },
    { id: 'doc-aadhaar', docType: 'Aadhaar Card (Masked)', fileName: 'aadhaar_card.pdf', fileSizeMb: 0.8, verified: true },
    { id: 'doc-bank-passbook', docType: 'Bank Account Passbook / Cheque', fileName: 'bank_passbook.pdf', fileSizeMb: 1.4, verified: true },
  ]);
  const [applicationCreated, setApplicationCreated] = useState<SchemeApplication | null>(null);

  // Sync with URL query parameter during render if search param changes
  const [prevApplyParam, setPrevApplyParam] = useState(applyParam);
  if (applyParam !== prevApplyParam) {
    setPrevApplyParam(applyParam);
    if (applyParam && SCHEMES.some(s => s.id === applyParam)) {
      setSelectedSchemeId(applyParam);
      setIsApplying(true);
    }
  }

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const filteredApps = applications.filter(a => {
    const matchesSearch = a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedSchemeObj = SCHEMES.find(s => s.id === selectedSchemeId) || SCHEMES[0];

  function validateStep2(): boolean {
    const errors: Record<string, string> = {};
    if (!applicantName.trim()) errors.applicantName = 'Applicant full name is required.';
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) errors.mobile = 'Enter a valid 10-digit mobile number.';
    if (!surveyNumber.trim()) errors.surveyNumber = 'Survey/Patta number is required for verification.';
    if (!landArea || landArea <= 0) errors.landArea = 'Enter a valid land area in acres.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: { id: string; docType: string; fileName: string; fileSizeMb: number; verified: boolean }[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMb = parseFloat((f.size / (1024 * 1024)).toFixed(2));
      newDocs.push({
        id: `doc-${Date.now()}-${i}-${f.name}`,
        docType: `Supporting Document (${f.name.split('.').pop()?.toUpperCase() || 'DOC'})`,
        fileName: f.name,
        fileSizeMb: sizeMb,
        verified: true,
      });
    }

    setUploadedFiles(prev => [...prev, ...newDocs]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleRemoveFile(id: string) {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }

  function handleCreateApplicationSubmit() {
    setIsSubmitting(true);
    const estAmount = typeof selectedSchemeObj.maxBenefitAmount === 'string'
      ? parseInt(selectedSchemeObj.maxBenefitAmount.replace(/[^0-9]/g, '')) || 50000
      : 50000;

    setTimeout(() => {
      const newApp = createApplication({
        schemeId: selectedSchemeObj.id,
        schemeCode: selectedSchemeObj.code,
        schemeName: selectedSchemeObj.name,
        farmerName: applicantName,
        aadhaarMasked: profile.aadhaarMasked || 'XXXX-XXXX-4892',
        mobileNumber: mobile,
        state: profile.state,
        district: profile.district,
        block: profile.block || 'Taluk Block',
        village: profile.village || 'Panchayat',
        surveyNumber: surveyNumber,
        landAreaAcres: landArea,
        category: category,
        subsidyRequestedAmount: estAmount,
        documentsUploaded: uploadedFiles.map(f => ({
          docType: f.docType,
          fileName: f.fileName,
          uploadDate: new Date().toISOString().split('T')[0],
          verified: f.verified,
          fileSizeMb: f.fileSizeMb,
        })),
        officerRemarks: 'Application submitted successfully via online welfare portal. Document pre-check passed.',
      });

      setApplications(getApplications());
      setApplicationCreated(newApp);
      setSelectedAppId(newApp.id);
      setIsSubmitting(false);
    }, 700);
  }

  function handlePrintReceipt() {
    window.print();
  }

  const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
    submitted: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    under_verification: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    field_inspected: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    district_approved: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    sanctioned: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    dbt_disbursed: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
    rejected: { bg: 'bg-[var(--color-surface-2)]', text: 'text-[var(--color-text-primary)]', border: 'border-[var(--color-border)]' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t('applications.title')}
          subtitle={t('applications.subtitle')}
        />
        <div className="flex items-center gap-2">
          {!isApplying ? (
            <Button
              variant="primary"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => {
                setIsApplying(true);
                setStep(1);
                setApplicationCreated(null);
              }}
            >
              {t('applications.newApplication')}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => {
                setIsApplying(false);
                setApplicationCreated(null);
              }}
            >
              {t('common.back')} to Tracker
            </Button>
          )}
        </div>
      </div>

      {!isApplying ? (
        /* Application Tracker & Detail Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Applications List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('applications.trackStatus')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] transition-all"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer"
                aria-label="Filter applications by status"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="under_verification">Under Verification</option>
                <option value="district_approved">Approved</option>
                <option value="dbt_disbursed">Disbursed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2.5">
              {filteredApps.map(app => {
                const isSelected = app.id === selectedApp?.id;
                const statusStyle = statusColors[app.status] || statusColors.submitted;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--color-primary-800)] bg-[var(--color-surface-2)] shadow-xs'
                        : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-1)] hover:border-[var(--color-primary-300)] shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        {app.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {app.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-1">
                      {app.schemeName}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-2">
                      <span>{app.farmerName} • Survey {app.surveyNumber}</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">₹{app.subsidyRequestedAmount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Multi-Tier Verification Timeline & Official Details */}
          <div className="lg:col-span-7">
            {selectedApp ? (
              <Card className="space-y-6">
                {/* Header Summary */}
                <div className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                        {selectedApp.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusColors[selectedApp.status].bg} ${statusColors[selectedApp.status].text} ${statusColors[selectedApp.status].border}`}>
                        {selectedApp.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-[var(--color-text-primary)] mt-1.5">
                      {selectedApp.schemeName}
                    </h2>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Applied on: {new Date(selectedApp.appliedDate).toLocaleDateString()} • {selectedApp.block}, {selectedApp.district.toUpperCase()}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                    onClick={handlePrintReceipt}
                  >
                    Print Receipt
                  </Button>
                </div>

                {/* Key Particulars Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[var(--color-surface-1)] rounded-lg border border-[var(--color-border)] text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Applicant</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{selectedApp.farmerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Survey / Patta No</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">{selectedApp.surveyNumber} ({selectedApp.landAreaAcres} ac)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">Subsidy Sanctioned</span>
                    <span className="font-bold text-[var(--color-text-primary)]">₹{selectedApp.subsidyRequestedAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">DBT UTR Reference</span>
                    <span className="text-[11px] font-bold text-[var(--color-text-primary)] truncate block">
                      {selectedApp.dbtUtrNumber || 'In Pipeline'}
                    </span>
                  </div>
                </div>

                {/* Multi-Tier Verification Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Multi-Tier Verification & Sanction Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedApp.timeline.map((event) => (
                      <div key={`${event.stage}-${event.timestamp}`} className="flex items-start gap-2.5">
                        {event.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-text-primary)] mt-0.5 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${event.completed ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                              {event.stage}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              {event.timestamp}
                            </span>
                          </div>
                          {event.officerName && (
                            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium mt-0.5">
                              {event.officerName} {event.officerDesignation ? `(${event.officerDesignation})` : ''}
                            </p>
                          )}
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                            {event.remarks}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uploaded Documents */}
                <div className="pt-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5">
                    Supporting Documents Verified
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedApp.documentsUploaded.map((doc) => (
                      <div key={`${doc.docType}-${doc.fileName}`} className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-[var(--color-text-primary)] block text-[11px]">{doc.docType}</span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">{doc.fileName}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 text-sm text-[var(--color-text-muted)]">
                Select an application to view timeline details.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Multi-Step New Application Wizard */
        <Card className="max-w-3xl mx-auto space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  step === s
                    ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-[var(--color-border)]'
                    : 'text-[var(--color-text-muted)] border-transparent'
                }`}>
                  Step {s}
                </span>
                <span className={`text-xs font-medium hidden sm:inline ${step === s ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-muted)]'}`}>
                  {s === 1 ? 'Scheme' : s === 2 ? 'Land & Identity' : s === 3 ? 'Documents' : 'Confirm'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Scheme Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Step 1: Select Welfare Scheme & Subsidy Estimate
              </h3>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-primary)] block mb-1">
                  Target Government Scheme
                </label>
                <select
                  value={selectedSchemeId}
                  onChange={e => setSelectedSchemeId(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                >
                  {SCHEMES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category.replace(/_/g, ' ')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Scheme Summary Card */}
              <div className="p-4 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[var(--color-text-primary)] block text-sm">
                      {selectedSchemeObj.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      {selectedSchemeObj.implementingDepartment}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                    {selectedSchemeObj.subsidyPercentage || 'Direct Grant'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {selectedSchemeObj.benefits}
                </p>
                <div className="pt-2 flex justify-between font-bold text-[var(--color-text-primary)]">
                  <span>Maximum Benefit / Cap:</span>
                  <span>{selectedSchemeObj.maxBenefitAmount || 'Standard Norm'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(2)}>
                  Next: Land & Personal Details
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Farmer & Land Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Step 2: Applicant & Land Revenue Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={e => {
                      setApplicantName(e.target.value);
                      if (formErrors.applicantName) setFormErrors(prev => ({ ...prev, applicantName: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.applicantName ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)]'}`}
                  />
                  {formErrors.applicantName && (
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{formErrors.applicantName}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Mobile Number (Aadhaar Linked) *
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => {
                      setMobile(e.target.value);
                      if (formErrors.mobile) setFormErrors(prev => ({ ...prev, mobile: '' }));
                    }}
                    placeholder="e.g. 9842155820"
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.mobile ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)]'}`}
                  />
                  {formErrors.mobile && (
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{formErrors.mobile}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Survey / Khasra / Patta Number *
                  </label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={e => {
                      setSurveyNumber(e.target.value);
                      if (formErrors.surveyNumber) setFormErrors(prev => ({ ...prev, surveyNumber: '' }));
                    }}
                    placeholder="e.g. 142/3A"
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.surveyNumber ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)]'}`}
                  />
                  {formErrors.surveyNumber && (
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{formErrors.surveyNumber}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Land Area for Scheme (Acres) *
                  </label>
                  <input
                    type="number"
                    step={0.1}
                    min={0.1}
                    value={landArea}
                    onChange={e => {
                      setLandArea(parseFloat(e.target.value) || 0);
                      if (formErrors.landArea) setFormErrors(prev => ({ ...prev, landArea: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.landArea ? 'border-[var(--color-border)] bg-[var(--color-surface-2)]' : 'border-[var(--color-border)]'}`}
                  />
                  {formErrors.landArea && (
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-1">{formErrors.landArea}</p>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Beneficiary Social Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white"
                  >
                    <option value="SF/MF">Small & Marginal Farmer (SF/MF)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="Women">Women Landholder</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="General">General Category</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Location (Verified from Profile)
                  </label>
                  <div className="px-3 py-2 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {profile.village || 'Panchayat Village'}, {(selectedDistrict || profile.district).toUpperCase()} ({profile.state.toUpperCase()})
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                >
                  Next: Document Verification
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Document Uploads */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Step 3: Document Upload & Verification
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                The following mandatory documents are auto-populated from your verified farm profile. You can remove or attach additional files.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload supporting documents"
              />

              <div className="space-y-2.5">
                {uploadedFiles.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileCheck className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-semibold text-[var(--color-text-primary)] block truncate">{doc.docType}</span>
                        <span className="text-[10px] text-[var(--color-text-muted)]">{doc.fileName} ({doc.fileSizeMb} MB)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                        Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(doc.id)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded transition-colors"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    const files = e.dataTransfer.files;
                    const newDocs: { id: string; docType: string; fileName: string; fileSizeMb: number; verified: boolean }[] = [];
                    for (let i = 0; i < files.length; i++) {
                      const f = files[i];
                      newDocs.push({
                        id: `doc-drop-${Date.now()}-${i}-${f.name}`,
                        docType: `Supporting Document (${f.name.split('.').pop()?.toUpperCase() || 'FILE'})`,
                        fileName: f.name,
                        fileSizeMb: parseFloat((f.size / (1024 * 1024)).toFixed(2)),
                        verified: true,
                      });
                    }
                    setUploadedFiles(prev => [...prev, ...newDocs]);
                  }
                }}
                className="p-5 border-2 border-dashed border-[var(--color-border)] rounded-xl text-center text-xs text-[var(--color-text-muted)] hover:border-[var(--color-primary-600)] hover:bg-[var(--color-surface-2)] cursor-pointer transition-all"
              >
                <Upload className="w-5 h-5 mx-auto mb-1 text-[var(--color-text-secondary)]" />
                <span className="font-semibold text-[var(--color-text-primary)] block">Click or Drag & Drop to attach documents</span>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Supports PDF, JPG, PNG up to 5MB</p>
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(4)}>
                  Review & Final Submission
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Final Review & Submission */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Step 4: Self-Declaration & Final Submission
              </h3>

              {applicationCreated ? (
                <div className="p-6 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border)] text-center space-y-3 text-xs">
                  <CheckCircle2 className="w-10 h-10 text-[var(--color-text-primary)] mx-auto" />
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-[var(--color-text-secondary)]">
                    Your official application reference number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-white rounded-lg text-base font-bold text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-xs">
                    {applicationCreated.id}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-muted)] max-w-md mx-auto">
                    An automated confirmation SMS has been dispatched to {mobile}. Field verification by the Village Administrative Officer (VAO) and Agricultural Officer is scheduled within 7 working days.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsApplying(false);
                        setSelectedAppId(applicationCreated.id);
                      }}
                    >
                      View in Application Tracker
                    </Button>
                    <Button
                      variant="outline"
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                      onClick={handlePrintReceipt}
                    >
                      Print Acknowledgement Receipt
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-xs space-y-2">
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-text-muted)]">Selected Scheme:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{selectedSchemeObj.name}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-text-muted)]">Beneficiary Applicant:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{applicantName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-text-muted)]">Survey Number & Land Area:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{surveyNumber} ({landArea} Acres)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-text-muted)]">Aadhaar Linked Bank Account:</span>
                      <span className="text-[var(--color-text-primary)]">{profile.bankName} ({profile.bankAccountMasked})</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-text-muted)]">Attached Documents:</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">{uploadedFiles.length} files verified</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs flex gap-2">
                    <AlertCircle className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                    <span>
                      I hereby declare that all information furnished is true to the best of my knowledge and complies with the operational guidelines of {selectedSchemeObj.name}.
                    </span>
                  </div>

                  <div className="flex justify-between pt-3">
                    <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      disabled={isSubmitting}
                      onClick={handleCreateApplicationSubmit}
                    >
                      {isSubmitting ? 'Submitting to Registry...' : 'Confirm & Submit Application'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
