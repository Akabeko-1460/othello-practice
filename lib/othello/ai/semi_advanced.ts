import { type BoardArray, type Player, type ValidMove } from "../types";
import { getValidMoves, applyMove } from "../rules";
import { evaluate } from "../evaluation";
import { opponent } from "../board";

/** Semi-Advanced AI: Minimax with Alpha-Beta pruning, depth 4 */
export function semiAdvancedMove(
  board: BoardArray,
  player: Player,
): ValidMove | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  const depth = 4;

  // Move ordering: evaluate each move quickly and sort
  const scored = moves.map((move) => {
    const newBoard = applyMove(board, move, player);
    return { move, score: evaluate(newBoard, player) };
  });
  scored.sort((a, b) => b.score - a.score);

  let bestMove = scored[0].move;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const { move } of scored) {
    const newBoard = applyMove(board, move, player);
    const score = -alphaBeta(
      newBoard,
      opponent(player),
      depth - 1,
      -beta,
      -alpha,
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
  depth: number,
  alpha: number,
  beta: number,
): number {
  const moves = getValidMoves(board, currentPlayer);

  if (moves.length === 0) {
    const oppMoves = getValidMoves(board, opponent(currentPlayer));
    if (oppMoves.length === 0) {
      // Game over
      let my = 0,
        opp = 0;
      for (let i = 0; i < 64; i++) {
        if (board[i] === currentPlayer) my++;
        else if (board[i] !== 0) opp++;
      }
      if (my > opp) return 10000 + (my - opp);
      if (my < opp) return -10000 - (opp - my);
      return 0;
    }
    return -alphaBeta(board, opponent(currentPlayer), depth, -beta, -alpha);
  }

  if (depth <= 0) {
    return evaluate(board, currentPlayer);
  }

  for (const move of moves) {
    const newBoard = applyMove(board, move, currentPlayer);
    const score = -alphaBeta(
      newBoard,
      opponent(currentPlayer),
      depth - 1,
      -beta,
      -alpha,
    );

    if (score > alpha) {
      alpha = score;
    }
    if (alpha >= beta) {
      break;
    }
  }

  return alpha;
}
