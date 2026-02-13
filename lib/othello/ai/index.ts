import {
  type BoardArray,
  type Player,
  type ValidMove,
  type AILevel,
} from "../types";
import { beginnerMove } from "./beginner";
import { elementaryMove } from "./elementary";
import { intermediateMove } from "./intermediate";
import { semiAdvancedMove } from "./semi_advanced";
import { advancedMove } from "./advanced";
import { expertMove } from "./expert";

/** Dispatch AI move based on level */
export function getAIMove(
  board: BoardArray,
  player: Player,
  level: AILevel,
): ValidMove | null {
  switch (level) {
    case "beginner":
      return beginnerMove(board, player);
    case "elementary":
      return elementaryMove(board, player);
    case "intermediate":
      return intermediateMove(board, player);
    case "semi_advanced":
      return semiAdvancedMove(board, player);
    case "advanced":
      return advancedMove(board, player);
    case "expert":
      return expertMove(board, player);
    default:
      return beginnerMove(board, player);
  }
}
