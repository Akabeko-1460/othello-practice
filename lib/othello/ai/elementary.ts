import { type BoardArray, type Player, type ValidMove } from '../types';
import { getValidMoves } from '../rules';
import { isCorner, isXSquare } from '../board';

/** Elementary AI: greedy (most flips) + corner priority + X-square avoidance */
export function elementaryMove(board: BoardArray, player: Player): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  // Corner moves are always top priority
  const cornerMoves = moves.filter(m => isCorner(m.row, m.col));
  if (cornerMoves.length > 0) {
    return cornerMoves[Math.floor(Math.random() * cornerMoves.length)];
  }

  // Avoid X-squares unless no other choice
  const nonXMoves = moves.filter(m => !isXSquare(m.row, m.col));
  const candidates = nonXMoves.length > 0 ? nonXMoves : moves;

  // Pick the move that flips the most stones
  let bestMove = candidates[0];
  let bestFlips = candidates[0].flips.length;

  for (let i = 1; i < candidates.length; i++) {
    if (candidates[i].flips.length > bestFlips) {
      bestFlips = candidates[i].flips.length;
      bestMove = candidates[i];
    }
  }

  return bestMove;
}
