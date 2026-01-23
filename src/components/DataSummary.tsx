import { useMemo } from 'react';
import { StockDataPoint } from '@/types/stock';
import { formatNumber, formatPercent, formatDate } from '@/utils/stockCalculations';
import { Card } from '@/components/ui/card';

interface DataSummaryProps {
  data: StockDataPoint[];
}

export function DataSummary({ data }: DataSummaryProps) {
  const stats = useMemo(() => {
    if (data.length === 0) return null;

    const firstPrice = data[0].close;
    const lastPrice = data[data.length - 1].close;
    const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    const minDrawdown = Math.min(...data.map(d => d.drawdown ?? 0));
    
    const validVolatilities = data.filter(d => d.volatility !== undefined).map(d => d.volatility!);
    const avgVolatility = validVolatilities.length > 0 
      ? validVolatilities.reduce((a, b) => a + b, 0) / validVolatilities.length 
      : undefined;

    const highPrice = Math.max(...data.map(d => d.close));
    const lowPrice = Math.min(...data.map(d => d.close));

    return {
      startDate: data[0].date,
      endDate: data[data.length - 1].date,
      observations: data.length,
      firstPrice,
      lastPrice,
      totalReturn,
      highPrice,
      lowPrice,
      maxDrawdown: minDrawdown,
      avgVolatility,
    };
  }, [data]);

  if (!stats) return null;

  const StatItem = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="data-label">{label}</p>
      <p className="text-lg font-serif font-semibold text-foreground">{value}</p>
    </div>
  );

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-medium text-foreground mb-4">Summary Statistics</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatItem 
          label="Period" 
          value={`${formatDate(stats.startDate).split(',')[0]} – ${formatDate(stats.endDate).split(',')[0]}`} 
        />
        <StatItem 
          label="Observations" 
          value={stats.observations.toLocaleString()} 
        />
        <StatItem 
          label="Total Return" 
          value={formatPercent(stats.totalReturn)} 
        />
        <StatItem 
          label="High / Low" 
          value={`$${formatNumber(stats.highPrice)} / $${formatNumber(stats.lowPrice)}`} 
        />
        <StatItem 
          label="Max Drawdown" 
          value={formatPercent(stats.maxDrawdown)} 
        />
        <StatItem 
          label="Avg. Volatility" 
          value={stats.avgVolatility !== undefined ? `${formatNumber(stats.avgVolatility)}%` : '—'} 
        />
      </div>
      <p className="mt-4 text-xs text-muted-foreground italic">
        Statistics are descriptive measures of historical data and do not imply future performance.
      </p>
    </Card>
  );
}
