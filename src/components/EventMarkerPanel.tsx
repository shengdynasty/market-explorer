import { useState } from 'react';
import { EventMarker } from '@/types/stock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, X, Calendar, Tag } from 'lucide-react';

interface EventMarkerPanelProps {
  events: EventMarker[];
  onAddEvent: (event: Omit<EventMarker, 'id'>) => void;
  onRemoveEvent: (id: string) => void;
  minDate?: string;
  maxDate?: string;
}

export function EventMarkerPanel({
  events,
  onAddEvent,
  onRemoveEvent,
  minDate,
  maxDate,
}: EventMarkerPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (newDate && newLabel.trim()) {
      onAddEvent({ date: newDate, label: newLabel.trim() });
      setNewDate('');
      setNewLabel('');
      setIsAdding(false);
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Policy & Event Markers</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add vertical reference lines for key dates
          </p>
        </div>
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Event
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-muted rounded-md space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="event-date" className="text-xs text-muted-foreground">
                Date
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="event-date"
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="event-label" className="text-xs text-muted-foreground">
                Label
              </Label>
              <div className="relative mt-1">
                <Tag className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="event-label"
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Fed Rate Decision"
                  maxLength={40}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setIsAdding(false); setNewDate(''); setNewLabel(''); }}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAdd}
              disabled={!newDate || !newLabel.trim()}
            >
              Add Marker
            </Button>
          </div>
        </div>
      )}

      {events.length > 0 && (
        <div className="space-y-2">
          {events.map((event) => (
            <div 
              key={event.id}
              className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-chart-event rounded-full" />
                <div>
                  <span className="text-foreground">{event.label}</span>
                  <span className="text-muted-foreground ml-2 text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveEvent(event.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {events.length === 0 && !isAdding && (
        <p className="text-xs text-muted-foreground italic">
          No events added. Use markers to annotate policy decisions, economic reports, or other relevant dates.
        </p>
      )}
    </Card>
  );
}
