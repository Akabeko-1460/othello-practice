'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import GameController from '@/components/game/GameController';
import { type GameSettings, type AILevel, type GameMode, BLACK, WHITE } from '@/lib/othello/types';

function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const settings: GameSettings = {
    mode: (searchParams.get('mode') as GameMode) || 'cpu',
    aiLevel: (searchParams.get('level') as AILevel) || 'beginner',
    playerColor: searchParams.get('color') === '-1' ? WHITE : BLACK,
    showOpenness: searchParams.get('openness') === 'true',
    evaluationMode: searchParams.get('eval') === 'true',
  };

  return (
    <div className="min-h-screen bg-background">
      <GameController settings={settings} onBack={() => router.push('/game')} />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <PlayContent />
    </Suspense>
  );
}
