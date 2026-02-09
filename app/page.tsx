import Link from 'next/link';

const FEATURES = [
  {
    href: '/game',
    title: '対戦モード',
    description: '4段階のCPUレベルで対戦。ランダムAIから先読みAIまで、あなたのレベルに合わせて練習。',
    icon: '⚔',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    href: '/guide',
    title: '攻略ガイド',
    description: '中割り、開放度、辺の攻防など、基本戦略から上級テクニックまで体系的に解説。',
    icon: '📘',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    href: '/joseki',
    title: '定石ビューアー',
    description: 'うさぎ・とら・うし・ねこの4大定石ファミリーを1手ずつインタラクティブに確認。',
    icon: '🗂',
    gradient: 'from-violet-500 to-purple-600',
  },
];

const TIPS = [
  { text: '石は少なく取る（序盤は取りすぎない）', emphasis: true },
  { text: '中割りを意識する（開放度の低い手を選ぶ）', emphasis: true },
  { text: '隅を狙い、X打ちを避ける', emphasis: true },
  { text: '相手の打てる場所を減らす', emphasis: false },
  { text: '辺を取りすぎない', emphasis: false },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dim border border-border text-xs text-text-muted mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-good" />
          対戦・攻略・定石の3本柱
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          オセロ<span className="text-accent">特訓</span>
        </h1>
        <p className="text-lg text-text-muted max-w-lg mx-auto mt-4 leading-relaxed">
          実戦で使える戦略を身につけて、オセロの実力を着実に伸ばしましょう。
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href="/game"
            className="btn btn-primary px-7 py-3 text-base rounded-xl"
          >
            対戦を始める
          </Link>
          <Link
            href="/guide"
            className="btn btn-secondary px-7 py-3 text-base rounded-xl"
          >
            攻略を学ぶ
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid md:grid-cols-3 gap-4 pb-12">
        {FEATURES.map(({ href, title, description, icon, gradient }) => (
          <Link
            key={href}
            href={href}
            className="card-interactive group block p-5 bg-surface rounded-2xl border border-border hover:border-accent/40"
          >
            <div className={`
              w-11 h-11 rounded-xl bg-gradient-to-br ${gradient}
              flex items-center justify-center text-xl text-white mb-4
              shadow-md
            `}>
              {icon}
            </div>
            <h2 className="text-lg font-bold mb-1.5 group-hover:text-accent transition-colors">
              {title}
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>

      {/* Tips */}
      <section className="pb-16">
        <div className="p-6 bg-surface rounded-2xl border border-border">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-good/10 text-good flex items-center justify-center text-xs">✓</span>
            上達のポイント
          </h3>
          <ul className="space-y-2">
            {TIPS.map(({ text, emphasis }, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${emphasis ? 'bg-accent' : 'bg-text-dim'}`} />
                <span className={emphasis ? 'text-foreground' : 'text-text-muted'}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
