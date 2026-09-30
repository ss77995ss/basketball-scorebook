import { useRef } from 'react';
import { StyledCell } from '../styles';
import { StatValueType, useStatsDispatch } from './hooks/statData';

interface Props {
  value: number;
  rowIndex: number;
  columnId: string;
  team: string;
}

const StatCell: React.FC<Props> = ({ value, rowIndex, columnId, team }: Props) => {
  const countClickTimeout = useRef<number | undefined>(undefined);
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

  const handleCountClick = (): void => {
    if (countClickCount.current < 1) {
      countClickCount.current += 1;
      countClickTimeout.current = window.setTimeout(() => {
        updateStats(value + 1);
        countClickCount.current = 0;
      }, 200);
    } else {
      clearTimeout(countClickTimeout.current);
      if (value - 1 >= 0) updateStats(value - 1);
      countClickCount.current = 0;
    }
  };

  return (
    <StyledCell $readOnly={false}>
      <span onClick={handleCountClick}>{value}</span>
    </StyledCell>
  );
};

export default StatCell;
