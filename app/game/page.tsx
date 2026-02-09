'use client';

import { useRouter } from 'next/navigation';
import GameSettingsPanel from '@/components/game/GameSettings';
import { type GameSettings } from '@/lib/othello/types';

export default function GamePage() {
  const router = useRouter();

  const handleStart = (settings: GameSettings) => {
    const params = new URLSearchParams({
      mode: settings.mode,
      level: settings.aiLevel,
      color: String(settings.playerColor),
      openness: String(settings.showOpenness),
      eval: String(settings.evaluationMode),
    });
    router.push(`/game/play?${params.toString()}`);
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center bg-background">
      <GameSettingsPanel onStart={handleStart} />
    </div>
  );
}
