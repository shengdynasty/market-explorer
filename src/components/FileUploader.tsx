import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploaderProps {
  onDataLoaded: (csvText: string) => void;
  hasData: boolean;
}

export function FileUploader({ onDataLoaded, hasData }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    setError(null);
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setFileName(file.name);
        onDataLoaded(text);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  if (hasData && fileName) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground">Data loaded successfully</p>
            </div>
          </div>
          <label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Load Different File</span>
            </Button>
          </label>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-8 border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-primary bg-accent' 
          : 'border-border hover:border-primary/50'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="p-4 rounded-full bg-muted">
          <Upload className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Upload Historical Data
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            Drag and drop a CSV file with historical stock prices, or click to browse. 
            Expected format: Yahoo Finance export with "Date" and "Close" or "Adj Close" columns.
          </p>
        </div>

        <label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="outline" asChild>
            <span className="cursor-pointer">Select CSV File</span>
          </Button>
        </label>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
