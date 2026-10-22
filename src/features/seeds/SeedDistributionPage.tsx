import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEED_VARIETIES, SEED_FARMS, searchSeedVarieties } from '@/data/seeds';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import { storageGet, storageSet } from '@/lib/storage';
import type { SeedVariety } from '@/types';
import {
  Sprout, Droplets, ShieldCheck, CheckCircle2,
  Calendar, Layers, MapPin, Phone, Building2,
  X, Check, Printer, Trash2
} from 'lucide-react';

interface SeedRequisitionRecord {
  id: string;
  varietyId: string;
  cropName: string;
  varietyName: string;
  farmId: string;
  farmName: string;
  farmContact: string;
  quantityKg: number;
  totalCost: number;
  subsidyAmount: number;
  farmerPayable: number;
  bookedDate: string;
  status: 'confirmed' | 'ready_for_pickup' | 'collected';
}

const DEFAULT_REQUISITIONS: SeedRequisitionRecord[] = [
  {
    id: 'SEED-2026-88412',
    varietyId: 'seed-rice-co51',
    cropName: 'Paddy (Rice)',
    varietyName: 'CO 51 (High Yielding)',
    farmId: 'farm-1',
    farmName: 'District Agricultural Farm, Sakkottai',
    farmContact: '04362-220412',
    quantityKg: 50,
    totalCost: 2400,
    subsidyAmount: 1200,
    farmerPayable: 1200,
    bookedDate: '2026-03-15',
    status: 'ready_for_pickup',
  },
];

