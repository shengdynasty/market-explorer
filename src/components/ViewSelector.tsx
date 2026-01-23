import { ViewMode } from '@/types/stock';
import { viewConfigs } from '@/config/viewConfigs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <Tabs value={currentView} onValueChange={(v) => onViewChange(v as ViewMode)}>
      <TabsList className="grid w-full grid-cols-4 bg-muted">
        {viewConfigs.map((config) => (
          <TabsTrigger 
            key={config.id} 
            value={config.id}
            className="text-sm data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            {config.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
