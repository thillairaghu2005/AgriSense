import { useState, useEffect } from 'react';
import { searchDbtRecords } from '@/data/dbtRecords';
import { Card, PageHeader } from '@/components/ui/Card';
import { SearchInput } from '@/components/forms/FormComponents';
import Button from '@/components/ui/Button';
import { useApp } from '@/app/providers';
import { STATES } from '@/data/locations';
import {
  CheckCircle2, Download
} from 'lucide-react';

function exportCsv(records: ReturnType<typeof searchDbtRecords>) {
  const headers = ['ID', 'Farmer Name', 'Village', 'District', 'State', 'Scheme', 'Installment', 'Amount (INR)', 'Bank', 'Account', 'UTR Reference', 'Date', 'Status'];
  const rows = records.map(r => [
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
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AgriSense_DBT_Ledger_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DbtLedgerPage() {
  const { t, state: appState } = useApp();
  const [query, setQuery] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState(() => appState || '');

  // Keep stateFilter synced when user switches state in TopBar
  useEffect(() => {
    setStateFilter(appState || '');
  }, [appState]);

  const filteredRecords = searchDbtRecords(query, schemeFilter || undefined, stateFilter || undefined);

  const totalDisbursed = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

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
          onClick={() => exportCsv(filteredRecords)}
        >
          {t('common.exportCsv')}
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <div className="bg-white rounded-lg border border-[var(--color-border)] p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="py-2 sm:py-0">
          <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider block">
            {t('dbt.totalDisbursed')}
          </span>
          <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-0.5 block">
            ₹{totalDisbursed.toLocaleString()}
          </span>
          <span className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 block">
            Across active DBT schemes
          </span>
        </div>

        <div className="py-2 sm:py-0">
          <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider block">
            {t('dbt.totalBeneficiaries')}
          </span>
          <span className="text-2xl font-bold text-[var(--color-text-primary)] mt-0.5 block">
            {filteredRecords.length}
          </span>
          <span className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 block">
            Direct transactions tracked
          </span>
        </div>

        <div className="py-2 sm:py-0">
          <span className="text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider block">
            Disbursement Route
          </span>
          <span className="text-sm font-bold text-[var(--color-text-primary)] mt-1 block">
            Aadhaar Payment Bridge (APB) / PFMS
          </span>
          <span className="text-[11px] text-[var(--color-text-secondary)] font-medium mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[var(--color-text-secondary)]" />
            100% Direct bank settlement
          </span>
        </div>
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
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
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
          className="px-3 py-2 text-xs border border-[var(--color-border)] rounded-lg bg-white text-[var(--color-text-primary)] shadow-xs hover:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-600)] cursor-pointer transition-all"
        >
          <option value="">All States</option>
          {STATES.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Ledger Table */}
      <Card className="overflow-hidden p-0 border border-[var(--color-border)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider text-[10px]">
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
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-[var(--color-surface-1)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                    <span className="font-bold block">{record.farmerName}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {record.village}, {record.district.toUpperCase()} ({record.state.toUpperCase()})
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface-2)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[10px] inline-block mb-0.5">
                      {record.schemeCode}
                    </span>
                    <span className="text-[11px] text-[var(--color-text-secondary)] block">
                      {record.installmentNo}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">
                    ₹{record.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    <span className="block font-medium">{record.bankName}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">{record.accountMasked}</span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-[var(--color-text-primary)]">
                    {record.utrNumber}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] text-[11px]">
                    {record.disbursedDate}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-surface-2)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-text-secondary)]" />
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
