'use client';

import type { ApodData } from '@/lib/nasa-apod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface OnThisDayCardProps {
  apod: ApodData;
}

export default function OnThisDayCard({ apod }: OnThisDayCardProps) {
  return (
    <Link href={`/?date=${apod.date}`} className="flex">
      <Card className="w-full flex flex-col hover:border-primary/60 transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-primary">{apod.title}</CardTitle>
          <CardDescription>{apod.date}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {apod.media_type === 'image' ? (
            <div className="relative aspect-video w-full">
              <Image
                src={apod.url}
                alt={apod.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video content</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground line-clamp-2">{apod.explanation}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
