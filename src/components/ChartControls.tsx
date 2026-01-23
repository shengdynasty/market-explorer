import { ViewMode } from '@/types/stock';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ChartControlsProps {
  currentView: ViewMode;
  showMA20: boolean;
  showMA50: boolean;
  onToggleMA20: (checked: boolean) => void;
  onToggleMA50: (checked: boolean) => void;
}

export function ChartControls({
  currentView,
  showMA20,
  showMA50,
  onToggleMA20,
  onToggleMA50,
}: ChartControlsProps) {
  if (currentView !== 'price') return null;

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch 
          id="ma20" 
          checked={showMA20} 
          onCheckedChange={onToggleMA20}
          className="data-[state=checked]:bg-chart-ma20"
        />
        <Label htmlFor="ma20" className="text-sm text-muted-foreground cursor-pointer">
          20-Day MA
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch 
          id="ma50" 
          checked={showMA50} 
          onCheckedChange={onToggleMA50}
          className="data-[state=checked]:bg-chart-ma50"
        />
        <Label htmlFor="ma50" className="text-sm text-muted-foreground cursor-pointer">
          50-Day MA
        </Label>
      </div>
    </div>
  );
}
