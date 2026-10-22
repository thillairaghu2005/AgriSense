import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2,
  PackageCheck, BookOpen
} from 'lucide-react';
import { getCropById } from '@/data/crops';
import Button from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Card';

export default function CropDetailPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const navigate = useNavigate();
  const crop = cropId ? getCropById(cropId) : undefined;

  if (!crop) {
    return (
      <EmptyState
        title="Crop Profile Not Found"
        description="The crop record you requested does not exist in the master registry."
        action={<Button variant="outline" onClick={() => navigate('/crops')}>Back to Catalogue</Button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Direct Navigation */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/crops')}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer"
              aria-label="Back to crop catalogue"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {crop.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-[var(--color-text-muted)] font-mono">
                  ID: {crop.id}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1 tracking-tight">
                {crop.name} — Agronomic Profile & Field Manual
              </h1>
            </div>
          </div>

          {/* Direct Government Links */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PackageCheck className="w-3.5 h-3.5" />}
              onClick={() => navigate('/seed-distribution')}
            >
              Govt Seed Farms
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => navigate('/schemes')}
            >
              Eligible Subsidies
            </Button>
          </div>
        </div>

        {/* Agronomic Telemetry Summary Strip (Dividers, not 4 separate bloated cards) */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          <div className="py-2 sm:py-0 sm:px-4 first:pl-0">
            <span className="text-xs font-medium text-[var(--color-text-muted)] block">Cultivation Period</span>
            <span className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">
              {crop.durationDays[0]}–{crop.durationDays[1]} Days
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">From sowing to physiological maturity</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4">
            <span className="text-xs font-medium text-[var(--color-text-muted)] block">Seasonal Water Demand</span>
            <span className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">
              {crop.waterNeedsMmPerSeason[0]}–{crop.waterNeedsMmPerSeason[1]} mm
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">Cumulative consumptive water requirement</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4">
            <span className="text-xs font-medium text-[var(--color-text-muted)] block">Optimal Thermal Range</span>
            <span className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">
              {crop.idealTempCelsius[0]}–{crop.idealTempCelsius[1]}°C
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">Critical vegetative & reproductive threshold</span>
          </div>

          <div className="py-2 sm:py-0 sm:px-4 last:pr-0">
            <span className="text-xs font-medium text-[var(--color-text-muted)] block">Soil Reaction (pH)</span>
            <span className="text-xl font-bold font-mono text-[var(--color-text-primary)] mt-1 block">
              pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">Optimal nutrient availability window</span>
          </div>
        </div>
      </div>

      {/* Structured Content Sections (Replaces Card Overload) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Growth Stages & Cultivation Calendar */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
            <div className="pb-3 border-b border-[var(--color-border)] mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                Physiological Growth Stages & Field Interventions
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                Standard days from sowing (DAS) and recommended farm operations
              </p>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {crop.growthStages.map((stage, idx) => (
                <div key={stage.name} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                        {stage.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[var(--color-text-muted)]">
                      Day {stage.daysFromSowing}+ DAS
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed pl-7">
                    {stage.description}
                  </p>
                  {stage.tasks.length > 0 && (
                    <ul className="mt-2 pl-7 space-y-1">
                      {stage.tasks.map((task, ti) => (
                        <li key={ti} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Agronomic Practices & Soil Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 space-y-4">
            <div className="pb-3 border-b border-[var(--color-border)]">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                Agronomic Management Notes
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                  Sowing & Nursery Protocol
                </span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {crop.sowingGuidance}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                  Irrigation & Moisture Management
                </span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {crop.irrigationNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                  Balanced Fertilisation (NPK)
                </span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {crop.fertiliserNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--color-border)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1">
                  Harvesting & Post-Harvest Handling
                </span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  {crop.harvestGuidance}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block">
                Compatible Soil Profiles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {crop.suitableSoils.map(soil => (
                  <span key={soil} className="px-2 py-0.5 rounded text-xs bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] font-medium border border-[var(--color-border)]">
                    {soil}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
                Cultivation Seasons
              </span>
              <div className="flex flex-wrap gap-1.5">
                {crop.seasons.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 uppercase">
                    {s} Season
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
