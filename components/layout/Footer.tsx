import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-dim py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          オセロ特訓アプリ
        </p>
        <nav className="flex items-center gap-4 text-sm text-text-dim">
          <Link href="/game" className="hover:text-foreground transition-colors">対戦</Link>
          <Link href="/guide" className="hover:text-foreground transition-colors">攻略</Link>
          <Link href="/joseki" className="hover:text-foreground transition-colors">定石</Link>
        </nav>
      </div>
    </footer>
  );
}
