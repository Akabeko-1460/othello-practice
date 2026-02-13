"use client";

import { useReducer, useCallback, useRef, useEffect, useState } from "react";
import {
  type GameState,
  type GameSettings,
  type GameAction,
  type GameStore,
  type ValidMove,
  BLACK,
} from "@/lib/othello/types";
import { createBoard, countAll, opponent } from "@/lib/othello/board";
import {
  getValidMoves,
  getValidMovesWithOpenness,
  applyMove,
} from "@/lib/othello/rules";
import { getAIMove } from "@/lib/othello/ai";
import { evaluateMoveQuality } from "@/lib/othello/ai/advanced";
import { isCorner, isXSquare, isCSquare } from "@/lib/othello/board";
import { calculateOpenness } from "@/lib/othello/rules";

const DEFAULT_SETTINGS: GameSettings = {
  mode: "cpu",
  aiLevel: "beginner",
  playerColor: BLACK,
  showOpenness: false,
  evaluationMode: false,
};

function createInitialState(board?: Int8Array): GameState {
  const b = board ?? createBoard();
  const moves = getValidMoves(b, BLACK);
  const counts = countAll(b);
  return {
    board: b,
    currentPlayer: BLACK,
    validMoves: moves,
    blackCount: counts.black,
    whiteCount: counts.white,
    isGameOver: false,
    lastMove: null,
    moveHistory: [],
    evaluation: null,
    passCount: 0,
  };
}

function updateState(
  board: Int8Array,
  currentPlayer: 1 | -1,
  lastMove: { row: number; col: number } | null,
  moveHistory: { row: number; col: number }[],
): GameState {
  const nextPlayer = opponent(currentPlayer);
  const nextMoves = getValidMoves(board, nextPlayer);
  const counts = countAll(board);

  // Check if next player can move
  if (nextMoves.length === 0) {
    // Check if current player can move again
    const currentMoves = getValidMoves(board, currentPlayer);
    if (currentMoves.length === 0) {
      // Game over
      return {
        board,
        currentPlayer: nextPlayer,
        validMoves: [],
        blackCount: counts.black,
        whiteCount: counts.white,
        isGameOver: true,
        lastMove,
        moveHistory,
        evaluation: null,
        passCount: 0,
      };
    }
    // Pass - back to current player
    return {
      board,
      currentPlayer,
      validMoves: currentMoves,
      blackCount: counts.black,
      whiteCount: counts.white,
      isGameOver: false,
      lastMove,
      moveHistory,
      evaluation: null,
      passCount: 1,
    };
  }

  return {
    board,
    currentPlayer: nextPlayer,
    validMoves: nextMoves,
    blackCount: counts.black,
    whiteCount: counts.white,
    isGameOver: false,
    lastMove,
    moveHistory,
    evaluation: null,
    passCount: 0,
  };
}

