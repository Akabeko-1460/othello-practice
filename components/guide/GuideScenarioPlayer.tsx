'use client';

import { type GuideScenario } from '@/lib/guide/types';
import { useGuidePlayer } from '@/hooks/useGuidePlayer';
import Board from '@/components/board/Board';

interface GuideScenarioPlayerProps {
  scenario: GuideScenario;
}

const TAG_STYLES = {
  good: { bg: 'bg-good-light', border: 'border-good', text: 'text-green-800', label: '好手', icon: '◎' },
  bad: { bg: 'bg-bad-light', border: 'border-bad', text: 'text-red-800', label: '悪手', icon: '✕' },
  info: { bg: 'bg-accent-light', border: 'border-accent', text: 'text-blue-800', label: '解説', icon: 'i' },
  warning: { bg: 'bg-ok-light', border: 'border-ok', text: 'text-yellow-800', label: '注意', icon: '!' },
};

export default function GuideScenarioPlayer({ scenario }: GuideScenarioPlayerProps) {
  const { currentStep, totalSteps, step, next, prev, reset, canNext, canPrev } = useGuidePlayer(scenario);

  const tagStyle = step.tag ? TAG_STYLES[step.tag] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Scenario title */}
      <p className="text-xs text-text-dim text-center">{scenario.title}</p>

      {/* Board */}
      <Board
        board={step.board}
        validMoves={[]}
        showOpenness={false}
        lastMove={step.lastMove}
        flippingCells={new Set()}
        newCell={null}
        onCellClick={() => {}}
        disabled
        highlightedCells={step.highlights}
        compact
      />

      {/* Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={reset}
          disabled={!canPrev}
          className="btn btn-secondary px-2.5 py-1.5 text-xs rounded-lg disabled:opacity-25"
          title="最初へ"
        >
          ⏮
        </button>
        <button
          onClick={prev}
          disabled={!canPrev}
          className="btn btn-secondary px-4 py-1.5 text-sm rounded-lg disabled:opacity-25"
        >
          ← 戻る
        </button>
        <span className="text-sm text-text-muted min-w-[56px] text-center tabular-nums font-mono">
          {currentStep + 1} / {totalSteps}
        </span>
        <button
          onClick={next}
          disabled={!canNext}
          className="btn btn-primary px-4 py-1.5 text-sm rounded-lg disabled:opacity-25"
        >
          進む →
        </button>
      </div>

      {/* Comment bubble with tag */}
      <div className={`
        w-full rounded-xl p-4 border transition-all
        ${tagStyle ? `${tagStyle.bg} ${tagStyle.border}` : 'bg-surface border-border'}
      `}>
        <div className="flex items-start gap-2.5">
          {tagStyle && (
            <span className={`
              ${tagStyle.text} w-6 h-6 rounded-md flex items-center justify-center
              text-[10px] font-bold flex-shrink-0 mt-0.5
              ${step.tag === 'good' ? 'bg-good/15' : step.tag === 'bad' ? 'bg-bad/15' : step.tag === 'warning' ? 'bg-ok/15' : 'bg-accent/15'}
            `}>
              {tagStyle.icon}
            </span>
          )}
          <div className="flex-1 min-w-0">
            {tagStyle && (
              <span className={`text-xs font-bold ${tagStyle.text}`}>{tagStyle.label}</span>
            )}
            <p className={`text-sm leading-relaxed ${tagStyle ? tagStyle.text + ' mt-0.5' : 'text-text-muted'}`}>
              {step.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
