'use client';

import { useState } from 'react';
import { type GuideConcept } from '@/lib/guide/types';
import GuideScenarioPlayer from './GuideScenarioPlayer';

interface GuideViewerProps {
  concept: GuideConcept;
}

export default function GuideViewer({ concept }: GuideViewerProps) {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const importanceBg = {
    high: 'bg-red-500',
    medium: 'bg-accent',
    low: 'bg-gray-400',
  }[concept.importance];

  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-surface-dim/50">
        <div className="flex items-start gap-3">
          <span className={`${importanceBg} text-white w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0`}>
            {concept.number}
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold leading-snug">{concept.title}</h3>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">{concept.summary}</p>
          </div>
        </div>
      </div>

      {/* Scenario tabs */}
      {concept.scenarios.length > 1 && (
        <div className="px-5 pt-3 pb-0 flex gap-1.5 flex-wrap">
          {concept.scenarios.map((s, i) => (
            <button
              key={i}
              onClick={() => setSelectedScenario(i)}
              className={`
                text-xs font-medium px-3 py-1.5 rounded-lg transition-all
                ${selectedScenario === i
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-dim text-text-muted hover:bg-surface-hover'
                }
              `}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      {/* Scenario player */}
      <div className="p-5">
        <GuideScenarioPlayer
          key={`${concept.id}-${selectedScenario}`}
          scenario={concept.scenarios[selectedScenario]}
        />
      </div>
    </div>
  );
}
