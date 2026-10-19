import { useState } from 'react';
import { searchSchemes } from '@/data/schemes';
import { Card, PageHeader, Badge, InfoBanner } from '@/components/ui/Card';
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

function SchemeCard({ scheme, checklist, onToggle }: { scheme: Scheme; checklist: string[]; onToggle: (item: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={scheme.level === 'central' ? 'blue' : 'green'}>{scheme.level === 'central' ? 'Central' : 'State'}</Badge>
            <Badge variant="gray">{scheme.category.replace('_', ' ')}</Badge>
            {!scheme.isVerified && <Badge variant="amber">Sample — not verified</Badge>}
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

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-[var(--color-border)] pt-4 animate-fade-in">
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">Eligibility</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">{scheme.eligibilitySummary}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">Benefits</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">{scheme.benefits}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">Required Documents</h3>
            <ul className="space-y-1">
              {scheme.documents.map((doc, i) => (
                <li key={i} className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-400)] flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-2">My Checklist</h3>
            <div className="space-y-2">
              {scheme.documents.map((doc, i) => (
                <button
                  key={i}
                  onClick={() => onToggle(doc)}
                  className="w-full flex items-center gap-2 text-xs text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {checklist.includes(doc)
                    ? <CheckSquare className="w-4 h-4 text-[var(--color-primary-600)] flex-shrink-0" />
                    : <Square className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />}
                  {doc}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-2">Checklist saved locally in your browser.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--color-text-primary)] mb-1.5">Application Steps</h3>
            <ol className="space-y-1.5">
              {scheme.applicationSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="w-4 h-4 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[var(--color-text-muted)]">Last verified: {scheme.lastVerifiedDate}</p>
            <a
              href={scheme.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[var(--color-primary-600)] hover:underline font-medium"
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
          <span className="text-xs"><strong>Guidance only.</strong> Scheme information is for reference and does not constitute official eligibility determination or approval. Eligibility criteria and benefits may change. Always verify with the official website or your local agriculture/government office before applying.</span>
        </div>
      </InfoBanner>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={query} onChange={e => setQuery(e.target.value)} placeholder="Search schemes…" className="flex-1" />
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]">
          <option value="">All Levels</option>
          <option value="central">Central</option>
          <option value="state">State</option>
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]">
          <option value="">All Categories</option>
          {['insurance', 'credit', 'subsidy', 'income_support', 'irrigation', 'mechanisation', 'market', 'organic'].map(c => (
            <option key={c} value={c}>{c.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-[var(--color-text-muted)]">{filtered.length} scheme{filtered.length !== 1 ? 's' : ''} found</p>

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
