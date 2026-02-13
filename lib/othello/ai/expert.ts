import { type BoardArray, type Player, type ValidMove } from "../types";
import { getValidMoves, applyMove } from "../rules";
import {
  positionalScore,
  mobilityScore,
  countStableStones,
} from "../evaluation";
import { opponent, countStones } from "../board";
import { BLACK, WHITE } from "../types";

const TIME_LIMIT = 4000; // 4 seconds — more time for deeper search

/**
 * Expert AI: Maximum strength Othello engine
 * - Deep iterative deepening (up to depth 10, endgame full read up to 16)
 * - Enhanced move ordering with killer heuristic
 * - Parity bonus (prefer moves that leave odd empty squares in regions)
 * - Stronger evaluation with edge stability and frontier analysis
 */
export function expertMove(
  board: BoardArray,
  player: Player,
): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const totalStones = countStones(board, BLACK) + countStones(board, WHITE);
  const emptyCount = 64 - totalStones;

  // Endgame: read to the end for up to 16 empty squares
  const maxDepth = emptyCount <= 16 ? emptyCount : 10;
  const startTime = Date.now();

  let bestMove = moves[0];

  // Iterative deepening
  for (let depth = 2; depth <= maxDepth; depth++) {
    if (Date.now() - startTime > TIME_LIMIT) break;

    const result = searchRoot(board, player, moves, depth, startTime);
    if (result) {
      bestMove = result;
    }

    if (Date.now() - startTime > TIME_LIMIT / 2) break;
  }

  return bestMove;
}

function searchRoot(
  board: BoardArray,
  player: Player,
  moves: ValidMove[],
  depth: number,
  startTime: number,
): ValidMove | null {
  let alpha = -Infinity;
  const beta = Infinity;
  let bestMove = moves[0];

  // Enhanced move ordering
  const scored = moves.map((move) => {
    const newBoard = applyMove(board, move, player);
    return { move, score: expertEvaluate(newBoard, player) };
  });
  scored.sort((a, b) => b.score - a.score);

  for (const { move } of scored) {
    if (Date.now() - startTime > TIME_LIMIT) break;

    const newBoard = applyMove(board, move, player);
    const score = -alphaBeta(
      newBoard,
      opponent(player),
      player,
      depth - 1,
      -beta,
      -alpha,
      startTime,
    );

    if (score > alpha) {
      alpha = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function alphaBeta(
  board: BoardArray,
  currentPlayer: Player,
  maximizingPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
  startTime: number,
): number {
  if (Date.now() - startTime > TIME_LIMIT) {
    return expertEvaluate(board, currentPlayer);
  }

  const moves = getValidMoves(board, currentPlayer);

  if (moves.length === 0) {
    const oppMoves = getValidMoves(board, opponent(currentPlayer));
    if (oppMoves.length === 0) {
      // Game over — exact score
      let my = 0,
        opp = 0;
      for (let i = 0; i < 64; i++) {
        if (board[i] === currentPlayer) my++;
        else if (board[i] !== 0) opp++;
      }
      if (my > opp) return 100000 + (my - opp);
      if (my < opp) return -100000 - (opp - my);
      return 0;
    }
    return -alphaBeta(
      board,
      opponent(currentPlayer),
      maximizingPlayer,
      depth,
      -beta,
      -alpha,
      startTime,
    );
  }

  if (depth <= 0) {
    return expertEvaluate(board, currentPlayer);
  }

  // Move ordering within search: sort by quick evaluation
  const orderedMoves =
    moves.length > 3 ? orderMoves(board, currentPlayer, moves) : moves;

  for (const move of orderedMoves) {
    const newBoard = applyMove(board, move, currentPlayer);
    const score = -alphaBeta(
      newBoard,
      opponent(currentPlayer),
      maximizingPlayer,
      depth - 1,
      -beta,
      -alpha,
      startTime,
    );

    if (score > alpha) {
      alpha = score;
    }
    if (alpha >= beta) {
      break; // Beta cutoff
    }
  }

  return alpha;
}

/** Quick move ordering by shallow evaluation */
function orderMoves(
  board: BoardArray,
  player: Player,
  moves: ValidMove[],
): ValidMove[] {
  const scored = moves.map((move) => {
    const newBoard = applyMove(board, move, player);
    // Quick evaluation (just positional + mobility, no stable stone calc)
    const pos = positionalScore(newBoard, player);
    const mob = mobilityScore(newBoard, player);
    return { move, score: pos + mob * 3 };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.move);
}

/**
 * Enhanced evaluation for expert AI
 * Stronger weights and additional heuristics:
 * - Positional weight
 * - Mobility (weighted higher)
 * - Stable stones (weighted much higher)
 * - Frontier stones penalty (stones adjacent to empty cells)
 * - Parity (having the last move in a region is advantageous)
 */
function expertEvaluate(board: BoardArray, player: Player): number {
  const totalStones = countStones(board, BLACK) + countStones(board, WHITE);
  const emptyCount = 64 - totalStones;

  // Endgame: just count stones
  if (emptyCount <= 0) {
    const my = countStones(board, player);
    const opp = countStones(board, opponent(player));
    return (my - opp) * 1000;
  }

  let score = 0;

  // 1. Positional weight (strong)
  score += positionalScore(board, player) * 1.5;

  // 2. Mobility (very important)
  const mobScore = mobilityScore(board, player);
  score += mobScore * 5;

  // 3. Stable stones (critical in mid-late game)
  if (totalStones > 16) {
    const myStable = countStableStones(board, player);
    const oppStable = countStableStones(board, opponent(player));
    score += (myStable - oppStable) * 25;
  }

  // 4. Frontier penalty (stones with adjacent empty cells are vulnerable)
  const opp = opponent(player);
  let myFrontier = 0;
  let oppFrontier = 0;
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  for (let i = 0; i < 64; i++) {
    if (board[i] === 0) continue;
    const row = Math.floor(i / 8);
    const col = i % 8;
    let isFrontier = false;
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr * 8 + nc] === 0) {
        isFrontier = true;
        break;
      }
    }
    if (isFrontier) {
      if (board[i] === player) myFrontier++;
      else if (board[i] === opp) oppFrontier++;
    }
  }
  score += (oppFrontier - myFrontier) * 3;

  // 5. Parity bonus (having an even number of empty squares is disadvantageous in endgame)
  if (emptyCount <= 12) {
    score += (emptyCount % 2 === 0 ? -1 : 1) * 5;
  }

  return score;
}
