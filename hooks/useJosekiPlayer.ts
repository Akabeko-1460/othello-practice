'use client';

import { useState, useCallback, useMemo } from 'react';
import { type JosekiSequence } from '@/lib/joseki/types';
import { type BoardArray, BLACK, WHITE } from '@/lib/othello/types';
import { createBoard, cloneBoard } from '@/lib/othello/board';
import { findFlips } from '@/lib/othello/rules';

interface JosekiPlayerState {
  board: BoardArray;
  currentStep: number;
  currentComment: string;
}

export function useJosekiPlayer(sequence: JosekiSequence) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = initial board

  const { boards, comments } = useMemo(() => {
    const boards: BoardArray[] = [createBoard()];
    const comments: string[] = ['初期配置: 中央に4つの石が置かれています。'];

    let board = createBoard();
    for (let i = 0; i < sequence.moves.length; i++) {
      const move = sequence.moves[i];
      const player = i % 2 === 0 ? BLACK : WHITE;
      const flips = findFlips(board, move.row, move.col, player);

      const newBoard = cloneBoard(board);
      newBoard[move.row * 8 + move.col] = player;
      for (const idx of flips) {
        newBoard[idx] = player;
      }

      boards.push(newBoard);
      comments.push(move.comment);
      board = newBoard;
    }

    return { boards, comments };
  }, [sequence]);

  const totalSteps = sequence.moves.length;
  const stepIndex = currentStep + 1; // -1 -> 0 (initial board)

  const state: JosekiPlayerState = {
    board: boards[stepIndex],
    currentStep,
    currentComment: comments[stepIndex],
  };

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(-1, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  const next = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, -1));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(-1);
  }, []);

  const goToEnd = useCallback(() => {
    setCurrentStep(totalSteps - 1);
  }, [totalSteps]);

  return {
    state,
    totalSteps,
    next,
    prev,
    reset,
    goToEnd,
    goToStep,
    canNext: currentStep < totalSteps - 1,
    canPrev: currentStep > -1,
  };
}
