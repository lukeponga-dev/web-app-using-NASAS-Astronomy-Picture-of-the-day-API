'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Wand2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAiSuggestions } from '@/app/actions';

interface DateControlsProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

export default function DateControls({
  currentDate,
  onDateChange,
}: DateControlsProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedDates, setSuggestedDates] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAiSuggest = async () => {
    setIsAiLoading(true);
    setSuggestedDates([]);
    try {
      const result = await getAiSuggestions({ currentDate: format(new Date(), 'yyyy-MM-dd') });
      if (result.dates) {
        setSuggestedDates(result.dates);
      }
    } catch (error) {
      console.error('Failed to get AI suggestions', error);
      // In a real app, a toast notification would be shown here.
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(format(date, 'yyyy-MM-dd'));
      setPopoverOpen(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-card rounded-lg border">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full sm:w-[280px] justify-start text-left font-normal',
              !currentDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {currentDate ? format(new Date(currentDate), 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={new Date(currentDate)}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => date > new Date() || date < new Date('1995-06-16')}
          />
        </PopoverContent>
      </Popover>

      <div className="flex flex-col items-center gap-2">
        <Button onClick={handleAiSuggest} disabled={isAiLoading} variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/80 w-full sm:w-auto">
          {isAiLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Suggest Dates
        </Button>
        {suggestedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {suggestedDates.map((date) => (
              <Button
                key={date}
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(date)}
                className="text-accent-foreground bg-accent/20 hover:bg-accent/40"
              >
                {format(new Date(date), 'MMM d, yyyy')}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
