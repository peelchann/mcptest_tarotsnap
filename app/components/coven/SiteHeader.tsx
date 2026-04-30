'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoMark from './LogoMark';
import MobileNav from './MobileNav';
import RitualButton from './RitualButton';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/reading/single', label: 'Readings' },
  { href: '/journal', label: 'Journal' },
  { href: '/spreads', label: 'Spreads' },
  { href: '/about', label: 'About' },
];

/**
 * SiteHeader — sticky-top dark glassy header.
 * Desktop: logo · nav links · "Begin Reading" RitualButton.
 * Mobile: logo · MobileNav drawer trigger.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-coven-deep/70 border-b border-[rgba(176,138,73,0.18)]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          <LogoMark href="/" />

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative font-sans text-[0.78rem] tracking-[0.22em] uppercase transition-colors',
                    active
                      ? 'text-coven-soft-gold'
                      : 'text-coven-fog hover:text-coven-bone',
                  )}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rotate-45 bg-coven-soft-gold"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <RitualButton size="sm" asChild>
              <Link href="/reading/single">Begin Reading</Link>
            </RitualButton>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
