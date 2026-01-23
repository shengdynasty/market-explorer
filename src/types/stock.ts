export interface StockDataPoint {
  date: string;
  close: number;
  ma20?: number;
  ma50?: number;
  returns?: number;
  drawdown?: number;
  volatility?: number;
}

export interface EventMarker {
  id: string;
  date: string;
  label: string;
}

export type ViewMode = 'price' | 'returns' | 'drawdown' | 'volatility';

export interface ViewConfig {
  id: ViewMode;
  label: string;
  description: string;
  methodology: string;
  limitations: string;
}
