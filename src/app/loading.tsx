import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <Loader className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
