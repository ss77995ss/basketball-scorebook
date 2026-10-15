import { useState } from 'react';
import styled from 'styled-components';
import { StyledTable } from '../styles';
import { DEFENSE_KEYS, DEFENSE_TYPES, PERIODS, RESULTS } from './constants';
import { DefenseKey, Period, Possession } from './types';
import { findThreeStops } from './utils';

const StyledEditModeRoot = styled.section`
  fieldset {
    border: 0;
    margin: 0 0 8px;
    padding: 0;
  }

  legend {
    width: 100%;
    font-weight: bold;
    margin-bottom: 4px;
  }

  /* radios and result buttons share the pill; for radios the whole label is the tap target, the native input stays for a11y */
  label,
  fieldset button {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    margin: 4px;
    padding: 0 16px;
    border: 1px solid #999;
    border-radius: 22px;
    background: white;
    color: inherit;
    font: inherit;
    cursor: pointer;
    user-select: none;
  }

  fieldset button:active {
    background: #3b5bdb;
    border-color: #3b5bdb;
    color: white;
  }

  label:has(input:checked) {
    background: #3b5bdb;
    border-color: #3b5bdb;
    color: white;
    font-weight: bold;
  }

  label:has(input:focus-visible) {
    outline: 2px solid #3b5bdb;
    outline-offset: 2px;
  }

  input[type='radio'] {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  button {
    margin: 4px;
  }
`;

const StyledLogTable = styled(StyledTable)`
  overflow-x: auto;
  margin: 16px 16px 0;

  th,
  td {
    padding: 10px 14px;
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 10px;
    border: 2px solid;
    border-radius: 16px;
  }

  li[data-scored='false'] {
    background: #edf2ff;
    border-color: #3b5bdb;
    color: #1c3a9e;
  }

  li[data-scored='true'] {
    background: #fff0f0;
    border-color: #e03131;
    color: #a51111;
  }

  li[data-contested='false'] {
    border-style: dashed;
    background: transparent;
  }

  /* highlighter stroke over the chip, like the yellow marker on the paper sheet */
  li[data-stop]::after {
    content: '';
    position: absolute;
    top: 20%;
    bottom: 20%;
    left: 0;
    right: 0;
    background: rgb(255 212 59 / 0.6);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  li[data-stop='mid']::after {
    right: -6px; /* = ul gap, joins the next chip's stroke */
  }

  li button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgb(0 0 0 / 0.08);
    color: inherit;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  li button:hover {
    background: rgb(0 0 0 / 0.18);
  }

  small {
    display: block;
    margin-top: 8px;
  }
`;

interface Props {
  possessions: Possession[];
  setPossessions: (possessions: Possession[]) => void;
}

const EditMode: React.FC<Props> = ({ possessions, setPossessions }: Props) => {
  const last = possessions[possessions.length - 1];
  const [period, setPeriod] = useState<Period>(last?.period ?? 'Q1');
  const [defense, setDefense] = useState<DefenseKey>(last?.defense ?? 'soft');
  const [contested, setContested] = useState(true);

  const handleRecord = (result: string, points: number) => (): void =>
    setPossessions([...possessions, { period, defense, result, points, contested }]);

  const handleDelete = (target: Possession) => (): void => {
    if (window.confirm('確定要刪除此紀錄嗎？'))
      setPossessions(possessions.filter((possession) => possession !== target));
  };

  return (
    <StyledEditModeRoot>
      <fieldset>
        <legend>節次</legend>
        {PERIODS.map((value) => (
          <label key={value}>
            <input type="radio" name="period" checked={period === value} onChange={(): void => setPeriod(value)} />
            {value}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>防守類型</legend>
        {DEFENSE_KEYS.map((key) => (
          <label key={key}>
            <input type="radio" name="defense" checked={defense === key} onChange={(): void => setDefense(key)} />
            {DEFENSE_TYPES[key].label}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>是否有守到</legend>
        <label>
          <input type="radio" name="contested" checked={contested} onChange={(): void => setContested(true)} />有
        </label>
        <label>
          <input type="radio" name="contested" checked={!contested} onChange={(): void => setContested(false)} />無
        </label>
      </fieldset>
      <fieldset>
        <legend>出手結果（點選即記錄）</legend>
        {RESULTS.map(({ label, points }) => (
          <button key={label} type="button" onClick={handleRecord(label, points)}>
            {label}
          </button>
        ))}
      </fieldset>
      <button
        type="button"
        disabled={!possessions.length}
        onClick={(): void => setPossessions(possessions.slice(0, -1))}
      >
        復原上一波
      </button>
      <StyledLogTable>
        <table>
          <thead>
            <tr>
              <th>節次</th>
              <th>每波紀錄</th>
              <th>3 stop</th>
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((value) => {
              const list = possessions.filter((possession) => possession.period === value);
              const stops = findThreeStops(list);

              return (
                <tr key={value}>
                  <td>{value}</td>
                  <td>
                    <ul>
                      {list.map((possession, index) => {
                        const group = stops.find((indices) => indices.includes(index));

                        return (
                          <li
                            key={index}
                            data-scored={possession.points > 0}
                            data-contested={possession.contested}
                            // 'mid' strokes reach across the gap to the next chip; 'end' stops so back-to-back 3 stops stay apart
                            data-stop={group && (index === group.at(-1) ? 'end' : 'mid')}
                          >
                            {`${index + 1}. ${DEFENSE_TYPES[possession.defense].code}/${possession.result}/${possession.points}${possession.contested ? '' : '*'}`}
                            <button
                              type="button"
                              aria-label={`刪除第 ${index + 1} 波`}
                              onClick={handleDelete(possession)}
                            >
                              ×
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td>{stops.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <small>紅色 = 被得分，藍色 = 沒被得分；虛線空心 * = 沒守到；黃色螢光線 = 3 stop</small>
      </StyledLogTable>
    </StyledEditModeRoot>
  );
};

export default EditMode;
