import Link from 'next/link';

const LEVELS = [
  {
    href: '/guide/beginner',
    title: '初心者向け',
    subtitle: '基本ルールと7つの原則',
    description: '少なく取る、中割り、隅を狙うなど、まず覚えるべき基礎を学びます。',
    icon: '🌱',
    gradient: 'from-green-500 to-emerald-600',
    count: '7つの原則',
  },
  {
    href: '/guide/elementary',
    title: '初級者向け',
    subtitle: '開放度理論と辺の攻防',
    description: '開放度の計算方法、辺の取り方、X打ち/C打ちの正しい使い方を学びます。',
    icon: '📐',
    gradient: 'from-blue-500 to-indigo-600',
    count: '5つの戦術',
  },
  {
    href: '/guide/intermediate',
    title: '中級者向け',
    subtitle: 'ストナーと偶数理論',
    description: 'ストナー、偶数理論、奇数理論、種石、TOFなどの上級テクニックを学びます。',
    icon: '🧠',
    gradient: 'from-purple-500 to-violet-600',
    count: '5つの技術',
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">攻略ガイド</h1>
      <p className="text-text-muted mb-8">レベルに合わせてオセロの戦略を体系的に学びましょう。</p>

      <div className="space-y-4">
        {LEVELS.map(({ href, title, subtitle, description, icon, gradient, count }) => (
          <Link
            key={href}
            href={href}
            className="card-interactive group flex items-start gap-4 p-5 bg-surface rounded-2xl border border-border hover:border-accent/40"
          >
            <div className={`
              w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
              flex items-center justify-center text-2xl text-white
              shadow-md flex-shrink-0
            `}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-bold group-hover:text-accent transition-colors">{title}</h2>
                <span className="text-xs text-text-dim bg-surface-dim px-2 py-0.5 rounded-full">{count}</span>
              </div>
              <p className="text-xs text-text-dim mb-1">{subtitle}</p>
              <p className="text-sm text-text-muted">{description}</p>
            </div>
            <span className="text-text-dim group-hover:text-accent transition-colors text-lg mt-2">&rsaquo;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
