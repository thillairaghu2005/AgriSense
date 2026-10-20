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
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-700)] hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-xs cursor-pointer"
          aria-label="Back to crop catalogue"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title={crop.name}
          subtitle="General crop guidance — conditions vary by region and variety."
          badge={<Badge variant="blue">{crop.category.replace('_', ' ')}</Badge>}
        />
      </div>

      <InfoBanner variant="info">
        <strong>Note:</strong> All guidance on this page is general information. Actual recommendations depend on your specific soil test results, local climate, variety, and agronomic practices. Consult your district agricultural officer or Krishi Vigyan Kendra for localised advice.
      </InfoBanner>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-700 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.durationDays[0]}–{crop.durationDays[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Days to Harvest</p>
        </Card>
        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mx-auto mb-2 text-sky-700 shadow-xs">
            <Droplets className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.waterNeedsMmPerSeason[0]}–{crop.waterNeedsMmPerSeason[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">mm Water / Season</p>
        </Card>
        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-2 text-amber-700 shadow-xs">
            <Thermometer className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">{crop.idealTempCelsius[0]}–{crop.idealTempCelsius[1]}°C</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Ideal Temperature</p>
        </Card>
        <Card className="text-center p-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mx-auto mb-2 text-purple-700 shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-[var(--color-text-primary)]">pH {crop.idealPhRange[0]}–{crop.idealPhRange[1]}</p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Soil pH Range</p>
        </Card>
      </div>

      {/* Seasons & Soils */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Seasons</h2>
          <div className="flex gap-2 flex-wrap">
            {crop.seasons.map(s => (
              <Badge key={s} variant="green">{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Suitable Soils</h2>
          <div className="flex gap-2 flex-wrap">
            {crop.suitableSoils.map(s => (
              <Badge key={s} variant="neutral">{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Growth Stages - Clean layout without decorative timeline dots or lines */}
      <Card>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Growth Stages</h2>
        <div className="space-y-5">
          {crop.growthStages.map((stage, idx) => (
            <div key={stage.name} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{stage.name}</h3>
                  <Badge variant="purple">Day {stage.daysFromSowing}+</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{stage.description}</p>
                {stage.tasks.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {stage.tasks.map((task, ti) => (
                      <li key={ti} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
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
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Fertiliser Advice</h2>
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{crop.fertiliserNotes}</p>
        </Card>
      </div>
    </div>
  );
}
