import { useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useMedia } from 'react-use';
import { StyledCell } from '../styles';
import { StatValueType, useStatsDispatch } from './hooks/statData';

interface Props {
  value: { count: number; points: number };
  rowIndex: number;
  columnId: string;
  team: string;
  isSwipeable: boolean;
}

const StatCellWithCount: React.FC<Props> = ({ value, rowIndex, columnId, team, isSwipeable }: Props) => {
  const { count, points } = value;
  // touch devices drive the cell by swipe, so mouse tracking is only for pointer devices
  const isTouch = useMedia('(pointer: coarse)', false);
  const pointsClickTimeout = useRef<number | undefined>(undefined);
  const countClickTimeout = useRef<number | undefined>(undefined);
  const pointsClickCount = useRef<number>(0);
  const countClickCount = useRef<number>(0);

  const statsDispatch = useStatsDispatch();

  const updateStats: (value: StatValueType) => void = (value) => {
    statsDispatch({
      type: 'UPDATE_CELL',
      params: {
        team,
        rowIndex,
        columnId,
        value,
      },
    });
  };

  const handlers = useSwipeable({
    onSwipedDown: () => {
      if (points - 3 >= 0) updateStats({ points: points - 3, count: count - 1 >= 0 ? count - 1 : count });
    },
    onSwipedUp: () => {
      updateStats({ points: points + 3, count: count + 1 });
    },
    onSwipedLeft: () => {
      if (points - 2 >= 0) updateStats({ points: points - 2, count: count - 1 >= 0 ? count - 1 : count });
    },
    onSwipedRight: () => {
      updateStats({ points: points + 2, count: count + 1 });
    },
    preventScrollOnSwipe: true,
    trackMouse: !isTouch,
  });

  const handlePointsClick = (): void => {
    if (pointsClickCount.current < 1) {
      pointsClickCount.current += 1;
      pointsClickTimeout.current = window.setTimeout(() => {
        updateStats({ points: points + 1, count: count });
        pointsClickCount.current = 0;
      }, 200);
    } else {
      clearTimeout(pointsClickTimeout.current);
      if (points - 1 >= 0) updateStats({ points: points - 1, count });
      pointsClickCount.current = 0;
    }
  };

  const handleCountClick = (): void => {
    if (countClickCount.current < 1) {
      countClickCount.current += 1;
      countClickTimeout.current = window.setTimeout(() => {
        updateStats({ points, count: count + 1 });
        countClickCount.current = 0;
      }, 200);
    } else {
      clearTimeout(countClickTimeout.current);
      if (count - 1 >= 0) updateStats({ points, count: count - 1 });
      countClickCount.current = 0;
    }
  };

  return (
    <StyledCell {...(isSwipeable && handlers)} $readOnly={false}>
      <span onClick={handlePointsClick}>{points}</span>
      <hr />
      <span onClick={handleCountClick}>{count}</span>
    </StyledCell>
  );
};

export default StatCellWithCount;
