import { type BoardArray, type Player, type ValidMove, EMPTY } from './types';
import { getCell, isOnBoard, opponent, cloneBoard, setCell } from './board';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
] as const;

/** Find all cells that would be flipped by placing a stone at (row, col) */
export function findFlips(board: BoardArray, row: number, col: number, player: Player): number[] {
  if (board[row * 8 + col] !== EMPTY) return [];

  const opp = opponent(player);
  const flips: number[] = [];

  for (const [dr, dc] of DIRECTIONS) {
    const lineFlips: number[] = [];
    let r = row + dr;
    let c = col + dc;

    while (isOnBoard(r, c) && getCell(board, r, c) === opp) {
      lineFlips.push(r * 8 + c);
      r += dr;
      c += dc;
    }

    if (lineFlips.length > 0 && isOnBoard(r, c) && getCell(board, r, c) === player) {
      flips.push(...lineFlips);
    }
  }

  return flips;
}

/** Get all valid moves for a player */
export function getValidMoves(board: BoardArray, player: Player): ValidMove[] {
  const moves: ValidMove[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const flips = findFlips(board, row, col, player);
      if (flips.length > 0) {
        moves.push({ row, col, flips });
      }
    }
  }

  return moves;
}

/** Apply a move to the board (mutates a clone) */
export function applyMove(board: BoardArray, move: ValidMove, player: Player): BoardArray {
  const newBoard = cloneBoard(board);
  setCell(newBoard, move.row, move.col, player);
  for (const idx of move.flips) {
    newBoard[idx] = player;
  }
  return newBoard;
}

/** Check if game is over (both players have no valid moves) */
export function isGameOver(board: BoardArray): boolean {
  return getValidMoves(board, 1).length === 0 && getValidMoves(board, -1).length === 0;
}

/** Calculate openness for a move: sum of adjacent empty cells for each flipped stone */
export function calculateOpenness(board: BoardArray, move: ValidMove): number {
  let openness = 0;

  for (const flipIdx of move.flips) {
    const fr = Math.floor(flipIdx / 8);
    const fc = flipIdx % 8;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = fr + dr;
      const nc = fc + dc;
      if (isOnBoard(nr, nc) && getCell(board, nr, nc) === EMPTY) {
        // Don't count the move position itself
        if (nr !== move.row || nc !== move.col) {
          openness++;
        }
      }
    }
  }

  return openness;
}

/** Get valid moves with openness calculated */
export function getValidMovesWithOpenness(board: BoardArray, player: Player): ValidMove[] {
  const moves = getValidMoves(board, player);
  for (const move of moves) {
    move.openness = calculateOpenness(board, move);
  }
  return moves;
}

/** Count adjacent empty cells for a position */
export function countAdjacentEmpty(board: BoardArray, row: number, col: number): number {
  let count = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (isOnBoard(nr, nc) && getCell(board, nr, nc) === EMPTY) {
      count++;
    }
  }
  return count;
}
