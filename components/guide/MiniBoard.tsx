'use client';

import { type CellState, BLACK, EMPTY } from '@/lib/othello/types';

interface MiniBoardProps {
  cells: CellState[];
  highlights?: number[];
  size?: number;
}

export default function MiniBoard({ cells, highlights = [], size = 200 }: MiniBoardProps) {
  const cellSize = size / 8;
  const highlightSet = new Set(highlights);

  return (
    <div
      className="inline-grid grid-cols-8 board-surface rounded-md overflow-hidden"
      style={{ width: size, height: size, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
    >
      {cells.map((cell, idx) => (
        <div
          key={idx}
          className={`border-[0.5px] border-board-line flex items-center justify-center ${
            highlightSet.has(idx) ? 'bg-yellow-400/25' : ''
          }`}
          style={{ width: cellSize, height: cellSize }}
        >
          {cell !== EMPTY && (
            <div
              className="rounded-full"
              style={{
                width: cellSize * 0.68,
                height: cellSize * 0.68,
                background: cell === BLACK
                  ? 'radial-gradient(circle at 35% 30%, #444, #1a1a1a 60%, #0a0a0a)'
                  : 'radial-gradient(circle at 35% 30%, #fff, #f0f0f0 60%, #d4d4d4)',
                boxShadow: cell === BLACK
                  ? '0 1px 2px rgba(0,0,0,0.3)'
                  : 'inset 0 1px 1px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.08)',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
