import { type BoardArray, type Player, type ValidMove } from '../types';
import { getValidMoves } from '../rules';

/** Beginner AI: random move selection */
export function beginnerMove(board: BoardArray, player: Player): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
