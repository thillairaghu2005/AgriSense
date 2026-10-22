import { useState, useMemo } from 'react';
import { PLANTATION_PROGRAMS, searchPlantationPrograms } from '@/data/plantations';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import { storageGet, storageSet } from '@/lib/storage';
import type { PlantationProgram } from '@/types';
import {
  TreeDeciduous, ShieldCheck, CheckCircle2,
  MapPin, Phone, Printer, Trash2,
  X, Check, TrendingUp
} from 'lucide-react';

interface SaplingOrderRecord {
  id: string;
  programId: string;
  programName: string;
  speciesName: string;
  nurseryId: string;
  nurseryName: string;
  nurseryContact: string;
  saplingCount: number;
  totalCost: number;
  subsidyAmount: number;
  farmerPayable: number;
  bookingDate: string;
  status: 'ready_for_pickup' | 'collected';
}

const DEFAULT_ORDERS: SaplingOrderRecord[] = [
  {
    id: 'SAPL-2026-44129',
    programId: 'midh-mango-01',
    programName: 'High Density Mango Orchard (Alphonso / Banganapalli)',
    speciesName: 'Mangifera indica',
    nurseryId: 'nur-01',
    nurseryName: 'State Horticulture Development Farm, Madurai',
    nurseryContact: '0452-2438100',
    saplingCount: 120,
    totalCost: 7200,
    subsidyAmount: 3240,
    farmerPayable: 3960,
    bookingDate: '2026-03-20',
    status: 'ready_for_pickup',
  },
];

