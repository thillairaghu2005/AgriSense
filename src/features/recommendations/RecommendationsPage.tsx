import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/providers';
import { STATES, getDistrictsByState } from '@/data/locations';
import { CROPS } from '@/data/crops';
import Button from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/forms/FormComponents';
import {
  AlertCircle, CheckCircle2, Info, ArrowRight,
  Leaf, Loader2, RotateCcw, PackageCheck
} from 'lucide-react';
import type { CropRecommendationInput, Season, SoilType, CropRecommendation } from '@/types';
import { generateRecommendations } from '@/lib/recommendationRules';

const SEASONS: { value: Season; label: string }[] = [
  { value: 'kharif', label: 'Kharif (Monsoon: Jun–Oct)' },
  { value: 'rabi', label: 'Rabi (Winter: Nov–Mar)' },
  { value: 'zaid', label: 'Zaid (Summer: Mar–Jun)' },
  { value: 'annual', label: 'Annual / Perennial' },
];

const SOIL_TYPES: { value: SoilType; label: string }[] = [
  { value: 'alluvial', label: 'Alluvial Loam (River Basin)' },
  { value: 'black', label: 'Black Soil / Regur (Vertisol)' },
  { value: 'red', label: 'Red & Yellow Sandy Loam' },
  { value: 'loamy', label: 'Rich Loamy Soil (Balanced)' },
  { value: 'clay', label: 'Clayey Soil (High Water Holding)' },
  { value: 'sandy', label: 'Sandy / Coarse Soil' },
  { value: 'laterite', label: 'Laterite (Acidic Highland)' },
];

const DEFAULT_FORM: Partial<CropRecommendationInput> = {
  state: '',
  district: '',
  landArea: 2.5,
  landAreaUnit: 'acres',
  season: 'kharif',
  soilType: 'alluvial',
};

