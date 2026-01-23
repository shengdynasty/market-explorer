import { ViewMode } from '@/types/stock';
import { viewConfigs } from '@/config/viewConfigs';
import { Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ViewExplanationProps {
  currentView: ViewMode;
}

export function ViewExplanation({ currentView }: ViewExplanationProps) {
  const config = viewConfigs.find(c => c.id === currentView);
  if (!config) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground academic-prose">
            {config.description}
          </p>
          
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="details" className="border-none">
              <AccordionTrigger className="py-2 text-xs text-muted-foreground hover:text-foreground hover:no-underline">
                Methodology & Limitations
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-1">
                  <div>
                    <h4 className="data-label mb-1">Methodology</h4>
                    <p className="text-sm text-muted-foreground">
                      {config.methodology}
                    </p>
                  </div>
                  <div>
                    <h4 className="data-label mb-1">Limitations</h4>
                    <p className="text-sm text-muted-foreground">
                      {config.limitations}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
