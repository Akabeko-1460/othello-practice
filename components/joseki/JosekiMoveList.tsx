'use client';

import { type JosekiSequence } from '@/lib/joseki/types';

interface JosekiMoveListProps {
  sequence: JosekiSequence;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export default function JosekiMoveList({ sequence, currentStep, onStepClick }: JosekiMoveListProps) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surface-dim">
        <h3 className="font-bold text-sm">手順リスト</h3>
      </div>
      <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
        <button
          onClick={() => onStepClick(-1)}
          className={`
            w-full text-left px-4 py-2.5 text-sm border-b border-border/50 transition-colors
            flex items-center gap-2
            ${currentStep === -1
              ? 'bg-accent-light/60 text-accent font-semibold'
              : 'hover:bg-surface-dim'
            }
          `}
        >
          <span className="w-5 text-text-dim text-xs">-</span>
          <span>初期配置</span>
        </button>
        {sequence.moves.map((move, idx) => {
          const isBlack = idx % 2 === 0;
          const col = String.fromCharCode(97 + move.col);
          const row = move.row + 1;
          const shortComment = move.comment.split(':')[1]?.trim() || '';

          return (
            <button
              key={idx}
              onClick={() => onStepClick(idx)}
              className={`
                w-full text-left px-4 py-2.5 text-sm border-b border-border/50
                flex items-center gap-2.5 transition-colors
                ${currentStep === idx
                  ? 'bg-accent-light/60 text-accent font-semibold'
                  : 'hover:bg-surface-dim'
                }
              `}
            >
              <span className="text-text-dim w-5 text-xs tabular-nums">{idx + 1}</span>
              <span
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{
                  background: isBlack
                    ? 'radial-gradient(circle at 35% 30%, #444, #1a1a1a)'
                    : 'radial-gradient(circle at 35% 30%, #fff, #e5e5e5)',
                  boxShadow: isBlack
                    ? '0 1px 2px rgba(0,0,0,0.3)'
                    : 'inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.1)',
                }}
              />
              <span className="font-mono text-xs font-medium w-5">{col}{row}</span>
              <span className="text-text-muted text-xs truncate">{shortComment}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
