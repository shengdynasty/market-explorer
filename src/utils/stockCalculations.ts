import { StockDataPoint } from '@/types/stock';

export function parseCSV(csvText: string): StockDataPoint[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dateIndex = headers.findIndex(h => h === 'date');
  const closeIndex = headers.findIndex(h => h === 'close' || h === 'adj close');

  if (dateIndex === -1 || closeIndex === -1) {
    throw new Error('CSV must contain "Date" and "Close" or "Adj Close" columns');
  }

  const data: StockDataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const date = values[dateIndex];
    const close = parseFloat(values[closeIndex]);

    if (date && !isNaN(close)) {
      data.push({ date, close });
    }
  }

  // Sort by date ascending
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return data;
}

export function calculateMovingAverage(data: StockDataPoint[], period: number): (number | undefined)[] {
  const result: (number | undefined)[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(undefined);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      result.push(sum / period);
    }
  }
  
  return result;
}

export function calculateReturns(data: StockDataPoint[]): (number | undefined)[] {
  const result: (number | undefined)[] = [undefined];
  
  for (let i = 1; i < data.length; i++) {
    const dailyReturn = ((data[i].close - data[i - 1].close) / data[i - 1].close) * 100;
    result.push(dailyReturn);
  }
  
  return result;
}

export function calculateDrawdown(data: StockDataPoint[]): number[] {
  const result: number[] = [];
  let peak = data[0]?.close || 0;
  
  for (const point of data) {
    if (point.close > peak) {
      peak = point.close;
    }
    const drawdown = ((point.close - peak) / peak) * 100;
    result.push(drawdown);
  }
  
  return result;
}

export function calculateVolatility(data: StockDataPoint[], period: number = 20): (number | undefined)[] {
  const returns = calculateReturns(data);
  const result: (number | undefined)[] = [];
  const annualizationFactor = Math.sqrt(252); // Trading days per year
  
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(undefined);
    } else {
      const windowReturns = returns.slice(i - period + 1, i + 1).filter((r): r is number => r !== undefined);
      if (windowReturns.length < period) {
        result.push(undefined);
        continue;
      }
      
      const mean = windowReturns.reduce((a, b) => a + b, 0) / windowReturns.length;
      const variance = windowReturns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / windowReturns.length;
      const stdDev = Math.sqrt(variance);
      const annualizedVol = stdDev * annualizationFactor;
      result.push(annualizedVol);
    }
  }
  
  return result;
}

export function enrichStockData(rawData: StockDataPoint[]): StockDataPoint[] {
  const ma20 = calculateMovingAverage(rawData, 20);
  const ma50 = calculateMovingAverage(rawData, 50);
  const returns = calculateReturns(rawData);
  const drawdown = calculateDrawdown(rawData);
  const volatility = calculateVolatility(rawData, 20);

  return rawData.map((point, i) => ({
    ...point,
    ma20: ma20[i],
    ma50: ma50[i],
    returns: returns[i],
    drawdown: drawdown[i],
    volatility: volatility[i],
  }));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
