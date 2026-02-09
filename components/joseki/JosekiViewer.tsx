'use client';

import { type JosekiSequence } from '@/lib/joseki/types';
import { useJosekiPlayer } from '@/hooks/useJosekiPlayer';
import Board from '@/components/board/Board';
import JosekiMoveList from './JosekiMoveList';

interface JosekiViewerProps {
  sequence: JosekiSequence;
}

export default function JosekiViewer({ sequence }: JosekiViewerProps) {
  const { state, totalSteps, next, prev, reset, goToEnd, goToStep, canNext, canPrev } = useJosekiPlayer(sequence);

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <div className="flex flex-col items-center gap-4">
        <Board
          board={state.board}
          validMoves={[]}
          showOpenness={false}
          lastMove={
            state.currentStep >= 0
              ? { row: sequence.moves[state.currentStep].row, col: sequence.moves[state.currentStep].col }
              : null
          }
          flippingCells={new Set()}
          newCell={null}
          onCellClick={() => {}}
          disabled
        />

        {/* Navigation controls */}
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
            {state.currentStep + 1} / {totalSteps}
          </span>
          <button
            onClick={next}
            disabled={!canNext}
            className="btn btn-primary px-4 py-1.5 text-sm rounded-lg disabled:opacity-25"
          >
            進む →
          </button>
          <button
            onClick={goToEnd}
            disabled={!canNext}
            className="btn btn-secondary px-2.5 py-1.5 text-xs rounded-lg disabled:opacity-25"
            title="最後へ"
          >
            ⏭
          </button>
        </div>

        {/* Comment bubble */}
        <div className="bg-surface border border-border rounded-xl p-4 w-full max-w-[460px] shadow-sm">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-md bg-accent/10 text-accent flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
              💬
            </span>
            <p className="text-sm text-text-muted leading-relaxed">{state.currentComment}</p>
          </div>
        </div>
      </div>

      {/* Move list sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <JosekiMoveList
          sequence={sequence}
          currentStep={state.currentStep}
          onStepClick={goToStep}
        />
      </div>
    </div>
  );
}
