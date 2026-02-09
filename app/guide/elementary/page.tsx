'use client';

import Link from 'next/link';
import { ELEMENTARY_CONCEPTS } from '@/lib/guide/elementary-data';
import GuideViewer from '@/components/guide/GuideViewer';

export default function ElementaryGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/guide" className="inline-flex items-center gap-1 text-accent text-sm hover:underline mb-4">
        <span>&larr;</span> 攻略ガイド
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">初級者向けガイド</h1>
      <p className="text-text-muted mb-8">
        基本を覚えたら、開放度理論と辺の攻防を盤面付きで学びましょう。
        各項目の「進む →」ボタンでステップを進めてください。
      </p>

      <div className="space-y-6">
        {ELEMENTARY_CONCEPTS.map((concept) => (
          <GuideViewer key={concept.id} concept={concept} />
        ))}
      </div>

      <div className="mt-10 flex justify-between">
        <Link href="/guide/beginner" className="btn btn-secondary px-5 py-2.5 rounded-xl">
          &larr; 初心者向け
        </Link>
        <Link href="/guide/intermediate" className="btn btn-secondary px-5 py-2.5 rounded-xl">
          中級者向け &rarr;
        </Link>
      </div>
    </div>
  );
}
