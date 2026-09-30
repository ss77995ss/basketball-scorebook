import { StyledCell } from '../styles';
import { StatType } from './types';

interface Props {
  value: StatType['q1'];
}

const ReadOnlyCell: React.FC<Props> = ({ value }: Props) => {
  return (
    <StyledCell $readOnly>
      {typeof value === 'number' ? (
        <span>{value}</span>
      ) : (
        <>
          <span>{value.points}</span>
          <hr />
          <span>{value.count}</span>
        </>
      )}
    </StyledCell>
  );
};

export default ReadOnlyCell;
