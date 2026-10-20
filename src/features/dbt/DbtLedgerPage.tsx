import { useState } from 'react';
import { searchDbtRecords } from '@/data/dbtRecords';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import {
  ShieldCheck, CheckCircle2, Building,
  CreditCard, Download
} from 'lucide-react';

export default function DbtLedgerPage() {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const filteredRecords = searchDbtRecords(query, schemeFilter || undefined, stateFilter || undefined);

  const totalDisbursed = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

  function handleExportCsv() {
    const headers = ['ID', 'Farmer Name', 'Village', 'District', 'State', 'Scheme', 'Installment', 'Amount (INR)', 'Bank', 'Account', 'UTR Reference', 'Date', 'Status'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.farmerName,
      r.village,
      r.district,
      r.state.toUpperCase(),
      r.schemeCode,
      `"${r.installmentNo}"`,
      r.amount,
      r.bankName,
      r.accountMasked,
      r.utrNumber,
      r.disbursedDate,
      r.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AgriSense_DBT_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title={t('dbt.title')}
          subtitle={t('dbt.subtitle')}
        />
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={handleExportCsv}
        >
          {t('common.exportCsv')}
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase block">
              {t('dbt.totalDisbursed')}
            </span>
            <span className="text-xl font-bold text-emerald-700">
              ₹{totalDisbursed.toLocaleString()}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase block">
              {t('dbt.totalBeneficiaries')}
            </span>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">
              {filteredRecords.length} Transactions
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary-700)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase block">
              Payment Gateway Mode
            </span>
            <span className="text-sm font-bold text-[var(--color-text-primary)]">
              Aadhaar Payment Bridge (APB) / PFMS
            </span>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('dbt.search')}
          className="flex-1"
        />
        <select
          value={schemeFilter}
          onChange={e => setSchemeFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white"
        >
          <option value="">All Schemes</option>
          <option value="PM-KISAN">PM-KISAN</option>
          <option value="PMFBY">PMFBY (Crop Insurance)</option>
          <option value="TN-MICRO-IRRIGATION">TN Micro Irrigation</option>
          <option value="SMAM">SMAM Mechanization</option>
          <option value="PB-PANI-BACHAO">PB Pani Bachao</option>
          <option value="PM-KUSUM">PM-KUSUM Solar</option>
          <option value="RYTHU-BHAROSA">YSR Rythu Bharosa</option>
          <option value="KA-KRISHI-BHAGYA">KA Krishi Bhagya</option>
        </select>
        <select
          value={stateFilter}
          onChange={e => setStateFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white"
        >
          <option value="">All States</option>
          <option value="tn">Tamil Nadu</option>
          <option value="ap">Andhra Pradesh</option>
          <option value="pb">Punjab</option>
          <option value="mh">Maharashtra</option>
          <option value="ka">Karnataka</option>
        </select>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden p-0 border border-[var(--color-border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--color-surface-1)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Beneficiary & Village</th>
                <th className="px-4 py-3">Scheme & Installment</th>
                <th className="px-4 py-3">Amount (₹)</th>
                <th className="px-4 py-3">Bank & Account</th>
                <th className="px-4 py-3">PFMS / UTR Ref</th>
                <th className="px-4 py-3">Disbursed Date</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                    <span className="font-bold block">{record.farmerName}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {record.village}, {record.district.toUpperCase()} ({record.state.toUpperCase()})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] inline-block mb-0.5">
                      {record.schemeCode}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-secondary)] block">
                      {record.installmentNo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-700">
                    ₹{record.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="block font-medium">{record.bankName}</span>
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{record.accountMasked}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-gray-700">
                    {record.utrNumber}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-[11px]">
                    {record.disbursedDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Credited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredRecords.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
          {t('common.noResults')}
        </div>
      )}
    </div>
  );
}