export default function RecommendationsPage() {
  const { state: appState, district: appDistrict } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<CropRecommendationInput>>({
    ...DEFAULT_FORM,
    state: appState,
    district: appDistrict,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const districts = getDistrictsByState(form.state ?? '');

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.state) errs.state = 'State selection is required.';
    if (!form.season) errs.season = 'Select a crop season window.';
    if (!form.soilType) errs.soilType = 'Specify the predominant soil type.';
    if (!form.landArea || form.landArea <= 0) errs.landArea = 'Enter a valid land area greater than 0.';
    if (form.soilPh !== undefined && (form.soilPh < 3.5 || form.soilPh > 10.5)) {
      errs.soilPh = 'Soil pH must be within agricultural range (3.5 to 10.5).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsCalculating(true);
    setSubmitted(false);

    setTimeout(() => {
      const recs = generateRecommendations(form as CropRecommendationInput);
      setResults(recs);
      setIsCalculating(false);
      setSubmitted(true);
    }, 600);
  }

  function handleReset() {
    setForm({ ...DEFAULT_FORM, state: appState, district: appDistrict });
    setResults(null);
    setSubmitted(false);
    setErrors({});
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Specific Platform Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                ICAR Regional Agronomic Rule Engine
              </span>
              <span className="text-xs text-[var(--color-text-muted)] font-mono">Model v2.4</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text-primary)] mt-1.5 tracking-tight">
              Agronomic Suitability & Seasonal Crop Diagnostics
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-3xl leading-relaxed">
              Calculates crop viability, duration, and water requirements based on your state agro-climatic zone, landholding, and soil health characteristics.
            </p>
          </div>
          {submitted && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleReset}
            >
              Reset Parameters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Diagnostic Input Parameters */}
        <div className="lg:col-span-5 bg-white border border-[var(--color-border)] rounded-lg p-5">
          <div className="pb-3 border-b border-[var(--color-border)] mb-4">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              Farm & Soil Parameters
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Enter test values or leave nutrient levels unknown to use district baselines.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="State" htmlFor="rec-state" error={errors.state} required>
                <Select
                  id="rec-state"
                  value={form.state ?? ''}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value, district: '' }))}
                  error={!!errors.state}
                >
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </FormField>

              <FormField label="District" htmlFor="rec-district">
                <Select
                  id="rec-district"
                  value={form.district ?? ''}
                  onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  disabled={!form.state}
                >
                  <option value="">All Regional Districts</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Land Area" htmlFor="rec-area" error={errors.landArea} required>
                <Input
                  id="rec-area"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={form.landArea ?? ''}
                  onChange={e => setForm(f => ({ ...f, landArea: parseFloat(e.target.value) }))}
                  error={!!errors.landArea}
                />
              </FormField>
              <FormField label="Unit" htmlFor="rec-unit">
                <Select
                  id="rec-unit"
                  value={form.landAreaUnit ?? 'acres'}
                  onChange={e => setForm(f => ({ ...f, landAreaUnit: e.target.value as 'acres' | 'hectares' | 'bigha' }))}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="bigha">Bigha</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Sowing Season" htmlFor="rec-season" error={errors.season} required>
              <Select
                id="rec-season"
                value={form.season ?? ''}
                onChange={e => setForm(f => ({ ...f, season: e.target.value as Season }))}
                error={!!errors.season}
              >
                {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </FormField>

            <FormField label="Predominant Soil Type" htmlFor="rec-soil" error={errors.soilType} required>
              <Select
                id="rec-soil"
                value={form.soilType ?? ''}
                onChange={e => setForm(f => ({ ...f, soilType: e.target.value as SoilType }))}
                error={!!errors.soilType}
              >
                {SOIL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </FormField>

            <div className="pt-2 border-t border-[var(--color-border)]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">
                Soil Health Card Metrics (Optional)
              </span>

              <div className="grid grid-cols-4 gap-2">
                <FormField label="pH Level" htmlFor="rec-ph" error={errors.soilPh}>
                  <Input
                    id="rec-ph"
                    type="number"
                    min={3.5}
                    max={10.5}
                    step={0.1}
                    placeholder="6.5"
                    value={form.soilPh ?? ''}
                    onChange={e => setForm(f => ({ ...f, soilPh: e.target.value ? parseFloat(e.target.value) : undefined }))}
                    error={!!errors.soilPh}
                  />
                </FormField>

                {(['nitrogenLevel', 'phosphorusLevel', 'potassiumLevel'] as const).map(key => (
                  <FormField key={key} label={key === 'nitrogenLevel' ? 'N' : key === 'phosphorusLevel' ? 'P' : 'K'} htmlFor={`rec-${key}`}>
                    <Select
                      id={`rec-${key}`}
                      value={(form[key] as string) ?? ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value || undefined }))}
                    >
                      <option value="">Auto</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormField>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isCalculating}
                leftIcon={isCalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Leaf className="w-4 h-4" />}
              >
                {isCalculating ? 'Computing Agronomic Suitability...' : 'Generate Agronomic Viability Report'}
              </Button>
            </div>
          </form>
        </div>

        {/* Diagnostic Results Report */}
        <div className="lg:col-span-7 space-y-6">
          {!submitted && !isCalculating && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-8 text-center min-h-[360px] flex flex-col items-center justify-center">
              <Leaf className="w-10 h-10 text-[var(--color-text-muted)] opacity-40 mb-3" />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Awaiting Farm Parameters
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm leading-relaxed">
                Specify your district, sowing season, and soil characteristics to calculate recommended crops, water requirements, and certified seed subsidies.
              </p>
            </div>
          )}

          {isCalculating && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-10 text-center flex flex-col items-center justify-center min-h-[360px]">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                Evaluating Agro-Climatic Viability
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-xs">
                Cross-referencing soil compatibility, seasonal monsoon patterns, and ICAR state recommendations...
              </p>
            </div>
          )}

          {submitted && results && results.length > 0 && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                <div>
                  <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Agronomic Suitability Summary Table
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Ranked by agro-climatic match score for {form.season?.toUpperCase()} season
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {results.length} Suitable Crops
                </span>
              </div>

              {/* Comparative Agronomic Table (Clean typography, no cards-in-cards) */}
              <div className="overflow-x-auto">
                <table className="table-clean" aria-label="Agronomic Suitability Results">
                  <thead>
                    <tr>
                      <th>Rank & Crop</th>
                      <th>Category</th>
                      <th className="text-right">Duration (Days)</th>
                      <th className="text-right">Water Demand</th>
                      <th className="text-right">Match Score</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((rec, idx) => {
                      const crop = CROPS.find(c => c.id === rec.cropId);
                      if (!crop) return null;
                      return (
                        <tr key={rec.cropId}>
                          <td className="font-bold">
                            <span className="text-xs text-[var(--color-text-muted)] mr-1.5 font-mono">#{idx + 1}</span>
                            <span className="text-[var(--color-text-primary)]">{crop.name}</span>
                          </td>
                          <td className="capitalize text-[var(--color-text-muted)]">
                            {crop.category.replace('_', ' ')}
                          </td>
                          <td className="text-right font-mono font-medium">
                            {rec.estimatedDurationDays[0]}–{rec.estimatedDurationDays[1]}
                          </td>
                          <td className="text-right font-mono font-medium">
                            {rec.waterNeedsMmPerSeason[0]}–{rec.waterNeedsMmPerSeason[1]} mm
                          </td>
                          <td className="text-right font-mono font-bold text-emerald-800">
                            {rec.score}/100
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => navigate(`/crops/${rec.cropId}`)}
                              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
                            >
                              Guide <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Detailed Agronomic Justifications (Clean content section with dividers) */}
              <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Agronomic Evaluation & Assumptions
                </h3>

                <div className="divide-y divide-[var(--color-border)]">
                  {results.slice(0, 3).map((rec, idx) => {
                    const crop = CROPS.find(c => c.id === rec.cropId);
                    if (!crop) return null;
                    return (
                      <div key={rec.cropId} className="py-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[var(--color-text-primary)]">
                            #{idx + 1} {crop.name} — Suitability Analysis
                          </span>
                          <button
                            onClick={() => navigate('/seed-distribution')}
                            className="text-xs text-emerald-800 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <PackageCheck className="w-3.5 h-3.5" /> Subsidized Seeds Available
                          </button>
                        </div>

                        <ul className="space-y-1 text-xs">
                          {rec.reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[var(--color-text-secondary)]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>

                        {rec.assumptions.length > 0 && (
                          <div className="p-2.5 bg-[var(--color-surface-2)] rounded border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
                            <span className="font-semibold text-[var(--color-text-secondary)] block mb-0.5">Assumptions applied:</span>
                            {rec.assumptions.join(' • ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded text-xs text-[var(--color-text-muted)] flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Advisory Disclaimer:</strong> Results are generated through agronomic rules matching soil classification and seasonal rainfall models. Field-specific pest pressures or local micro-climates should be verified with your Block Agricultural Extension Officer.
                </span>
              </div>
            </div>
          )}

          {submitted && results && results.length === 0 && (
            <div className="bg-white border border-[var(--color-border)] rounded-lg p-8 text-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                No Compatible Crops Found
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm mx-auto">
                No crops in the catalogue strictly match the current combination of soil pH and season. Try adjusting the season or soil type to view neighboring recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
