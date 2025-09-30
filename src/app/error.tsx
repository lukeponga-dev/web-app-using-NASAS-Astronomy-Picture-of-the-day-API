'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center text-center">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-3xl font-headline font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{error.message || 'An unexpected error occurred. Please try again.'}</p>
      <Button onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
