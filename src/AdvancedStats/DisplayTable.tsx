import { Cell, useTable } from '@tanstack/react-table';
import { features } from '../tableFeatures';
import { StyledTable } from '../styles';
import { useStatsState } from './hooks/statData';
import { STAT_TYPE } from './constants';
import { getTotal, getTotalWithCount } from './utils';
import { StyledDisplayCell } from '../styles';
import { StatType } from './types';

const renderCell: (cell: Cell<typeof features, StatType, unknown>) => React.ReactNode = (cell) => {
  const { statInfo } = cell.row.original;

  switch (cell.column.columnDef.header) {
    case '項目':
      return (
        <>
          <div id={statInfo.linkName}>{statInfo.name}</div>
          <div>
            {typeof statInfo.title === 'object' ? `${statInfo.title.points}/${statInfo.title.count}` : statInfo.title}
          </div>
        </>
      );
    case '總計':
      return statInfo.type === STAT_TYPE.POINTS_AND_COUNT
        ? getTotalWithCount(cell.row.original)
        : getTotal(cell.row.original);
    default: {
      const value = cell.getValue() as StatType['q1'];

      return typeof value === 'object' ? `${value.points} / ${value.count}` : value;
    }
  }
};

interface Props {
  team: string;
  teamName: string;
  filterValue: string;
}

const DisplayTable: React.FC<Props> = ({ team, teamName, filterValue }: Props) => {
  const { columns, home, away } = useStatsState();
  const data = team === 'home' ? home : away;
  const resolvedData = data.filter((stat) => stat.statInfo.name === filterValue);
  const table = useTable({ features, columns, data: filterValue ? resolvedData : data });

  return (
    <StyledTable>
      <p>{`紀錄球隊：${teamName}`}</p>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <table.FlexRender header={header} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <StyledDisplayCell>{renderCell(cell)}</StyledDisplayCell>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </StyledTable>
  );
};

export default DisplayTable;
