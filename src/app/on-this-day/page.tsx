import { fetchApod, isApodError, type ApodData } from '@/lib/nasa-apod';
import { format, getYear, getMonth, getDate } from 'date-fns';
import OnThisDayCard from '@/components/on-this-day-card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default async function OnThisDayPage() {
  const today = new Date();
  const currentYear = getYear(today);
  const month = getMonth(today) + 1; // date-fns months are 0-indexed
  const day = getDate(today);

  const datesToFetch: string[] = [];
  // APOD started on 1995-06-16
  const startYear = Math.max(1996, getYear(new Date('1995-06-20'))); 
  
  for (let year = currentYear - 1; year >= startYear; year--) {
    // Handle case for APOD start date
    if (year === 1995 && (month < 6 || (month === 6 && day < 20))) continue;
    datesToFetch.push(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  const apodPromises = datesToFetch.map(date => fetchApod(date));
  const apodResults = await Promise.all(apodPromises);
  const validApods = apodResults.filter(result => !isApodError(result)) as ApodData[];
  const sortedApods = validApods.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="my-8 text-center">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tighter text-primary">
          On This Day in History
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A look back at astronomy pictures from {format(today, 'MMMM do')}
        </p>
      </header>
      <main>
        {sortedApods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApods.map(apod => (
              <OnThisDayCard key={apod.date} apod={apod} />
            ))}
          </div>
        ) : (
          <Alert className="max-w-xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Pictures Found</AlertTitle>
            <AlertDescription>
              It looks like there are no historical pictures for this date. This could be because it's a leap day or there wasn't a picture published on this day in the past.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
