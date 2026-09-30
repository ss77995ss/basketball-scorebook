import { StatType } from './types';
import { StyledTitleCell } from '../styles';
import { StatValueType, useStatsDispatch } from './hooks/statData';

interface Props {
  statInfo: StatType['statInfo'];
  rowIndex: number;
  columnId: string;
}

const StatTitleCell: React.FC<Props> = ({ statInfo, rowIndex, columnId }: Props) => {
  const { name, linkName, title } = statInfo;

  const statsDispatch = useStatsDispatch();

  const updateStatsName: (value: StatValueType) => void = (value) => {
    statsDispatch({
      type: 'UPDATE_STATS_NAME',
      params: {
        team: '',
        rowIndex,
        columnId,
        value,
      },
    });
  };

  const rename = (current: string): string => prompt('輸入新的名稱', current) || current;

  // 'points'/'count' rename the two halves of a split title, everything else renames statInfo itself
  const handleOnClick = (key: 'name' | 'title' | 'points' | 'count') => (): void => {
    if (typeof title === 'object' && (key === 'points' || key === 'count')) {
      updateStatsName({ ...statInfo, title: { ...title, [key]: rename(title[key]) } });
      return;
    }

    const current = key === 'name' ? name : String(title);
    updateStatsName({ ...statInfo, [key]: rename(current) });
  };

  return (
    <StyledTitleCell id={linkName}>
      <div onClick={handleOnClick('name')}>{name}</div>
      {typeof title === 'string' ? (
        <div onClick={handleOnClick('title')}>{title}</div>
      ) : (
        <div>
          <span onClick={handleOnClick('points')}>{title.points}</span>
          <span>/</span>
          <span onClick={handleOnClick('count')}>{title.count}</span>
        </div>
      )}
    </StyledTitleCell>
  );
};

export default StatTitleCell;
