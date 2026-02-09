import { type Player } from '@/lib/othello/types';

export interface GuideStep {
  /** Move to make on the board. If omitted, step just shows highlights/commentary. */
  move?: { row: number; col: number };
  /** Which player makes the move. Alternates automatically if omitted. */
  player?: Player;
  /** Commentary for this step */
  comment: string;
  /** Cell indices to highlight with a colored overlay */
  highlights?: number[];
  /** Evaluation tag shown next to the comment */
  tag?: 'good' | 'bad' | 'info' | 'warning';
}

export interface GuideScenario {
  title: string;
  description: string;
  /** Custom initial board as 64-element array (1=BLACK, -1=WHITE, 0=EMPTY).
   *  If omitted, standard opening is used. */
  initialBoard?: number[];
  /** Who moves first in this scenario (default: BLACK) */
  initialPlayer?: Player;
  steps: GuideStep[];
}

export interface GuideConcept {
  id: string;
  title: string;
  importance: 'high' | 'medium' | 'low';
  number: number;
  summary: string;
  scenarios: GuideScenario[];
}
