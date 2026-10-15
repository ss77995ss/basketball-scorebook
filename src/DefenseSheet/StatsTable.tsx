import { useState } from 'react';
import styled from 'styled-components';
import { StyledTable } from '../styles';
import { DEFENSE_KEYS, DEFENSE_TYPES, PERIODS } from './constants';
import { Possession } from './types';
import { STAT_LABELS, summarize } from './utils';

const StyledStatsTable = styled(StyledTable)`
  overflow-x: auto;

  th,
  td {
    padding: 4px 8px;
    white-space: nowrap;
  }
`;

const COLUMN_LABELS = [...DEFENSE_KEYS.map((key) => DEFENSE_TYPES[key].label), '全場'];

const summarizeColumns = (list: Possession[]): Array<Array<number | string>> => [
  ...DEFENSE_KEYS.map((key) => summarize(list.filter((possession) => possession.defense === key))),
  summarize(list),
];

interface Props {
  possessions: Possession[];
}

const StatsTable: React.FC<Props> = ({ possessions }: Props) => {
  const [view, setView] = useState('全部');
  const sections = [
    { label: '總和', list: possessions },
    ...PERIODS.map((period) => ({
      label: period,
      list: possessions.filter((possession) => possession.period === period),
    })),
  ];
  const views = ['全部', ...sections.map(({ label }) => label)];

  // fragment so the buttons sit directly under DefenseSheet's root and pick up its aria-pressed style
  return (
    <>
      <div>
        {views.map((value) => (
          <button key={value} type="button" aria-pressed={view === value} onClick={(): void => setView(value)}>
            {value}
          </button>
        ))}
      </div>
      <StyledStatsTable>
        <table>
          <thead>
            <tr>
              <th colSpan={2} />
              {COLUMN_LABELS.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sections
              .filter(({ label }) => view === '全部' || view === label)
              .map(({ label, list }) => {
                const columns = summarizeColumns(list);

                return STAT_LABELS.map((statLabel, row) => (
                  <tr key={`${label}-${row}`}>
                    {row === 0 && (
                      <th scope="rowgroup" rowSpan={STAT_LABELS.length}>
                        {label}
                      </th>
                    )}
                    <th scope="row">{statLabel}</th>
                    {columns.map((values, column) => (
                      <td key={column}>{values[row]}</td>
                    ))}
                  </tr>
                ));
              })}
          </tbody>
        </table>
      </StyledStatsTable>
    </>
  );
};

export default StatsTable;
