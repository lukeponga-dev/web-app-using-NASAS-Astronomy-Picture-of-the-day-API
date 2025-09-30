import { fetchApod, isApodError } from '@/lib/nasa-apod';
import ApodViewer from '@/components/apod-viewer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const today = new Date();
  const dateParam = typeof searchParams.date === 'string' ? searchParams.date : format(today, 'yyyy-MM-dd');
  
  let dateToFetch = dateParam;
  try {
    const parsedDate = new Date(dateParam);
    if (isNaN(parsedDate.getTime()) || parsedDate > today) {
      dateToFetch = format(today, 'yyyy-MM-dd');
    }
  } catch {
    dateToFetch = format(today, 'yyyy-MM-dd');
  }

  const apodData = await fetchApod(dateToFetch);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center my-8">
        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl tracking-tighter text-primary">
          Stellar Stories
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          NASA's Astronomy Picture of the Day
        </p>
      </header>
      <main>
        {isApodError(apodData) ? (
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Image</AlertTitle>
            <AlertDescription>{apodData.msg}</AlertDescription>
          </Alert>
        ) : (
          <ApodViewer initialApod={apodData} currentDate={dateToFetch} />
        )}
      </main>
    </div>
  );
}
