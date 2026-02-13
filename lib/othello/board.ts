import { BoardArray, BLACK, WHITE, type CellState } from "./types";

/** Create initial othello board */
export function createBoard(): BoardArray {
  const board = new Int8Array(64);
  // Initial 4 stones in center
  board[3 * 8 + 3] = WHITE;
  board[3 * 8 + 4] = BLACK;
  board[4 * 8 + 3] = BLACK;
  board[4 * 8 + 4] = WHITE;
  return board;
}

/** Clone a board (fast copy for AI search) */
export function cloneBoard(board: BoardArray): BoardArray {
  return new Int8Array(board);
}

/** Get cell value */
export function getCell(
  board: BoardArray,
  row: number,
  col: number,
): CellState {
  return board[row * 8 + col] as CellState;
}

/** Set cell value */
export function setCell(
  board: BoardArray,
  row: number,
  col: number,
  value: CellState,
): void {
  board[row * 8 + col] = value;
}

/** Count stones of a given type */
export function countStones(board: BoardArray, type: CellState): number {
  let count = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] === type) count++;
  }
  return count;
}

/** Count all stones */
export function countAll(board: BoardArray): {
  black: number;
  white: number;
  empty: number;
} {
  let black = 0,
    white = 0,
    empty = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] === BLACK) black++;
    else if (board[i] === WHITE) white++;
    else empty++;
  }
  return { black, white, empty };
}

/** Convert index to row, col */
export function indexToPos(index: number): [number, number] {
  return [Math.floor(index / 8), index % 8];
}

/** Convert row, col to index */
export function posToIndex(row: number, col: number): number {
  return row * 8 + col;
}

/** Check if position is on the board */
export function isOnBoard(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/** Check if position is a corner */
export function isCorner(row: number, col: number): boolean {
  return (row === 0 || row === 7) && (col === 0 || col === 7);
}

/** Check if position is an X-square (diagonal to corner) */
export function isXSquare(row: number, col: number): boolean {
  return (row === 1 || row === 6) && (col === 1 || col === 6);
}

/** Check if position is a C-square (adjacent to corner on edge) */
export function isCSquare(row: number, col: number): boolean {
  return (
    (row === 0 && (col === 1 || col === 6)) ||
    (row === 7 && (col === 1 || col === 6)) ||
    (col === 0 && (row === 1 || row === 6)) ||
    (col === 7 && (row === 1 || row === 6))
  );
}

/** Get the opponent */
export function opponent(player: 1 | -1): 1 | -1 {
  return (player === BLACK ? WHITE : BLACK) as 1 | -1;
}
