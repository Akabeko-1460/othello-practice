import { type BoardArray, type Player, type ValidMove } from '../types';
import { getValidMoves, calculateOpenness } from '../rules';
import { POSITION_WEIGHTS } from '../evaluation';
import { getValidMoves as getMovesForMobility } from '../rules';
import { opponent } from '../board';

/** Intermediate AI: openness + positional weight + mobility */
export function intermediateMove(board: BoardArray, player: Player): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const openness = calculateOpenness(board, move);
    const posWeight = POSITION_WEIGHTS[move.row * 8 + move.col];

    // Apply move temporarily to check resulting mobility
    const tempBoard = new Int8Array(board);
    tempBoard[move.row * 8 + move.col] = player;
    for (const idx of move.flips) {
      tempBoard[idx] = player;
    }
    const opp = opponent(player);
    const oppMoves = getMovesForMobility(tempBoard, opp).length;
    const myMoves = getMovesForMobility(tempBoard, player).length;

    const score = -openness * 3 + posWeight + (myMoves - oppMoves) * 2;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
