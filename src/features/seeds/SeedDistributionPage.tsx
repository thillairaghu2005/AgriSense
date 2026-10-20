import { useState } from 'react';
import { SEED_VARIETIES, SEED_FARMS, searchSeedVarieties } from '@/data/seeds';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import type { SeedVariety } from '@/types';
import {
  Sprout, Droplets, ShieldCheck, CheckCircle2,
  Calendar, Layers, MapPin, Phone, Building2,
  X, Check, Sparkles
} from 'lucide-react';

export default function SeedDistributionPage() {
  const { t, profile } = useApp();
  const [query, setQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'farms'>('catalog');

  // Booking Modal State
  const [bookingVariety, setBookingVariety] = useState<SeedVariety | null>(null);
  const [acreage, setAcreage] = useState<number>(profile.landArea || 2);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredVarieties = searchSeedVarieties(
    query,
    seasonFilter || undefined,
    cropFilter || undefined
  );

  function handleOpenBooking(variety: SeedVariety) {
    setBookingVariety(variety);
    setSelectedFarmId(variety.stockAvailability[0]?.farmOrSupplierId || '');
    setBookingSuccess(null);
  }

  function handleConfirmBooking() {
    if (!bookingVariety) return;
    const reqQty = Math.ceil(bookingVariety.seedRateKgPerAcre * acreage);
    const totalCost = reqQty * bookingVariety.pricePerKg;
    const subsidy = (totalCost * bookingVariety.subsidyPercentage) / 100;
    const refCode = `SEED-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    setBookingSuccess(
      `Requisition ${refCode} booked! Required: ${reqQty} kg. Total: ₹${totalCost.toLocaleString()}, Subsidy: ₹${subsidy.toLocaleString()}, You pay at farm: ₹${(totalCost - subsidy).toLocaleString()}.`
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('seeds.title')}
        subtitle={t('seeds.subtitle')}
      />

      {/* Official Government Mission Banner */}
      <div className="bg-emerald-900 text-white rounded-xl p-5 shadow-sm border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-800/80 text-emerald-200 border border-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              National Food Security Mission (NFSM) & Certified Seed Hubs
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              Direct Certified Seed Requisition & 50% DBT Subsidy
            </h2>
            <p className="text-xs text-emerald-100 max-w-3xl leading-relaxed">
              Procure genetically pure Foundation and Certified seeds directly from State Agricultural Seed Farms,
              National Seeds Corporation (NSC), and Agricultural University centres with authentic seed tags.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              Certified Seed Catalog ({SEED_VARIETIES.length})
            </button>
            <button
              onClick={() => setActiveTab('farms')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'farms'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              Government Seed Farms ({SEED_FARMS.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('seeds.searchPlaceholder')}
              className="flex-1"
            />
            <select
              value={seasonFilter}
              onChange={e => setSeasonFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
              aria-label="Filter by season"
            >
              <option value="">All Seasons</option>
              <option value="kharif">Kharif (Monsoon)</option>
              <option value="rabi">Rabi (Winter)</option>
              <option value="zaid">Zaid (Summer)</option>
            </select>
            <select
              value={cropFilter}
              onChange={e => setCropFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
              aria-label="Filter by crop"
            >
              <option value="">All Crop Types</option>
              <option value="paddy">Paddy / Rice</option>
              <option value="wheat">Wheat</option>
              <option value="black_gram">Black Gram (Urad)</option>
              <option value="groundnut">Groundnut</option>
              <option value="soybean">Soybean</option>
              <option value="cotton">Cotton</option>
              <option value="ragi">Ragi (Finger Millet)</option>
            </select>
          </div>

          {/* Seed Varieties Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredVarieties.map(variety => {
              const subsidizedRate = (variety.pricePerKg * (100 - variety.subsidyPercentage)) / 100;
              const totalStockKg = variety.stockAvailability.reduce((sum, s) => sum + s.availableKg, 0);

              return (
                <Card key={variety.id} className="flex flex-col justify-between hover:border-[var(--color-primary-400)] transition-all">
                  <div>
                    {/* Top Tag Row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {variety.seedType} Seed
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {variety.recommendedSeason.map(s => s.toUpperCase()).join(' / ')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {variety.subsidyPercentage}% NFSM Subsidy
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex-shrink-0">
                        ₹{subsidizedRate}/kg <span className="text-[10px] text-gray-500 line-through">₹{variety.pricePerKg}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                      {variety.varietyName}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      {variety.cropName} • Sowing: {variety.sowingPeriod}
                    </p>

                    {/* Scientific Specifications Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 bg-[var(--color-surface-1)] rounded-lg text-xs mb-3 border border-[var(--color-border)]">
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Seed Rate</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {variety.seedRateKgPerAcre} kg / acre
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Spacing</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {variety.spacingCm}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Duration & Yield</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {variety.harvestingPeriodDays[0]}-{variety.harvestingPeriodDays[1]} days • {variety.expectedYieldQuintalsPerAcre[0]}-{variety.expectedYieldQuintalsPerAcre[1]} qtl/ac
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Germination</span>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          Min. {variety.minGerminationPercentage}% ({variety.germinationPeriodDays})
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Soil Suitability</span>
                        <span className="font-semibold text-[var(--color-text-primary)] truncate block" title={variety.soilSuitability.join(', ')}>
                          {variety.soilSuitability[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--color-text-muted)] block">Live Stock</span>
                        <span className="font-semibold text-emerald-700">
                          {totalStockKg.toLocaleString()} kg in Govt Farms
                        </span>
                      </div>
                    </div>

                    {/* Agronomy Guidance Details */}
                    <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                      <div className="flex gap-2">
                        <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Nursery & Sowing: </strong>
                          {variety.nurseryPreparation}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Layers className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Fertilizer Schedule: </strong>
                          {variety.fertilizerSchedule.basal} {variety.fertilizerSchedule.topDressing1}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Droplets className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Irrigation: </strong>
                          {variety.irrigationRequirements}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Resistance: </strong>
                          {variety.pestDiseaseResistance.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action Footer */}
                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      Available at {variety.stockAvailability.length} Govt Seed Farms
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenBooking(variety)}
                    >
                      {t('seeds.bookSeed')}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredVarieties.length === 0 && (
            <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
              {t('common.noResults')}
            </div>
          )}
        </>
      )}

      {/* Seed Farms Directory Tab */}
      {activeTab === 'farms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SEED_FARMS.map(farm => (
              <Card key={farm.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-800)] bg-[var(--color-primary-50)] px-2 py-0.5 rounded">
                        {farm.type}
                      </span>
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                        {farm.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 text-[var(--color-text-secondary)]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                    <span>{farm.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                    <span>{farm.contactNumber} ({farm.contactPerson})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                    <span>Hours: {farm.operatingHours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)]">
                  <span className="text-[10px] text-[var(--color-text-muted)] font-semibold block mb-1">
                    Crops in Seed Stock:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {farm.stockCrops.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Seed Requisition Modal */}
      {bookingVariety && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] max-w-lg w-full p-6 relative animate-scale-up">
            <button
              onClick={() => setBookingVariety(null)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  Seed Quota Requisition
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {bookingVariety.varietyName} ({bookingVariety.cropName})
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Requisition Confirmed!
                  </div>
                  <p>{bookingSuccess}</p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Please present your Aadhaar Card and this reference at the chosen seed farm counter.
                    Government subsidy is deducted at the counter automatically.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" onClick={() => setBookingVariety(null)}>
                    {t('common.close')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Cultivation Acreage (Acres)
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={25}
                    step={0.5}
                    value={acreage}
                    onChange={e => setAcreage(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                  />
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                    Standard seed rate: {bookingVariety.seedRateKgPerAcre} kg/acre. Total seed requirement: {Math.ceil(bookingVariety.seedRateKgPerAcre * acreage)} kg.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Select Collection Seed Farm / Center
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={e => setSelectedFarmId(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                  >
                    {bookingVariety.stockAvailability.map(s => (
                      <option key={s.farmOrSupplierId} value={s.farmOrSupplierId}>
                        {s.farmName} ({s.availableKg.toLocaleString()} kg available)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculation Summary Box */}
                <div className="p-3 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Total Seed Quantity:</span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {Math.ceil(bookingVariety.seedRateKgPerAcre * acreage)} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Official Seed Price:</span>
                    <span className="text-[var(--color-text-primary)]">
                      ₹{(Math.ceil(bookingVariety.seedRateKgPerAcre * acreage) * bookingVariety.pricePerKg).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Govt NFSM Subsidy ({bookingVariety.subsidyPercentage}%):</span>
                    <span className="font-bold">
                      - ₹{((Math.ceil(bookingVariety.seedRateKgPerAcre * acreage) * bookingVariety.pricePerKg * bookingVariety.subsidyPercentage) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--color-text-primary)] pt-1 border-t border-[var(--color-border)]">
                    <span>Farmer Payable at Farm:</span>
                    <span className="text-emerald-700">
                      ₹{(
                        Math.ceil(bookingVariety.seedRateKgPerAcre * acreage) *
                        ((bookingVariety.pricePerKg * (100 - bookingVariety.subsidyPercentage)) / 100)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setBookingVariety(null)}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Check className="w-4 h-4" />}
                    onClick={handleConfirmBooking}
                  >
                    Confirm Requisition
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
