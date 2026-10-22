import { useState, useMemo } from 'react';
import { Card, PageHeader, Badge, InfoBanner, EmptyState, StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, Input, Select, Textarea } from '@/components/forms/FormComponents';
import { CROPS } from '@/data/crops';
import type { Transaction, TransactionType, ExpenseCategory, IncomeCategory } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatCurrency, formatDate, generateId } from '@/lib/formatters';
import { useToast } from '@/components/feedback/Toast';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import {
  IndianRupee,
  Plus,
  Trash2,
  X,
  PieChart as PieIcon,
  Calculator,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const EXPENSE_CATEGORIES: { id: ExpenseCategory; label: string; color: string }[] = [
  { id: 'seed', label: 'Seeds & Seedlings', color: '#14532d' },
  { id: 'fertiliser', label: 'Fertilisers & Manure', color: '#166534' },
  { id: 'pesticide', label: 'Crop Protection & Bio-agents', color: '#15803d' },
  { id: 'labour', label: 'Farm Labour & Weeding', color: '#16a34a' },
  { id: 'irrigation', label: 'Irrigation & Diesel/Electricity', color: '#22c55e' },
  { id: 'equipment', label: 'Tractor / Machinery Hire', color: '#4ade80' },
  { id: 'transport', label: 'Transport & Mandi Fee', color: '#86efac' },
  { id: 'other', label: 'Other Operational Expenses', color: '#64748b' },
];

const INCOME_CATEGORIES: { id: IncomeCategory; label: string; color: string }[] = [
  { id: 'crop_sale', label: 'Crop Produce Sale', color: '#16a34a' },
  { id: 'subsidy', label: 'Government Subsidy / DBT', color: '#22c55e' },
  { id: 'other', label: 'Other Farm Income', color: '#4ade80' },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    category: 'seed',
    amount: 3200,
    date: '2026-02-10',
    cropId: 'rice',
    notes: '25 kg certified paddy seed (CR 1009) from Co-op Society',
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'tx-2',
    type: 'expense',
    category: 'equipment',
    amount: 4500,
    date: '2026-02-12',
    cropId: 'rice',
    notes: 'Tractor rotavator hiring for 3 hours land preparation',
    createdAt: '2026-02-12T14:30:00.000Z',
  },
  {
    id: 'tx-3',
    type: 'expense',
    category: 'fertiliser',
    amount: 3800,
    date: '2026-02-18',
    cropId: 'rice',
    notes: '2 bags DAP and 1 bag MOP basal application',
    createdAt: '2026-02-18T11:00:00.000Z',
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'labour',
    amount: 6000,
    date: '2026-02-22',
    cropId: 'rice',
    notes: 'Transplanting labour (6 workers for 1 day)',
    createdAt: '2026-02-22T17:00:00.000Z',
  },
  {
    id: 'tx-5',
    type: 'income',
    category: 'subsidy',
    amount: 2000,
    date: '2026-03-01',
    notes: 'PM-KISAN seasonal installment credit',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
];

export default function FinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    storageGet(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS)
  );

  const [activeTab, setActiveTab] = useState<'transactions' | 'calculator'>('transactions');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCrop, setFilterCrop] = useState<string>('all');

  const { showToast } = useToast();
  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formType, setFormType] = useState<TransactionType>('expense');
  const [formCategory, setFormCategory] = useState<string>('seed');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [formCropId, setFormCropId] = useState<string>('rice');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Cultivation Cost & Profit Calculator State
  const [calcCropId, setCalcCropId] = useState<string>('rice');
  const [calcArea, setCalcArea] = useState<number>(2); // acres
  const [calcExpectedYield, setCalcExpectedYield] = useState<number>(24); // quintals per acre
  const [calcMarketPrice, setCalcMarketPrice] = useState<number>(2320); // Rs per quintal (MSP reference)

  function saveTransactions(updated: Transaction[]) {
    setTransactions(updated);
    storageSet(STORAGE_KEYS.TRANSACTIONS, updated);
  }

  function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (isNaN(amt) || amt <= 0) {
      setFormError('Please enter a valid positive amount.');
      return;
    }

    const newTx: Transaction = {
      id: generateId(),
      type: formType,
      category: formCategory as any,
      amount: amt,
      date: formDate,
      cropId: formCropId || undefined,
      notes: formNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    saveTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setFormAmount('');
    setFormNotes('');
    setFormError('');
    showToast(formType === 'income' ? 'Income entry recorded' : 'Expense entry recorded', {
      type: 'success',
    });
  }

  function confirmDelete() {
    if (deleteTargetId) {
      saveTransactions(transactions.filter(t => t.id !== deleteTargetId));
      setDeleteTargetId(null);
      showToast('Transaction removed from farm ledger', { type: 'info' });
    }
  }

  function downloadCsv() {
    if (transactions.length === 0) {
      showToast('No transactions to export', { type: 'warning' });
      return;
    }
    const headers = ['ID', 'Type', 'Category', 'Amount (INR)', 'Date', 'Crop', 'Notes'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      t.category,
      t.amount,
      t.date,
      t.cropId || 'General',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `agrisense-farm-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported transaction ledger to CSV', { type: 'success' });
  }

  // Summaries
  const summaries = useMemo(() => {
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach(t => {
      if (t.type === 'expense') totalExpense += t.amount;
      else totalIncome += t.amount;
    });

    const netBalance = totalIncome - totalExpense;
    return { totalExpense, totalIncome, netBalance };
  }, [transactions]);

  // Filtered List
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCrop !== 'all' && t.cropId !== filterCrop) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, filterCrop]);

  // Breakdown by Category
  const expenseBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return EXPENSE_CATEGORIES.map(cat => ({
      name: cat.label,
      value: map[cat.id] || 0,
      color: cat.color,
    })).filter(item => item.value > 0);
  }, [transactions]);

  // Profit Calculator Metrics
  const calcTotalYield = calcArea * calcExpectedYield;
  const calcEstimatedRevenue = calcTotalYield * calcMarketPrice;
  // Sum matching expenses for the selected crop
  const calcCropExpenses = transactions
    .filter(t => t.type === 'expense' && t.cropId === calcCropId)
    .reduce((sum, t) => sum + t.amount, 0);
  // Default estimated cost baseline if no logged expenses
  const calcCultivationCost = calcCropExpenses > 0 ? calcCropExpenses : calcArea * 18000;
  const calcNetProfit = calcEstimatedRevenue - calcCultivationCost;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Farm Finances & Profit Calculator"
        subtitle="Track seasonal cultivation expenses, crop sales, and estimate profit margins"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={downloadCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setFormType('expense');
                setFormCategory('seed');
                setIsModalOpen(true);
              }}
            >
              Add Transaction
            </Button>
          </div>
        }
      />

      <InfoBanner variant="info">
        <strong>Financial records are private:</strong> All entries are stored solely in your local browser storage. Revenue calculations are illustrative estimates based on user-entered yield and price assumptions.
      </InfoBanner>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Cultivation Expenses"
          value={formatCurrency(summaries.totalExpense)}
          icon={<ArrowUpRight className="w-5 h-5 text-neutral-800" />}
          subtitle={`${transactions.filter(t => t.type === 'expense').length} expense entries recorded`}
        />
        <StatCard
          label="Total Recorded Income"
          value={formatCurrency(summaries.totalIncome)}
          icon={<ArrowDownLeft className="w-5 h-5 text-[var(--color-primary-600)]" />}
          subtitle="Produce sales & DBT subsidies"
        />
        <StatCard
          label="Current Net Balance"
          value={formatCurrency(summaries.netBalance)}
          icon={<IndianRupee className="w-5 h-5 text-[var(--color-primary-600)]" />}
          subtitle={summaries.netBalance >= 0 ? 'Positive net cashflow' : 'Operating deficit (pre-harvest)'}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-xl w-fit" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'transactions'}
          onClick={() => setActiveTab('transactions')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Transactions & Ledger</span>
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
          <span>Crop Profit Calculator</span>
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS & LEDGER */}
      {activeTab === 'transactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ledger Table */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Select
                  className="text-xs py-1.5"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="expense">Expenses only</option>
                  <option value="income">Income only</option>
                </Select>

                <Select
                  className="text-xs py-1.5"
                  value={filterCrop}
                  onChange={e => setFilterCrop(e.target.value)}
                >
                  <option value="all">All Crops</option>
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>

              <span className="text-xs text-[var(--color-text-muted)]">
                Showing {filteredTransactions.length} of {transactions.length} records
              </span>
            </div>

            {filteredTransactions.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<IndianRupee className="w-10 h-10 text-[var(--color-text-muted)]" />}
                  title="No financial entries found"
                  description="Start logging your seed, fertiliser, labour, and produce transactions."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Record First Entry
                    </Button>
                  }
                />
              </Card>
            ) : (
              <Card className="p-0 overflow-hidden shadow-xs border border-[var(--color-border)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left" aria-label="Farm transactions table">
                    <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold border-b border-[var(--color-border)]">
                      <tr>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Crop / Notes</th>
                        <th className="py-2.5 px-4 text-right">Amount</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {filteredTransactions.map(tx => {
                        const isExp = tx.type === 'expense';
                        const crop = CROPS.find(c => c.id === tx.cropId);

                        return (
                          <tr key={tx.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                            <td className="py-3 px-4 font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                              {formatDate(tx.date)}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant={isExp ? 'neutral' : 'green'}>
                                {tx.category.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-[var(--color-text-primary)]">
                                {crop ? crop.name : 'General Farm'}
                              </p>
                              {tx.notes && (
                                <p className="text-[11px] text-[var(--color-text-muted)] truncate max-w-xs">
                                  {tx.notes}
                                </p>
                              )}
                            </td>
                            <td className={`py-3 px-4 text-right font-semibold whitespace-nowrap ${isExp ? 'text-red-700' : 'text-emerald-700'}`}>
                              {isExp ? '-' : '+'} {formatCurrency(tx.amount)}
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => setDeleteTargetId(tx.id)}
                                className="p-1.5 text-[var(--color-text-muted)] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                aria-label="Delete transaction"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Expense Breakdown Visualisation */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[var(--color-primary-600)]" />
                Expense Distribution
              </h3>

              {expenseBreakdown.length === 0 ? (
                <p className="text-xs text-[var(--color-text-muted)] text-center py-8">
                  No expense records yet to plot.
                </p>
              ) : (
                <div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdown}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={65}
                          innerRadius={40}
                          paddingAngle={3}
                        >
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {expenseBreakdown.map(item => (
                      <div key={item.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-[var(--color-text-secondary)]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: CULTIVATION COST & PROFIT CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Parameters */}
          <div className="lg:col-span-1">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[var(--color-primary-600)]" />
                Estimation Assumptions
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Input your anticipated land area, estimated yield, and expected market realization.
              </p>

              <FormField label="Target Crop">
                <Select
                  value={calcCropId}
                  onChange={e => setCalcCropId(e.target.value)}
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Cultivated Land Area (Acres)">
                <Input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={calcArea}
                  onChange={e => setCalcArea(parseFloat(e.target.value) || 0)}
                />
              </FormField>

              <FormField label="Expected Yield (Quintals per Acre)" hint="Average regional yields: Paddy 22-26, Wheat 18-22">
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={calcExpectedYield}
                  onChange={e => setCalcExpectedYield(parseFloat(e.target.value) || 0)}
                />
              </FormField>

              <FormField label="Anticipated Mandi Price (₹ per Quintal)">
                <Input
                  type="number"
                  min="500"
                  step="50"
                  value={calcMarketPrice}
                  onChange={e => setCalcMarketPrice(parseFloat(e.target.value) || 0)}
                />
              </FormField>
            </Card>
          </div>

          {/* Calculated Output & Formula Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-[var(--color-primary-200)] bg-[var(--color-surface-1)]">
              <div className="flex items-center justify-between pb-2 mb-4">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Projected Financial Outcome (Estimates)
                </h3>
                <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                  ICAR Model Estimate
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                <div className="p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-xs">
                  <span className="text-xs text-[var(--color-text-muted)]">Total Expected Harvest</span>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                    {calcTotalYield} Quintals
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {calcArea} ac × {calcExpectedYield} qtl
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-xs">
                  <span className="text-xs text-[var(--color-text-muted)]">Estimated Gross Revenue</span>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                    {formatCurrency(calcEstimatedRevenue)}
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    @ {formatCurrency(calcMarketPrice)}/qtl
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-xs">
                  <span className="text-xs text-[var(--color-text-muted)]">Estimated Net Margin</span>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                    {formatCurrency(calcNetProfit)}
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    Net profit after costs
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-xs">
                  <span className="text-xs text-[var(--color-text-muted)]">Benefit-Cost Ratio</span>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                    {(calcEstimatedRevenue / Math.max(1, calcCultivationCost)).toFixed(2)} : 1
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    Target &gt; 1.50
                  </span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[var(--color-border)] shadow-xs col-span-2 sm:col-span-1">
                  <span className="text-xs text-[var(--color-text-muted)]">Projected ROI</span>
                  <p className="text-lg font-bold text-[var(--color-text-primary)] mt-1">
                    {((calcNetProfit / Math.max(1, calcCultivationCost)) * 100).toFixed(1)}%
                  </p>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    Return on Capital
                  </span>
                </div>
              </div>

              {/* Explanatory Formula */}
              <div className="bg-white p-4 rounded-lg border border-[var(--color-border)] shadow-xs space-y-2 text-xs text-[var(--color-text-secondary)]">
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Calculation Formula Breakdown:
                </p>
                <div className="space-y-1 font-mono text-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border)] p-2.5 rounded text-[var(--color-text-primary)]">
                  <p>1. Total Yield = {calcArea} acres × {calcExpectedYield} qtl = {calcTotalYield} qtl</p>
                  <p>2. Gross Revenue = {calcTotalYield} qtl × ₹{calcMarketPrice} = ₹{calcEstimatedRevenue.toLocaleString('en-IN')}</p>
                  <p>3. Cultivation Cost = ₹{calcCultivationCost.toLocaleString('en-IN')} ({calcCropExpenses > 0 ? 'from your recorded expenses' : 'estimated standard @ ₹18,000/acre'})</p>
                  <p className="font-bold">4. Estimated Profit = Gross Revenue − Total Cost = ₹{calcNetProfit.toLocaleString('en-IN')}</p>
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] italic">
                  Note: Yield and prices depend on monsoon rainfall, pest infestations, harvest moisture, and mandi fluctuations. Use this as a budgeting tool, not an agricultural guarantee.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Transaction Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl border border-[var(--color-border)] max-w-md w-full p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                Record Financial Entry
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('expense');
                    setFormCategory('seed');
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    formType === 'expense'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  - Farm Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('income');
                    setFormCategory('crop_sale');
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    formType === 'income'
                      ? 'bg-[var(--color-primary-600)] text-white shadow-xs'
                      : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  + Farm Income
                </button>
              </div>

              <FormField label="Category" required>
                <Select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  required
                >
                  {(formType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Amount (₹ INR)" required>
                  <Input
                    type="number"
                    step="10"
                    placeholder="e.g. 2500"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Date" required>
                  <Input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Associated Crop (Optional)">
                <Select
                  value={formCropId}
                  onChange={e => setFormCropId(e.target.value)}
                >
                  <option value="">General Farm</option>
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Description / Invoice Notes">
                <Textarea
                  rows={2}
                  placeholder="e.g. Paid labourer Ramu for weeding, cash receipt"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accessible Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Transaction Record"
        message="Are you sure you want to delete this financial ledger record? This will adjust your total farm balance and cost calculations."
        confirmLabel="Delete Transaction"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
