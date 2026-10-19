import { useState, useMemo, useRef } from 'react';
import { Card, PageHeader, Badge, InfoBanner, DemoLabel, EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Select, SearchInput } from '@/components/forms/FormComponents';
import { PESTS_DISEASES } from '@/data/pestsDiseases';
import { CROPS } from '@/data/crops';
import type { PestDisease, PestOrDisease } from '@/types';
import {
  Activity,
  AlertTriangle,
  Upload,
  CheckCircle,
  ShieldCheck,
  X,
  FileImage,
  RefreshCw,
  Info,
  ChevronRight,
} from 'lucide-react';

export default function PestsDiseasesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PestOrDisease>('all');
  const [selectedItem, setSelectedItem] = useState<PestDisease | null>(null);

  // Simulated Image Assessment State
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<{
    match: PestDisease;
    confidence: number;
    observations: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter pest/disease list
  const filteredList = useMemo(() => {
    return PESTS_DISEASES.filter(item => {
      // Type filter
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;

      // Crop filter
      if (selectedCrop !== 'all' && !item.affectedCropIds.includes(selectedCrop)) return false;

      // Search query (matches name, symptoms, causes)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCause = item.causes.toLowerCase().includes(q);
        const matchesSymptom = item.symptoms.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCause && !matchesSymptom) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCrop, typeFilter]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setImageFileName(file.name);
        setSimulatedResult(null);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleUseSampleImage(sampleCropId: string) {
    setUploadedImage('sample-' + sampleCropId);
    setImageFileName(`${sampleCropId}-leaf-sample.jpg`);
    setSimulatedResult(null);
  }

  function runSimulatedAnalysis() {
    if (!uploadedImage) return;
    setIsAnalyzing(true);
    setSimulatedResult(null);

    // Simulate 1.2s analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Contextual match based on sample or selected crop
      let match = PESTS_DISEASES[0]; // default: rice blast
      let observations = [
        'Visual leaf lesions with typical necrotic center and brown border observed.',
        'Symptom pattern closely resembles blast lesions under high humidity conditions.',
        'Microscopic confirmation is required for definitive fungal taxonomy.',
      ];

      const checkName = (imageFileName + ' ' + uploadedImage).toLowerCase();
      if (checkName.includes('tomato')) {
        match = PESTS_DISEASES.find(p => p.id === 'late-blight-tomato') || PESTS_DISEASES[0];
        observations = [
          'Water-soaked dark lesions identified on leaf margin and petiole.',
          'Under-surface displays characteristic pale fungal growth under humid conditions.',
          'Likely Late Blight (Phytophthora infestans) — fast spreading in cool moist nights.',
        ];
      } else if (checkName.includes('cotton')) {
        match = PESTS_DISEASES.find(p => p.id === 'cotton-bollworm') || PESTS_DISEASES[0];
        observations = [
          'Entry puncture holes and rosette appearance observed on floral parts.',
          'Chewing damage signature matches pink bollworm (Pectinophora gossypiella).',
          'Immediate installation of pheromone delta traps (5/acre) recommended.',
        ];
      } else if (checkName.includes('maize')) {
        match = PESTS_DISEASES.find(p => p.id === 'fall-armyworm') || PESTS_DISEASES[0];
        observations = [
          'Pin-hole perforations and ragged leaf margins identified in leaf whorl.',
          'Frass accumulation pattern characteristic of early-instar Fall Armyworm (FAW).',
          'Handpick egg masses and apply botanical neem extract immediately.',
        ];
      } else if (checkName.includes('onion')) {
        match = PESTS_DISEASES.find(p => p.id === 'onion-thrips') || PESTS_DISEASES[0];
        observations = [
          'Silvery-white streaks and leaf curling observed near leaf axil.',
          'Piercing-sucking damage signature typical of Thrips tabaci.',
          'Install blue sticky traps at canopy level.',
        ];
      } else if (selectedCrop !== 'all') {
        const cropMatch = PESTS_DISEASES.find(p => p.affectedCropIds.includes(selectedCrop));
        if (cropMatch) match = cropMatch;
      }

      setSimulatedResult({
        match,
        confidence: Math.floor(84 + Math.random() * 11),
        observations,
      });
    }, 1100);
  }

  function clearUploadedImage() {
    setUploadedImage(null);
    setImageFileName('');
    setSimulatedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pest & Disease Advisory"
        subtitle="Identify crop symptoms, prevention protocols, and simulated field assessment"
        badge={<DemoLabel label="Educational reference library" />}
      />

      <InfoBanner variant="warning">
        <strong>Important Advisory:</strong> Management protocols presented here are for preliminary guidance and educational awareness. 
        Never apply restricted chemical pesticides or determine dosage without consulting your local <strong>Krishi Vigyan Kendra (KVK)</strong> or State Agricultural Extension Officer.
      </InfoBanner>

      {/* Simulated Image Assessment Studio */}
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-neutral-800" />
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            Simulated Crop Image Assessment Flow
          </h2>
          <DemoLabel label="Prototype Simulator" />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mb-4">
          Test how a farmer can preview photo uploads of affected leaves. 
          <em> Note: This is an illustrative simulation; no real AI/ML inference or biological diagnosis is performed.</em>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div>
            {!uploadedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center hover:border-neutral-400 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[190px]"
              >
                <Upload className="w-8 h-8 text-[var(--color-text-muted)] mb-3" />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Click to select crop leaf photo
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Supports JPG, PNG up to 5MB
                </p>
                <div className="mt-4 flex items-center gap-1.5 flex-wrap justify-center">
                  <span className="text-[11px] text-[var(--color-text-muted)] w-full mb-1">Or test with realistic crop samples:</span>
                  {[
                    { id: 'rice', label: 'Rice (Blast)' },
                    { id: 'tomato', label: 'Tomato (Blight)' },
                    { id: 'cotton', label: 'Cotton (Bollworm)' },
                    { id: 'maize', label: 'Maize (Armyworm)' },
                  ].map(sample => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseSampleImage(sample.id);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-surface-3)] text-[var(--color-text-primary)] hover:bg-neutral-200 font-medium transition-colors"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-[var(--color-border)] rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-neutral-700" />
                    <span className="text-xs font-medium text-[var(--color-text-primary)] truncate max-w-[200px]">
                      {imageFileName}
                    </span>
                  </div>
                  <button
                    onClick={clearUploadedImage}
                    className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-0.5"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                {/* Preview Box */}
                <div className="relative w-full h-40 bg-[var(--color-surface-2)] rounded-lg overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                  {uploadedImage === 'sample-leaf' ? (
                    <div className="text-center p-4">
                      <FileImage className="w-8 h-8 text-neutral-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                        Sample Affected Rice Leaf
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Spindle-shaped necrotic lesions detected on leaf blade
                      </p>
                    </div>
                  ) : (
                    <img
                      src={uploadedImage}
                      alt="Crop symptom preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  isLoading={isAnalyzing}
                  onClick={runSimulatedAnalysis}
                >
                  {isAnalyzing ? 'Simulating Analysis…' : 'Run Simulated Assessment'}
                </Button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Assessment Output */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex flex-col justify-center">
            {isAnalyzing ? (
              <div className="text-center py-8 space-y-2">
                <RefreshCw className="w-8 h-8 text-neutral-700 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Processing leaf imagery…
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Evaluating lesion patterns against illustrative database
                </p>
              </div>
            ) : simulatedResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-[var(--color-text-primary)]">
                      Simulated Demonstration Result
                    </span>
                  </div>
                  <Badge>
                    ~{simulatedResult.confidence}% Pattern Match
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    {simulatedResult.match.name}
                    <Badge variant="neutral">
                      {simulatedResult.match.type.toUpperCase()}
                    </Badge>
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    {simulatedResult.match.causes}
                  </p>
                </div>

                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-xs text-neutral-800 space-y-1">
                  <p className="font-semibold text-neutral-900">Simulated Observations:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-700">
                    {simulatedResult.observations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(simulatedResult.match)}
                  >
                    View Recommended Protocols
                  </Button>
                  <span className="text-[10px] text-[var(--color-text-muted)] italic">
                    Simulation only — verify with KVK
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--color-text-muted)] space-y-2">
                <Info className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-medium">No image evaluated yet</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Upload an affected leaf photo or load the sample rice leaf above, then click &quot;Run Simulated Assessment&quot;.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Library Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search symptoms or disease names…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            className="text-xs py-1.5"
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
          >
            <option value="all">All Crops</option>
            {CROPS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            className="text-xs py-1.5"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as any)}
          >
            <option value="all">All Categories</option>
            <option value="disease">Diseases only</option>
            <option value="pest">Pests only</option>
          </Select>
        </div>
      </div>

      {/* Library Grid */}
      {filteredList.length === 0 ? (
        <Card>
          <EmptyState
            icon={<AlertTriangle className="w-10 h-10 text-[var(--color-text-muted)]" />}
            title="No matching pests or diseases found"
            description="Try modifying your symptom search query or choosing another crop."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCrop('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map(item => {
            const affectedCrops = CROPS.filter(c => item.affectedCropIds.includes(c.id));

            return (
              <Card
                key={item.id}
                className="transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="neutral">
                        {item.type === 'pest' ? 'Pest' : 'Disease'}
                      </Badge>
                      <Badge variant="neutral">
                        Severity: {item.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1.5 flex-wrap my-1.5">
                    <span className="text-[11px] text-[var(--color-text-muted)]">Crops:</span>
                    {affectedCrops.map(c => (
                      <span
                        key={c.id}
                        className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] px-1.5 py-0.5 rounded"
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-1">
                    {item.causes}
                  </p>

                  <div className="mt-3 bg-[var(--color-surface-1)] p-2.5 rounded-lg border border-[var(--color-border)]">
                    <p className="text-[11px] font-semibold text-[var(--color-text-primary)] mb-1">
                      Key Diagnostic Symptoms:
                    </p>
                    <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                      {item.symptoms.slice(0, 2).map((sym, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span>{sym}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    {item.prevention.length} prevention measures
                  </span>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-xs text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] hover:underline font-semibold flex items-center gap-1"
                  >
                    View Protocols <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Protocol Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="neutral">
                    {selectedItem.type.toUpperCase()}
                  </Badge>
                  <Badge variant="neutral">
                    Severity: {selectedItem.severity}
                  </Badge>
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {selectedItem.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[var(--color-text-secondary)]">
              <div>
                <h4 className="font-semibold text-sm text-[var(--color-text-primary)] mb-1">
                  Causal Agent & Epidemiology
                </h4>
                <p className="bg-[var(--color-surface-1)] p-3 rounded-lg border border-[var(--color-border)]">
                  {selectedItem.causes}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[var(--color-text-primary)] mb-1">
                  Detailed Symptoms
                </h4>
                <ul className="space-y-1.5 list-disc list-inside bg-[var(--color-surface-1)] p-3 rounded-lg border border-[var(--color-border)]">
                  {selectedItem.symptoms.map((sym, i) => (
                    <li key={i}>{sym}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[var(--color-text-primary)] mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-neutral-700" />
                  Cultural & Preventive Measures
                </h4>
                <ul className="space-y-1.5 list-disc list-inside bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-neutral-800">
                  {selectedItem.prevention.map((prev, i) => (
                    <li key={i}>{prev}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-[var(--color-text-primary)] mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-neutral-700" />
                  Management Advisory & Caution
                </h4>
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-neutral-800 leading-relaxed">
                  {selectedItem.management}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[11px] text-[var(--color-text-muted)]">
                General agronomic reference data
              </span>
              <Button variant="primary" size="sm" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
