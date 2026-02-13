"use client";

import { useState } from "react";
import {
  type GameSettings,
  type AILevel,
  type GameMode,
  BLACK,
  WHITE,
} from "@/lib/othello/types";

interface GameSettingsProps {
  onStart: (settings: GameSettings) => void;
}

const AI_LEVELS: {
  value: AILevel;
  label: string;
  desc: string;
}[] = [
  {
    value: "beginner",
    label: "初心者",
    desc: "ランダムに着手する",
  },
  {
    value: "elementary",
    label: "初級",
    desc: "多く取る＋隅を優先",
  },
  {
    value: "intermediate",
    label: "中級",
    desc: "開放度・位置・手数を総合判断",
  },
  {
    value: "semi_advanced",
    label: "準上級",
    desc: "4手先まで読む",
  },
  {
    value: "advanced",
    label: "上級",
    desc: "深い先読み＋反復深化",
  },
  {
    value: "expert",
    label: "超級",
    desc: "最強・終盤完全読み",
  },
];

export default function GameSettingsPanel({ onStart }: GameSettingsProps) {
  const [mode, setMode] = useState<GameMode>("cpu");
  const [aiLevel, setAiLevel] = useState<AILevel>("beginner");
  const [playerColor, setPlayerColor] = useState<1 | -1>(BLACK);
  const [showOpenness, setShowOpenness] = useState(false);
  const [evaluationMode, setEvaluationMode] = useState(false);

  const handleStart = () => {
    onStart({ mode, aiLevel, playerColor, showOpenness, evaluationMode });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">対戦設定</h2>
        <p className="text-sm text-text-muted mt-1">
          モードとレベルを選んで対局を始めましょう
        </p>
      </div>

      <div className="space-y-6">
        {/* Mode */}
        <section>
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            対戦モード
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: "cpu" as GameMode, label: "CPU対戦", sub: "AIと対局" },
              { v: "local" as GameMode, label: "対人戦", sub: "2人で対局" },
            ].map(({ v, label, sub }) => (
              <button
                key={v}
                onClick={() => setMode(v)}
                className={`
                  py-3 px-4 rounded-lg border-2 text-left transition-all
                  ${
                    mode === v
                      ? "border-accent bg-accent-light/60 shadow-sm"
                      : "border-border hover:border-border-hover bg-surface"
                  }
                `}
              >
                <div className="font-semibold text-sm">{label}</div>
                <div className="text-xs text-text-muted mt-0.5">{sub}</div>
              </button>
            ))}
          </div>
        </section>

        {/* AI Level */}
        {mode === "cpu" && (
          <section className="animate-fade-in-up">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              CPUレベル
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AI_LEVELS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setAiLevel(value)}
                  className={`
                    py-3 px-3 rounded-lg border-2 text-left transition-all
                    ${
                      aiLevel === value
                        ? "border-accent bg-accent-light/60 shadow-sm"
                        : "border-border hover:border-border-hover bg-surface"
                    }
                  `}
                >
                  <div className="font-semibold text-sm">{label}</div>
                  <div className="text-xs text-text-muted mt-0.5">{desc}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Player Color */}
        {mode === "cpu" && (
          <section className="animate-fade-in-up">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              あなたの色
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPlayerColor(BLACK)}
                className={`
                  py-3 px-4 rounded-lg border-2 flex items-center gap-3 transition-all
                  ${
                    playerColor === BLACK
                      ? "border-accent bg-accent-light/60 shadow-sm"
                      : "border-border hover:border-border-hover bg-surface"
                  }
                `}
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #444, #1a1a1a 60%, #0a0a0a)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                />
                <div className="text-left">
                  <div className="text-sm font-semibold">黒</div>
                  <div className="text-[11px] text-text-muted">先手</div>
                </div>
              </button>
              <button
                onClick={() => setPlayerColor(WHITE)}
                className={`
                  py-3 px-4 rounded-lg border-2 flex items-center gap-3 transition-all
                  ${
                    playerColor === WHITE
                      ? "border-accent bg-accent-light/60 shadow-sm"
                      : "border-border hover:border-border-hover bg-surface"
                  }
                `}
              >
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, #fff, #f0f0f0 60%, #d4d4d4)",
                    boxShadow:
                      "inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 3px rgba(0,0,0,0.12)",
                  }}
                />
                <div className="text-left">
                  <div className="text-sm font-semibold">白</div>
                  <div className="text-[11px] text-text-muted">後手</div>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Options */}
        <section className="space-y-2">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            オプション
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border bg-surface hover:bg-surface-dim transition-colors">
            <input
              type="checkbox"
              checked={showOpenness}
              onChange={(e) => setShowOpenness(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-accent rounded"
            />
            <div>
              <span className="text-sm font-medium">開放度を表示</span>
              <p className="text-xs text-text-muted mt-0.5">
                着手候補ごとの開放度を数値で表示します
              </p>
            </div>
          </label>

          {mode === "cpu" && (
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border bg-surface hover:bg-surface-dim transition-colors animate-fade-in-up">
              <input
                type="checkbox"
                checked={evaluationMode}
                onChange={(e) => setEvaluationMode(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-accent rounded"
              />
              <div>
                <span className="text-sm font-medium">1手評価モード</span>
                <p className="text-xs text-text-muted mt-0.5">
                  好手・普通・悪手で評価＋解説します
                </p>
              </div>
            </label>
          )}
        </section>

        {/* Start */}
        <button
          onClick={handleStart}
          className="btn btn-primary w-full py-3.5 text-base rounded-xl mt-2"
        >
          対局開始
        </button>
      </div>
    </div>
  );
}
