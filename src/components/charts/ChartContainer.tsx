import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Table, BarChart2 } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  tableData?: { headers: string[]; rows: (string | number)[][] };
  ariaLabel: string;
  className?: string;
}

export default function ChartContainer({
  title,
  subtitle,
  action,
  children,
  tableData,
  ariaLabel,
  className = '',
}: ChartContainerProps) {
  const [showTable, setShowTable] = useState(false);

  return (
    <Card className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-primary)]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {tableData && (
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
              aria-label={showTable ? 'Switch to graphical chart' : 'Switch to accessible data table'}
            >
              {showTable ? (
                <>
                  <BarChart2 className="w-3.5 h-3.5 text-[var(--color-text-primary)]" />
                  <span>Chart View</span>
                </>
              ) : (
                <>
                  <Table className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>Data Table</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div aria-label={ariaLabel}>
        {showTable && tableData ? (
          <div className="overflow-x-auto max-h-72 rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                <tr>
                  {tableData.headers.map(h => (
                    <th key={h} className="py-2.5 px-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {tableData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[var(--color-surface-1)]">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3 text-[var(--color-text-secondary)] whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
