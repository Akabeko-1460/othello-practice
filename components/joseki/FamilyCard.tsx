import Link from 'next/link';
import { type JosekiFamily } from '@/lib/joseki/types';

const GRADIENTS: Record<string, string> = {
  usagi: 'from-pink-500 to-rose-600',
  tora: 'from-amber-500 to-orange-600',
  ushi: 'from-green-500 to-emerald-600',
  neko: 'from-blue-500 to-indigo-600',
};

const EMOJIS: Record<string, string> = {
  usagi: '🐰',
  tora: '🐯',
  ushi: '🐮',
  neko: '🐱',
};

interface FamilyCardProps {
  family: JosekiFamily;
}

export default function FamilyCard({ family }: FamilyCardProps) {
  const gradient = GRADIENTS[family.id] || 'from-gray-500 to-gray-600';
  const emoji = EMOJIS[family.id] || '📖';

  return (
    <Link
      href={`/joseki/${family.id}`}
      className="card-interactive group block p-5 bg-surface rounded-2xl border border-border hover:border-accent/40"
    >
      <div className={`
        w-11 h-11 rounded-xl bg-gradient-to-br ${gradient}
        flex items-center justify-center text-xl shadow-md mb-3
      `}>
        {emoji}
      </div>
      <h2 className="text-lg font-bold mb-0.5 group-hover:text-accent transition-colors">
        {family.japaneseName}
      </h2>
      <p className="text-xs text-text-dim mb-2">{family.name}</p>
      <p className="text-sm text-text-muted leading-relaxed">{family.description}</p>
      <div className="mt-3 flex items-center gap-1 text-xs text-text-dim">
        <span className="bg-surface-dim px-2 py-0.5 rounded-full">{family.sequences.length}つの変化</span>
      </div>
    </Link>
  );
}
