'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Wand2, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAiSuggestions, getRandomDateSuggestion } from '@/app/actions';

interface DateControlsProps {
  currentDate: string;
  onDateChange: (date: string) => void;
}

export default function DateControls({
  currentDate,
  onDateChange,
}: DateControlsProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
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

  const handleRandomSuggest = async () => {
    setIsRandomLoading(true);
    try {
      const result = await getRandomDateSuggestion({});
      if (result.date) {
        onDateChange(result.date);
      }
    } catch (error) {
      console.error('Failed to get random date suggestion', error);
    } finally {
      setIsRandomLoading(false);
    }
  }
  
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
              'w-full sm:w-[240px] justify-start text-left font-normal',
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
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleAiSuggest} disabled={isAiLoading} variant="secondary" className="w-full sm:w-auto">
            {isAiLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Suggest
          </Button>
           <Button onClick={handleRandomSuggest} disabled={isRandomLoading} variant="secondary" className="w-full sm:w-auto">
            {isRandomLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Surprise Me
          </Button>
        </div>
        {suggestedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {suggestedDates.map((date) => (
              <Button
                key={date}
                variant="ghost"
                size="sm"
                onClick={() => onDateChange(date)}
                className="text-primary hover:bg-primary/10 hover:text-primary"
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
