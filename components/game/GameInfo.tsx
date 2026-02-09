'use client';

import { type GameState, type GameSettings, BLACK, WHITE } from '@/lib/othello/types';

interface GameInfoProps {
  state: GameState;
  settings: GameSettings;
  isThinking: boolean;
  passMessage: string | null;
}

export default function GameInfo({ state, settings, isThinking, passMessage }: GameInfoProps) {
  const isBlackTurn = state.currentPlayer === BLACK;
  const isPlayer = settings.mode === 'local' || state.currentPlayer === settings.playerColor;

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[460px]">
      {/* Score bar */}
      <div className="flex items-center w-full gap-3">
        {/* Black side */}
        <div
          className={`
            flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200
            ${isBlackTurn && !state.isGameOver
              ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-700'
              : 'bg-surface border border-border text-foreground'
            }
          `}
        >
          <div
            className="w-7 h-7 rounded-full flex-shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #444, #1a1a1a 60%, #0a0a0a)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-bold leading-none tabular-nums">{state.blackCount}</span>
            <span className={`text-[10px] leading-tight ${isBlackTurn && !state.isGameOver ? 'text-gray-400' : 'text-text-dim'}`}>
              {settings.mode === 'cpu' && settings.playerColor === BLACK ? 'あなた' : '黒'}
            </span>
          </div>
        </div>

        {/* Center status */}
        <div className="flex flex-col items-center px-2 min-w-[80px]">
          {state.isGameOver ? (
            <span className="text-sm font-bold text-accent">終局</span>
          ) : passMessage ? (
            <span className="text-xs font-semibold text-amber-600 animate-fade-in-up">{passMessage}</span>
          ) : isThinking ? (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : (
            <span className="text-xs text-text-muted">
              {isPlayer ? '手番' : 'CPU'}
            </span>
          )}
          <span className="text-[10px] text-text-dim mt-0.5 tabular-nums">
            {state.moveHistory.length}手
          </span>
        </div>

        {/* White side */}
        <div
          className={`
            flex-1 flex items-center justify-end gap-2.5 px-3 py-2 rounded-lg transition-all duration-200
            ${!isBlackTurn && !state.isGameOver
              ? 'bg-white text-gray-900 shadow-md ring-2 ring-gray-300'
              : 'bg-surface border border-border text-foreground'
            }
          `}
        >
          <div className="flex flex-col items-end min-w-0">
            <span className="text-xl font-bold leading-none tabular-nums">{state.whiteCount}</span>
            <span className={`text-[10px] leading-tight ${!isBlackTurn && !state.isGameOver ? 'text-gray-500' : 'text-text-dim'}`}>
              {settings.mode === 'cpu' && settings.playerColor === WHITE ? 'あなた' : '白'}
            </span>
          </div>
          <div
            className="w-7 h-7 rounded-full flex-shrink-0"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #fff, #f0f0f0 60%, #d4d4d4)',
              boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.12)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
