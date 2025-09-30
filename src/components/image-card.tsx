'use client';

import type { ApodData } from '@/lib/nasa-apod';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookMarked, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getAiStory } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from './ui/scroll-area';

interface ImageCardProps {
  apod: ApodData;
}

export default function ImageCard({ apod }: ImageCardProps) {
  const [story, setStory] = useState('');
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerateStory = async () => {
    if (story) {
      setIsDialogOpen(true);
      return;
    }
    setIsStoryLoading(true);
    try {
      const result = await getAiStory({ title: apod.title, explanation: apod.explanation });
      setStory(result.story);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Failed to generate story", error);
      // In a real app, you might show a toast notification here
    } finally {
      setIsStoryLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl w-full mx-auto animate-fade-in border-primary/20 shadow-lg shadow-primary/10">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <CardTitle className="text-2xl md:text-3xl text-primary">{apod.title}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap self-start sm:self-center">{apod.date}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {apod.media_type === 'image' ? (
          <a href={apod.hdurl || apod.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video w-full">
            <Image
              src={apod.url}
              alt={apod.title}
              fill
              className="object-contain rounded-lg shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <CardFooter className="flex-col items-end gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleGenerateStory} disabled={isStoryLoading} variant="outline" className="ml-auto">
              {isStoryLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BookMarked className="mr-2 h-4 w-4" />
              )}
              Tell me a Story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-primary">A Story about {apod.title}</DialogTitle>
              <DialogDescription>
                An imaginative tale inspired by this cosmic marvel.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{story}</p>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        {apod.copyright && (
          <p className="text-sm text-muted-foreground w-full text-right">&copy; {apod.copyright}</p>
        )}
      </CardFooter>
    </Card>
  );
}
