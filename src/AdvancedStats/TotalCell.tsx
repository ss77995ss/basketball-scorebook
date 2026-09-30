import { StatType } from './types';
import { getTotal } from './utils';
import { StyledCell } from '../styles';

interface Props {
  row: StatType;
}

const TotalCell: React.FC<Props> = ({ row }: Props) => {
  return (
    <StyledCell $readOnly>
      <span>{getTotal(row)}</span>
    </StyledCell>
  );
};

export default TotalCell;
