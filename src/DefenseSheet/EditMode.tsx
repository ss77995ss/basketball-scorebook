import { useState } from 'react';
import styled from 'styled-components';
import { StyledTable } from '../styles';
import { DEFENSE_ROWS, DEFENSE_TYPES, PERIODS, RESULT_GROUPS } from './constants';
import { DefenseKey, Period, Possession } from './types';
import { findThreeStops } from './utils';

const StyledEditModeRoot = styled.section`
  /* the controls; the log table sits below them */
  > div:first-child {
    text-align: left;
    padding: 0 16px;
  }

  /* landscape tablet: selections on the left, result buttons on the right, so the log stays in view */
  @media (min-width: 900px) and (orientation: landscape) {
    > div:first-child {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 16px;
    }
  }

  fieldset {
    margin: 0 0 12px;
    padding: 8px;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    background: #f8f9fa;
  }

  /* browsers draw the legend across the card's top edge, so style it as a tag sitting there */
  legend {
    padding: 2px 10px;
    border-radius: 999px;
    background: #495057;
    color: white;
    font-size: 0.875em;
    font-weight: bold;
  }

  legend[data-editing='true'] {
    background: #f08c00;
  }

  /* every row splits its width evenly, however many keys it has */
  fieldset > div {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: 6px;
  }

  fieldset > div + div {
    margin-top: 6px;
  }

  /* radios and result buttons share the key; for radios the whole label is the tap target, the native input stays for a11y */
  label,
  fieldset button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    margin: 0;
    padding: 0 8px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    text-align: center;
    background: white;
    color: inherit;
    font: inherit;
    cursor: pointer;
    user-select: none;
  }

  fieldset button[data-scored='true'] {
    background: #fff0f0;
    border-color: #e03131;
    color: #a51111;
  }

  fieldset button[data-scored='false'] {
    background: #edf2ff;
    border-color: #3b5bdb;
    color: #1c3a9e;
  }

  fieldset button[data-scored='true']:active {
    background: #e03131;
    color: white;
  }

  fieldset button[data-scored='false']:active {
    background: #3b5bdb;
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

  /* undo / cancel edit: a full-width secondary key under the result card */
  fieldset + button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    min-height: 36px;
    margin: 0;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background: white;
    color: #495057;
    font: inherit;
    cursor: pointer;
  }

  fieldset + button small {
    color: #868e96;
    font-size: 0.875em;
  }

  fieldset + button:active {
    background: #e9ecef;
  }

  fieldset + button:disabled {
    opacity: 0.4;
    cursor: default;
  }

  fieldset + button[data-editing='true'] {
    border-color: #f08c00;
    color: #e8590c;
    font-weight: bold;
  }
`;

const StyledLogTable = styled(StyledTable)`
  overflow-x: auto;
  margin: 12px 16px 0;

  /* fill the page width; 節次 and 3 stop shrink to their content so the log column gets the rest */
  table {
    width: 100%;
  }

  th:first-child,
  th:last-child {
    width: 1%;
    white-space: nowrap;
  }

  /* gray, so it never reads as the red/blue chips or the yellow 3 stop stroke */
  tr[data-current='true'] {
    background: #f1f3f5;
  }

  tr[data-current='true'] td:first-child {
    font-weight: bold;
  }

  th,
  td {
    padding: 10px 14px;
  }

  /* room for two lines of chips before any are recorded: chip = 24px × button + 4px padding + 2px border, each side */
  ul {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 6px;
    min-height: calc(2 * 36px + 6px);
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

  li[data-editing='true'] {
    outline: 3px solid #f08c00;
    outline-offset: 2px;
  }

  li button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  /* the delete × */
  li button:last-child {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgb(0 0 0 / 0.08);
    font-size: 14px;
    line-height: 1;
  }

  li button:last-child:hover {
    background: rgb(0 0 0 / 0.18);
  }

  small {
    display: block;
    margin-top: 8px;
  }
`;

const describe = ({ defense, result, points, contested }: Possession): string =>
  `${DEFENSE_TYPES[defense].code}/${result}/${points}${contested ? '' : '*'}`;

// the chip being edited, plus the live controls to put back once it is saved or cancelled
type Editing = {
  target: Possession;
  restore: Pick<Possession, 'period' | 'defense' | 'contested'>;
};

interface Props {
  possessions: Possession[];
  setPossessions: (possessions: Possession[]) => void;
}

