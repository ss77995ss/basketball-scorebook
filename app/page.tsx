'use client';

import { StatsProvider } from '../src/AdvancedStats/hooks/statData';
import AdvancedStats from '../src/AdvancedStats';

export default function AdvancedStatsPage() {
  return (
    <StatsProvider>
      <AdvancedStats />
    </StatsProvider>
  );
}
