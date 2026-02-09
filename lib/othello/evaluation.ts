import { type BoardArray, type Player, BLACK, WHITE, EMPTY } from './types';
import { getCell, isOnBoard, opponent, countStones } from './board';
import { getValidMoves } from './rules';

/** Position weight matrix */
export const POSITION_WEIGHTS = new Int8Array([
  100, -20,  10,   5,   5,  10, -20, 100,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
   10,  -2,   1,   1,   1,   1,  -2,  10,
    5,  -2,   1,   0,   0,   1,  -2,   5,
    5,  -2,   1,   0,   0,   1,  -2,   5,
   10,  -2,   1,   1,   1,   1,  -2,  10,
  -20, -50,  -2,  -2,  -2,  -2, -50, -20,
  100, -20,  10,   5,   5,  10, -20, 100,
]);

/** Evaluate position weight score for a player */
export function positionalScore(board: BoardArray, player: Player): number {
  let score = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] === player) {
      score += POSITION_WEIGHTS[i];
    } else if (board[i] === opponent(player)) {
      score -= POSITION_WEIGHTS[i];
    }
  }
  return score;
}

/** Calculate mobility (number of valid moves) */
export function mobilityScore(board: BoardArray, player: Player): number {
  const myMoves = getValidMoves(board, player).length;
  const oppMoves = getValidMoves(board, opponent(player)).length;
  if (myMoves + oppMoves === 0) return 0;
  return myMoves - oppMoves;
}

/** Count stable stones (stones that can never be flipped) */
export function countStableStones(board: BoardArray, player: Player): number {
  const stable = new Uint8Array(64);

  // Check from each corner
  const corners: [number, number, number, number][] = [
    [0, 0, 1, 1],
    [0, 7, 1, -1],
    [7, 0, -1, 1],
    [7, 7, -1, -1],
  ];

  for (const [startR, startC, dr, dc] of corners) {
    if (getCell(board, startR, startC) !== player) continue;
    stable[startR * 8 + startC] = 1;

    // Spread along edges and diagonals from corner
    // Row from corner
    for (let c = startC + dc; c >= 0 && c < 8; c += dc) {
      if (getCell(board, startR, c) === player) {
        stable[startR * 8 + c] = 1;
      } else break;
    }
    // Column from corner
    for (let r = startR + dr; r >= 0 && r < 8; r += dr) {
      if (getCell(board, r, startC) === player) {
        stable[r * 8 + startC] = 1;
      } else break;
    }
    // Fill rectangle from corner
    for (let r = startR + dr; r >= 0 && r < 8; r += dr) {
      if (!stable[r * 8 + startC]) break;
      for (let c = startC + dc; c >= 0 && c < 8; c += dc) {
        if (getCell(board, r, c) === player && stable[r * 8 + (c - dc)] && stable[(r - dr) * 8 + c]) {
          stable[r * 8 + c] = 1;
        } else break;
      }
    }
  }

  let count = 0;
  for (let i = 0; i < 64; i++) {
    if (stable[i]) count++;
  }
  return count;
}

/** Combined evaluation function */
export function evaluate(board: BoardArray, player: Player): number {
  const totalStones = countStones(board, BLACK) + countStones(board, WHITE);
  const emptyCount = 64 - totalStones;

  // Endgame: just count stones
  if (emptyCount <= 0) {
    const my = countStones(board, player);
    const opp = countStones(board, opponent(player));
    return (my - opp) * 1000;
  }

  let score = 0;

  // Positional weight
  score += positionalScore(board, player);

  // Mobility
  score += mobilityScore(board, player) * 3;

  // Stable stones (more important in mid-late game)
  if (totalStones > 20) {
    const myStable = countStableStones(board, player);
    const oppStable = countStableStones(board, opponent(player));
    score += (myStable - oppStable) * 15;
  }

  return score;
}
