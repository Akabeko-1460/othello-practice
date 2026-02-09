import { type BoardArray, type Player, type ValidMove, type AILevel } from '../types';
import { beginnerMove } from './beginner';
import { elementaryMove } from './elementary';
import { intermediateMove } from './intermediate';
import { advancedMove } from './advanced';

/** Dispatch AI move based on level */
export function getAIMove(board: BoardArray, player: Player, level: AILevel): ValidMove | null {
  switch (level) {
    case 'beginner':
      return beginnerMove(board, player);
    case 'elementary':
      return elementaryMove(board, player);
    case 'intermediate':
      return intermediateMove(board, player);
    case 'advanced':
      return advancedMove(board, player);
    default:
      return beginnerMove(board, player);
  }
}
