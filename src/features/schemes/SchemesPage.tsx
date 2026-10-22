import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchSchemes } from '@/data/schemes';
import { Card, Badge, PageHeader, InfoBanner } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import { evaluateEligibility, type EligibilityResult } from '@/lib/eligibilityEngine';
import type { Scheme } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import {
  ExternalLink, CheckSquare, Square, ChevronDown, ChevronUp,
  AlertCircle, ShieldCheck,
  CheckCircle2, ArrowRight
} from 'lucide-react';

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mt-4 mb-2">
      {children}
    </p>
  );
}

function SchemeCard({
  scheme,
  eligibility,
  checklist,
  onToggle,
  onApply,
  isInitialExpanded = false,
}: {
  scheme: Scheme;
  eligibility: EligibilityResult;
  checklist: string[];
  onToggle: (item: string) => void;
  onApply: (schemeId: string) => void;
  isInitialExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(isInitialExpanded);

  useEffect(() => {
    if (isInitialExpanded) setExpanded(true);
  }, [isInitialExpanded]);

  const levelLabel = scheme.level === 'central' ? 'Central Scheme' : 'State Scheme';
  const catLabel = scheme.category.replace(/_/g, ' ');

  const matchColor =
    eligibility.matchScore >= 80
      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
      : eligibility.matchScore >= 50
      ? 'bg-amber-50 text-amber-800 border-amber-300'
      : 'bg-gray-100 text-gray-700 border-gray-300';

  return (
    <Card className="hover:border-[var(--color-primary-400)] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Badge Strip */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant={scheme.level === 'central' ? 'blue' : 'green'}>
              {levelLabel}
            </Badge>
            <Badge variant="neutral">
              {catLabel}
            </Badge>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${matchColor}`}>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {eligibility.matchScore}% Match
            </span>
            {scheme.isVerified ? (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified MoA&FW
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                Sample
              </span>
            )}
          </div>

          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            {scheme.name}
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed">
            {scheme.shortDescription}
          </p>
        </div>

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] flex-shrink-0 cursor-pointer transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse scheme details' : 'Expand scheme details'}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Summary Highlight Strip */}
      <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-[var(--color-surface-1)] border border-[var(--color-border)] text-xs">
        <div>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium block">Assistance / Subsidy</span>
          <span className="font-bold text-emerald-700">{scheme.subsidyPercentage || scheme.maxBenefitAmount || 'Direct Grant'}</span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium block">Max Benefit</span>
          <span className="font-semibold text-[var(--color-text-primary)]">{scheme.maxBenefitAmount || 'As per norms'}</span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium block">Application Deadline</span>
          <span className="font-semibold text-[var(--color-text-primary)] truncate block">{scheme.deadlines || 'Open Year-round'}</span>
        </div>
        <div>
          <span className="text-[10px] text-[var(--color-text-muted)] font-medium block">Helpline</span>
          <span className="font-semibold text-[var(--color-text-primary)] truncate block">{scheme.helplineNumber}</span>
        </div>
      </div>

      {/* Eligibility breakdown banner */}
      <div className="mt-3 flex items-center justify-between text-xs pt-1">
        <div className="flex items-center gap-1.5">
          {eligibility.isEligible ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          )}
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            {eligibility.isEligible
              ? 'You meet all core eligibility criteria for this scheme.'
              : eligibility.failedCriteria[0] || 'Check specific conditions below.'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApply(scheme.id)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Apply Now
          </Button>
        </div>
      </div>

      {/* Expandable Comprehensive Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[var(--color-border)] animate-fade-in space-y-4 text-xs">
          {/* Objectives */}
          {scheme.objectives && scheme.objectives.length > 0 && (
            <div>
              <SectionLabel>Objectives & Scope</SectionLabel>
              <ul className="space-y-1 list-disc pl-4 text-[var(--color-text-secondary)]">
                {scheme.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed Eligibility & Profile Match Evaluation */}
          <div>
            <SectionLabel>Personalized Eligibility Evaluation</SectionLabel>
            <p className="text-[var(--color-text-secondary)] mb-2">{scheme.eligibilitySummary}</p>
            <div className="p-3 bg-[var(--color-surface-2)] rounded-lg space-y-1.5 border border-[var(--color-border)]">
              {eligibility.passedCriteria.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-emerald-800 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
              {eligibility.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5 text-amber-800 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
              {eligibility.failedCriteria.map((f, i) => (
                <div key={i} className="flex items-start gap-1.5 text-red-800 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Assistance & Benefits */}
          <div>
            <SectionLabel>Financial Assistance & Benefits</SectionLabel>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">{scheme.benefits}</p>
            {scheme.financialAssistance && (
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                <strong>Funding Mechanism:</strong> {scheme.financialAssistance}
              </p>
            )}
          </div>

          {/* Key Features */}
          {scheme.keyFeatures && scheme.keyFeatures.length > 0 && (
            <div>
              <SectionLabel>Key Highlights</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {scheme.keyFeatures.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[var(--color-text-secondary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Timeline Calendar */}
          {scheme.timeline && scheme.timeline.length > 0 && (
            <div>
              <SectionLabel>Seasonal Activity Timeline</SectionLabel>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left text-[var(--color-text-muted)] font-semibold pb-1.5 w-40">Period / Month</th>
                      <th className="text-left text-[var(--color-text-muted)] font-semibold pb-1.5">Scheduled Activity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {scheme.timeline.map((tItem, i) => (
                      <tr key={i}>
                        <td className="py-1.5 font-medium text-[var(--color-text-primary)] align-top">{tItem.activityMonth}</td>
                        <td className="py-1.5 text-[var(--color-text-secondary)] align-top">{tItem.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step-by-Step Application Procedures */}
          <div>
            <SectionLabel>Official Application Procedure</SectionLabel>
            <div className="space-y-1.5">
              {scheme.applicationSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)]">
                  <span className="font-bold text-[var(--color-primary-800)] w-4 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div>
            <SectionLabel>Required Documents Checklist</SectionLabel>
            <div className="space-y-1.5">
              {scheme.documents.map((doc, i) => (
                <button
                  key={i}
                  onClick={() => onToggle(doc)}
                  className="w-full flex items-center gap-2 text-xs text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {checklist.includes(doc) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
                  )}
                  <span>{doc}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">Checklist items are saved locally in your browser.</p>
          </div>

          {/* Implementing Department & Authoritative Source */}
          <div className="pt-3 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[var(--color-text-muted)]">
            <div>
              <span className="block font-medium text-[var(--color-text-secondary)]">
                Department: {scheme.implementingDepartment}
              </span>
              <span>Last Verified Date: {scheme.lastVerifiedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                Official Scheme Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function SchemesPage() {
  const { t, profile } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetSchemeId = searchParams.get('scheme');

  const [query, setQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [onlyEligible, setOnlyEligible] = useState(false);
  const { checklists, toggleItem } = useSchemeChecklists();

  // Evaluate eligibility for all schemes based on current farmer profile
  const filtered = useMemo(() => {
    let result = searchSchemes(
      query,
      levelFilter || undefined,
      categoryFilter || undefined,
      profile.state || undefined
    );

    if (onlyEligible) {
      result = result.filter(s => evaluateEligibility(profile, s).isEligible);
    }

    // If targetSchemeId is provided, bring it to top if not filtered out
    if (targetSchemeId) {
      const target = result.find(s => s.id === targetSchemeId);
      if (target) {
        result = [target, ...result.filter(s => s.id !== targetSchemeId)];
      }
    }

    return result;
  }, [query, levelFilter, categoryFilter, onlyEligible, profile, targetSchemeId]);

  function handleApply(schemeId: string) {
    navigate(`/applications?apply=${schemeId}`);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('schemes.title')}
        subtitle={t('schemes.subtitle')}
      />

      <InfoBanner variant="warning">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="text-xs">
            <strong>Authoritative Source Advisory:</strong> All scheme criteria, subsidy calculations, and official links are compiled directly from central and state ministries (Ministry of Agriculture & Farmers Welfare, PM-KISAN, PMFBY, ICAR, TNAU, and State Portals). Always confirm latest seasonal operational guidelines before applying.
          </span>
        </div>
      </InfoBanner>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('schemes.searchPlaceholder')}
          className="flex-1"
        />
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
          aria-label="Filter by level"
        >
          <option value="">All Levels (Central & State)</option>
          <option value="central">Central Government Only</option>
          <option value="state">State Specific ({profile.state.toUpperCase()})</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          <option value="income_support">Income Support</option>
          <option value="insurance">Crop Insurance</option>
          <option value="credit">Credit & Loans</option>
          <option value="irrigation">Micro Irrigation</option>
          <option value="mechanisation">Agricultural Machinery</option>
          <option value="organic_farming">Organic & Natural Farming</option>
          <option value="horticulture">Horticulture & Orchards</option>
          <option value="livestock">Livestock & Dairy</option>
          <option value="fisheries">Fisheries & Aquaculture</option>
          <option value="pension">Farmer Pension</option>
          <option value="solar_energy">Solar Pumps (PM-KUSUM)</option>
          <option value="disaster_relief">Disaster Relief</option>
          <option value="soil_health">Soil Health</option>
          <option value="subsidy">Direct Subsidies</option>
        </select>
        <button
          onClick={() => setOnlyEligible(v => !v)}
          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            onlyEligible
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] shadow-xs hover:bg-[var(--color-surface-2)] hover:border-[var(--color-primary-300)]'
          }`}
        >
          <ShieldCheck className={`w-3.5 h-3.5 ${onlyEligible ? 'text-white' : 'text-emerald-700'}`} />
          My Eligible Schemes Only
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>Showing {filtered.length} welfare scheme{filtered.length !== 1 ? 's' : ''} for {profile.displayName} ({profile.state.toUpperCase()})</span>
        <span>Profile Landholding: {profile.landArea} {profile.landAreaUnit}</span>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {filtered.map(scheme => {
          const eligibility = evaluateEligibility(profile, scheme);
          return (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              eligibility={eligibility}
              checklist={checklists[scheme.id] ?? []}
              onToggle={item => toggleItem(scheme.id, item)}
              onApply={handleApply}
              isInitialExpanded={scheme.id === targetSchemeId}
            />
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            No government schemes match your filter criteria. Try resetting filters.
          </div>
        )}
      </div>
    </div>
  );
}
