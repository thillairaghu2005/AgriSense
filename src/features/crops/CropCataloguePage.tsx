import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight } from 'lucide-react';
import { searchCrops } from '@/data/crops';
import { Card, Badge, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import { EmptyState } from '@/components/ui/Card';
import type { Season, CropCategory } from '@/types';

const SEASON_LABELS: Record<Season, string> = { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', annual: 'Annual' };
const CATEGORY_LABELS: Record<CropCategory, string> = {
  cereal: 'Cereal', pulse: 'Pulse', oilseed: 'Oilseed', vegetable: 'Vegetable',
  fruit: 'Fruit', cash_crop: 'Cash Crop', spice: 'Spice', fiber: 'Fiber',
};
const CATEGORY_COLORS: Partial<Record<CropCategory, 'green' | 'amber' | 'blue' | 'purple' | 'gray'>> = {
  cereal: 'amber', pulse: 'green', oilseed: 'blue', vegetable: 'green',
  cash_crop: 'purple', spice: 'amber', fiber: 'gray',
};

export default function CropCataloguePage() {
  const [query, setQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const navigate = useNavigate();

  const filteredCrops = searchCrops(query).filter(c =>
    (!seasonFilter || c.seasons.includes(seasonFilter as Season)) &&
    (!categoryFilter || c.category === categoryFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Crop Catalogue"
        subtitle="Browse guidance for major Indian crops by season and category."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search crops…"
          className="flex-1"
          aria-label="Search crops"
        />
        <select
          value={seasonFilter}
          onChange={e => setSeasonFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
          aria-label="Filter by season"
        >
          <option value="">All Seasons</option>
          {Object.entries(SEASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-[var(--color-text-muted)]">{filteredCrops.length} crop{filteredCrops.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon={<Leaf className="w-12 h-12" />}
          title="No crops found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map(crop => (
            <Card
              key={crop.id}
              onClick={() => navigate(`/crops/${crop.id}`)}
              className="hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant={CATEGORY_COLORS[crop.category] ?? 'gray'}>
                      {CATEGORY_LABELS[crop.category]}
                    </Badge>
                    {crop.seasons.map(s => (
                      <Badge key={s} variant="gray">{SEASON_LABELS[s]}</Badge>
                    ))}
                  </div>
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{crop.name}</h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {crop.durationDays[0]}–{crop.durationDays[1]} days
                    &nbsp;·&nbsp; pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Soils: {crop.suitableSoils.join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0 mt-1" />
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {crop.sowingGuidance.slice(0, 100)}…
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
