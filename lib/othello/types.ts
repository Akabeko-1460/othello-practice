// Board representation: Int8Array(64), index = row * 8 + col
export const BLACK = 1 as const;
export const WHITE = -1 as const;
export const EMPTY = 0 as const;

export type CellState = typeof BLACK | typeof WHITE | typeof EMPTY;
export type BoardArray = Int8Array;
export type Player = typeof BLACK | typeof WHITE;

export interface Move {
  row: number;
  col: number;
}

export interface ValidMove extends Move {
  flips: number[]; // indices of cells to flip
  openness?: number; // sum of adjacent empty cells for flipped stones
}

export type AILevel =
  | "beginner"
  | "elementary"
  | "intermediate"
  | "semi_advanced"
  | "advanced"
  | "expert";
export type GameMode = "cpu" | "local";

export interface GameSettings {
  mode: GameMode;
  aiLevel: AILevel;
  playerColor: Player;
  showOpenness: boolean;
  evaluationMode: boolean;
}

export interface MoveEvaluation {
  quality: "good" | "ok" | "bad";
  message: string;
  bestMove: ValidMove | null;
  scoreDiff: number;
}

export interface GameState {
  board: BoardArray;
  currentPlayer: Player;
  validMoves: ValidMove[];
  blackCount: number;
  whiteCount: number;
  isGameOver: boolean;
  lastMove: Move | null;
  moveHistory: Move[];
  evaluation: MoveEvaluation | null;
  passCount: number; // consecutive passes
}

export type GameAction =
  | { type: "INIT"; settings: GameSettings }
  | { type: "PLACE_STONE"; move: ValidMove }
  | { type: "CPU_MOVE"; move: ValidMove }
  | { type: "PASS" }
  | { type: "TOGGLE_OPENNESS" }
  | { type: "SET_EVALUATION"; evaluation: MoveEvaluation | null }
  | { type: "UNDO"; steps: number }
  | { type: "RESET" };

export interface GameStore {
  settings: GameSettings;
  state: GameState;
  stateHistory: GameState[];
}
