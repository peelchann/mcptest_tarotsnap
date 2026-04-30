'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, User2 } from 'lucide-react';
import LogoMark from './LogoMark';
import RitualButton from './RitualButton';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/reading/single', label: 'Readings' },
  { href: '/journal', label: 'Journal' },
  { href: '/spreads', label: 'Spreads' },
  { href: '/about', label: 'About' },
];

/**
 * MobileNav — full-screen drawer; toggles via menu button.
 * Logo at top, nav links centered, profile placeholder, bottom CTA.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-[2px] border border-[rgba(176,138,73,0.45)] text-coven-soft-gold hover:border-[rgba(216,182,106,0.7)] transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-coven-deep/96"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 ambient-bg pointer-events-none" />

          <div className="relative z-[81] flex flex-col h-full px-6 py-7">
            <div className="flex items-center justify-between">
              <LogoMark href="/" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center w-10 h-10 rounded-[2px] border border-[rgba(176,138,73,0.45)] text-coven-soft-gold hover:border-[rgba(216,182,106,0.85)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col items-center justify-center gap-6 -mt-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-3xl text-coven-bone hover:text-coven-soft-gold transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <span className="coven-divider w-32 mt-4">
                <span className="text-coven-soft-gold/50 text-base">✦</span>
              </span>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-coven-fog text-sm tracking-[0.2em] uppercase hover:text-coven-soft-gold transition-colors"
              >
                <User2 className="w-4 h-4" />
                Your Grimoire
              </Link>
            </nav>

            <div className="pt-6">
              <RitualButton size="lg" asChild className="w-full">
                <Link href="/reading/single" onClick={() => setOpen(false)}>
                  Begin Reading
                </Link>
              </RitualButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
