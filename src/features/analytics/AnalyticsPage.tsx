import { Card, PageHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import {
  Download, Printer, TrendingUp, Users, DollarSign,
  CheckCircle
} from 'lucide-react';

const DISTRICT_DATA = [
  { district: 'Thanjavur (TN)', disbursedLakhs: 840, beneficiaries: 4200 },
  { district: 'Coimbatore (TN)', disbursedLakhs: 620, beneficiaries: 3100 },
  { district: 'Salem (TN)', disbursedLakhs: 510, beneficiaries: 2800 },
  { district: 'Guntur (AP)', disbursedLakhs: 730, beneficiaries: 3600 },
  { district: 'Ludhiana (PB)', disbursedLakhs: 910, beneficiaries: 4100 },
  { district: 'Solapur (MH)', disbursedLakhs: 680, beneficiaries: 3400 },
  { district: 'Chitradurga (KA)', disbursedLakhs: 490, beneficiaries: 2600 },
];

const CATEGORY_DATA = [
  { name: 'Small & Marginal (SF/MF)', value: 58, color: '#16a34a' },
  { name: 'SC / ST Farmers', value: 22, color: '#0d9488' },
  { name: 'Women Landholders', value: 12, color: '#10b981' },
  { name: 'General Category', value: 8, color: '#64748b' },
];

const MONTHLY_TREND = [
  { month: 'Apr', applied: 320, sanctioned: 290, dbtDisbursed: 280 },
  { month: 'May', applied: 480, sanctioned: 430, dbtDisbursed: 410 },
  { month: 'Jun', applied: 610, sanctioned: 560, dbtDisbursed: 540 },
  { month: 'Jul', applied: 820, sanctioned: 740, dbtDisbursed: 710 },
  { month: 'Aug', applied: 750, sanctioned: 690, dbtDisbursed: 670 },
  { month: 'Sep', applied: 690, sanctioned: 640, dbtDisbursed: 630 },
];

const BUDGET_DATA = [
  { scheme: 'PM-KISAN', budgetCr: 60000, spentCr: 42000, percent: 70 },
  { scheme: 'PMFBY (Insurance)', budgetCr: 15500, spentCr: 11200, percent: 72 },
  { scheme: 'PMKSY (Micro-Irrig)', budgetCr: 4000, spentCr: 3100, percent: 77 },
  { scheme: 'SMAM (Mechanization)', budgetCr: 2200, spentCr: 1650, percent: 75 },
  { scheme: 'MIDH (Horticulture)', budgetCr: 2800, spentCr: 2100, percent: 75 },
];

export default function AnalyticsPage() {
  const { t } = useApp();

  function handleExportCsv() {
    const headers = ['District', 'Disbursed (Lakhs INR)', 'Beneficiaries Count'];
    const rows = DISTRICT_DATA.map(d => [d.district, d.disbursedLakhs, d.beneficiaries]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Welfare_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t('analytics.title')}
          subtitle={t('analytics.subtitle')}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
          >
            {t('common.print')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
          >
            {t('analytics.exportData')}
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase block">
              Total Funds Disbursed
            </span>
            <span className="text-xl font-bold text-emerald-700">₹4,780 Lakhs</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center shrink-0 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase block">
              Verified Beneficiaries
            </span>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">23,800</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase block">
              Application Clearance Rate
            </span>
            <span className="text-xl font-bold text-emerald-700">92.4%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-[var(--color-text-muted)] font-semibold uppercase block">
              Average Disbursal Speed
            </span>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">18.5 Days</span>
          </div>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* District Wise Bar Chart */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {t('analytics.districtDisbursement')} (₹ Lakhs)
            </h3>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
              FY 2026-27
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Lakhs`, 'Disbursed']}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="disbursedLakhs" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown Donut Chart */}
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {t('analytics.categoryDistribution')}
            </h3>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
              Social Equity
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '10px' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend Line Chart */}
        <Card className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {t('analytics.monthlyTrends')}
            </h3>
            <span className="text-[10px] text-[var(--color-text-muted)] font-medium bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)]">
              Submission vs DBT Disbursal
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} verticalAlign="top" align="right" />
                <Line type="monotone" dataKey="applied" name="Applications Submitted" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="sanctioned" name="Approved by District" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="dbtDisbursed" name="DBT Disbursed" stroke="#15803d" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Scheme Budget Utilization Progress */}
        <Card className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              {t('analytics.budgetUtilisation')}
            </h3>
            <span className="text-[10px] text-[var(--color-text-muted)]">
              FY 2026-27 Target
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {BUDGET_DATA.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[var(--color-text-primary)]">{item.scheme}</span>
                  <span className="font-semibold text-emerald-800">
                    ₹{item.spentCr.toLocaleString()} Cr / ₹{item.budgetCr.toLocaleString()} Cr ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--color-surface-2)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
