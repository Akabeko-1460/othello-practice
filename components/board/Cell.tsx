'use client';

import { type CellState, type ValidMove } from '@/lib/othello/types';
import Stone from './Stone';

export type HighlightColor = 'blue' | 'red' | 'green' | 'yellow';

interface CellProps {
  row: number;
  col: number;
  value: CellState;
  validMove: ValidMove | null;
  showOpenness: boolean;
  isLastMove: boolean;
  isFlipping: boolean;
  isNew: boolean;
  highlight?: HighlightColor;
  onClick: (move: ValidMove) => void;
}

const HIGHLIGHT_STYLES: Record<HighlightColor, string> = {
  blue: 'bg-blue-400/30 ring-1 ring-blue-400/50',
  red: 'bg-red-400/30 ring-1 ring-red-400/50',
  green: 'bg-green-400/30 ring-1 ring-green-400/50',
  yellow: 'bg-yellow-400/30 ring-1 ring-yellow-400/50',
};

export default function Cell({
  row,
  col,
  value,
  validMove,
  showOpenness,
  isLastMove,
  isFlipping,
  isNew,
  highlight,
  onClick,
}: CellProps) {
  const handleClick = () => {
    if (validMove) onClick(validMove);
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        border-[0.5px] border-board-line aspect-square
        transition-colors duration-100
        ${validMove ? 'cursor-pointer hover:bg-cell-hover' : ''}
      `}
      onClick={handleClick}
    >
      {/* Highlight overlay */}
      {highlight && (
        <div className={`absolute inset-0 ${HIGHLIGHT_STYLES[highlight]} pointer-events-none`} />
      )}

      {/* Last move indicator */}
      {isLastMove && !highlight && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[90%] h-[90%] rounded-sm bg-yellow-400/20 ring-1 ring-yellow-400/40" />
        </div>
      )}

      {/* Stone - rendered directly as flex child so % sizing resolves against Cell */}
      {value !== 0 && (
        <Stone color={value} isFlipping={isFlipping} isNew={isNew} />
      )}

      {/* Valid move marker */}
      {validMove && value === 0 && (
        <div className="w-[28%] h-[28%] rounded-full bg-cell-valid animate-valid shadow-[0_0_6px_rgba(255,255,200,0.3)]" />
      )}

      {/* Openness badge */}
      {validMove && showOpenness && validMove.openness !== undefined && (
        <span
          className="absolute bottom-0 right-0.5 text-[9px] font-bold leading-none tabular-nums"
          style={{
            color: validMove.openness <= 2
              ? 'rgba(134,239,172,0.9)'
              : validMove.openness <= 4
              ? 'rgba(253,224,71,0.9)'
              : 'rgba(252,165,165,0.9)',
          }}
        >
          {validMove.openness}
        </span>
      )}
    </div>
  );
}
