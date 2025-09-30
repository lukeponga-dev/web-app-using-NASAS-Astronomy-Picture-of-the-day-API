'use client';

import type { ApodData } from '@/lib/nasa-apod';
import { useRouter } from 'next/navigation';
import DateControls from './date-controls';
import ImageCard from './image-card';

interface ApodViewerProps {
  initialApod: ApodData;
  currentDate: string;
}

export default function ApodViewer({ initialApod, currentDate }: ApodViewerProps) {
  const router = useRouter();

  const handleDateChange = (newDate: string) => {
    router.push(`/?date=${newDate}`, { scroll: false });
  };
  
  return (
    <div className="flex flex-col items-center gap-8">
      <DateControls
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />
      <ImageCard apod={initialApod} />
    </div>
  );
}
