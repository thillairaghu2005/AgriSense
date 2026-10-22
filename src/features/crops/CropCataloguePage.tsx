import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ChevronRight, LayoutGrid, TableProperties, ArrowRight } from 'lucide-react';
import { searchCrops } from '@/data/crops';
import { SearchInput } from '@/components/forms/FormComponents';
import { EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Season, CropCategory } from '@/types';

const SEASON_LABELS: Record<Season, string> = { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', annual: 'Annual' };
const CATEGORY_LABELS: Record<CropCategory, string> = {
  cereal: 'Cereal', pulse: 'Pulse', oilseed: 'Oilseed', vegetable: 'Vegetable',
  fruit: 'Fruit', cash_crop: 'Cash Crop', spice: 'Spice', fiber: 'Fiber',
  plantation: 'Plantation', fodder: 'Fodder',
};

export default function CropCataloguePage() {
  const [query, setQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const navigate = useNavigate();

  const filteredCrops = searchCrops(query).filter(c =>
    (!seasonFilter || c.seasons.includes(seasonFilter as Season)) &&
    (!categoryFilter || c.category === categoryFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-0.5 rounded border border-[var(--color-border)]">
                Indian Council of Agricultural Research (ICAR) Reference
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1.5 tracking-tight">
              Major Indian Crop Agronomic Catalogue
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
              Standard agronomic guidelines, duration baselines, water budgeting, and soil pH tolerances across Kharif, Rabi, and Zaid cultivation cycles.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-[var(--color-surface-2)] p-1 rounded-lg border border-[var(--color-border)] shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              Agronomic Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-[var(--color-text-primary)] font-semibold shadow-xs border border-[var(--color-border)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Card View
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search crops by name or type..."
          className="flex-1"
          aria-label="Search crops"
        />
        <select
          value={seasonFilter}
          onChange={e => setSeasonFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-border-strong)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] cursor-pointer"
          aria-label="Filter by season"
        >
          <option value="">All Seasons</option>
          {Object.entries(SEASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-border-strong)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] cursor-pointer"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <span>Showing {filteredCrops.length} crop profile{filteredCrops.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Empty State */}
      {filteredCrops.length === 0 ? (
        <EmptyState
          icon={<Leaf className="w-10 h-10" />}
          title="No crops found"
          description="No crops match your search term or selected season/category filters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery('');
                setSeasonFilter('');
                setCategoryFilter('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        /* Agronomic Comparison Table View */
        <div className="bg-white border border-[var(--color-border)] rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="table-clean" aria-label="Crop Agronomic Catalogue">
              <thead>
                <tr>
                  <th>Crop Name</th>
                  <th>Category</th>
                  <th>Sowing Seasons</th>
                  <th className="text-right">Duration (Days)</th>
                  <th className="text-right">Soil pH Range</th>
                  <th className="text-right">Water Need</th>
                  <th>Suitable Soils</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrops.map(crop => (
                  <tr
                    key={crop.id}
                    onClick={() => navigate(`/crops/${crop.id}`)}
                    className="cursor-pointer hover:bg-[var(--color-surface-1)] transition-colors"
                  >
                    <td className="font-bold text-[var(--color-text-primary)]">
                      {crop.name}
                    </td>
                    <td className="capitalize text-[var(--color-text-secondary)]">
                      {CATEGORY_LABELS[crop.category]}
                    </td>
                    <td>
                      <div className="flex gap-1 flex-wrap">
                        {crop.seasons.map(s => (
                          <span key={s} className="px-1.5 py-0.5 text-[10px] rounded bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] font-medium">
                            {SEASON_LABELS[s]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-right font-medium">
                      {crop.durationDays[0]}–{crop.durationDays[1]}
                    </td>
                    <td className="text-right">
                      pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}
                    </td>
                    <td className="text-right text-[var(--color-text-secondary)]">
                      {crop.waterNeedsMmPerSeason[0]}–{crop.waterNeedsMmPerSeason[1]} mm
                    </td>
                    <td className="text-xs text-[var(--color-text-muted)] max-w-xs truncate">
                      {crop.suitableSoils.join(', ')}
                    </td>
                    <td className="text-right">
                      <span className="text-xs font-semibold text-[var(--color-text-primary)] hover:underline inline-flex items-center gap-1">
                        Profile <ArrowRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCrops.map(crop => (
            <div
              key={crop.id}
              onClick={() => navigate(`/crops/${crop.id}`)}
              className="bg-white border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-strong)] transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                      {CATEGORY_LABELS[crop.category]}
                    </span>
                    {crop.seasons.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                        {SEASON_LABELS[s]}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)] group-hover:underline transition-colors">
                    {crop.name}
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {crop.durationDays[0]}–{crop.durationDays[1]} days &nbsp;·&nbsp; pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">
                    Soils: {crop.suitableSoils.join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] shrink-0 transition-colors mt-1" />
              </div>

              <div className="mt-3 pt-2.5">
                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                  {crop.sowingGuidance.slice(0, 110)}…
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
