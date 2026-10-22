import { useState } from 'react';
import { getGrievances, createGrievance } from '@/data/grievances';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import type { GrievanceTicket, GrievanceCategory } from '@/types';
import {
  LifeBuoy, CheckCircle2, Clock,
  Send, Loader2, Search
} from 'lucide-react';

export default function GrievancesPage() {
  const { profile } = useApp();
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => getGrievances());
  const [activeTab, setActiveTab] = useState<'tickets' | 'lodge'>('tickets');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State & Validation
  const [category, setCategory] = useState<GrievanceCategory>('dbt_delay');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!subject.trim()) errs.subject = 'Please state the grievance subject summary.';
    else if (subject.trim().length < 5) errs.subject = 'Subject should be at least 5 characters.';

    if (!description.trim()) errs.description = 'Please describe the specific issue (scheme, installment, or farm location).';
    else if (description.trim().length < 20) errs.description = 'Provide more detail (at least 20 characters) for officer review.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleLodgeGrievance(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newTicket = createGrievance({
        farmerName: profile.displayName || 'Farmer',
        mobile: profile.mobileNumber || '98421-55820',
        state: profile.state,
        district: profile.district,
        category,
        subject: subject.trim(),
        description: description.trim(),
      });

      setGrievances(getGrievances());
      setSubmittedTicket(newTicket);
      setSubject('');
      setDescription('');
      setErrors({});
      setIsSubmitting(false);
    }, 600);
  }

  const categoryLabels: Record<GrievanceCategory, string> = {
    dbt_delay: 'Delayed DBT Subsidy / PM-KISAN Payment',
    insurance_claim: 'Crop Insurance Claim Dispute / Assessment',
    seed_shortage: 'Certified Seed Quality / Shortage at Govt Farm',
    fertilizer_pricing: 'Fertilizer Overpricing / Urea Black-Marketing',
    soil_card: 'Soil Health Card Delivery Delay',
    solar_pump: 'Solar Agricultural Pump Installation (PM-KUSUM)',
    other: 'General Farmer Welfare Grievance',
  };

  const filteredGrievances = grievances.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categoryLabels[t.category].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Platform Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                MoA&FW Farmer Grievance Redressal Portal
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">CPGRAMS-Agri v3.2</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1.5 tracking-tight">
              Welfare Scheme Grievances & Redressal Monitoring
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
              Lodge complaints regarding delayed PM-KISAN installments, crop insurance claim disputes, certified seed farm availability, or input overpricing with a mandatory 48-hour initial officer response SLA.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={activeTab === 'tickets' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveTab('tickets');
                setSubmittedTicket(null);
              }}
            >
              My Tickets ({grievances.length})
            </Button>
            <Button
              variant={activeTab === 'lodge' ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<LifeBuoy className="w-3.5 h-3.5" />}
              onClick={() => setActiveTab('lodge')}
            >
              Lodge Grievance
            </Button>
          </div>
        </div>
      </div>

      {/* Official Government 24x7 Helplines (Clean editorial strip, no bloated card icons) */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)] text-xs shadow-xs">
        <div className="py-2 sm:py-0 sm:px-3 first:pl-0">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">Kisan Call Centre (MoA&FW)</span>
          <a href="tel:18001801551" className="font-bold text-sm text-emerald-800 hover:underline mt-0.5 block font-mono">
            1800-180-1551
          </a>
          <span className="text-[10px] text-[var(--color-text-muted)]">24x7 Free Agronomic Support</span>
        </div>

        <div className="py-2 sm:py-0 sm:px-3">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">PM-KISAN DBT Disbursal Helpline</span>
          <a href="tel:155261" className="font-bold text-sm text-emerald-800 hover:underline mt-0.5 block font-mono">
            155261 / 1800-11-5526
          </a>
          <span className="text-[10px] text-[var(--color-text-muted)]">Installment & eKYC Help</span>
        </div>

        <div className="py-2 sm:py-0 sm:px-3">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">PMFBY Crop Insurance Desk</span>
          <a href="tel:14447" className="font-bold text-sm text-emerald-800 hover:underline mt-0.5 block font-mono">
            14447 (Toll-Free)
          </a>
          <span className="text-[10px] text-[var(--color-text-muted)]">Claim Intimation & Disputes</span>
        </div>

        <div className="py-2 sm:py-0 sm:px-3 last:pr-0">
          <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">State Agriculture Command Room</span>
          <a href="tel:18004254444" className="font-bold text-sm text-emerald-800 hover:underline mt-0.5 block font-mono">
            1800-425-4444
          </a>
          <span className="text-[10px] text-[var(--color-text-muted)]">Uzhavan / District Officer Escalation</span>
        </div>
      </div>

      {activeTab === 'tickets' ? (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket reference, subject, or department..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)]"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[var(--color-border)] shrink-0 text-xs">
              {(
                [
                  { id: 'all', label: 'All Tickets' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'resolved', label: 'Resolved' },
                ] as { id: 'all' | 'pending' | 'in_progress' | 'resolved'; label: string }[]
              ).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Table / List */}
          <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>Showing {filteredGrievances.length} grievance tickets</span>
              <span>Mandatory SLA: 48 Hours</span>
            </div>

            {filteredGrievances.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--color-text-muted)]">
                No grievance tickets found for the selected filter.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {filteredGrievances.map(ticket => {
                  const isResolved = ticket.status === 'resolved';
                  const isInProgress = ticket.status === 'in_progress';

                  return (
                    <div key={ticket.id} className="p-4 hover:bg-[var(--color-surface-1)] transition-colors space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {ticket.id}
                          </span>
                          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                            {categoryLabels[ticket.category]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isResolved
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isInProgress
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-sky-50 text-sky-800 border-sky-200'
                          }`}>
                            {ticket.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)] font-mono">
                            Filed: {ticket.filedDate}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                          {ticket.subject}
                        </h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      {/* Official Officer Investigation Remarks */}
                      <div className="p-3 bg-[var(--color-surface-2)] rounded border border-[var(--color-border)] text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[var(--color-text-primary)]">
                            Assigned Officer: {ticket.assignedOfficer}
                          </span>
                          {ticket.updatedDate && (
                            <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                              Last Action: {ticket.updatedDate}
                            </span>
                          )}
                        </div>
                        <div className="flex items-start gap-1.5 text-[var(--color-text-secondary)] pt-1">
                          {isResolved ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          )}
                          <span>{ticket.resolutionNotes || 'Official inquiry in progress with the District Welfare Committee.'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Lodge New Grievance Form */
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 max-w-2xl mx-auto space-y-5 shadow-xs">
          <div className="border-b border-[var(--color-border)] pb-3">
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              Lodge New Official Grievance
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Submissions receive a permanent tracking token and are monitored directly by the District Welfare Grievance Committee.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-6 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                Grievance Registered Successfully
              </h4>
              <p className="text-emerald-800">
                Your permanent tracking token number is:
              </p>
              <div className="inline-block px-4 py-2 bg-white rounded font-mono text-base font-bold text-emerald-900 border border-emerald-300 shadow-xs">
                {submittedTicket.id}
              </div>
              <p className="text-[11px] text-emerald-700 max-w-sm mx-auto">
                An acknowledgment SMS has been dispatched. The designated Sub-Divisional Agricultural Officer is required to provide a preliminary response within 48 hours.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    setActiveTab('tickets');
                    setSubmittedTicket(null);
                  }}
                >
                  View in My Tickets
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeGrievance} className="space-y-4" noValidate>
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-primary)] block mb-1">
                  Grievance Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as GrievanceCategory)}
                  className="w-full px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white"
                >
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-primary)] block mb-1">
                  Subject Summary <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
                  }}
                  placeholder="e.g. PM-KISAN 16th Installment not credited to Indian Bank account"
                  className={`w-full px-3 py-2 text-xs border rounded-lg ${errors.subject ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)]'}`}
                />
                {errors.subject && <p className="text-[11px] text-red-600 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-primary)] block mb-1">
                  Detailed Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  placeholder="Please provide application reference number, Aadhaar last 4 digits, bank account branch, or field location details..."
                  className={`w-full px-3 py-2 text-xs border rounded-lg ${errors.description ? 'border-red-500 bg-red-50/20' : 'border-[var(--color-border)]'}`}
                />
                {errors.description && <p className="text-[11px] text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div className="p-3 bg-[var(--color-surface-2)] rounded border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                Filing as verified beneficiary: <strong>{profile.displayName}</strong> | Mobile: <strong>{profile.mobileNumber || '98421-55820'}</strong> | District: <strong>{profile.district}</strong>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab('tickets')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Registering Token...' : 'Submit Official Grievance'}
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
