import { ViewConfig } from '@/types/stock';

export const viewConfigs: ViewConfig[] = [
  {
    id: 'price',
    label: 'Price',
    description: 'Historical closing prices with optional moving average overlays.',
    methodology: 'Displays the adjusted closing price for each trading day. Moving averages (20-day and 50-day) are calculated as simple arithmetic means of the preceding N trading days.',
    limitations: 'Past prices do not predict future performance. Moving averages are lagging indicators that smooth historical data but cannot anticipate trend changes.',
  },
  {
    id: 'returns',
    label: 'Returns',
    description: 'Daily percentage change in closing price.',
    methodology: 'Calculated as (P₁ - P₀) / P₀ × 100, where P₁ is today\'s close and P₀ is yesterday\'s close. This represents the one-day holding period return.',
    limitations: 'Daily returns are highly variable and not normally distributed. Outliers (large positive or negative returns) occur more frequently than a normal distribution would suggest.',
  },
  {
    id: 'drawdown',
    label: 'Drawdown',
    description: 'Percentage decline from the highest previous closing price.',
    methodology: 'At each point, drawdown = (Current Price - Peak Price) / Peak Price × 100. The peak is the highest close observed up to that date.',
    limitations: 'Drawdowns measure historical maximum loss but do not indicate recovery time or probability. Maximum drawdown is sensitive to the observation period.',
  },
  {
    id: 'volatility',
    label: 'Volatility',
    description: 'Rolling 20-day annualized volatility (standard deviation of returns).',
    methodology: 'Calculated as the standard deviation of the past 20 daily returns, multiplied by √252 to annualize (assuming 252 trading days per year).',
    limitations: 'Historical volatility is backward-looking and may not reflect future risk. Volatility clustering means high-volatility periods tend to persist, but regime changes can occur suddenly.',
  },
];
