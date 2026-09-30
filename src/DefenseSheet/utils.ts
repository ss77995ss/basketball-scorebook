import type { Possession } from './types';

export const STAT_LABELS = [
  '總失分',
  '總波數',
  '總Drtg',
  '沒守到但被得分的分數',
  '沒守到但被得分的波數',
  'Drtg',
  '有守到但被得分的分數',
  '有守到但被得分的波數',
  'Drtg',
];

const drtg = (points: number, count: number): number | string =>
  count ? Math.round((points / count) * 1000) / 10 : '-';

const sumPoints = (list: Possession[]): number => list.reduce((acc, { points }) => acc + points, 0);

// one value per STAT_LABELS row
// ponytail: split rows count only possessions that gave up points, as the sheet labels them
export const summarize = (list: Possession[]): Array<number | string> => {
  const scored = list.filter(({ points }) => points > 0);

  return [list, scored.filter(({ contested }) => !contested), scored.filter(({ contested }) => contested)].flatMap(
    (group) => {
      const points = sumPoints(group);
      return [points, group.length, drtg(points, group.length)];
    },
  );
};

// 3 scoreless possessions in a row = one 3 stop; the streak restarts after each one
export const countThreeStops = (list: Possession[]): number => {
  let streak = 0;
  let count = 0;

  for (const { points } of list) {
    streak = points ? 0 : streak + 1;
    if (streak === 3) {
      count += 1;
      streak = 0;
    }
  }

  return count;
};
