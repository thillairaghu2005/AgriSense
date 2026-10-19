import { useState } from 'react';
import { useApp } from '@/app/providers';
import { STATES, getDistrictsByState } from '@/data/locations';
import { CROPS } from '@/data/crops';
import { Card, PageHeader, Badge, InfoBanner, DemoLabel } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/forms/FormComponents';
import { Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';
import type { CropRecommendationInput, Season, SoilType, CropRecommendation } from '@/types';
import { generateRecommendations } from '@/lib/recommendationRules';

const SEASONS: { value: Season; label: string }[] = [
  { value: 'kharif', label: 'Kharif (Jun–Oct)' },
  { value: 'rabi', label: 'Rabi (Nov–Mar)' },
  { value: 'zaid', label: 'Zaid (Mar–Jun)' },
  { value: 'annual', label: 'Annual' },
];

const SOIL_TYPES: { value: SoilType; label: string }[] = [
  { value: 'clay', label: 'Clay' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'loamy', label: 'Loamy' },
  { value: 'black', label: 'Black (Vertisol)' },
  { value: 'red', label: 'Red' },
  { value: 'alluvial', label: 'Alluvial' },
  { value: 'laterite', label: 'Laterite' },
];


const DEFAULT_FORM: Partial<CropRecommendationInput> = {
  state: '',
  district: '',
  landArea: 1,
  landAreaUnit: 'acres',
  season: 'kharif',
  soilType: 'loamy',
};

export default function RecommendationsPage() {
  const { state: appState } = useApp();
  const [form, setForm] = useState<Partial<CropRecommendationInput>>({
    ...DEFAULT_FORM,
    state: appState,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CropRecommendation[] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const districts = getDistrictsByState(form.state ?? '');

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.state) errs.state = 'Please select a state.';
    if (!form.season) errs.season = 'Please select a season.';
    if (!form.soilType) errs.soilType = 'Please select a soil type.';
    if (!form.landArea || form.landArea <= 0) errs.landArea = 'Enter a valid land area.';
    if (form.soilPh !== undefined && (form.soilPh < 3 || form.soilPh > 11)) errs.soilPh = 'pH must be between 3 and 11.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const recs = generateRecommendations(form as CropRecommendationInput);
    setResults(recs);
    setSubmitted(true);
  }

  function handleReset() {
    setForm({ ...DEFAULT_FORM, state: appState });
    setResults(null);
    setSubmitted(false);
    setErrors({});
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Crop Recommendations"
        subtitle="Enter your farm details to get illustrative crop suggestions."
        badge={<DemoLabel label="Demo — not a validated model" />}
      />

      <InfoBanner variant="warning">
        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Demo Recommendation Only.</strong> Results are based on simple illustrative rules — not a validated agricultural model. Missing values are filled with assumptions. For high-stakes decisions, consult your local Krishi Vigyan Kendra or agriculture extension officer.
          </div>
        </div>
      </InfoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">Farm Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                  <option value="">All Districts</option>
                  {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </Select>
              </FormField>

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

              <FormField label="Season" htmlFor="rec-season" error={errors.season} required>
                <Select
                  id="rec-season"
                  value={form.season ?? ''}
                  onChange={e => setForm(f => ({ ...f, season: e.target.value as Season }))}
                  error={!!errors.season}
                >
                  {SEASONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </FormField>

              <FormField label="Soil Type" htmlFor="rec-soil" error={errors.soilType} required>
                <Select
                  id="rec-soil"
                  value={form.soilType ?? ''}
                  onChange={e => setForm(f => ({ ...f, soilType: e.target.value as SoilType }))}
                  error={!!errors.soilType}
                >
                  {SOIL_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </Select>
              </FormField>

              <FormField label="Soil pH (optional)" htmlFor="rec-ph" error={errors.soilPh} hint="Leave blank if unknown">
                <Input
                  id="rec-ph"
                  type="number"
                  min={3}
                  max={11}
                  step={0.1}
                  placeholder="e.g. 6.5"
                  value={form.soilPh ?? ''}
                  onChange={e => setForm(f => ({ ...f, soilPh: e.target.value ? parseFloat(e.target.value) : undefined }))}
                  error={!!errors.soilPh}
                />
              </FormField>

              <div className="grid grid-cols-3 gap-2">
                {(['nitrogenLevel', 'phosphorusLevel', 'potassiumLevel'] as const).map(key => (
                  <FormField key={key} label={key === 'nitrogenLevel' ? 'N' : key === 'phosphorusLevel' ? 'P' : 'K'} htmlFor={`rec-${key}`} hint="Optional">
                    <Select
                      id={`rec-${key}`}
                      value={(form[key] as string) ?? ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value || undefined }))}
                    >
                      <option value="">Unknown</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormField>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Get Suggestions
                </Button>
                {submitted && (
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {!submitted ? (
            <div className="h-full flex items-center justify-center min-h-48">
              <div className="text-center text-[var(--color-text-muted)]">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">Fill in your farm details</p>
                <p className="text-xs mt-1">to get illustrative crop suggestions</p>
              </div>
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Top Suggestions</h2>
              {results.map((rec, idx) => {
                const crop = CROPS.find(c => c.id === rec.cropId);
                if (!crop) return null;
                return (
                  <Card key={rec.cropId} className="border-l-4 border-l-[var(--color-primary-500)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-muted)]">#{idx + 1}</span>
                          <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{crop.name}</h3>
                          <Badge variant={idx === 0 ? 'green' : idx === 1 ? 'amber' : 'gray'}>
                            Score {rec.score}/100
                          </Badge>
                        </div>

                        {/* Reasons */}
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-1.5">Why suitable:</p>
                          <ul className="space-y-1">
                            {rec.reasons.map((r, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                <CheckCircle className="w-3 h-3 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Assumptions */}
                        {rec.assumptions.length > 0 && (
                          <div className="mt-3 p-2.5 bg-amber-50 rounded-lg">
                            <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                              <Info className="w-3 h-3" /> Assumptions made:
                            </p>
                            <ul className="space-y-0.5">
                              {rec.assumptions.map((a, i) => (
                                <li key={i} className="text-xs text-amber-700">• {a}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Missing data */}
                        {rec.missingData.length > 0 && (
                          <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                            <span className="font-medium">Not provided:</span> {rec.missingData.join(', ')}
                          </div>
                        )}

                        {/* Quick stats */}
                        <div className="mt-3 flex gap-4 text-xs text-[var(--color-text-muted)]">
                          <span>⏱ {rec.estimatedDurationDays[0]}–{rec.estimatedDurationDays[1]} days</span>
                          <span>💧 {rec.waterNeedsMmPerSeason[0]}–{rec.waterNeedsMmPerSeason[1]} mm/season</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              <p className="text-xs text-[var(--color-text-muted)] italic">These are illustrative suggestions based on a simple rules engine. For reliable advice, consult your local agricultural extension officer.</p>
            </div>
          ) : (
            <Card>
              <p className="text-sm text-[var(--color-text-muted)] text-center py-8">No crops matched your inputs. Try adjusting soil type or season.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
