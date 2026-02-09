'use client';

import { useState, useCallback, useMemo } from 'react';
import { type GuideScenario } from '@/lib/guide/types';
import { type BoardArray, BLACK, WHITE, type Player } from '@/lib/othello/types';
import { createBoard, cloneBoard } from '@/lib/othello/board';
import { findFlips } from '@/lib/othello/rules';
import { type HighlightColor } from '@/components/board/Cell';

export interface GuidePlayerStep {
  board: BoardArray;
  comment: string;
  highlights: Map<number, HighlightColor>;
  tag?: 'good' | 'bad' | 'info' | 'warning';
  lastMove: { row: number; col: number } | null;
}

function buildBoard(data?: number[]): BoardArray {
  if (!data) return createBoard();
  const board = new Int8Array(64);
  for (let i = 0; i < 64; i++) {
    board[i] = data[i] ?? 0;
  }
  return board;
}

function tagToColor(tag?: string): HighlightColor {
  switch (tag) {
    case 'good': return 'green';
    case 'bad': return 'red';
    case 'warning': return 'yellow';
    default: return 'blue';
  }
}

export function useGuidePlayer(scenario: GuideScenario) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(() => {
    const result: GuidePlayerStep[] = [];
    let board = buildBoard(scenario.initialBoard);
    let nextPlayer: Player = scenario.initialPlayer ?? BLACK;

    // Step 0: initial position with first step's info
    const firstStep = scenario.steps[0];
    if (firstStep && !firstStep.move) {
      // First step is descriptive, show initial board
      const hlMap = new Map<number, HighlightColor>();
      if (firstStep.highlights) {
        for (const idx of firstStep.highlights) {
          hlMap.set(idx, tagToColor(firstStep.tag));
        }
      }
      result.push({
        board: cloneBoard(board),
        comment: firstStep.comment,
        highlights: hlMap,
        tag: firstStep.tag,
        lastMove: null,
      });
    } else if (firstStep && firstStep.move) {
      // First step already has a move, show initial board as intro
      result.push({
        board: cloneBoard(board),
        comment: scenario.description,
        highlights: new Map(),
        tag: 'info',
        lastMove: null,
      });
    }

    // Process all steps
    for (let i = (firstStep && !firstStep.move ? 1 : 0); i < scenario.steps.length; i++) {
      const step = scenario.steps[i];

      if (step.move) {
        const player = step.player ?? nextPlayer;
        const flips = findFlips(board, step.move.row, step.move.col, player);
        const newBoard = cloneBoard(board);
        newBoard[step.move.row * 8 + step.move.col] = player;
        for (const idx of flips) {
          newBoard[idx] = player;
        }

        const hlMap = new Map<number, HighlightColor>();
        if (step.highlights) {
          for (const idx of step.highlights) {
            hlMap.set(idx, tagToColor(step.tag));
          }
        }

        result.push({
          board: newBoard,
          comment: step.comment,
          highlights: hlMap,
          tag: step.tag,
          lastMove: { row: step.move.row, col: step.move.col },
        });

        board = newBoard;
        // Alternate player
        nextPlayer = player === BLACK ? WHITE : BLACK;
      } else {
        // Descriptive step - same board, different highlights/comment
        const hlMap = new Map<number, HighlightColor>();
        if (step.highlights) {
          for (const idx of step.highlights) {
            hlMap.set(idx, tagToColor(step.tag));
          }
        }
        result.push({
          board: cloneBoard(board),
          comment: step.comment,
          highlights: hlMap,
          tag: step.tag,
          lastMove: null,
        });
      }
    }

    return result;
  }, [scenario]);

  const totalSteps = steps.length;
  const currentData = steps[currentStep] ?? steps[0];

  const next = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);

  return {
    currentStep,
    totalSteps,
    step: currentData,
    next,
    prev,
    reset,
    goToStep,
    canNext: currentStep < totalSteps - 1,
    canPrev: currentStep > 0,
  };
}
