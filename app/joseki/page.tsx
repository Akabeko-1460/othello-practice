import { JOSEKI_FAMILIES } from '@/lib/joseki/data';
import FamilyCard from '@/components/joseki/FamilyCard';

export default function JosekiPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">定石ビューアー</h1>
      <p className="text-text-muted mb-8">
        4大定石ファミリーを1手ずつ確認して、序盤の戦い方を学びましょう。
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {JOSEKI_FAMILIES.map((family) => (
          <FamilyCard key={family.id} family={family} />
        ))}
      </div>

      <div className="mt-8 p-5 bg-surface rounded-2xl border border-border">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs">?</span>
          定石とは
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          定石とは、序盤の決まった手順のことです。お互いが最善手を打った場合の展開が研究されており、
          定石を覚えることで序盤を有利に進められます。初手はf5が標準で、
          2手目の応手によって定石ファミリーが分かれます。
        </p>
      </div>
    </div>
  );
}
