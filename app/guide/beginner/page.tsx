'use client';

import Link from 'next/link';
import { BEGINNER_CONCEPTS } from '@/lib/guide/beginner-data';
import GuideViewer from '@/components/guide/GuideViewer';

export default function BeginnerGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/guide" className="inline-flex items-center gap-1 text-accent text-sm hover:underline mb-4">
        <span>&larr;</span> 攻略ガイド
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">初心者向けガイド</h1>
      <p className="text-text-muted mb-8">
        オセロで勝つために必須の7つの基本原則を、動く盤面で体験しながら学びましょう。
        各項目の「進む →」ボタンでステップを進めてください。
      </p>

      <div className="space-y-6">
        {BEGINNER_CONCEPTS.map((concept) => (
          <GuideViewer key={concept.id} concept={concept} />
        ))}
      </div>

      {/* Supplementary info */}
      <div className="grid sm:grid-cols-2 gap-4 mt-10">
        <div className="p-5 bg-accent-light/50 rounded-2xl border border-accent/20">
          <h3 className="font-bold text-sm mb-2 text-accent">打てる場所の数（モビリティ）</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            自分が打てる場所が多く、相手が打てる場所が少ない状態が理想です。
            石を少なく取り、中割りを心がけることで、自然とモビリティが良くなります。
          </p>
        </div>
        <div className="p-5 bg-good-light/50 rounded-2xl border border-good/20">
          <h3 className="font-bold text-sm mb-2 text-good">確定石</h3>
          <p className="text-sm text-text-muted leading-relaxed">
            隅から連続して並ぶ石は「確定石」と呼ばれ、絶対に返されません。
            隅を取ったら、辺に沿って石を伸ばして確定石を増やしましょう。
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Link href="/guide/elementary" className="btn btn-secondary px-5 py-2.5 rounded-xl">
          次へ: 初級者向け &rarr;
        </Link>
      </div>
    </div>
  );
}