function gameReducer(store: GameStore, action: GameAction): GameStore {
  switch (action.type) {
    case "INIT":
      return {
        settings: { ...action.settings },
        state: createInitialState(),
        stateHistory: [],
      };

    case "PLACE_STONE": {
      const { move } = action;
      const { state, settings, stateHistory } = store;
      const newBoard = applyMove(state.board, move, state.currentPlayer);
      const newHistory = [
        ...state.moveHistory,
        { row: move.row, col: move.col },
      ];
      const newState = updateState(
        newBoard,
        state.currentPlayer,
        { row: move.row, col: move.col },
        newHistory,
      );
      return {
        settings,
        state: newState,
        stateHistory: [...stateHistory, state],
      };
    }

    case "CPU_MOVE": {
      const { move } = action;
      const { state, settings, stateHistory } = store;
      const newBoard = applyMove(state.board, move, state.currentPlayer);
      const newHistory = [
        ...state.moveHistory,
        { row: move.row, col: move.col },
      ];
      const newState = updateState(
        newBoard,
        state.currentPlayer,
        { row: move.row, col: move.col },
        newHistory,
      );
      // Preserve evaluation during CPU move - only clear when player makes a move
      return {
        settings,
        state: { ...newState, evaluation: state.evaluation },
        stateHistory: [...stateHistory, state],
      };
    }

    case "PASS": {
      const { state, settings, stateHistory } = store;
      const nextPlayer = opponent(state.currentPlayer);
      const nextMoves = getValidMoves(state.board, nextPlayer);
      return {
        settings,
        state: {
          ...state,
          currentPlayer: nextPlayer,
          validMoves: nextMoves,
          passCount: state.passCount + 1,
        },
        stateHistory,
      };
    }

    case "TOGGLE_OPENNESS":
      return {
        ...store,
        settings: {
          ...store.settings,
          showOpenness: !store.settings.showOpenness,
        },
      };

    case "SET_EVALUATION":
      return {
        ...store,
        state: { ...store.state, evaluation: action.evaluation },
      };

    case "UNDO": {
      const { stateHistory, settings } = store;
      const steps = Math.min(action.steps, stateHistory.length);
      if (steps === 0) return store;
      const newHistory = stateHistory.slice(0, -steps);
      const restoredState = stateHistory[stateHistory.length - steps];
      return {
        settings,
        state: { ...restoredState, evaluation: null },
        stateHistory: newHistory,
      };
    }

    case "RESET":
      return {
        settings: store.settings,
        state: createInitialState(),
        stateHistory: [],
      };

    default:
      return store;
  }
}

function generateEvalMessage(
  move: ValidMove,
  quality: "good" | "ok" | "bad",
  bestMove: ValidMove | null,
  board: Int8Array,
): string {
  if (quality === "good") {
    if (isCorner(move.row, move.col)) return "隅を取る好手です！";
    const openness = calculateOpenness(board, move);
    if (openness <= 1) return "開放度の低い中割りの好手です！";
    return "良い手です！盤面を有利に進めています。";
  }
  if (quality === "ok") {
    return "まずまずの手です。悪くはありませんが、より良い手もありました。";
  }
  // bad
  if (isXSquare(move.row, move.col)) return "X打ちは隅を取られやすく危険です！";
  if (isCSquare(move.row, move.col))
    return "理由のないC打ちは隅を取られるリスクがあります。";
  if (bestMove && isCorner(bestMove.row, bestMove.col)) {
    return `隅(${String.fromCharCode(97 + bestMove.col)}${bestMove.row + 1})を取るチャンスを逃しました！`;
  }
  const openness = calculateOpenness(board, move);
  if (openness >= 5)
    return "開放度が高すぎます。もっと少なく返せる手を探しましょう。";
  return "相手に有利な展開になりそうです。石の取りすぎに注意しましょう。";
}

