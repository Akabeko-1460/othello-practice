'use client';

import { type MoveEvaluation } from '@/lib/othello/types';

interface MoveEvaluationProps {
  evaluation: MoveEvaluation;
  onClose: () => void;
}

const CONFIG = {
  good: {
    bg: 'bg-good-light',
    border: 'border-good',
    text: 'text-green-800',
    icon: '◎',
    iconBg: 'bg-good',
    label: '好手！',
  },
  ok: {
    bg: 'bg-ok-light',
    border: 'border-ok',
    text: 'text-yellow-800',
    icon: '△',
    iconBg: 'bg-ok',
    label: 'まずまず',
  },
  bad: {
    bg: 'bg-bad-light',
    border: 'border-bad',
    text: 'text-red-800',
    icon: '✕',
    iconBg: 'bg-bad',
    label: '悪手',
  },
};

export default function MoveEvaluationDisplay({ evaluation, onClose }: MoveEvaluationProps) {
  const c = CONFIG[evaluation.quality];

  return (
    <div
      className={`
        ${c.bg} border ${c.border} rounded-xl p-4 ${c.text}
        cursor-pointer transition-all hover:shadow-md animate-fade-in-up
      `}
      onClick={onClose}
    >
      <div className="flex items-start gap-3">
        <span
          className={`
            ${c.iconBg} text-white w-8 h-8 rounded-lg flex items-center justify-center
            font-bold text-sm flex-shrink-0
          `}
        >
          {c.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm">{c.label}</div>
          <p className="text-sm mt-0.5 opacity-90">{evaluation.message}</p>
          {evaluation.bestMove && evaluation.quality !== 'good' && (
            <p className="text-xs mt-1.5 opacity-60 font-mono">
              最善手: {String.fromCharCode(97 + evaluation.bestMove.col)}{evaluation.bestMove.row + 1}
            </p>
          )}
        </div>
        <span className="text-xs opacity-40 flex-shrink-0 mt-1">tap</span>
      </div>
    </div>
  );
}
