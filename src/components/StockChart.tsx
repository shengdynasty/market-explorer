import { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { StockDataPoint, EventMarker, ViewMode } from '@/types/stock';
import { formatDate, formatNumber, formatPercent } from '@/utils/stockCalculations';

interface StockChartProps {
  data: StockDataPoint[];
  events: EventMarker[];
  view: ViewMode;
  showMA20: boolean;
  showMA50: boolean;
}

const chartColors = {
  price: 'hsl(210, 60%, 45%)',
  ma20: 'hsl(35, 80%, 55%)',
  ma50: 'hsl(280, 40%, 55%)',
  positive: 'hsl(145, 50%, 40%)',
  negative: 'hsl(0, 55%, 50%)',
  drawdown: 'hsl(0, 50%, 45%)',
  volatility: 'hsl(200, 50%, 50%)',
  event: 'hsl(25, 70%, 50%)',
  grid: 'hsl(40, 10%, 80%)',
};

function CustomTooltip({ active, payload, label, view }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-md shadow-lg p-3 text-sm">
      <p className="font-medium text-foreground mb-2">{formatDate(label)}</p>
      <div className="space-y-1">
        {view === 'price' && (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Close:</span>
              <span className="font-medium text-foreground">${formatNumber(data.close)}</span>
            </div>
            {data.ma20 !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">20-Day MA:</span>
                <span style={{ color: chartColors.ma20 }}>${formatNumber(data.ma20)}</span>
              </div>
            )}
            {data.ma50 !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">50-Day MA:</span>
                <span style={{ color: chartColors.ma50 }}>${formatNumber(data.ma50)}</span>
              </div>
            )}
          </>
        )}
        {view === 'returns' && data.returns !== undefined && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Daily Return:</span>
            <span 
              className="font-medium"
              style={{ color: data.returns >= 0 ? chartColors.positive : chartColors.negative }}
            >
              {formatPercent(data.returns)}
            </span>
          </div>
        )}
        {view === 'drawdown' && data.drawdown !== undefined && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Drawdown:</span>
            <span className="font-medium" style={{ color: chartColors.drawdown }}>
              {formatPercent(data.drawdown)}
            </span>
          </div>
        )}
        {view === 'volatility' && data.volatility !== undefined && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Volatility (ann.):</span>
            <span className="font-medium" style={{ color: chartColors.volatility }}>
              {formatNumber(data.volatility)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function StockChart({ data, events, view, showMA20, showMA50 }: StockChartProps) {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      displayMA20: showMA20 ? d.ma20 : undefined,
      displayMA50: showMA50 ? d.ma50 : undefined,
    }));
  }, [data, showMA20, showMA50]);

  const eventLines = useMemo(() => {
    const dataDateSet = new Set(data.map(d => d.date));
    return events.filter(e => {
      const eventDate = new Date(e.date);
      const minDate = new Date(data[0]?.date);
      const maxDate = new Date(data[data.length - 1]?.date);
      return eventDate >= minDate && eventDate <= maxDate;
    });
  }, [data, events]);

  const commonProps = {
    data: chartData,
    margin: { top: 20, right: 20, left: 10, bottom: 20 },
  };

  const xAxisProps = {
    dataKey: 'date',
    tick: { fontSize: 11, fill: 'hsl(220, 10%, 45%)' },
    tickLine: false,
    axisLine: { stroke: chartColors.grid },
    tickFormatter: (value: string) => {
      const date = new Date(value);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    },
    interval: Math.floor(data.length / 6),
  };

  const yAxisProps = {
    tick: { fontSize: 11, fill: 'hsl(220, 10%, 45%)' },
    tickLine: false,
    axisLine: false,
    width: 60,
  };

  const renderEventLines = () => (
    eventLines.map((event) => (
      <ReferenceLine
        key={event.id}
        x={event.date}
        stroke={chartColors.event}
        strokeDasharray="4 4"
        strokeWidth={1.5}
        label={{
          value: event.label,
          position: 'top',
          fill: chartColors.event,
          fontSize: 10,
          fontWeight: 500,
        }}
      />
    ))
  );

  if (view === 'price') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis 
            {...yAxisProps} 
            tickFormatter={(v) => `$${v}`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip view={view} />} />
          {renderEventLines()}
          <Line
            type="monotone"
            dataKey="close"
            stroke={chartColors.price}
            strokeWidth={2}
            dot={false}
            name="Close"
          />
          {showMA20 && (
            <Line
              type="monotone"
              dataKey="displayMA20"
              stroke={chartColors.ma20}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 2"
              name="20-Day MA"
            />
          )}
          {showMA50 && (
            <Line
              type="monotone"
              dataKey="displayMA50"
              stroke={chartColors.ma50}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 2"
              name="50-Day MA"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (view === 'returns') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis 
            {...yAxisProps} 
            tickFormatter={(v) => `${v}%`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip view={view} />} />
          <ReferenceLine y={0} stroke={chartColors.grid} />
          {renderEventLines()}
          <Bar dataKey="returns" name="Daily Return">
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={(entry.returns ?? 0) >= 0 ? chartColors.positive : chartColors.negative}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (view === 'drawdown') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis 
            {...yAxisProps} 
            tickFormatter={(v) => `${v}%`}
            domain={['auto', 0]}
          />
          <Tooltip content={<CustomTooltip view={view} />} />
          <ReferenceLine y={0} stroke={chartColors.grid} />
          {renderEventLines()}
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke={chartColors.drawdown}
            fill={chartColors.drawdown}
            fillOpacity={0.3}
            strokeWidth={1.5}
            name="Drawdown"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (view === 'volatility') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis 
            {...yAxisProps} 
            tickFormatter={(v) => `${v}%`}
            domain={[0, 'auto']}
          />
          <Tooltip content={<CustomTooltip view={view} />} />
          {renderEventLines()}
          <Area
            type="monotone"
            dataKey="volatility"
            stroke={chartColors.volatility}
            fill={chartColors.volatility}
            fillOpacity={0.3}
            strokeWidth={1.5}
            name="Volatility"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
