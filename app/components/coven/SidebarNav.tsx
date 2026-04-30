'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Sparkles,
  BookOpen,
  Layers,
  Eye,
  User2,
  Settings,
  LogOut,
} from 'lucide-react';
import LogoMark from './LogoMark';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/reading/single', label: 'Readings', icon: Sparkles },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/spreads', label: 'Spreads', icon: Layers },
  { href: '/journal#insights', label: 'Insights', icon: Eye },
  { href: '/dashboard', label: 'Profile', icon: User2 },
];

interface SidebarNavProps {
  className?: string;
}

/**
 * SidebarNav — desktop journal sidebar. Logo at top, nav middle, settings + auth pill at bottom.
 */
export default function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col gap-2 sticky top-24 self-start',
        'w-60 shrink-0 p-5 rounded-[3px]',
        'border border-[rgba(176,138,73,0.32)] bg-coven-ink/65 backdrop-blur-md',
        className,
      )}
    >
      <div className="px-2 pb-4 mb-2 border-b border-[rgba(176,138,73,0.18)]">
        <LogoMark href="/" />
      </div>

      <nav aria-label="Sidebar navigation" className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm',
                'transition-colors duration-300',
                active
                  ? 'bg-coven-plum/55 text-coven-soft-gold border-l-2 border-coven-soft-gold'
                  : 'text-coven-fog hover:text-coven-bone hover:bg-coven-plum/30',
              )}
            >
              <Icon className="w-4 h-4 opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
              <span className="tracking-[0.18em] uppercase text-[0.72rem]">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[rgba(176,138,73,0.18)] flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-coven-fog hover:text-coven-bone hover:bg-coven-plum/30 transition-colors"
        >
          <Settings className="w-4 h-4 opacity-80" strokeWidth={1.5} />
          <span className="tracking-[0.18em] uppercase text-[0.72rem]">Settings</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[2px] text-sm text-coven-fog hover:text-coven-bone hover:bg-coven-plum/30 transition-colors"
        >
          <LogOut className="w-4 h-4 opacity-80" strokeWidth={1.5} />
          <span className="tracking-[0.18em] uppercase text-[0.72rem]">Sign Out</span>
        </Link>
        <div className="mt-3 px-3 py-2 rounded-[2px] foil-border text-[0.65rem] tracking-[0.22em] uppercase text-coven-fog text-center">
          Anonymous · 3/day
        </div>
      </div>
    </aside>
  );
}
