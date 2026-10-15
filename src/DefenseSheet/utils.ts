import type { Game, Possession } from './types';

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
// returns the indices of each 3 stop; the 1-2 extra stops of an unbroken run stay on the 3 stop before them,
// so 5 in a row = [[0, 1, 2, 3, 4]] and 6 in a row = [[0, 1, 2], [3, 4, 5]]
export const findThreeStops = (list: Possession[]): number[][] => {
  const stops: number[][] = [];
  let streak: number[] = [];

  const flush = (): void => {
    const last = stops.at(-1);
    if (last && last.at(-1) === streak[0] - 1) last.push(...streak);
    streak = [];
  };

  list.forEach(({ points }, index) => {
    if (points) {
      flush();
    } else if (streak.push(index) === 3) {
      stops.push(streak);
      streak = [];
    }
  });
  flush();

  return stops;
};

// ponytail: 3h ≈ one game plus warm-up and breaks; make it a setting if tournaments need longer
const RESUME_MS = 3 * 60 * 60 * 1000;

const touchedAt = (game: Game): number => Date.parse(game.updatedAt ?? game.createdAt);

export const findResumable = (games: Game[], now = Date.now()): Game | undefined => {
  const latest = games.reduce<Game | undefined>((a, b) => (a && touchedAt(a) >= touchedAt(b) ? a : b), undefined);
  return latest && now - touchedAt(latest) < RESUME_MS ? latest : undefined;
};
