import { useState, useRef } from 'react';
import { Card, PageHeader, InfoBanner, EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, Input, Select } from '@/components/forms/FormComponents';
import type { SoilTest, SoilType } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatDate, generateId } from '@/lib/formatters';
import { useToast } from '@/components/feedback/Toast';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { CROPS } from '@/data/crops';
import {
  FlaskConical,
  Layers,
  Upload,
  Trash2,
  HelpCircle,
  Plus,
  X,
  Printer,
  Calculator,
  CheckCircle2,
} from 'lucide-react';

const SOIL_PROFILES: {
  type: SoilType;
  name: string;
  color: string;
  description: string;
  drainage: string;
  idealCrops: string[];
  managementTips: string;
}[] = [
  {
    type: 'alluvial',
    name: 'Alluvial Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'Deposition soil rich in potash and humus. Extremely fertile with balanced loam texture.',
    drainage: 'Moderate to well-drained',
    idealCrops: ['Rice', 'Wheat', 'Sugarcane', 'Maize', 'Pulses'],
    managementTips: 'Maintain organic matter with compost. Balanced NPK application is key.',
  },
  {
    type: 'black',
    name: 'Black Soil (Regur / Vertisol)',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'High clay content with high moisture retention and swelling properties. Rich in calcium and magnesium.',
    drainage: 'Slow drainage; prone to waterlogging in heavy rains',
    idealCrops: ['Cotton', 'Soyabean', 'Gram (Chickpea)', 'Millets', 'Sugarcane'],
    managementTips: 'Provide drainage channels. Avoid deep tillage when wet.',
  },
  {
    type: 'red',
    name: 'Red Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'Porous and friable texture with iron oxide richness. Naturally low in nitrogen and phosphorus.',
    drainage: 'Rapid drainage; low water retention',
    idealCrops: ['Groundnut', 'Millets', 'Pulses', 'Oilseeds', 'Potato'],
    managementTips: 'Add farmyard manure (FYM) regularly to improve water retention and phosphorus availability.',
  },
  {
    type: 'loamy',
    name: 'Loamy Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'The agricultural standard mixture of sand, silt, and clay. Excellent tilth and aeration.',
    drainage: 'Ideal balanced drainage and aeration',
    idealCrops: ['Vegetables', 'Wheat', 'Cotton', 'Fruits', 'Maize'],
    managementTips: 'Ideal for most intensive crops. Maintain organic carbon through green manuring.',
  },
  {
    type: 'sandy',
    name: 'Sandy Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'Coarse particles with high permeability. Highly prone to nutrient leaching.',
    drainage: 'Excessive drainage; dry surface',
    idealCrops: ['Groundnut', 'Watermelon', 'Millets', 'Root vegetables'],
    managementTips: 'Use drip fertigation in split doses. Incorporate bulky organic manures.',
  },
  {
    type: 'clay',
    name: 'Clay Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'Fine particles with high water-holding capacity and plasticity. Very slow drying.',
    drainage: 'Poor drainage; high compaction risk',
    idealCrops: ['Rice (Paddy)', 'Broccoli', 'Cabbage'],
    managementTips: 'Avoid over-irrigation. Incorporate coarse sand or organic matter to improve aeration.',
  },
  {
    type: 'laterite',
    name: 'Laterite Soil',
    color: 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)]',
    description: 'Formed by intense tropical leaching. Acidic with low organic matter, lime, and nitrogen.',
    drainage: 'Rapid drainage',
    idealCrops: ['Tea', 'Coffee', 'Cashew', 'Rubber', 'Coconut'],
    managementTips: 'Apply agricultural lime periodically to neutralise acidity. Replenish micronutrients.',
  },
];

const DEFAULT_TESTS: SoilTest[] = [
  {
    id: 'test-1',
    testDate: '2026-02-15',
    soilType: 'alluvial',
    ph: 7.2,
    nitrogen: 'medium',
    phosphorus: 'low',
    potassium: 'high',
    organicCarbon: 0.55,
    source: 'laboratory',
    labName: 'District Soil Testing Laboratory, Thanjavur',
    notes: 'Soil Health Card sample #TN-2026-891. Phosphorus supplement recommended for samba paddy.',
    createdAt: '2026-02-16T10:00:00.000Z',
  },
];

