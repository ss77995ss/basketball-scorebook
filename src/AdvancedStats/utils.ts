import { omit } from 'ramda';
import { StatType } from './types';

export const getTotal: (row: StatType) => number = (row) => {
  const quarterStats = Object.values(omit(['statInfo', 'total'], row)) as Array<number>;
  const sum = quarterStats.reduce((acc, current) => acc + current, 0);

  return sum;
};

export const getTotalWithCount: (row: StatType) => string = (row) => {
  const quarterStats = Object.values(omit(['statInfo', 'total'], row)) as Array<{
    count: number;
    points: number;
  }>;

  const sum = quarterStats.reduce(
    ({ count: accCount, points: accPoints }, { count: currentCount, points: currentPoints }) => {
      return {
        count: accCount + currentCount,
        points: accPoints + currentPoints,
      };
    },
  );

  return `${sum.points} / ${sum.count}`;
};