export function useGame() {
  const [store, dispatch] = useReducer(gameReducer, {
    settings: DEFAULT_SETTINGS,
    state: createInitialState(),
    stateHistory: [],
  });

  const [flippingCells, setFlippingCells] = useState<Set<number>>(new Set());
  const [newCell, setNewCell] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [passMessage, setPassMessage] = useState<string | null>(null);
  const thinkingRef = useRef(false);

  const { settings, state } = store;

  // Compute valid moves with openness if needed
  const validMoves = settings.showOpenness
    ? getValidMovesWithOpenness(state.board, state.currentPlayer)
    : state.validMoves;

  const isPlayerTurn =
    settings.mode === "local" || state.currentPlayer === settings.playerColor;

  // Animate flips
  const animateMove = useCallback((move: ValidMove) => {
    setNewCell(move.row * 8 + move.col);
    setFlippingCells(new Set(move.flips));
    setTimeout(() => {
      setFlippingCells(new Set());
      setNewCell(null);
    }, 400);
  }, []);

  // Handle player move
  const placeStone = useCallback(
    (move: ValidMove) => {
      if (!isPlayerTurn || isThinking || state.isGameOver) return;

      const boardBefore = new Int8Array(state.board);
      animateMove(move);

      // Evaluate if in evaluation mode
      if (settings.evaluationMode && settings.mode === "cpu") {
        const { score, bestMove, bestScore } = evaluateMoveQuality(
          boardBefore,
          state.currentPlayer,
          move,
        );
        const diff = bestScore - score;
        let quality: "good" | "ok" | "bad";
        if (diff <= 3) quality = "good";
        else if (diff <= 15) quality = "ok";
        else quality = "bad";

        const message = generateEvalMessage(
          move,
          quality,
          bestMove,
          boardBefore,
        );
        dispatch({ type: "PLACE_STONE", move });
        dispatch({
          type: "SET_EVALUATION",
          evaluation: { quality, message, bestMove, scoreDiff: diff },
        });
      } else {
        dispatch({ type: "PLACE_STONE", move });
      }
    },
    [
      isPlayerTurn,
      isThinking,
      state.isGameOver,
      state.board,
      state.currentPlayer,
      settings,
      animateMove,
    ],
  );

  // CPU move effect
  useEffect(() => {
    if (settings.mode !== "cpu") return;
    if (state.isGameOver) return;
    if (state.currentPlayer === settings.playerColor) return;
    if (thinkingRef.current) return;

    // Handle pass
    if (state.validMoves.length === 0) return;

    thinkingRef.current = true;

    const timer = setTimeout(
      () => {
        setIsThinking(true);
        const move = getAIMove(
          state.board,
          state.currentPlayer,
          settings.aiLevel,
        );
        if (move) {
          animateMove(move);
          dispatch({ type: "CPU_MOVE", move });
        }
        thinkingRef.current = false;
        setIsThinking(false);
      },
      settings.aiLevel === "advanced" ||
        settings.aiLevel === "semi_advanced" ||
        settings.aiLevel === "expert"
        ? 100
        : 500,
    );

    return () => {
      clearTimeout(timer);
      thinkingRef.current = false;
      setIsThinking(false);
    };
  }, [
    state.currentPlayer,
    state.isGameOver,
    state.board,
    settings,
    animateMove,
    state.validMoves.length,
  ]);

  // Pass detection
  useEffect(() => {
    if (state.passCount > 0 && !state.isGameOver) {
      const passingPlayer = state.currentPlayer === BLACK ? "WHITE" : "BLACK";
      const message = `${passingPlayer === "BLACK" ? "黒" : "白"}はパスです`;

      // Use setTimeout to avoid synchronous setState in effect
      const showTimer = setTimeout(() => setPassMessage(message), 0);
      const hideTimer = setTimeout(() => setPassMessage(null), 1500);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [state.passCount, state.currentPlayer, state.isGameOver]);

  const initGame = useCallback((newSettings: GameSettings) => {
    dispatch({ type: "INIT", settings: newSettings });
    setFlippingCells(new Set());
    setNewCell(null);
    setIsThinking(false);
    thinkingRef.current = false;
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET" });
    setFlippingCells(new Set());
    setNewCell(null);
    setIsThinking(false);
    thinkingRef.current = false;
  }, []);

  const toggleOpenness = useCallback(() => {
    dispatch({ type: "TOGGLE_OPENNESS" });
  }, []);

  const clearEvaluation = useCallback(() => {
    dispatch({ type: "SET_EVALUATION", evaluation: null });
  }, []);

  // Undo: CPU mode = 2 steps (player + CPU), local mode = 1 step
  const undoMove = useCallback(() => {
    if (isThinking) return;
    const steps = settings.mode === "cpu" ? 2 : 1;
    dispatch({ type: "UNDO", steps });
    setFlippingCells(new Set());
    setNewCell(null);
  }, [settings.mode, isThinking]);

  const canUndo =
    store.stateHistory.length >= (settings.mode === "cpu" ? 2 : 1) &&
    !isThinking &&
    !state.isGameOver;

  return {
    settings,
    state,
    validMoves,
    isPlayerTurn,
    isThinking,
    flippingCells,
    newCell,
    passMessage,
    placeStone,
    initGame,
    resetGame,
    toggleOpenness,
    clearEvaluation,
    undoMove,
    canUndo,
  };
}
