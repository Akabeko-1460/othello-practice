'use client';

import { BLACK, type CellState } from '@/lib/othello/types';

interface StoneProps {
  color: CellState;
  isFlipping?: boolean;
  isNew?: boolean;
}

export default function Stone({ color, isFlipping, isNew }: StoneProps) {
  if (color === 0) return null;

  const isBlack = color === BLACK;

  return (
    <div
      className={`
        w-[78%] h-[78%] rounded-full relative z-10
        ${isFlipping ? 'animate-flip' : ''}
        ${isNew ? 'animate-place' : ''}
      `}
      style={{
        background: isBlack
          ? 'radial-gradient(circle at 35% 30%, #444, #1a1a1a 60%, #0a0a0a)'
          : 'radial-gradient(circle at 35% 30%, #fff, #f0f0f0 60%, #d4d4d4)',
        boxShadow: isBlack
          ? 'inset 0 1px 2px rgba(255,255,255,0.1), 0 3px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)'
          : 'inset 0 1px 3px rgba(255,255,255,0.8), 0 3px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
      }}
    />
  );
}
