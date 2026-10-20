import { useState } from 'react';
import { getApplications, createApplication } from '@/data/applications';
import { SCHEMES } from '@/data/schemes';
import { Card, PageHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import type { SchemeApplication, ApplicationStatus } from '@/types';
import {
  FileText, CheckCircle2, Clock, ShieldCheck, Printer,
  ArrowRight, ArrowLeft, Upload, AlertCircle, FileCheck
} from 'lucide-react';

export default function ApplicationsPage() {
  const { t, profile } = useApp();
  const [applications, setApplications] = useState<SchemeApplication[]>(() => getApplications());
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // New Application Wizard state
  const [step, setStep] = useState(1);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(SCHEMES[0]?.id || '');
  const [applicantName, setApplicantName] = useState(profile.displayName || 'Farmer');
  const [mobile, setMobile] = useState(profile.mobileNumber || '98421-55820');
  const [surveyNumber, setSurveyNumber] = useState(profile.surveyNumber || '142/3A');
  const [landArea, setLandArea] = useState<number>(profile.landArea || 2.5);
  const [category, setCategory] = useState<'SF/MF' | 'SC' | 'ST' | 'General' | 'OBC' | 'Women'>('SF/MF');
  const [uploadedFiles] = useState<{ docType: string; fileName: string; verified: boolean }[]>([
    { docType: 'Land Records (Patta / Chitta / 7/12)', fileName: 'land_record.pdf', verified: true },
    { docType: 'Aadhaar Card (Masked)', fileName: 'aadhaar_card.pdf', verified: true },
    { docType: 'Bank Account Passbook / Cheque', fileName: 'bank_passbook.pdf', verified: true },
  ]);
  const [applicationCreated, setApplicationCreated] = useState<SchemeApplication | null>(null);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const filteredApps = applications.filter(a =>
    a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.farmerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSchemeObj = SCHEMES.find(s => s.id === selectedSchemeId) || SCHEMES[0];

  function handleCreateApplicationSubmit() {
    const estAmount = typeof selectedSchemeObj.maxBenefitAmount === 'string'
      ? parseInt(selectedSchemeObj.maxBenefitAmount.replace(/[^0-9]/g, '')) || 50000
      : 50000;

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
        fileSizeMb: 1.1,
      })),
      officerRemarks: 'Application submitted successfully via online welfare portal.',
    });

    setApplications(getApplications());
    setApplicationCreated(newApp);
    setSelectedAppId(newApp.id);
  }

  function handlePrintReceipt() {
    window.print();
  }

  const statusColors: Record<ApplicationStatus, { bg: string; text: string; border: string }> = {
    submitted: { bg: 'bg-[var(--color-primary-50)]', text: 'text-black', border: 'border-[var(--color-primary-200)]' },
    under_verification: { bg: 'bg-amber-50', text: 'text-black', border: 'border-amber-200' },
    field_inspected: { bg: 'bg-[var(--color-primary-100)]', text: 'text-black', border: 'border-[var(--color-primary-300)]' },
    district_approved: { bg: 'bg-emerald-50', text: 'text-black', border: 'border-emerald-200' },
    sanctioned: { bg: 'bg-[var(--color-primary-100)]', text: 'text-black', border: 'border-[var(--color-primary-300)]' },
    dbt_disbursed: { bg: 'bg-[var(--color-primary-200)]', text: 'text-black', border: 'border-[var(--color-primary-400)]' },
    rejected: { bg: 'bg-red-50', text: 'text-black', border: 'border-red-200' },
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
            <div className="relative">
              <input
                type="text"
                placeholder={t('applications.trackStatus')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
              />
            </div>

            <div className="space-y-2.5">
              {filteredApps.map(app => {
                const isSelected = app.id === selectedApp?.id;
                const statusStyle = statusColors[app.status] || statusColors.submitted;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)] shadow-sm'
                        : 'border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-1)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--color-text-primary)]">
                        {app.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {app.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[var(--color-text-primary)] line-clamp-1">
                      {app.schemeName}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] mt-2">
                      <span>{app.farmerName} • Survey {app.surveyNumber}</span>
                      <span className="font-semibold text-emerald-800">₹{app.subsidyRequestedAmount.toLocaleString()}</span>
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
                <div className="border-b border-[var(--color-border)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--color-primary-800)] bg-[var(--color-primary-50)] px-2 py-0.5 rounded border border-[var(--color-primary-200)]">
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
                    <span className="font-bold text-emerald-700">₹{selectedApp.subsidyRequestedAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--color-text-muted)] block">DBT UTR Reference</span>
                    <span className="font-mono text-[11px] font-bold text-gray-800 truncate block">
                      {selectedApp.dbtUtrNumber || 'In Pipeline'}
                    </span>
                  </div>
                </div>

                {/* Multi-Tier Verification Timeline */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Multi-Tier Verification & Sanction Timeline
                  </h3>
                  <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--color-border)]">
                    {selectedApp.timeline.map((event, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          event.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {event.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${event.completed ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'}`}>
                              {event.stage}
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                              {event.timestamp}
                            </span>
                          </div>
                          {event.officerName && (
                            <p className="text-[11px] text-[var(--color-primary-800)] font-medium mt-0.5">
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
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2.5">
                    Supporting Documents Verified
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedApp.documentsUploaded.map((doc, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-[var(--color-text-primary)] block text-[11px]">{doc.docType}</span>
                            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{doc.fileName}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
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
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s
                    ? 'bg-emerald-600 text-white'
                    : step > s
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedSchemeObj.subsidyPercentage || 'Direct Grant'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {selectedSchemeObj.benefits}
                </p>
                <div className="pt-2 border-t border-[var(--color-border)] flex justify-between font-bold text-emerald-900">
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
                    Applicant Full Name
                  </label>
                  <input
                    type="text"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Mobile Number (Aadhaar Linked)
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Survey / Khasra / Patta Number
                  </label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={e => setSurveyNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Land Area for Scheme (Acres)
                  </label>
                  <input
                    type="number"
                    step={0.5}
                    value={landArea}
                    onChange={e => setLandArea(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg"
                  />
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
                    Location (From Profile)
                  </label>
                  <div className="px-3 py-2 bg-[var(--color-surface-2)] rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                    {profile.village}, {profile.district.toUpperCase()} ({profile.state.toUpperCase()})
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(3)}>
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
                The following mandatory documents are auto-populated from your verified farm profile.
              </p>

              <div className="space-y-3">
                {uploadedFiles.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold text-[var(--color-text-primary)] block">{doc.docType}</span>
                        <span className="text-[11px] text-[var(--color-text-muted)] font-mono">{doc.fileName}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Uploaded & Ready
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-2 border-dashed border-[var(--color-border)] rounded-xl text-center text-xs text-[var(--color-text-muted)] hover:border-emerald-600 transition-colors">
                <Upload className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                <span className="font-semibold text-[var(--color-text-primary)]">Click to upload additional documents</span>
                <p className="text-[10px] text-[var(--color-text-muted)]">Supports PDF, JPG, PNG up to 5MB</p>
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
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-950">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-emerald-800">
                    Your application reference number is:
                  </p>
                  <div className="inline-block px-4 py-2 bg-white rounded-lg font-mono text-base font-bold text-emerald-900 border border-emerald-300 shadow-sm">
                    {applicationCreated.id}
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    A confirmation SMS has been dispatched to {mobile}. You can track the multi-tier verification progress anytime.
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        setIsApplying(false);
                        setSelectedAppId(applicationCreated.id);
                      }}
                    >
                      View in Application Tracker
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Scheme:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{selectedSchemeObj.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Applicant:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Survey & Area:</span>
                      <span className="font-bold text-[var(--color-text-primary)]">{surveyNumber} ({landArea} Acres)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Bank Account:</span>
                      <span className="font-mono text-[var(--color-text-primary)]">{profile.bankName} ({profile.bankAccountMasked})</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>
                      I hereby declare that all information furnished is true to the best of my knowledge and complies with the scheme guidelines.
                    </span>
                  </div>

                  <div className="flex justify-between pt-3">
                    <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button variant="primary" leftIcon={<ShieldCheck className="w-4 h-4" />} onClick={handleCreateApplicationSubmit}>
                      Confirm & Submit Application
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
