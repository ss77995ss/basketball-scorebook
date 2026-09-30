import { ReactElement } from 'react';
import { Cell, useTable } from '@tanstack/react-table';
import styled from 'styled-components';
import { features } from '../tableFeatures';
import { StyledTable } from '../styles';
import { columns } from './constants';
import { TurnoverCategoriesType, TurnoverSubCategoriesType } from './types';
import TurnoverCategoriesHeader from './TurnoverCategoriesHeader';
import TurnoverCell from './TurnoverCell';
import TurnoverTotalRow from './TurnoverTotalRow';

const StyledCells = styled.td`
  font-size: 12px;
  padding: 0;

  :nth-child(2),
  :nth-child(3),
  :nth-child(4),
  :nth-child(5) {
    border-right: 1px solid black;
    border-left: 1px solid black;
  }

  :nth-child(6) {
    border-left: 1px solid black;
  }

  span,
  li {
    padding: 4px 8px;

    @media (max-width: 1152x) {
      font-size: 10px;
    }

    @media (max-width: 800px) {
      font-size: 8px;
    }
  }
`;

const StyledHeader = styled.th<{ $isTurnoverCategoriesHeader: boolean }>`
  padding: ${(props): string | number => (props.$isTurnoverCategoriesHeader ? 0 : '4px')};

  :nth-child(2),
  :nth-child(3),
  :nth-child(4),
  :nth-child(5) {
    border-right: 1px solid black;
    border-left: 1px solid black;
    border-top: 1px solid black;
  }

  :nth-child(6) {
    border-left: 1px solid black;
  }

  @media (max-width: 1152px) {
    font-size: 10px;
  }
`;

const renderCell: (cell: Cell<typeof features, TurnoverCategoriesType, unknown>) => ReactElement | null | undefined = (
  cell,
) => {
  switch (cell.column.columnDef.header) {
    case '名字':
    case '其他失誤':
    case '總計次數':
    case '總失分':
      return <span>{cell.getValue() as string | number}</span>;
    default:
      return <TurnoverCell value={cell.getValue() as TurnoverSubCategoriesType} />;
  }
};

interface Props {
  turnoverData: TurnoverCategoriesType[];
}

const DisplayTable: React.FC<Props> = ({ turnoverData }: Props) => {
  const table = useTable({ features, columns, data: turnoverData });

  return (
    <StyledTable>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const label = header.column.columnDef.header;
                const isTurnoverCategoriesHeader =
                  label === 'Drop' || label === '非攻擊性傳球' || label === '攻擊性傳球' || label === '禁區傳球';

                return (
                  <StyledHeader key={header.id} $isTurnoverCategoriesHeader={isTurnoverCategoriesHeader}>
                    {isTurnoverCategoriesHeader ? (
                      <TurnoverCategoriesHeader passType={String(label)} />
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </StyledHeader>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <StyledCells key={cell.id}>{renderCell(cell)}</StyledCells>
              ))}
            </tr>
          ))}
          <TurnoverTotalRow turnoverData={turnoverData} />
        </tbody>
      </table>
    </StyledTable>
  );
};

export default DisplayTable;
