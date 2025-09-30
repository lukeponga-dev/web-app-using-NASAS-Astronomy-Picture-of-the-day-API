
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, History, Rocket } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/on-this-day', label: 'On This Day', icon: History },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  const navLinks = (
    <>
      {navItems.map((item) => (
        <Button
          key={item.label}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          asChild
          onClick={closeSheet}
        >
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Stellar Stories
            </span>
          </Link>
          <nav className="flex items-center space-x-1">{navLinks}</nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link
                  href="/"
                  className="mb-6 flex items-center space-x-2 px-4"
                  onClick={closeSheet}
                >
                  <Rocket className="h-6 w-6 text-primary" />
                  <span className="font-bold">Stellar Stories</span>
                </Link>
                <div className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={closeSheet}
                            className={cn(
                                "flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex items-center">
             <p className="text-xs text-muted-foreground">
                Powered by NASA APOD API
            </p>
          </nav>
        </div>
      </div>
    </header>
  );
}
