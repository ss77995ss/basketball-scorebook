import { ReactElement, useState } from 'react';
import { Cell, useTable } from '@tanstack/react-table';
import { features } from '../tableFeatures';
import { StyledTable } from '../styles';
import { useStatsState } from './hooks/statData';
import { StatType } from './types';
import { STAT_TYPE } from './constants';
import StatCell from './StatCell';
import StatCellWithCount from './StatCellWithCount';
import StatTitleCell from './StatTitleCell';
import TotalCell from './TotalCell';
import TotalCellWithCount from './TotalCellWithCount';
import ReadOnlyCell from './ReadOnlyCell';

type StatCellType = Cell<typeof features, StatType, unknown>;
type QuarterValue = StatType['q1'];

const renderCell: (quarter: string, team: string, cell: StatCellType) => ReactElement | null | undefined = (
  quarter,
  team,
  cell,
) => {
  const { statInfo } = cell.row.original;
  const rowIndex = cell.row.index;
  const columnId = cell.column.id;

  switch (cell.column.columnDef.header) {
    case '項目':
      return <StatTitleCell statInfo={statInfo} rowIndex={rowIndex} columnId={columnId} />;
    case '總計':
      return statInfo.type === STAT_TYPE.POINTS_AND_COUNT ? (
        <TotalCellWithCount row={cell.row.original} />
      ) : (
        <TotalCell row={cell.row.original} />
      );
    default: {
      const value = cell.getValue() as QuarterValue;

      if (columnId !== quarter) return <ReadOnlyCell value={value} />;

      return statInfo.type === STAT_TYPE.POINTS_AND_COUNT ? (
        <StatCellWithCount
          value={value as { count: number; points: number }}
          rowIndex={rowIndex}
          columnId={columnId}
          team={team}
          isSwipeable={statInfo.isSwipeable}
        />
      ) : (
        <StatCell value={value as number} rowIndex={rowIndex} columnId={columnId} team={team} />
      );
    }
  }
};

interface Props {
  team: string;
}

const StatTable: React.FC<Props> = ({ team }: Props) => {
  const [quarter, setQuarter] = useState('q1');
  const { columns, home, away } = useStatsState();
  const data = team === 'home' ? home : away;
  const table = useTable({ features, columns, data });

  return (
    <StyledTable>
      <h3>+/- by direction Up: +3, Down: -3, Left: -2, Right: +2, Click: +1, DoubleClick: -1</h3>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const label = header.column.columnDef.header;
                const isQuarter = label !== '項目' && label !== '總計';

                return (
                  <th
                    key={header.id}
                    style={isQuarter ? { cursor: 'pointer' } : undefined}
                    onClick={isQuarter ? (): void => setQuarter(header.column.id) : undefined}
                  >
                    <table.FlexRender header={header} />
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>{renderCell(quarter, team, cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </StyledTable>
  );
};

export default StatTable;
