'use client';

import { type BoardArray, type ValidMove, type Move } from '@/lib/othello/types';
import Cell, { type HighlightColor } from './Cell';

interface BoardProps {
  board: BoardArray;
  validMoves: ValidMove[];
  showOpenness: boolean;
  lastMove: Move | null;
  flippingCells: Set<number>;
  newCell: number | null;
  onCellClick: (move: ValidMove) => void;
  disabled?: boolean;
  /** Map of cell index → highlight color for guide/analysis overlays */
  highlightedCells?: Map<number, HighlightColor>;
  /** Compact size variant for guide pages */
  compact?: boolean;
}

export default function Board({
  board,
  validMoves,
  showOpenness,
  lastMove,
  flippingCells,
  newCell,
  onCellClick,
  disabled,
  highlightedCells,
  compact,
}: BoardProps) {
  const validMoveMap = new Map<number, ValidMove>();
  for (const move of validMoves) {
    validMoveMap.set(move.row * 8 + move.col, move);
  }

  const rows = [];
  for (let row = 0; row < 8; row++) {
    const cells = [];
    for (let col = 0; col < 8; col++) {
      const idx = row * 8 + col;
      const validMove = disabled ? null : validMoveMap.get(idx) ?? null;
      const isLastMove = lastMove !== null && lastMove.row === row && lastMove.col === col;

      cells.push(
        <Cell
          key={idx}
          row={row}
          col={col}
          value={board[idx] as -1 | 0 | 1}
          validMove={validMove}
          showOpenness={showOpenness}
          isLastMove={isLastMove}
          isFlipping={flippingCells.has(idx)}
          isNew={newCell === idx}
          highlight={highlightedCells?.get(idx)}
          onClick={onCellClick}
        />
      );
    }
    rows.push(cells);
  }

  const colLabels = 'abcdefgh'.split('');
  const rowLabels = '12345678'.split('');

  const sizeClasses = compact
    ? 'w-[min(78vw,280px)] h-[min(78vw,280px)] sm:w-[340px] sm:h-[340px]'
    : 'w-[min(82vw,320px)] h-[min(82vw,320px)] sm:w-[400px] sm:h-[400px] md:w-[460px] md:h-[460px]';

  return (
    <div className="inline-flex flex-col select-none">
      {/* Column labels */}
      <div className="flex ml-7">
        {colLabels.map((label) => (
          <div
            key={label}
            className="flex-1 text-center text-[11px] font-mono text-text-dim pb-1"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Row labels */}
        <div className="flex flex-col w-7">
          {rowLabels.map((label) => (
            <div
              key={label}
              className="flex-1 flex items-center justify-center text-[11px] font-mono text-text-dim pr-1"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Board grid */}
        <div
          className={`board-surface grid grid-cols-8 rounded-md overflow-hidden ${sizeClasses}`}
          style={{ boxShadow: 'var(--board-shadow)' }}
        >
          {rows.flat()}
        </div>
      </div>
    </div>
  );
}
