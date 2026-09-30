'use client';

import dynamic from 'next/dynamic';
import { PlayerListProvider } from '../../src/PlayerList/hooks/usePlayerList';

// ponytail: the player list lives in localStorage, so there is nothing to prerender
const TurnoverSheet = dynamic(() => import('../../src/TurnoverSheet'), { ssr: false });

export default function TurnoverPage() {
  return (
    <PlayerListProvider>
      <TurnoverSheet />
    </PlayerListProvider>
  );
}
