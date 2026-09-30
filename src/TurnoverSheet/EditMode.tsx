import styled from 'styled-components';
import { update, prop, prepend, remove } from 'ramda';
import PlayerSelector from './PlayerSelector';
import TurnoverCategoriesSelector from './TurnoverCategoriesSelector';
import { TurnoverCategoriesType, StatHistoryType } from './types';
import { TURNOVER_CATEGORIES_NAME, TURNOVER_SUB_CATEGORIES_NAME } from './constants';

const StyledEditModeRoot = styled.section`
  text-align: center;
  padding-bottom: 28px;
`;

const StyledList = styled.ul`
  padding: 0;
  list-style-type: none;
  max-height: 170px;
  overflow: auto;
`;

const DeleteHistoryBtn = styled.button`
  margin-left: 4px;
  cursor: pointer;
`;

interface Props {
  playerList: string[];
  statHistory: StatHistoryType[];
  setTurnoverData: React.Dispatch<React.SetStateAction<TurnoverCategoriesType[]>>;
  setStatHistory: React.Dispatch<React.SetStateAction<StatHistoryType[]>>;
}

const EditMode: React.FC<Props> = ({ playerList, statHistory, setTurnoverData, setStatHistory }: Props) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { playerName, turnoverCategory, turnoverSubCategory } = event.target as HTMLFormElement;

    if (turnoverSubCategory && turnoverSubCategory.value === 'lostPoints') {
      const inputLostPoints = prompt('失分', '2');
      const resolvedLostPoints = inputLostPoints ? parseInt(inputLostPoints, 10) : 0;

      setTurnoverData((prev) => {
        const index = prev.findIndex((row) => row.playerName === playerName.value);
        const targetPlayer = prop(turnoverCategory.value, prev[index]);
        const targetNumber = prop(turnoverSubCategory.value, targetPlayer);
        const newData = {
          ...prev[index],
          [turnoverCategory.value]: {
            ...targetPlayer,
            directTrans: targetPlayer.directTrans + 1,
            [turnoverSubCategory.value]: targetNumber + resolvedLostPoints,
          },
          totalTurnovers: prev[index]['totalTurnovers'] + 1,
          totalLostPoints: prev[index]['totalLostPoints'] + resolvedLostPoints,
        };

        return update(index, newData, prev);
      });

      setStatHistory(
        prepend(
          {
            playerName: playerName.value,
            turnoverCategory: turnoverCategory.value,
            turnoverSubCategory: turnoverSubCategory ? turnoverSubCategory.value : undefined,
            value: resolvedLostPoints,
          },
          statHistory,
        ),
      );
    } else {
      setTurnoverData((prev) => {
        const index = prev.findIndex((row) => row.playerName === playerName.value);
        const targetPlayer = prop(turnoverCategory.value, prev[index]);
        let newData;

        if (!turnoverSubCategory) {
          newData = {
            ...prev[index],
            [turnoverCategory.value]: targetPlayer + 1,
            totalTurnovers: prev[index]['totalTurnovers'] + 1,
          };

          return update(index, newData, prev);
        }

        const targetNumber = prop(turnoverSubCategory.value, targetPlayer);

        newData = {
          ...prev[index],
          [turnoverCategory.value]: {
            ...targetPlayer,
            [turnoverSubCategory.value]: targetNumber + 1,
          },
          totalTurnovers: prev[index]['totalTurnovers'] + 1,
        };

        return update(index, newData, prev);
      });

      setStatHistory(
        prepend(
          {
            playerName: playerName.value,
            turnoverCategory: turnoverCategory.value,
            turnoverSubCategory: turnoverSubCategory ? turnoverSubCategory.value : undefined,
            value: 1,
          },
          statHistory,
        ),
      );
    }
  };

  const handleClick = (stat: StatHistoryType, index: number) => (): void => {
    if (window.confirm('確定要刪除此紀錄嗎？')) {
      const { playerName, turnoverCategory, turnoverSubCategory, value } = stat;

      setTurnoverData((prev) => {
        const index = prev.findIndex((row) => row.playerName === playerName);
        const targetPlayer = prop(turnoverCategory, prev[index]);
        let newData;

        if (typeof targetPlayer === 'number') {
          newData = {
            ...prev[index],
            [turnoverCategory]: targetPlayer - 1,
            totalTurnovers: prev[index]['totalTurnovers'] - 1,
          };

          return update(index, newData, prev);
        }

        if (turnoverSubCategory) {
          const targetNumber = prop(turnoverSubCategory, targetPlayer);

          newData =
            turnoverSubCategory === 'lostPoints'
              ? {
                  ...prev[index],
                  [turnoverCategory]: {
                    ...targetPlayer,
                    directTrans: targetPlayer.directTrans - 1,
                    lostPoints: targetPlayer.lostPoints - value,
                  },
                  totalTurnovers: prev[index]['totalTurnovers'] - 1,
                }
              : {
                  ...prev[index],
                  [turnoverCategory]: {
                    ...targetPlayer,
                    [turnoverSubCategory]: targetNumber - 1,
                  },
                  totalTurnovers: prev[index]['totalTurnovers'] - 1,
                };

          return update(index, newData, prev);
        }

        return prev;
      });

      setStatHistory((prev) => remove(index, 1, prev));
    }
  };

  return (
    <StyledEditModeRoot>
      <form onSubmit={handleSubmit}>
        {playerList && <PlayerSelector playerList={playerList} />}
        <TurnoverCategoriesSelector />
        <input type="submit" value="送出" />
      </form>
      {statHistory && (
        <StyledList>
          {statHistory.map(({ playerName, turnoverCategory, turnoverSubCategory, value }, index) => (
            <li key={`history-#${index}`}>
              <span>
                {turnoverSubCategory
                  ? `#${playerName}: ${TURNOVER_CATEGORIES_NAME[turnoverCategory]} -> ${TURNOVER_SUB_CATEGORIES_NAME[turnoverSubCategory]}: ${value}`
                  : `#${playerName}: ${TURNOVER_CATEGORIES_NAME[turnoverCategory]}`}
              </span>
              <DeleteHistoryBtn
                onClick={handleClick({ playerName, turnoverCategory, turnoverSubCategory, value }, index)}
              >
                X
              </DeleteHistoryBtn>
            </li>
          ))}
        </StyledList>
      )}
    </StyledEditModeRoot>
  );
};

export default EditMode;
