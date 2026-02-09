'use client';

import { type GameState, type GameSettings, BLACK } from '@/lib/othello/types';

interface GameOverDialogProps {
  state: GameState;
  settings: GameSettings;
  onReset: () => void;
  onBack: () => void;
}

export default function GameOverDialog({ state, settings, onReset, onBack }: GameOverDialogProps) {
  if (!state.isGameOver) return null;

  const { blackCount, whiteCount } = state;
  let resultText: string;
  let resultEmoji: string;
  let resultGradient: string;

  if (blackCount === whiteCount) {
    resultText = '引き分け';
    resultEmoji = '🤝';
    resultGradient = 'from-amber-500 to-yellow-500';
  } else {
    const winnerIsBlack = blackCount > whiteCount;
    const winnerName = winnerIsBlack ? '黒' : '白';

    if (settings.mode === 'cpu') {
      const playerWins = (winnerIsBlack && settings.playerColor === BLACK) ||
        (!winnerIsBlack && settings.playerColor !== BLACK);
      resultText = playerWins ? 'あなたの勝ち！' : 'CPUの勝ち';
      resultEmoji = playerWins ? '🎉' : '💪';
      resultGradient = playerWins ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500';
    } else {
      resultText = `${winnerName}の勝ち！`;
      resultEmoji = '🏆';
      resultGradient = 'from-accent to-blue-600';
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
      <div className="bg-surface rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
        {/* Result header */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">{resultEmoji}</div>
          <h2 className={`text-2xl font-bold bg-gradient-to-r ${resultGradient} bg-clip-text text-transparent`}>
            {resultText}
          </h2>
        </div>

        {/* Score */}
        <div className="flex justify-center items-center gap-6 py-4 bg-surface-dim rounded-xl mb-5">
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-2"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #444, #1a1a1a 60%, #0a0a0a)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            />
            <span className="text-3xl font-bold tabular-nums">{blackCount}</span>
          </div>
          <span className="text-xl text-text-dim font-light">-</span>
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-full mx-auto mb-2"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #fff, #f0f0f0 60%, #d4d4d4)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <span className="text-3xl font-bold tabular-nums">{whiteCount}</span>
          </div>
        </div>

        <p className="text-xs text-text-dim text-center mb-5 tabular-nums">
          {state.moveHistory.length}手で終局
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="btn btn-primary flex-1 py-2.5 rounded-xl"
          >
            もう一度
          </button>
          <button
            onClick={onBack}
            className="btn btn-secondary flex-1 py-2.5 rounded-xl"
          >
            設定に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
