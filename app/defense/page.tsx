'use client';

import dynamic from 'next/dynamic';

// ponytail: games live in localStorage, so there is nothing to prerender
const DefenseSheet = dynamic(() => import('../../src/DefenseSheet'), { ssr: false });

export default function DefensePage() {
  return <DefenseSheet />;
}