const EditMode: React.FC<Props> = ({ possessions, setPossessions }: Props) => {
  const last = possessions[possessions.length - 1];
  const [period, setPeriod] = useState<Period>(last?.period ?? 'Q1');
  const [defense, setDefense] = useState<DefenseKey>(last?.defense ?? 'soft');
  const [contested, setContested] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);

  const loadControls = (values: Editing['restore']): void => {
    setPeriod(values.period);
    setDefense(values.defense);
    setContested(values.contested);
  };

  const startEditing = (target: Possession) => (): void => {
    // hopping from chip to chip keeps the first restore, so live recording still comes back
    setEditing({ target, restore: editing?.restore ?? { period, defense, contested } });
    loadControls(target);
  };

  const stopEditing = ({ restore }: Editing): void => {
    loadControls(restore);
    setEditing(null);
  };

  const handleRecord = (result: string, points: number) => (): void => {
    const next = { period, defense, result, points, contested };

    if (editing) {
      setPossessions(possessions.map((possession) => (possession === editing.target ? next : possession)));
      stopEditing(editing);
    } else {
      setPossessions([...possessions, next]);
    }
  };

  const handleDelete = (target: Possession) => (): void => {
    if (!window.confirm('確定要刪除此紀錄嗎？')) return;

    setPossessions(possessions.filter((possession) => possession !== target));
    if (editing?.target === target) stopEditing(editing);
  };

  const editingNumber =
    editing &&
    possessions.filter((possession) => possession.period === editing.target.period).indexOf(editing.target) + 1;

  return (
    <StyledEditModeRoot>
      <div>
        <div>
          <fieldset>
            <legend>節次</legend>
            <div>
              {PERIODS.map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="period"
                    checked={period === value}
                    onChange={(): void => setPeriod(value)}
                  />
                  {value}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>防守類型</legend>
            {DEFENSE_ROWS.map((row, index) => (
              <div key={index}>
                {row.map((key) => (
                  <label key={key}>
                    <input
                      type="radio"
                      name="defense"
                      checked={defense === key}
                      onChange={(): void => setDefense(key)}
                    />
                    {DEFENSE_TYPES[key].label}
                  </label>
                ))}
              </div>
            ))}
          </fieldset>
          <fieldset>
            <legend>是否有守到</legend>
            <div>
              <label>
                <input type="radio" name="contested" checked={contested} onChange={(): void => setContested(true)} />有
              </label>
              <label>
                <input type="radio" name="contested" checked={!contested} onChange={(): void => setContested(false)} />
                無
              </label>
            </div>
          </fieldset>
        </div>
        <div>
          <fieldset>
            <legend data-editing={!!editing}>
              {editing
                ? `修改 ${editing.target.period} 第 ${editingNumber} 波（調整後點出手結果儲存）`
                : '出手結果（點選即記錄）'}
            </legend>
            {RESULT_GROUPS.map((group, index) => (
              <div key={index}>
                {group.map(({ label, points }) => (
                  <button key={label} type="button" data-scored={points > 0} onClick={handleRecord(label, points)}>
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </fieldset>
          {/* undo turns into cancel while editing so it can't drop the chip being edited */}
          <button
            type="button"
            data-editing={!!editing}
            disabled={!editing && !possessions.length}
            onClick={(): void => (editing ? stopEditing(editing) : setPossessions(possessions.slice(0, -1)))}
          >
            {editing ? (
              '✕ 取消修改'
            ) : (
              <>
                ↶ 復原上一波
                {/* last is always the newest of its period, so its number is that period's count */}
                {last && (
                  <small>{`${last.period} 第 ${possessions.filter((possession) => possession.period === last.period).length} 波 ${describe(last)}`}</small>
                )}
              </>
            )}
          </button>
        </div>
      </div>
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
            {/* the selected period leads, the rest keep their order */}
            {[period, ...PERIODS.filter((value) => value !== period)].map((value) => {
              const list = possessions.filter((possession) => possession.period === value);
              const stops = findThreeStops(list);

              return (
                <tr key={value} data-current={value === period}>
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
                            data-editing={possession === editing?.target}
                          >
                            <button type="button" onClick={startEditing(possession)}>
                              {`${index + 1}. ${describe(possession)}`}
                            </button>
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
        <small>紅色 = 被得分，藍色 = 沒被得分；虛線空心 * = 沒守到；黃色螢光線 = 3 stop；點紀錄可修改</small>
      </StyledLogTable>
    </StyledEditModeRoot>
  );
};

export default EditMode;
