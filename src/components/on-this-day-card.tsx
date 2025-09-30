'use client';

import type { ApodData } from '@/lib/nasa-apod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Video } from 'lucide-react';

interface OnThisDayCardProps {
  apod: ApodData;
}

export default function OnThisDayCard({ apod }: OnThisDayCardProps) {
  return (
    <Link href={`/?date=${apod.date}`} className="flex group">
      <Card className="w-full flex flex-col bg-secondary/30 hover:border-primary/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
        <CardContent className="p-0 flex-grow">
          {apod.media_type === 'image' ? (
            <div className="relative aspect-video w-full">
              <Image
                src={apod.url}
                alt={apod.title}
                fill
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black rounded-t-lg flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </CardContent>
        <CardHeader className="p-4">
          <CardTitle className="text-lg text-primary group-hover:text-primary/90 transition-colors">{apod.title}</CardTitle>
          <CardDescription>{apod.date}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
