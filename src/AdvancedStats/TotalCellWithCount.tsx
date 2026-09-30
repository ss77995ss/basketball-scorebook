import { StatType } from './types';
import { getTotalWithCount } from './utils';
import { StyledCell } from '../styles';

interface Props {
  row: StatType;
}

const TotalCellWithCount: React.FC<Props> = ({ row }: Props) => {
  return (
    <StyledCell $readOnly>
      <span>{getTotalWithCount(row)}</span>
    </StyledCell>
  );
};

export default TotalCellWithCount;
