'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { JOSEKI_FAMILIES } from '@/lib/joseki/data';
import JosekiViewer from '@/components/joseki/JosekiViewer';

export default function JosekiFamilyPage() {
  const params = useParams();
  const familyId = params.family as string;
  const family = JOSEKI_FAMILIES.find(f => f.id === familyId);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!family) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/joseki" className="inline-flex items-center gap-1 text-accent text-sm hover:underline">
          <span>&larr;</span> 定石一覧
        </Link>
        <div className="mt-8 text-center py-12">
          <p className="text-text-muted">定石ファミリーが見つかりませんでした。</p>
          <Link href="/joseki" className="btn btn-primary px-6 py-2.5 rounded-xl mt-4 inline-flex">
            定石一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/joseki" className="inline-flex items-center gap-1 text-accent text-sm hover:underline mb-4">
        <span>&larr;</span> 定石一覧
      </Link>
      <h1 className="text-3xl font-extrabold tracking-tight mb-1">{family.japaneseName}</h1>
      <p className="text-text-muted mb-6">{family.description}</p>

      {/* Sequence selector tabs */}
      {family.sequences.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {family.sequences.map((seq, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`btn text-sm px-4 py-2 rounded-lg ${
                selectedIdx === idx ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {seq.name}
            </button>
          ))}
        </div>
      )}

      <p className="text-sm text-text-muted mb-4">{family.sequences[selectedIdx].description}</p>

      <JosekiViewer
        key={`${familyId}-${selectedIdx}`}
        sequence={family.sequences[selectedIdx]}
      />
    </div>
  );
}