export default function SoilPage() {
  const { showToast } = useToast();
  const [soilTests, setSoilTests] = useState<SoilTest[]>(() =>
    storageGet(STORAGE_KEYS.SOIL_TESTS, DEFAULT_TESTS)
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'tests' | 'calculator' | 'guide'>('profile');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formSoilType, setFormSoilType] = useState<SoilType>('alluvial');
  const [formPh, setFormPh] = useState<string>('7.0');
  const [formN, setFormN] = useState<'low' | 'medium' | 'high'>('medium');
  const [formP, setFormP] = useState<'low' | 'medium' | 'high'>('medium');
  const [formK, setFormK] = useState<'low' | 'medium' | 'high'>('medium');
  const [formOc, setFormOc] = useState<string>('0.55');
  const [formLabName, setFormLabName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // File Upload Preview
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fertilizer Calculator State
  const [calcCropId, setCalcCropId] = useState<string>('rice');
  const [calcAcreage, setCalcAcreage] = useState<number>(2);
  const [calcSoilStatus, setCalcSoilStatus] = useState({
    n: 'medium',
    p: 'low',
    k: 'high',
    ph: 7.0,
  });

  function handleSaveTest(e: React.FormEvent) {
    e.preventDefault();
    const phNum = parseFloat(formPh);
    if (isNaN(phNum) || phNum < 3 || phNum > 11) {
      setFormError('Please enter a valid soil pH between 3.0 and 11.0');
      return;
    }

    const ocNum = parseFloat(formOc);

    const newTest: SoilTest = {
      id: generateId(),
      testDate: formDate,
      soilType: formSoilType,
      ph: phNum,
      nitrogen: formN,
      phosphorus: formP,
      potassium: formK,
      organicCarbon: isNaN(ocNum) ? undefined : ocNum,
      source: 'laboratory',
      labName: formLabName.trim() || 'Laboratory Soil Test',
      notes: formNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [newTest, ...soilTests];
    setSoilTests(updated);
    storageSet(STORAGE_KEYS.SOIL_TESTS, updated);
    setShowAddForm(false);
    setFormError('');
    setUploadedDocName(null);
    showToast('Soil Health Card record saved successfully', { type: 'success' });
  }

  function confirmDelete() {
    if (deleteTargetId) {
      const updated = soilTests.filter(t => t.id !== deleteTargetId);
      setSoilTests(updated);
      storageSet(STORAGE_KEYS.SOIL_TESTS, updated);
      setDeleteTargetId(null);
      showToast('Soil test record removed', { type: 'info' });
    }
  }

  function handleDocSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
    }
  }

  // Calculate Fertilizer Dose based on selected crop and soil status
  const fertilizerPlan = (() => {
    // Base kg/acre requirements (N, P2O5, K2O)
    const baseReqs: Record<string, [number, number, number]> = {
      rice: [48, 24, 24],
      wheat: [50, 25, 20],
      cotton: [40, 20, 20],
      maize: [48, 24, 20],
      groundnut: [10, 20, 30],
      sugarcane: [100, 30, 45],
    };

    const req = baseReqs[calcCropId] || [45, 20, 20];
    const nMult = calcSoilStatus.n === 'low' ? 1.25 : calcSoilStatus.n === 'high' ? 0.75 : 1.0;
    const pMult = calcSoilStatus.p === 'low' ? 1.3 : calcSoilStatus.p === 'high' ? 0.7 : 1.0;
    const kMult = calcSoilStatus.k === 'low' ? 1.25 : calcSoilStatus.k === 'high' ? 0.75 : 1.0;

    const totalN = req[0] * nMult * calcAcreage;
    const totalP = req[1] * pMult * calcAcreage;
    const totalK = req[2] * kMult * calcAcreage;

    // Commercial fertilizer formulation calculation
    // DAP (18% N, 46% P2O5) supplies P and partial N
    const dapKg = Math.round(totalP / 0.46);
    const nSuppliedByDap = dapKg * 0.18;
    const remainingN = Math.max(0, totalN - nSuppliedByDap);
    const ureaKg = Math.round(remainingN / 0.46);
    const mopKg = Math.round(totalK / 0.60);

    const dapBags = (dapKg / 50).toFixed(1);
    const ureaBags = (ureaKg / 50).toFixed(1);
    const mopBags = (mopKg / 50).toFixed(1);

    return {
      dapKg,
      dapBags,
      ureaKg,
      ureaBags,
      mopKg,
      mopBags,
      fymTonnes: Math.round(4 * calcAcreage),
      soilAmendment:
        calcSoilStatus.ph < 6.0
          ? 'Apply Agricultural Lime (100–150 kg/acre) to reduce acidity.'
          : calcSoilStatus.ph > 8.2
          ? 'Apply Gypsum (200–250 kg/acre) and green manure to reclaim sodic soil.'
          : 'Soil pH is balanced. No chemical amendment required.',
    };
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Soil Health & Fertiliser Management"
        subtitle="Record certified laboratory tests, calculate tailored N-P-K fertilizer doses, and print health cards"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print Health Card
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setActiveTab('tests');
                setShowAddForm(true);
              }}
            >
              Record Soil Test
            </Button>
          </div>
        }
      />

      <InfoBanner variant="info">
        <strong>Certified Laboratory Guidance:</strong> Fertilizer dosages must be based on certified <strong>Soil Health Cards (SHC)</strong> issued by government soil testing laboratories. Calculations below provide extension-standard estimates.
      </InfoBanner>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-lg w-fit flex-wrap" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Major Soil Types ({SOIL_PROFILES.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'tests'}
          onClick={() => setActiveTab('tests')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'tests'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>My Soil Tests ({soilTests.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'calculator'}
          onClick={() => setActiveTab('calculator')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'calculator'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Fertiliser Dose Calculator</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'guide'}
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'guide'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Nutrients & pH Guide</span>
        </button>
      </div>

      {/* TAB 1: SOIL TYPES REFERENCE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOIL_PROFILES.map(item => (
            <Card key={item.type} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {item.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.type.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="bg-[var(--color-surface-1)] p-2.5 rounded-lg border border-[var(--color-border)] space-y-2 mb-3">
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
                      Drainage & Aeration
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">
                      {item.drainage}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
                      Recommended Crops
                    </span>
                    <div className="flex items-center gap-1 flex-wrap mt-1">
                      {item.idealCrops.map(crop => (
                        <span
                          key={crop}
                          className="text-[10px] bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2.5">
                <p className="text-[11px] text-[var(--color-text-muted)] italic">
                  {item.managementTips}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: MY SOIL TESTS */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {showAddForm && (
            <Card className="shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[var(--color-primary-600)]" />
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Enter Certified Soil Health Card Results
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs rounded-lg mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveTest} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField label="Testing Date" required>
                    <Input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      required
                    />
                  </FormField>

                  <FormField label="Soil Classification" required>
                    <Select
                      value={formSoilType}
                      onChange={e => setFormSoilType(e.target.value as SoilType)}
                      required
                    >
                      {SOIL_PROFILES.map(s => (
                        <option key={s.type} value={s.type}>
                          {s.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="Soil pH (3.0 – 11.0)" required hint="7.0 is neutral">
                    <Input
                      type="number"
                      step="0.1"
                      min="3.0"
                      max="11.0"
                      value={formPh}
                      onChange={e => setFormPh(e.target.value)}
                      required
                    />
                  </FormField>
                </div>

                <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)]">
                  <p className="text-xs font-bold text-[var(--color-text-primary)] mb-2">
                    Primary Macro-Nutrient Indices (as reported on Soil Card)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <FormField label="Nitrogen (N)">
                      <Select
                        value={formN}
                        onChange={e => setFormN(e.target.value as any)}
                      >
                        <option value="low">Low (&lt; 280 kg/ha)</option>
                        <option value="medium">Medium (280–560 kg/ha)</option>
                        <option value="high">High (&gt; 560 kg/ha)</option>
                      </Select>
                    </FormField>

                    <FormField label="Phosphorus (P)">
                      <Select
                        value={formP}
                        onChange={e => setFormP(e.target.value as any)}
                      >
                        <option value="low">Low (&lt; 10 kg/ha)</option>
                        <option value="medium">Medium (10–25 kg/ha)</option>
                        <option value="high">High (&gt; 25 kg/ha)</option>
                      </Select>
                    </FormField>

                    <FormField label="Potassium (K)">
                      <Select
                        value={formK}
                        onChange={e => setFormK(e.target.value as any)}
                      >
                        <option value="low">Low (&lt; 108 kg/ha)</option>
                        <option value="medium">Medium (108–280 kg/ha)</option>
                        <option value="high">High (&gt; 280 kg/ha)</option>
                      </Select>
                    </FormField>

                    <FormField label="Organic Carbon (%)" hint="Target &gt; 0.75%">
                      <Input
                        type="number"
                        step="0.05"
                        min="0"
                        max="5"
                        value={formOc}
                        onChange={e => setFormOc(e.target.value)}
                      />
                    </FormField>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Laboratory Name / Certificate ID">
                    <Input
                      type="text"
                      placeholder="e.g. KVK Soil Testing Center, Sample #1024"
                      value={formLabName}
                      onChange={e => setFormLabName(e.target.value)}
                    />
                  </FormField>

                  <FormField label="Attach Lab Report / Scan (Optional)">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        leftIcon={<Upload className="w-3.5 h-3.5" />}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedDocName ? 'Change File' : 'Browse File'}
                      </Button>
                      {uploadedDocName && (
                        <span className="text-xs text-neutral-800 font-medium truncate max-w-[150px]">
                          {uploadedDocName}
                        </span>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleDocSelect}
                        className="hidden"
                        accept=".pdf,image/*"
                      />
                    </div>
                  </FormField>
                </div>

                <FormField label="Field Notes / Recommended Actions">
                  <Input
                    type="text"
                    placeholder="e.g. Basal DAP required for upcoming rice crop"
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                  />
                </FormField>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Soil Test Card
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {soilTests.length === 0 ? (
            <Card>
              <EmptyState
                icon={<FlaskConical className="w-12 h-12 text-[var(--color-text-muted)]" />}
                title="No Soil Health Cards recorded"
                description="Record results from your government soil health card to unlock personalized fertilizer dosage recommendations."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={() => setShowAddForm(true)}
                  >
                    Enter First Test Card
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="space-y-4">
              {soilTests.map(test => {
                const isAcidic = (test.ph ?? 7) < 6.5;
                const isAlkaline = (test.ph ?? 7) > 7.8;
                const isNeutral = !isAcidic && !isAlkaline;

                return (
                  <Card key={test.id} className="space-y-4 print:border-black">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-primary-50)] text-[var(--color-primary-800)] border border-[var(--color-primary-200)]">
                            Laboratory Tested
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            Tested on {formatDate(test.testDate)}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                          {test.labName || 'Soil Health Card Report'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 no-print">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Calculator className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setCalcSoilStatus({
                              n: test.nitrogen || 'medium',
                              p: test.phosphorus || 'medium',
                              k: test.potassium || 'medium',
                              ph: test.ph || 7.0,
                            });
                            setActiveTab('calculator');
                          }}
                        >
                          Calculate Fertilizer Dose
                        </Button>
                        <button
                          onClick={() => setDeleteTargetId(test.id)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                          aria-label="Delete test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Nutrient Metric Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3 bg-[var(--color-surface-1)] rounded-lg text-center border border-[var(--color-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                          Soil pH
                        </span>
                        <p className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">
                          {test.ph ?? 'N/A'}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {isAcidic ? 'Acidic' : isAlkaline ? 'Alkaline' : 'Optimal/Neutral'}
                        </span>
                      </div>

                      <div className="p-3 bg-[var(--color-surface-1)] rounded-lg text-center border border-[var(--color-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                          Nitrogen (N)
                        </span>
                        <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1.5 uppercase">
                          {test.nitrogen ?? 'N/A'}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Available N</span>
                      </div>

                      <div className="p-3 bg-[var(--color-surface-1)] rounded-lg text-center border border-[var(--color-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                          Phosphorus (P)
                        </span>
                        <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1.5 uppercase">
                          {test.phosphorus ?? 'N/A'}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Available P</span>
                      </div>

                      <div className="p-3 bg-[var(--color-surface-1)] rounded-lg text-center border border-[var(--color-border)]">
                        <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                          Potassium (K)
                        </span>
                        <p className="text-sm font-bold text-[var(--color-text-primary)] mt-1.5 uppercase">
                          {test.potassium ?? 'N/A'}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)]">Available K</span>
                      </div>

                      <div className="p-3 bg-[var(--color-surface-1)] rounded-lg text-center border border-[var(--color-border)] col-span-2 sm:col-span-1">
                        <span className="text-[10px] uppercase font-semibold text-[var(--color-text-muted)] block">
                          Organic Carbon
                        </span>
                        <p className="text-lg font-bold text-[var(--color-text-primary)] mt-0.5">
                          {test.organicCarbon != null ? `${test.organicCarbon}%` : 'N/A'}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-muted)]">
                          {(test.organicCarbon ?? 0) < 0.5 ? 'Deficient' : 'Adequate'}
                        </span>
                      </div>
                    </div>

                    {/* General Amendment Advisory */}
                    <div className="bg-[var(--color-surface-1)] p-3.5 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] space-y-1">
                      <p className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-[var(--color-primary-700)]" /> Agronomic Soil Health Advisory:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5 text-[var(--color-text-secondary)] text-[11px] leading-relaxed">
                        {isAcidic && <li>Soil pH is acidic (&lt; 6.5). Apply agricultural lime (calcium carbonate) at 100 kg/acre to restore nutrient bioavailability.</li>}
                        {isAlkaline && <li>Soil pH is alkaline (&gt; 7.8). Apply gypsum (200 kg/acre) and incorporate green manure (Dhaincha) to reduce sodicity.</li>}
                        {isNeutral && <li>Soil pH is in the optimal range (6.5–7.5) for nutrient bioavailability and root health.</li>}
                        {test.nitrogen === 'low' && <li>Nitrogen is low: Incorporate bio-fertilizers (Azospirillum) and apply urea in 3 equal split doses.</li>}
                        {test.phosphorus === 'low' && <li>Phosphorus is low: Apply single superphosphate (SSP) or DAP as basal dose during field preparation.</li>}
                        {test.potassium === 'high' && <li>Potassium is high: Reduce chemical potash (MOP) dosage by 25% to prevent nutrient imbalance.</li>}
                      </ul>
                    </div>

                    {test.notes && (
                      <p className="text-xs text-[var(--color-text-secondary)] italic">
                        &quot;{test.notes}&quot;
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FERTILIZER DOSAGE CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Nutrient Input Parameters
            </h2>

            <FormField label="Target Crop">
              <Select value={calcCropId} onChange={e => setCalcCropId(e.target.value)}>
                {CROPS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Farm Land Holding (Acres)">
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={calcAcreage}
                onChange={e => setCalcAcreage(Math.max(0.5, parseFloat(e.target.value) || 1))}
              />
            </FormField>

            <div className="p-3 bg-[var(--color-surface-1)] rounded-xl border border-[var(--color-border)] space-y-3">
              <p className="text-xs font-bold text-[var(--color-text-primary)]">
                Soil Card Indices (Adjust or auto-filled from test)
              </p>
              <div className="grid grid-cols-3 gap-2">
                <FormField label="Nitrogen">
                  <Select
                    value={calcSoilStatus.n}
                    onChange={e => setCalcSoilStatus(s => ({ ...s, n: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Med</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>

                <FormField label="Phosphorus">
                  <Select
                    value={calcSoilStatus.p}
                    onChange={e => setCalcSoilStatus(s => ({ ...s, p: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Med</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>

                <FormField label="Potassium">
                  <Select
                    value={calcSoilStatus.k}
                    onChange={e => setCalcSoilStatus(s => ({ ...s, k: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Med</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>
              </div>

              <FormField label="Soil pH Value">
                <Input
                  type="number"
                  step="0.1"
                  min="3"
                  max="11"
                  value={calcSoilStatus.ph}
                  onChange={e => setCalcSoilStatus(s => ({ ...s, ph: parseFloat(e.target.value) || 7.0 }))}
                />
              </FormField>
            </div>
          </Card>

          <Card className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Recommended Fertilizer Application
                </span>
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mt-0.5">
                  Tailored Prescription for {calcAcreage} Acre(s) of{' '}
                  {CROPS.find(c => c.id === calcCropId)?.name || 'Crop'}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Dose Slip
              </Button>
            </div>

            {/* Commercial Bags Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                  DAP (18-46-0)
                </span>
                <p className="text-2xl font-extrabold text-[var(--color-primary-700)] mt-1">
                  {fertilizerPlan.dapBags} <span className="text-xs font-normal text-[var(--color-text-muted)]">bags</span>
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  ({fertilizerPlan.dapKg} kg total) — Basal application at sowing
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                  Urea (46% N)
                </span>
                <p className="text-2xl font-extrabold text-[var(--color-primary-700)] mt-1">
                  {fertilizerPlan.ureaBags} <span className="text-xs font-normal text-[var(--color-text-muted)]">bags</span>
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  ({fertilizerPlan.ureaKg} kg total) — 2 to 3 split top-dressings
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[var(--color-border)] shadow-xs text-center">
                <span className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                  MOP Potash (60% K2O)
                </span>
                <p className="text-2xl font-extrabold text-[var(--color-primary-700)] mt-1">
                  {fertilizerPlan.mopBags} <span className="text-xs font-normal text-[var(--color-text-muted)]">bags</span>
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  ({fertilizerPlan.mopKg} kg total) — Basal or split dose
                </p>
              </div>
            </div>

            {/* Application Schedule Table */}
            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
              <div className="bg-[var(--color-surface-1)] px-4 py-2 font-bold text-xs text-[var(--color-text-primary)]">
                Application Timing & Split Schedule
              </div>
              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Basal Dose (At Sowing / Transplanting):</span>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                      Apply 100% of DAP ({fertilizerPlan.dapBags} bags), 50% of MOP, and {fertilizerPlan.fymTonnes} tonnes of well-decomposed Farmyard Manure (FYM).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">First Top Dressing (20–25 DAS / Active Tillering):</span>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                      Apply 50% of total Urea ({((parseFloat(fertilizerPlan.ureaBags) * 0.5) || 0).toFixed(1)} bags). Drain standing water before application if paddy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-neutral-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">Second Top Dressing (40–45 DAS / Panicle Initiation):</span>
                    <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                      Apply remaining 50% of Urea and remaining 50% of MOP.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Amendment Note */}
            <div className="p-3 bg-[var(--color-surface-2)] rounded-xl text-xs text-[var(--color-text-primary)] border border-[var(--color-border)]">
              <strong className="text-[var(--color-text-primary)] font-semibold">Soil Conditioning Advice:</strong> {fertilizerPlan.soilAmendment}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: NUTRIENTS & PH GUIDE */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
              The Soil pH Scale
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
              Soil pH measures the acidity or alkalinity of the soil solution. Most nutrients are most readily available to crops between pH 6.0 and 7.5.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">pH &lt; 5.5 (Strongly Acidic):</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Aluminum & manganese toxicity risk; phosphorus and calcium become locked.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">pH 6.2 – 7.5 (Optimal Neutral):</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Maximum microbial activity and balanced uptake of N, P, K, and micronutrients.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                <span className="font-semibold text-[var(--color-text-primary)]">pH &gt; 8.0 (Alkaline / Calcareous):</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">Zinc, iron, and boron deficiencies common; phosphorus fixes as insoluble calcium phosphate.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
              Primary Macro-Nutrients (NPK)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-neutral-900">Nitrogen (N) — Vegetative Growth:</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  Promotes leaf canopy, chlorophyll, and vigorous tillering. Excess causes lodging and pest attraction.
                </p>
              </div>
              <div>
                <span className="font-semibold text-neutral-900">Phosphorus (P) — Root & Grain Development:</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  Essential for early root establishment, flowering, seed setting, and energy transfer (ATP).
                </p>
              </div>
              <div>
                <span className="font-semibold text-neutral-900">Potassium (K) — Stress & Disease Resistance:</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  Regulates stomatal opening, drought resilience, stalk strength, and fruit quality.
                </p>
              </div>
              <div>
                <span className="font-semibold text-neutral-900">Organic Carbon (OC) — Soil Life:</span>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  Measures humus and microbial health. Aim for &gt; 0.75% for good soil structure.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Accessible Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Soil Health Card"
        message="Are you sure you want to delete this certified soil test record? This will remove the saved N-P-K readings from your browser."
        confirmLabel="Delete Test Record"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
