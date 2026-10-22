import { useState } from 'react';
import { searchGovernmentResources } from '@/data/governmentResources';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import { useApp } from '@/app/providers';
import {
  ExternalLink, ShieldCheck,
  PhoneCall
} from 'lucide-react';

export default function GovernmentResourcesPage() {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const filteredResources = searchGovernmentResources(
    query,
    catFilter || undefined,
    levelFilter || undefined
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('resources.title')}
        subtitle={t('resources.subtitle')}
      />

      {/* Official Directory Header Banner */}
      <div className="bg-white text-[var(--color-text-primary)] rounded-lg p-5 shadow-xs border border-[var(--color-border)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
            Verified Ministry of Agriculture & Farmers Welfare Directory
          </span>
        </div>
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          Central & State Official Portals, Implementation Guidelines & Direct Helplines
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
          Access authoritative portals, official gazette circulars, scheme guidelines, downloadable forms,
          and 24x7 toll-free farmer helplines directly. Every single link and contact is officially verified with audit timestamps.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('resources.search')}
          className="flex-1"
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white"
        >
          <option value="">All Resource Types</option>
          <option value="Portal">Portals</option>
          <option value="Guideline">Guidelines</option>
          <option value="Form">Forms & Downloads</option>
          <option value="Helpline">Helplines</option>
          <option value="Database">Databases</option>
        </select>
        <select
          value={levelFilter}
          onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white"
        >
          <option value="">Central & State</option>
          <option value="central">Central Govt</option>
          <option value="state">State Govt</option>
        </select>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(res => {
          const isCentral = res.level === 'central';

          return (
            <Card key={res.id} className="flex flex-col justify-between hover:border-[var(--color-text-secondary)] transition-colors">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                      {isCentral ? 'CENTRAL GOVT' : `STATE (${res.state?.toUpperCase()})`}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                      {res.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[var(--color-text-primary)]" />
                    Verified
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  {res.title}
                </h3>

                <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                  {res.department}
                </p>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {res.description}
                </p>

                {res.helpline && (
                  <div className="p-2 bg-[var(--color-surface-1)] rounded border border-[var(--color-border)] flex items-center gap-2 text-xs">
                    <PhoneCall className="w-3.5 h-3.5 text-[var(--color-text-primary)] flex-shrink-0" />
                    <span className="font-semibold text-[var(--color-text-primary)]">{res.helpline}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-[var(--color-text-muted)]">
                  Verified: {res.lastVerifiedDate}
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-primary)] hover:underline transition-colors"
                >
                  Visit Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.noResults')}
        </div>
      )}
    </div>
  );
}
