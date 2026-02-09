'use client';

import Link from 'next/link';
import { INTERMEDIATE_CONCEPTS } from '@/lib/guide/intermediate-data';
import GuideViewer from '@/components/guide/GuideViewer';

export default function IntermediateGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/guide" className="inline-flex items-center gap-1 text-accent text-sm hover:underline mb-4">
        <span>&larr;</span> 攻略ガイド
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">中級者向けガイド</h1>
      <p className="text-text-muted mb-8">
        より高度なストナー、偶数理論、種石などを動く盤面で学びましょう。
        各項目の「進む →」ボタンでステップを進めてください。
      </p>

      <div className="space-y-6">
        {INTERMEDIATE_CONCEPTS.map((concept) => (
          <GuideViewer key={concept.id} concept={concept} />
        ))}
      </div>

      {/* Practice note */}
      <div className="mt-10 p-5 bg-violet-50 rounded-2xl border border-violet-200">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-violet-500 text-white flex items-center justify-center text-xs">!</span>
          実践のすすめ
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          これらのテクニックは知識だけでなく実戦で使えるようになることが重要です。
          対戦モードの「1手評価モード」を使って、毎手AIからフィードバックを受けながら上達しましょう。
          まずは中級CPUに安定して勝てることを目指してください。
        </p>
      </div>

      <div className="mt-10">
        <Link href="/guide/elementary" className="btn btn-secondary px-5 py-2.5 rounded-xl">
          &larr; 初級者向け
        </Link>
      </div>
    </div>
  );
}
