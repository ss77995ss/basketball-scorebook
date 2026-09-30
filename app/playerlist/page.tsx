'use client';

import dynamic from 'next/dynamic';
import { PlayerListProvider } from '../../src/PlayerList/hooks/usePlayerList';

// ponytail: the player list lives in localStorage, so there is nothing to prerender
const PlayerList = dynamic(() => import('../../src/PlayerList'), { ssr: false });

export default function PlayerListPage() {
  return (
    <PlayerListProvider>
      <PlayerList />
    </PlayerListProvider>
  );
}
