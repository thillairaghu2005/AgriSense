import { useState } from 'react';
import { searchSchemes } from '@/data/schemes';
import { Card, PageHeader, InfoBanner } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import { ExternalLink, CheckSquare, Square, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { Scheme } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';

function useSchemeChecklists() {
  const [checklists, setChecklists] = useState<Record<string, string[]>>(() =>
    storageGet(STORAGE_KEYS.SCHEME_CHECKLISTS, {})
  );

  function toggleItem(schemeId: string, item: string) {
    setChecklists(prev => {
      const current = prev[schemeId] ?? [];
      const next = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      const updated = { ...prev, [schemeId]: next };
      storageSet(STORAGE_KEYS.SCHEME_CHECKLISTS, updated);
      return updated;
    });
  }

  return { checklists, toggleItem };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-xs leading-relaxed">
      <span className="text-[var(--color-text-muted)] font-medium w-28 flex-shrink-0">{label}</span>
      <span className="text-[var(--color-text-secondary)]">{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mt-4 mb-2">
      {children}
    </p>
  );
}

function SchemeCard({ scheme, checklist, onToggle }: { scheme: Scheme; checklist: string[]; onToggle: (item: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  const levelLabel = scheme.level === 'central' ? 'Central' : 'State';
  const catLabel = scheme.category.replace(/_/g, ' ');

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary-800)] bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] px-2 py-0.5 rounded">
              {levelLabel}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-0.5 rounded">
              {catLabel}
            </span>
            {!scheme.isVerified && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-0.5 rounded">
                Sample
              </span>
            )}
          </div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">{scheme.name}</h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">{scheme.shortDescription}</p>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] flex-shrink-0"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse scheme details' : 'Expand scheme details'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary strip */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {scheme.subsidyAmount && (
          <Row label="Subsidy / Amount" value={scheme.subsidyAmount} />
        )}
        {scheme.fundingBudget && (
          <Row label="Funding Budget" value={scheme.fundingBudget} />
        )}
        {scheme.coverageStates && (
          <Row label="Coverage" value={scheme.coverageStates} />
        )}
        {scheme.renewalPeriod && (
          <Row label="Renewal" value={scheme.renewalPeriod} />
        )}
        {scheme.targetBeneficiaries && (
          <Row label="Target" value={scheme.targetBeneficiaries} />
        )}
      </div>

      {expanded && (
        <div className="mt-4 animate-fade-in space-y-1">

          {/* Eligibility */}
          <SectionLabel>Eligibility</SectionLabel>
          <p className="text-xs text-[var(--color-text-secondary)]">{scheme.eligibilitySummary}</p>

          {/* Benefits */}
          <SectionLabel>Benefits</SectionLabel>
          <p className="text-xs text-[var(--color-text-secondary)]">{scheme.benefits}</p>

          {/* Key Features */}
          {scheme.keyFeatures && scheme.keyFeatures.length > 0 && (
            <>
              <SectionLabel>Key Features</SectionLabel>
              <div className="space-y-1">
                {scheme.keyFeatures.map((f, i) => (
                  <p key={i} className="text-xs text-[var(--color-text-secondary)] pl-2">
                    {f}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Activity Timeline */}
          {scheme.timeline && scheme.timeline.length > 0 && (
            <>
              <SectionLabel>Activity Timeline</SectionLabel>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left text-[var(--color-text-muted)] font-semibold pr-4 pb-1 w-36">Period</th>
                      <th className="text-left text-[var(--color-text-muted)] font-semibold pb-1">Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.timeline.map((t, i) => (
                      <tr key={i}>
                        <td className="pr-4 py-0.5 text-[var(--color-text-muted)] align-top font-medium">{t.activityMonth}</td>
                        <td className="py-0.5 text-[var(--color-text-secondary)] align-top">{t.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Seed Plantation Info */}
          {scheme.seedInfo && scheme.seedInfo.length > 0 && (
            <>
              <SectionLabel>Seed Plantation Details</SectionLabel>
              <div className="space-y-4">
                {scheme.seedInfo.map((si, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">{si.cropName}</p>
                    <div className="space-y-1">
                      <Row label="Varieties" value={si.recommendedVarieties.join(', ')} />
                      <Row label="Seed Rate" value={si.seedRateKgPerHectare + ' kg/ha'} />
                      <Row label="Sowing Depth" value={si.sowingDepthCm + ' cm'} />
                      <Row label="Spacing" value={si.spacingCm} />
                      <Row label="Germination" value={si.germinationDays} />
                      <Row label="Seed Treatment" value={si.seedTreatment} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Required Documents */}
          <SectionLabel>Required Documents</SectionLabel>
          <div className="space-y-0.5">
            {scheme.documents.map((doc, i) => (
              <p key={i} className="text-xs text-[var(--color-text-secondary)] pl-2">
                {doc}
              </p>
            ))}
          </div>

          {/* Application Steps without circular box containers */}
          <SectionLabel>Application Steps</SectionLabel>
          <div className="space-y-1.5">
            {scheme.applicationSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <span className="font-semibold text-[var(--color-text-muted)] w-4 flex-shrink-0">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* My Checklist */}
          <SectionLabel>My Document Checklist</SectionLabel>
          <div className="space-y-1.5">
            {scheme.documents.map((doc, i) => (
              <button
                key={i}
                onClick={() => onToggle(doc)}
                className="w-full flex items-center gap-2 text-xs text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                {checklist.includes(doc)
                  ? <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  : <Square className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />}
                {doc}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Checklist saved locally in your browser.</p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-2">
            <p className="text-[10px] text-[var(--color-text-muted)]">Last verified: {scheme.lastVerifiedDate}</p>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-semibold"
            >
              Official website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function SchemesPage() {
  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { checklists, toggleItem } = useSchemeChecklists();

  const filtered = searchSchemes(query, levelFilter || undefined, categoryFilter || undefined);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Government Schemes" subtitle="Central and state-level schemes for farmers" />

      <InfoBanner variant="warning">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-xs">
            <strong>Guidance only.</strong> Scheme information is for reference and does not constitute official eligibility determination or approval.
            Eligibility criteria and benefits may change. Always verify with the official website or your local agriculture/government office before applying.
          </span>
        </div>
      </InfoBanner>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search schemes, crops, varieties..." className="flex-1" />
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
        >
          <option value="">All Levels</option>
          <option value="central">Central</option>
          <option value="state">State</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
        >
          <option value="">All Categories</option>
          {['insurance', 'credit', 'subsidy', 'income_support', 'irrigation', 'mechanisation', 'market', 'organic', 'seed'].map(c => (
            <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">{filtered.length} scheme{filtered.length !== 1 ? 's' : ''} found</p>

      <div className="space-y-4">
        {filtered.map(scheme => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            checklist={checklists[scheme.id] ?? []}
            onToggle={item => toggleItem(scheme.id, item)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">No schemes match your search.</div>
        )}
      </div>
    </div>
  );
}