export default function PlantationsPage() {
  const { t, state: selectedState, district: selectedDistrict } = useApp();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'orchard' | 'timber' | 'nurseries' | 'orders'>('orchard');

  const [orders, setOrders] = useState<SaplingOrderRecord[]>(() =>
    storageGet('agrisense_sapling_orders', DEFAULT_ORDERS)
  );

  // Sapling Booking State
  const [bookingProgram, setBookingProgram] = useState<PlantationProgram | null>(null);
  const [saplingCount, setSaplingCount] = useState<number>(100);
  const [selectedNurseryId, setSelectedNurseryId] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const programs = searchPlantationPrograms(
    query,
    activeTab === 'orchard' ? 'orchard' : activeTab === 'timber' ? undefined : undefined
  ).filter(p => {
    if (activeTab === 'orchard') return p.type === 'orchard';
    if (activeTab === 'timber') return p.type === 'timber_agroforestry' || p.type === 'bamboo';
    return true;
  });

  // Extract unique nurseries prioritized by user's state & district
  const allNurseries = useMemo(() => {
    const raw = Array.from(
      new Map(
        PLANTATION_PROGRAMS.flatMap(p => p.participatingNurseries).map(n => [n.id, n])
      ).values()
    );
    return raw.sort((a, b) => {
      if (a.state === selectedState && b.state !== selectedState) return -1;
      if (a.state !== selectedState && b.state === selectedState) return 1;
      if (selectedDistrict) {
        if (a.district === selectedDistrict && b.district !== selectedDistrict) return -1;
        if (a.district !== selectedDistrict && b.district === selectedDistrict) return 1;
      }
      return 0;
    });
  }, [selectedState, selectedDistrict]);

  function handleOpenBooking(program: PlantationProgram) {
    setBookingProgram(program);
    setSaplingCount(Math.min(program.saplingsPerAcre, 200));
    const regionalNursery = program.participatingNurseries.find(
      n => n.state === selectedState && (!selectedDistrict || n.district === selectedDistrict)
    ) || program.participatingNurseries.find(n => n.state === selectedState) || program.participatingNurseries[0];
    setSelectedNurseryId(regionalNursery?.id || program.participatingNurseries[0]?.id || '');
    setBookingSuccess(null);
  }

  function handleConfirmBooking() {
    if (!bookingProgram) return;
    const totalCost = saplingCount * bookingProgram.saplingCost;
    const estSubsidy = Math.round(totalCost * 0.45); // ~45% average subsidy under MIDH/SMAF
    const payable = totalCost - estSubsidy;
    const refCode = `SAPL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const selectedNursery = bookingProgram.participatingNurseries.find(n => n.id === selectedNurseryId) ||
      bookingProgram.participatingNurseries[0];

    const newOrder: SaplingOrderRecord = {
      id: refCode,
      programId: bookingProgram.id,
      programName: bookingProgram.name,
      speciesName: bookingProgram.speciesName,
      nurseryId: selectedNursery?.id || 'nur-01',
      nurseryName: selectedNursery?.name || 'District Horticulture Nursery',
      nurseryContact: selectedNursery?.contact || '0452-2438100',
      saplingCount,
      totalCost,
      subsidyAmount: estSubsidy,
      farmerPayable: payable,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'ready_for_pickup',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    storageSet('agrisense_sapling_orders', updated);

    setBookingSuccess(
      `Order ${refCode} confirmed! Saplings: ${saplingCount} of ${bookingProgram.speciesName}. Total Cost: ₹${totalCost.toLocaleString()}, Government Subsidy: ₹${estSubsidy.toLocaleString()}, Balance Payable at Nursery: ₹${payable.toLocaleString()}.`
    );
  }

  function handleCancelOrder(id: string) {
    const updated = orders.filter(o => o.id !== id);
    setOrders(updated);
    storageSet('agrisense_sapling_orders', updated);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('plantations.title')}
        subtitle={t('plantations.subtitle')}
      />

      {/* Hero Mission Header */}
      <div className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] rounded-xl p-5 shadow-xs border border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-[var(--color-surface-1)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-text-secondary)]" />
              Mission for Integrated Development of Horticulture (MIDH) & Sub-Mission on Agroforestry (SMAF)
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              Orchard Development, Commercial Timber & 3-Year Maintenance Support
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-3xl leading-relaxed">
              Transform dryland and perimeter boundaries into high-value perennial wealth with certified fruit grafts,
              fast-growing Malabar Neem, Teak, and Bamboo. Receive multi-year maintenance incentives linked to plant survival.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('orchard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'orchard'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              Horticulture & Orchards
            </button>
            <button
              onClick={() => setActiveTab('timber')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'timber'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              Timber & Agroforestry
            </button>
            <button
              onClick={() => setActiveTab('nurseries')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'nurseries'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              Certified Nurseries ({allNurseries.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                activeTab === 'orders'
                  ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-[var(--color-border)] shadow-xs'
                  : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              My Bookings ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        /* Orders & Gate Pass Tab */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-12 text-center space-y-3">
              <TreeDeciduous className="w-10 h-10 text-[var(--color-text-muted)] mx-auto" />
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                No Active Sapling Bookings
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
                You have not booked any certified saplings yet. Explore high-density orchard packages and commercial timber programs to order saplings with government subsidies.
              </p>
              <Button variant="primary" size="sm" onClick={() => setActiveTab('orchard')}>
                Explore Orchard Programs
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden shadow-xs">
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--color-surface-1)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Certified Sapling Orders & Counter Gate Passes ({orders.length})
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Carry the booking slip and identity proof to collect saplings from the allotted government nursery.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => window.print()}
                >
                  Print Gate Passes
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="table-clean w-full text-left text-xs">
                  <thead>
                    <tr>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Order ID</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Species & Program</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Certified Nursery</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Saplings</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Payable at Counter</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)]">Status</th>
                      <th className="py-2.5 px-4 font-semibold text-[var(--color-text-muted)] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                        <td className="py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                          {order.id}
                          <span className="block text-[10px] font-normal text-[var(--color-text-muted)]">
                            {order.bookingDate}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[var(--color-text-primary)] block">
                            {order.programName}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)] italic">
                            {order.speciesName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[var(--color-text-primary)] block">
                            {order.nurseryName}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[var(--color-text-muted)]" />
                            {order.nurseryContact}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                          {order.saplingCount} saplings
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[var(--color-text-primary)] block">
                            ₹{order.farmerPayable.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            (Subsidy: ₹{order.subsidyAmount.toLocaleString()})
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
                              title="Print Pass"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="p-1.5 rounded-md hover:bg-[var(--color-surface-2)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                              title="Cancel Order"
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
      ) : activeTab !== 'nurseries' ? (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search plantation programs, fruit trees, timber species (e.g. Mango, Guava, Teak, Malabar Neem)..."
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {programs.map(program => (
              <Card key={program.id} className="flex flex-col justify-between hover:border-[var(--color-primary-400)] transition-all">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                        {program.type.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                        {program.subsidyScheme}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2.5 py-1 rounded border border-[var(--color-border)] flex-shrink-0">
                      ₹{program.saplingCost} / sapling
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {program.name}
                  </h3>
                  <p className="text-xs italic text-[var(--color-text-muted)] mb-3">
                    {program.botanicalName}
                  </p>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 bg-[var(--color-surface-1)] rounded-lg text-xs mb-3 border border-[var(--color-border)]">
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Density / Acre</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.saplingsPerAcre} plants
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Planting Spacing</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.spacing}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Pit Dimensions</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.pitSize}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Commercial Gestation</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.commercialGestationYears} years
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Planting Window</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.plantingSeason}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] block">Subsidy Rate</span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {program.subsidyPerPlantOrAcre}
                      </span>
                    </div>
                  </div>

                  {/* Expected Financial Returns Box */}
                  <div className="p-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg text-xs mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
                      <TrendingUp className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      Expected Commercial Realization:
                    </div>
                    <p className="text-[var(--color-text-secondary)] font-medium">
                      {program.expectedReturnsPerAcre}
                    </p>
                  </div>

                  {/* 3-Year Maintenance Support Schedule */}
                  <div className="space-y-1.5 mb-3">
                    <span className="text-[11px] font-semibold text-[var(--color-text-primary)] uppercase tracking-wide block">
                      3-Year Survival Maintenance Grants:
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {program.maintenanceSchedule.map(tier => (
                        <div key={tier.year} className="p-2 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">
                          <span className="text-[10px] text-[var(--color-text-muted)] block font-semibold">
                            Year {tier.year} ({tier.targetSurvivalRate}% Survival)
                          </span>
                          <span className="font-bold text-[var(--color-text-primary)]">
                            ₹{tier.amountPerAcre.toLocaleString()} / acre
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Care Guidelines */}
                  <div className="space-y-1 text-xs text-[var(--color-text-secondary)]">
                    {program.careGuidelines.map((g) => (
                      <div key={g} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-text-secondary)] flex-shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Available in {program.participatingNurseries.length} Certified Govt Nurseries
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<TreeDeciduous className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenBooking(program)}
                  >
                    Order Certified Saplings
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {programs.length === 0 && (
            <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
              {t('common.noResults')}
            </div>
          )}
        </>
      ) : (
        /* Certified Nurseries Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allNurseries.map(nursery => (
            <Card key={nursery.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <TreeDeciduous className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-primary)] bg-[var(--color-surface-2)] border border-[var(--color-border)] px-2 py-0.5 rounded">
                    {nursery.type}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)] mt-1">
                    {nursery.name}
                  </h3>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-[var(--color-text-secondary)]">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0 mt-0.5" />
                  <span>District: {nursery.district.toUpperCase()}, {nursery.state.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)] flex-shrink-0" />
                  <span>Helpline: {nursery.contact}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-muted)] font-medium">
                  Certified Stock Available:
                </span>
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  {nursery.stockCount.toLocaleString()} Saplings
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sapling Order Modal */}
      {bookingProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] max-w-lg w-full p-6 relative animate-scale-up">
            <button
              onClick={() => setBookingProgram(null)}
              className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <TreeDeciduous className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <div>
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  Order Certified Plantation Saplings
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {bookingProgram.name} ({bookingProgram.speciesName})
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    Sapling Booking Confirmed!
                  </div>
                  <p>{bookingSuccess}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] font-medium">
                    Please present your Aadhaar Card and this reference at the government nursery counter.
                    Government subsidy under {bookingProgram.subsidyScheme} is directly deducted.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setBookingProgram(null);
                      setActiveTab('orders');
                    }}
                  >
                    View My Bookings
                  </Button>
                  <Button variant="primary" onClick={() => setBookingProgram(null)}>
                    {t('common.close')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Number of Saplings Required
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={2000}
                    step={10}
                    value={saplingCount}
                    onChange={e => setSaplingCount(parseInt(e.target.value) || 10)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                  />
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                    Recommended orchard density: {bookingProgram.saplingsPerAcre} saplings per acre.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-[var(--color-text-primary)] block mb-1">
                    Select Certified Nursery for Pickup
                  </label>
                  <select
                    value={selectedNurseryId}
                    onChange={e => setSelectedNurseryId(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)]"
                  >
                    {bookingProgram.participatingNurseries.map(n => (
                      <option key={n.id} value={n.id}>
                        {n.name} ({n.stockCount.toLocaleString()} saplings in stock)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calculation Summary Box */}
                <div className="p-3 bg-[var(--color-surface-1)] border border-[var(--color-border)] rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)]">Official Sapling Cost:</span>
                    <span className="text-[var(--color-text-primary)]">
                      ₹{(saplingCount * bookingProgram.saplingCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Estimated Scheme Subsidy (~45%):</span>
                    <span className="font-bold">
                      - ₹{Math.round(saplingCount * bookingProgram.saplingCost * 0.45).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--color-text-primary)] pt-1">
                    <span>Farmer Payable at Nursery:</span>
                    <span className="text-[var(--color-text-primary)]">
                      ₹{Math.round(saplingCount * bookingProgram.saplingCost * 0.55).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setBookingProgram(null)}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<Check className="w-4 h-4" />}
                    onClick={handleConfirmBooking}
                  >
                    Confirm Sapling Booking
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
