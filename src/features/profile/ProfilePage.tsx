import { useState } from 'react';
import { Card, PageHeader, DemoLabel } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/forms/FormComponents';
import { useApp } from '@/app/providers';
import { useToast } from '@/components/feedback/Toast';
import { STATES, getDistrictsByState } from '@/data/locations';
import { LANGUAGES } from '@/data/translations';
import type { SoilType } from '@/types';
import {
  User,
  Globe,
  Sprout,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const SOIL_OPTIONS: { value: SoilType; label: string }[] = [
  { value: 'alluvial', label: 'Alluvial Soil' },
  { value: 'black', label: 'Black Soil (Regur)' },
  { value: 'red', label: 'Red Soil' },
  { value: 'loamy', label: 'Loamy Soil' },
  { value: 'sandy', label: 'Sandy Soil' },
  { value: 'clay', label: 'Clay Soil' },
  { value: 'laterite', label: 'Laterite Soil' },
];

export default function ProfilePage() {
  const {
    profile,
    updateProfile,
    language,
    setLanguage,
    state: selectedState,
    setState,
    district: selectedDistrict,
    setDistrict,
    resetDemoData,
  } = useApp();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [village, setVillage] = useState(profile.village || '');
  const [landArea, setLandArea] = useState(profile.landArea);
  const [landAreaUnit, setLandAreaUnit] = useState(profile.landAreaUnit);
  const [soilType, setSoilType] = useState<SoilType>(profile.soilType);

  const [highContrast, setHighContrast] = useState(profile.accessibility.highContrast);
  const [largeText, setLargeText] = useState(profile.accessibility.largeText);
  const [reducedMotion, setReducedMotion] = useState(profile.accessibility.reducedMotion);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const districts = getDistrictsByState(selectedState);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();

    updateProfile({
      displayName: displayName.trim() || 'Farmer',
      preferredLanguage: language,
      state: selectedState,
      district: selectedDistrict,
      village: village.trim(),
      landArea: Number(landArea) || 1,
      landAreaUnit,
      soilType,
      accessibility: {
        highContrast,
        largeText,
        reducedMotion,
      },
    });

    setSavedSuccess(true);
    showToast('Profile and regional preferences updated', { type: 'success' });
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  function handleResetAll() {
    resetDemoData();
    setDisplayName('Farmer');
    setVillage('');
    setLandArea(2);
    setLandAreaUnit('acres');
    setSoilType('loamy');
    setHighContrast(false);
    setLargeText(false);
    setReducedMotion(false);
    setConfirmResetOpen(false);
    showToast('All demo records reset to initial state', { type: 'info' });
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="Farmer Profile & Regional Settings"
        subtitle="Customise your location, farm holding characteristics, and accessibility preferences"
        badge={<DemoLabel label="Local demo profile" />}
      />

      {savedSuccess && (
        <div className="p-3.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] text-[var(--color-primary-900)] rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully to your browser storage!</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal & Farm Location */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <User className="w-5 h-5 text-[var(--color-primary-600)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Personal & Farm Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Farmer / Farm Display Name" required>
              <Input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
              />
            </FormField>

            <FormField label="Village / Gram Panchayat (Optional)">
              <Input
                type="text"
                value={village}
                onChange={e => setVillage(e.target.value)}
                placeholder="e.g. Vaduvur Agraharam"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="State" required hint="Used to localize crop advisories and market prices">
              <Select
                value={selectedState}
                onChange={e => {
                  const newState = e.target.value;
                  setState(newState);
                  const newDistricts = getDistrictsByState(newState);
                  if (newDistricts.length > 0) {
                    setDistrict(newDistricts[0].id);
                  }
                }}
                required
              >
                {STATES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="District" required>
              <Select
                value={selectedDistrict}
                onChange={e => setDistrict(e.target.value)}
                required
              >
                {districts.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </Card>

        {/* Agricultural Holding Characteristics */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Sprout className="w-5 h-5 text-[var(--color-primary-600)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Land Holding & Soil Baseline
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Total Cultivable Area" required>
              <Input
                type="number"
                min="0.1"
                step="0.5"
                value={landArea}
                onChange={e => setLandArea(parseFloat(e.target.value) || 1)}
                required
              />
            </FormField>

            <FormField label="Measurement Unit">
              <Select
                value={landAreaUnit}
                onChange={e => setLandAreaUnit(e.target.value as any)}
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
                <option value="bigha">Bigha</option>
              </Select>
            </FormField>

            <FormField label="Predominant Soil Type">
              <Select
                value={soilType}
                onChange={e => setSoilType(e.target.value as SoilType)}
              >
                {SOIL_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </Card>

        {/* Language & Accessibility */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Globe className="w-5 h-5 text-[var(--color-primary-600)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Language & Accessibility Options
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Preferred Application Language">
              <Select
                value={language}
                onChange={e => setLanguage(e.target.value)}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.nativeLabel} ({l.label})
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="pt-2 space-y-3">
            <p className="text-xs font-semibold text-[var(--color-text-primary)]">
              Interface Adaptations:
            </p>

            <label className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={e => setHighContrast(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-primary-600)] accent-[var(--color-primary-600)] focus:ring-[var(--color-primary-600)]"
              />
              <span>High Contrast Mode (Enhances visibility under outdoor direct sunlight)</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={largeText}
                onChange={e => setLargeText(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-primary-600)] accent-[var(--color-primary-600)] focus:ring-[var(--color-primary-600)]"
              />
              <span>Larger Text Size (Increased font scale for easy reading)</span>
            </label>

            <label className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={e => setReducedMotion(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--color-primary-600)] accent-[var(--color-primary-600)] focus:ring-[var(--color-primary-600)]"
              />
              <span>Reduce Motion & Animations (Optimised for lower-power devices)</span>
            </label>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setConfirmResetOpen(true)}
          >
            Reset Demo Data
          </Button>

          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Profile Settings
          </Button>
        </div>
      </form>

      {/* Confirmation Modal for Resetting Demo Data */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[var(--color-border)] space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Reset All Local Demo Data?
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                This will clear all locally saved tasks, financial transactions, recorded soil health tests, and scheme checklist progress from your browser storage.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmResetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleResetAll}
              >
                Yes, Reset All Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
