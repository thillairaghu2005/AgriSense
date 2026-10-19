import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, Clock, Thermometer, Layers, CheckCircle2 } from 'lucide-react';
import { getCropById } from '@/data/crops';
import { Card, Badge, PageHeader, InfoBanner } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function CropDetailPage() {
  const { cropId } = useParams<{ cropId: string }>();
  const navigate = useNavigate();
  const crop = cropId ? getCropById(cropId) : undefined;

  if (!crop) {
    return (
      <EmptyState
        title="Crop not found"
        description="The crop you're looking for doesn't exist."
        action={<Button variant="outline" onClick={() => navigate('/crops')}>Back to Catalogue</Button>}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/crops')}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label="Back to crop catalogue"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={crop.name}
          subtitle="General crop guidance — conditions vary by region and variety."
          badge={<Badge variant="green">{crop.category.replace('_', ' ')}</Badge>}
        />
      </div>

      <InfoBanner variant="info">
        <strong>Note:</strong> All guidance on this page is general information. Actual recommendations depend on your specific soil test results, local climate, variety, and agronomic practices. Consult your district agricultural officer or Krishi Vigyan Kendra for localised advice.
      </InfoBanner>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <Clock className="w-5 h-5 text-[var(--color-primary-600)] mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.durationDays[0]}–{crop.durationDays[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Days to Harvest</p>
        </div>
        <div className="card text-center">
          <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.waterNeedsMmPerSeason[0]}–{crop.waterNeedsMmPerSeason[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)]">mm Water / Season</p>
        </div>
        <div className="card text-center">
          <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.idealTempCelsius[0]}–{crop.idealTempCelsius[1]}°C</p>
          <p className="text-xs text-[var(--color-text-muted)]">Ideal Temperature</p>
        </div>
        <div className="card text-center">
          <Layers className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-[var(--color-text-primary)]">pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)]">Soil pH Range</p>
        </div>
      </div>

      {/* Seasons & Soils */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Seasons</h2>
          <div className="flex gap-2 flex-wrap">
            {crop.seasons.map(s => (
              <Badge key={s} variant="amber">{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Suitable Soils</h2>
          <div className="flex gap-2 flex-wrap">
            {crop.suitableSoils.map(s => (
              <Badge key={s} variant="gray">{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Growth Stages */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Growth Stages</h2>
        <div className="relative">
          {crop.growthStages.map((stage, idx) => (
            <div key={stage.name} className="flex gap-4 mb-5 last:mb-0">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary-100)] border-2 border-[var(--color-primary-400)] flex items-center justify-center flex-shrink-0 z-10">
                  <span className="text-[10px] font-bold text-[var(--color-primary-700)]">{idx + 1}</span>
                </div>
                {idx < crop.growthStages.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[var(--color-border)] mt-1" style={{ minHeight: 20 }} />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{stage.name}</h3>
                  <Badge variant="gray">Day {stage.daysFromSowing}+</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{stage.description}</p>
                {stage.tasks.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {stage.tasks.map((task, ti) => (
                      <li key={ti} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                        <CheckCircle2 className="w-3 h-3 text-[var(--color-primary-500)] mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Guidance sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Sowing Guidance</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{crop.sowingGuidance}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Harvest Guidance</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{crop.harvestGuidance}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Irrigation Notes</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{crop.irrigationNotes}</p>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Fertiliser Notes</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{crop.fertiliserNotes}</p>
        </Card>
      </div>

      {/* Local names */}
      {Object.keys(crop.localNames).length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Local Names</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(crop.localNames).map(([lang, name]) => (
              <div key={lang} className="px-3 py-1.5 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg">
                <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase mr-1.5">{lang}</span>
                <span className="text-sm text-[var(--color-text-primary)]">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