export default function SeedDistributionPage() {
  const { t, profile } = useApp();
  const [searchParams] = useSearchParams();
  const cropParam = searchParams.get('crop');

  const [query, setQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('');
  const [cropFilter, setCropFilter] = useState(() => cropParam || '');
  const [activeTab, setActiveTab] = useState<'catalog' | 'farms' | 'requisitions'>('catalog');

  const [requisitions, setRequisitions] = useState<SeedRequisitionRecord[]>(() =>
    storageGet('agrisense_seed_requisitions', DEFAULT_REQUISITIONS)
  );

  const [prevCropParam, setPrevCropParam] = useState(cropParam);
  if (cropParam !== prevCropParam) {
    setPrevCropParam(cropParam);
    if (cropParam) {
      setCropFilter(cropParam);
      setActiveTab('catalog');
    }
  }

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
    const payable = totalCost - subsidy;
    const refCode = `SEED-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedFarm = bookingVariety.stockAvailability.find(s => s.farmOrSupplierId === selectedFarmId) ||
      bookingVariety.stockAvailability[0];

    const newRequisition: SeedRequisitionRecord = {
      id: refCode,
      varietyId: bookingVariety.id,
      cropName: bookingVariety.cropName,
      varietyName: bookingVariety.varietyName,
      farmId: selectedFarm?.farmOrSupplierId || 'farm-1',
      farmName: selectedFarm?.farmName || 'District Seed Farm',
      farmContact: SEED_FARMS.find(f => f.id === selectedFarm?.farmOrSupplierId)?.contactNumber || '04362-220412',
      quantityKg: reqQty,
      totalCost,
      subsidyAmount: subsidy,
      farmerPayable: payable,
      bookedDate: new Date().toISOString().split('T')[0],
      status: 'ready_for_pickup',
    };

    const updated = [newRequisition, ...requisitions];
    setRequisitions(updated);
    storageSet('agrisense_seed_requisitions', updated);

    setBookingSuccess(
      `Requisition ${refCode} booked! Required: ${reqQty} kg. Total: ₹${totalCost.toLocaleString()}, Subsidy: ₹${subsidy.toLocaleString()}, You pay at farm: ₹${payable.toLocaleString()}.`
    );
  }

  function handleCancelRequisition(id: string) {
    const updated = requisitions.filter(r => r.id !== id);
    setRequisitions(updated);
    storageSet('agrisense_seed_requisitions', updated);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('seeds.title')}
        subtitle={t('seeds.subtitle')}
      />

      {/* Official Government Mission Banner */}
      <div className="bg-white text-[var(--color-text-primary)] rounded-xl p-5 shadow-xs border border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
              National Food Security Mission (NFSM) & Certified Seed Hubs
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              Direct Certified Seed Requisition & 50% DBT Subsidy
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              Procure genetically pure Foundation and Certified seeds directly from State Agricultural Seed Farms,
              National Seeds Corporation (NSC), and Agricultural University centres with authentic seed tags.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              Certified Seed Catalog ({SEED_VARIETIES.length})
            </button>
            <button
              onClick={() => setActiveTab('farms')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'farms'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              Government Farms ({SEED_FARMS.length})
            </button>
            <button
              onClick={() => setActiveTab('requisitions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'requisitions'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              My Requisitions ({requisitions.length})
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
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                          {variety.seedType} Seed
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {variety.recommendedSeason.map(s => s.toUpperCase()).join(' / ')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                          {variety.subsidyPercentage}% NFSM Subsidy
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded border border-[var(--color-border)] flex-shrink-0">
                        ₹{subsidizedRate}/kg <span className="text-[10px] text-[var(--color-text-muted)] line-through">₹{variety.pricePerKg}</span>
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
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {totalStockKg.toLocaleString()} kg in Govt Farms
                        </span>
                      </div>
                    </div>

                    {/* Agronomy Guidance Details */}
                    <div className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                      <div className="flex gap-2">
                        <Sprout className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Nursery & Sowing: </strong>
                          {variety.nurseryPreparation}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Layers className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Fertilizer Schedule: </strong>
                          {variety.fertilizerSchedule.basal} {variety.fertilizerSchedule.topDressing1}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Droplets className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Irrigation: </strong>
                          {variety.irrigationRequirements}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <ShieldCheck className="w-4 h-4 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[var(--color-text-primary)]">Resistance: </strong>
                          {variety.pestDiseaseResistance.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action Footer */}
                  <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[var(--color-text-muted)]">
                      Available at {variety.stockAvailability.length} Govt Seed Farms
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Sprout className="w-3.5 h-3.5" />}
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
                    <Building2 className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-0.5 rounded">
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

                <div className="pt-2">
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

      {/* Requisitions Tab */}
      {activeTab === 'requisitions' && (
        <div className="space-y-4">
          {requisitions.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-12 text-center space-y-3">
              <Sprout className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                No Active Seed Requisitions
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
                You have not booked any certified seeds yet. Browse the catalog to view NFSM subsidized seeds and book your seasonal quota.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('catalog')}>
                Browse Seed Catalog
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden shadow-xs">
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface-1)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Active Seed Quotas & Counter Requisitions ({requisitions.length})
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Present requisition reference code and Aadhaar ID at the designated Government Seed Farm counter.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print All Vouchers
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="table-clean w-full text-left text-xs">
                  <thead>
                    <tr>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Requisition ID</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Variety & Crop</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Distribution Center</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Allocated Qty</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Payable at Counter</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Status</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisitions.map(req => (
                      <tr key={req.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                          {req.id}
                          <span className="block text-[10px] font-normal text-[var(--color-text-muted)]">
                            Booked: {req.bookedDate}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--color-text-primary)] block">
                            {req.varietyName}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            {req.cropName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[var(--color-text-primary)] block">
                            {req.farmName}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
                            {req.farmContact}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                          {req.quantityKg} kg
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[var(--color-text-primary)] block">
                            ₹{req.farmerPayable.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            (Govt Subsidy: ₹{req.subsidyAmount.toLocaleString()})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                            <CheckCircle2 className="w-3 h-3 text-[var(--color-text-secondary)]" />
                            Ready for Pickup
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => window.print()}
                              className="p-1.5 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] transition-colors"
                              title="Print Voucher"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCancelRequisition(req.id)}
                              className="p-1.5 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                              title="Cancel Requisition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
              <Sprout className="w-5 h-5 text-[var(--color-text-secondary)]" />
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
                <div className="p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    Requisition Confirmed!
                  </div>
                  <p>{bookingSuccess}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                    Please present your Aadhaar Card and this reference at the chosen seed farm counter.
                    Government subsidy is deducted at the counter automatically.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setBookingVariety(null);
                      setActiveTab('requisitions');
                    }}
                  >
                    View My Requisitions
                  </Button>
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
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Govt NFSM Subsidy ({bookingVariety.subsidyPercentage}%):</span>
                    <span className="font-bold">
                      - ₹{((Math.ceil(bookingVariety.seedRateKgPerAcre * acreage) * bookingVariety.pricePerKg * bookingVariety.subsidyPercentage) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--color-text-primary)] pt-1">
                    <span>Farmer Payable at Farm:</span>
                    <span className="text-[var(--color-text-primary)]">
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
