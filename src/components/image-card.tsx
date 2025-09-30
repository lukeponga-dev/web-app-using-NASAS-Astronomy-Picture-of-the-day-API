'use client';

import type { ApodData } from '@/lib/nasa-apod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ImageCardProps {
  apod: ApodData;
}

export default function ImageCard({ apod }: ImageCardProps) {
  return (
    <Card className="max-w-4xl w-full mx-auto animate-fade-in border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <CardTitle className="font-headline text-2xl md:text-3xl text-primary">{apod.title}</CardTitle>
          <Badge variant="outline" className="text-accent-foreground bg-accent border-accent whitespace-nowrap self-start sm:self-center">{apod.date}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {apod.media_type === 'image' ? (
          <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer">
            <img
              src={apod.url}
              alt={apod.title}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </a>
        ) : (
          <div className="aspect-video w-full">
            <iframe
              src={apod.url}
              title={apod.title}
              className="w-full h-full rounded-lg shadow-md"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <p className="text-foreground/80 mt-6 text-base leading-relaxed">
          {apod.explanation}
        </p>
      </CardContent>
      {apod.copyright && (
        <CardFooter>
          <p className="text-sm text-muted-foreground w-full text-right">&copy; {apod.copyright}</p>
        </CardFooter>
      )}
    </Card>
  );
}
