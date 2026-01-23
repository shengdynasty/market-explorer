import { useState, useCallback } from 'react';
import { StockDataPoint, EventMarker, ViewMode } from '@/types/stock';
import { parseCSV, enrichStockData } from '@/utils/stockCalculations';
import { FileUploader } from './FileUploader';
import { ViewSelector } from './ViewSelector';
import { ViewExplanation } from './ViewExplanation';
import { ChartControls } from './ChartControls';
import { StockChart } from './StockChart';
import { EventMarkerPanel } from './EventMarkerPanel';
import { DataSummary } from './DataSummary';
import { Footer } from './Footer';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function StockVisualization() {
  const [stockData, setStockData] = useState<StockDataPoint[]>([]);
  const [events, setEvents] = useState<EventMarker[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('price');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleDataLoaded = useCallback((csvText: string) => {
    try {
      setParseError(null);
      const rawData = parseCSV(csvText);
      if (rawData.length === 0) {
        setParseError('No valid data found in the CSV file');
        return;
      }
      const enrichedData = enrichStockData(rawData);
      setStockData(enrichedData);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Failed to parse CSV');
    }
  }, []);

  const handleAddEvent = useCallback((event: Omit<EventMarker, 'id'>) => {
    const newEvent: EventMarker = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  }, []);

  const handleRemoveEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const minDate = stockData.length > 0 ? stockData[0].date : undefined;
  const maxDate = stockData.length > 0 ? stockData[stockData.length - 1].date : undefined;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Historical Market Data Explorer
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl academic-prose">
            An educational tool for analyzing historical stock prices, volatility patterns, 
            and the relationship between market behavior and policy events.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <FileUploader 
            onDataLoaded={handleDataLoaded} 
            hasData={stockData.length > 0} 
          />

          {parseError && (
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">{parseError}</p>
              </div>
            </Card>
          )}

          {stockData.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <DataSummary data={stockData} />

              <Card className="p-4 sm:p-6 bg-card border-border">
                <div className="space-y-4">
                  <ViewSelector 
                    currentView={currentView} 
                    onViewChange={setCurrentView} 
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <ViewExplanation currentView={currentView} />
                    <ChartControls
                      currentView={currentView}
                      showMA20={showMA20}
                      showMA50={showMA50}
                      onToggleMA20={setShowMA20}
                      onToggleMA50={setShowMA50}
                    />
                  </div>

                  <div className="mt-4">
                    <StockChart
                      data={stockData}
                      events={events}
                      view={currentView}
                      showMA20={showMA20}
                      showMA50={showMA50}
                    />
                  </div>
                </div>
              </Card>

              <EventMarkerPanel
                events={events}
                onAddEvent={handleAddEvent}
                onRemoveEvent={handleRemoveEvent}
                minDate={minDate}
                maxDate={maxDate}
              />
            </div>
          )}

          {stockData.length === 0 && !parseError && (
            <Card className="p-8 bg-muted/30 border-border">
              <div className="text-center">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Getting Started
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  Upload a CSV file containing historical stock data. The file should include 
                  columns for "Date" and either "Close" or "Adj Close" prices. You can download 
                  historical data from Yahoo Finance or similar sources.
                </p>
                <div className="mt-4 p-4 bg-card rounded-md border border-border max-w-sm mx-auto">
                  <p className="data-label mb-2">Expected CSV Format</p>
                  <pre className="text-xs text-muted-foreground text-left font-mono">
{`Date,Open,High,Low,Close,Adj Close,Volume
2023-01-03,130.28,130.90,124.17,125.07,124.56,112117500
2023-01-04,126.89,128.66,125.08,126.36,125.85,89113600`}
                  </pre>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
