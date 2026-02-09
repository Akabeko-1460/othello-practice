import { type BoardArray, type Player, type ValidMove } from '../types';
import { getValidMoves, applyMove } from '../rules';
import { evaluate } from '../evaluation';
import { opponent, countStones } from '../board';
import { BLACK, WHITE } from '../types';

const TIME_LIMIT = 2000; // 2 seconds

/** Advanced AI: Minimax with Alpha-Beta pruning, iterative deepening */
export function advancedMove(board: BoardArray, player: Player): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const totalStones = countStones(board, BLACK) + countStones(board, WHITE);
  const emptyCount = 64 - totalStones;

  // Endgame: try to read to the end
  const maxDepth = emptyCount <= 12 ? emptyCount : 6;
  const startTime = Date.now();

  let bestMove = moves[0];

  // Iterative deepening
  for (let depth = 2; depth <= maxDepth; depth += 2) {
    if (Date.now() - startTime > TIME_LIMIT) break;

    const result = searchRoot(board, player, moves, depth, startTime);
    if (result) {
      bestMove = result;
    }

    // If we've used more than half the time, don't start a deeper search
    if (Date.now() - startTime > TIME_LIMIT / 2) break;
  }

  return bestMove;
}

function searchRoot(
  board: BoardArray,
  player: Player,
  moves: ValidMove[],
  depth: number,
  startTime: number
): ValidMove | null {
  let alpha = -Infinity;
  const beta = Infinity;
  let bestMove = moves[0];

  // Move ordering: evaluate each move quickly and sort
  const scored = moves.map(move => {
    const newBoard = applyMove(board, move, player);
    return { move, score: evaluate(newBoard, player) };
  });
  scored.sort((a, b) => b.score - a.score);

  for (const { move } of scored) {
    if (Date.now() - startTime > TIME_LIMIT) break;

    const newBoard = applyMove(board, move, player);
    const score = -alphaBeta(newBoard, opponent(player), player, depth - 1, -beta, -alpha, startTime);

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
  startTime: number
): number {
  if (Date.now() - startTime > TIME_LIMIT) {
    return evaluate(board, currentPlayer);
  }

  const moves = getValidMoves(board, currentPlayer);

  if (moves.length === 0) {
    // Check if opponent also has no moves (game over)
    const oppMoves = getValidMoves(board, opponent(currentPlayer));
    if (oppMoves.length === 0) {
      // Game over - count stones
      const my = countStones(board, currentPlayer);
      const opp = countStones(board, opponent(currentPlayer));
      if (my > opp) return 10000 + (my - opp);
      if (my < opp) return -10000 - (opp - my);
      return 0;
    }
    // Pass: opponent's turn
    return -alphaBeta(board, opponent(currentPlayer), maximizingPlayer, depth, -beta, -alpha, startTime);
  }

  if (depth <= 0) {
    return evaluate(board, currentPlayer);
  }

  for (const move of moves) {
    const newBoard = applyMove(board, move, currentPlayer);
    const score = -alphaBeta(newBoard, opponent(currentPlayer), maximizingPlayer, depth - 1, -beta, -alpha, startTime);

    if (score > alpha) {
      alpha = score;
    }
    if (alpha >= beta) {
      break; // Beta cutoff
    }
  }

  return alpha;
}

/** Evaluate a specific move for the evaluation mode */
export function evaluateMoveQuality(
  board: BoardArray,
  player: Player,
  move: ValidMove
): { score: number; bestMove: ValidMove | null; bestScore: number } {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return { score: 0, bestMove: null, bestScore: 0 };

  const startTime = Date.now();
  const depth = 6;

  // Evaluate the played move
  const newBoard = applyMove(board, move, player);
  const moveScore = -alphaBeta(newBoard, opponent(player), player, depth - 1, -Infinity, Infinity, startTime);

  // Find the best move
  let bestScore = -Infinity;
  let bestMove = moves[0];

  for (const m of moves) {
    const nb = applyMove(board, m, player);
    const s = -alphaBeta(nb, opponent(player), player, depth - 1, -Infinity, Infinity, startTime);
    if (s > bestScore) {
      bestScore = s;
      bestMove = m;
    }
  }

  return { score: moveScore, bestMove, bestScore };
}
