'use client';

import { useEffect, useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import Board from '@/components/board/Board';
import GameInfo from './GameInfo';
import MoveEvaluationDisplay from './MoveEvaluation';
import GameOverDialog from './GameOverDialog';
import { type GameSettings } from '@/lib/othello/types';

interface GameControllerProps {
  settings: GameSettings;
  onBack: () => void;
}

export default function GameController({ settings, onBack }: GameControllerProps) {
  const {
    settings: currentSettings,
    state,
    validMoves,
    isPlayerTurn,
    isThinking,
    flippingCells,
    newCell,
    passMessage,
    placeStone,
    initGame,
    resetGame,
    toggleOpenness,
    clearEvaluation,
  } = useGame();

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      initGame(settings);
    }
  }, [settings, initGame]);

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 max-w-2xl mx-auto">
      <GameInfo
        state={state}
        settings={currentSettings}
        isThinking={isThinking}
        passMessage={passMessage}
      />

      <Board
        board={state.board}
        validMoves={isPlayerTurn ? validMoves : []}
        showOpenness={currentSettings.showOpenness}
        lastMove={state.lastMove}
        flippingCells={flippingCells}
        newCell={newCell}
        onCellClick={placeStone}
        disabled={!isPlayerTurn || isThinking}
      />

      {/* Evaluation display */}
      {state.evaluation && (
        <div className="w-full max-w-[460px]">
          <MoveEvaluationDisplay evaluation={state.evaluation} onClose={clearEvaluation} />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={toggleOpenness}
          className={`btn text-sm px-4 py-2 rounded-lg ${
            currentSettings.showOpenness ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          開放度 {currentSettings.showOpenness ? 'ON' : 'OFF'}
        </button>
        <button onClick={resetGame} className="btn btn-secondary text-sm px-4 py-2 rounded-lg">
          リセット
        </button>
        <button onClick={onBack} className="btn btn-secondary text-sm px-4 py-2 rounded-lg">
          設定に戻る
        </button>
      </div>

      <GameOverDialog
        state={state}
        settings={currentSettings}
        onReset={resetGame}
        onBack={onBack}
      />
    </div>
  );
}
