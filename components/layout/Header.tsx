'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/game', label: '対戦', icon: '⚔' },
  { href: '/guide', label: '攻略', icon: '📘' },
  { href: '/joseki', label: '定石', icon: '🗂' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-header-bg text-header-text sticky top-0 z-40 shadow-lg shadow-black/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
        >
          <span className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center text-sm">
            ◎
          </span>
          <span className="hidden sm:inline">オセロ特訓</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                  ${isActive
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/65 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="text-xs">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
