import { Row } from 'react-table';
import { StatType } from './types';
import { getTotalWithCount } from './utils';
import { StyledCell } from '../styles';

interface Props {
  row: Row<StatType>;
}

const TotalCellWithCount: React.FC<Props> = ({ row }: Props) => {
  return (
    <StyledCell readOnly>
      <span>{getTotalWithCount(row.values)}</span>
    </StyledCell>
  );
};

export default TotalCellWithCount;
