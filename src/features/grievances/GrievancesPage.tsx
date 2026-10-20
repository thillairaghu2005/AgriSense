import { useState } from 'react';
import { getGrievances, createGrievance } from '@/data/grievances';
import { Card, PageHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import type { GrievanceTicket, GrievanceCategory } from '@/types';
import {
  LifeBuoy, CheckCircle2, Clock, PhoneCall,
  AlertTriangle, Send
} from 'lucide-react';

export default function GrievancesPage() {
  const { t, profile } = useApp();
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => getGrievances());
  const [activeTab, setActiveTab] = useState<'tickets' | 'lodge'>('tickets');

  // Form State
  const [category, setCategory] = useState<GrievanceCategory>('dbt_delay');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  function handleLodgeGrievance(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const newTicket = createGrievance({
      farmerName: profile.displayName || 'Farmer',
      mobile: profile.mobileNumber || '98421-55820',
      state: profile.state,
      district: profile.district,
      category,
      subject,
      description,
    });

    setGrievances(getGrievances());
    setSubmittedTicket(newTicket);
    setSubject('');
    setDescription('');
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t('grievances.title')}
          subtitle={t('grievances.subtitle')}
        />
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'tickets' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              setActiveTab('tickets');
              setSubmittedTicket(null);
            }}
          >
            {t('grievances.myTickets')} ({grievances.length})
          </Button>
          <Button
            variant={activeTab === 'lodge' ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={<LifeBuoy className="w-3.5 h-3.5" />}
            onClick={() => setActiveTab('lodge')}
          >
            {t('grievances.lodge')}
          </Button>
        </div>
      </div>

      {/* Emergency Helplines Strip */}
      <div className="p-4 rounded-xl bg-emerald-950 text-white border border-emerald-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900 text-emerald-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 block font-semibold uppercase">Kisan Call Centre</span>
            <span className="font-bold text-sm">1800-180-1551</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900 text-emerald-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 block font-semibold uppercase">PM-KISAN Helpline</span>
            <span className="font-bold text-sm">155261 / 1800-11-5526</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900 text-emerald-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 block font-semibold uppercase">PMFBY Crop Insurance</span>
            <span className="font-bold text-sm">14447 (National Toll-Free)</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-900 text-emerald-400">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 block font-semibold uppercase">Tamil Nadu Uzhavan Help</span>
            <span className="font-bold text-sm">1800-425-4444</span>
          </div>
        </div>
      </div>

      {activeTab === 'tickets' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {grievances.map(ticket => {
              const isResolved = ticket.status === 'resolved';
              const isInProgress = ticket.status === 'in_progress';

              return (
                <Card key={ticket.id} className="space-y-3 border-[var(--color-border)] hover:border-emerald-600 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[var(--color-primary-800)] bg-[var(--color-primary-50)] px-2 py-0.5 rounded border border-[var(--color-primary-200)]">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                        {categoryLabels[ticket.category]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-sky-50 text-sky-800 border-sky-200'
                      }`}>
                        {ticket.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
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

                  {/* Officer Resolution Box */}
                  <div className="p-3 bg-[var(--color-surface-1)] rounded-lg border border-[var(--color-border)] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Assigned: {ticket.assignedOfficer}
                      </span>
                      {ticket.updatedDate && (
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                          Last Updated: {ticket.updatedDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-1.5 text-[var(--color-text-secondary)] pt-1">
                      {isResolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{ticket.resolutionNotes || 'Under investigation by the District Welfare Committee.'}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Lodge New Grievance Form */
        <Card className="max-w-2xl mx-auto space-y-5">
          <div className="border-b border-[var(--color-border)] pb-3">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {t('grievances.lodge')}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Submissions are monitored directly by the District Level Grievance Redressal Committee.
            </p>
          </div>

          {submittedTicket ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                Grievance Registered Successfully!
              </h4>
              <p className="text-emerald-800">
                Your tracking token number is:
              </p>
              <div className="inline-block px-4 py-2 bg-white rounded-lg font-mono text-base font-bold text-emerald-900 border border-emerald-300 shadow-sm">
                {submittedTicket.id}
              </div>
              <p className="text-[11px] text-emerald-700">
                The designated department officer is required to examine and provide an initial status update within 7 working days.
              </p>
              <div className="pt-2 flex justify-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    setActiveTab('tickets');
                    setSubmittedTicket(null);
                  }}
                >
                  View My Grievances
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodgeGrievance} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                  Issue Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as GrievanceCategory)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-white"
                >
                  {Object.entries(categoryLabels).map(([catKey, label]) => (
                    <option key={catKey} value={catKey}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                  Subject / Short Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 17th PM-KISAN installment not credited to SBI account"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                  Detailed Description of Issue *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide transaction dates, bank names, survey numbers, or specific officer references..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Please ensure your Aadhaar-linked mobile number ({profile.mobileNumber}) is reachable for follow-up verification by the field officer.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setActiveTab('tickets')}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" variant="primary" leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Submit Grievance
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
