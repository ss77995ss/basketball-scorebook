import styled from 'styled-components';
import TurnoverCell from './TurnoverCell';
import { TurnoverCategoriesType } from './types';
import { initialSingleData } from './constants';

interface Props {
  turnoverData: TurnoverCategoriesType[];
}

const StyledRow = styled.tr`
  li {
    border-bottom: 1px solid black;
  }

  :first-child {
    border-bottom: none;
  }
`;

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

    @media (max-width: 1119px) {
      font-size: 10px;
    }
  }
`;

const TurnoverTotalRow: React.FC<Props> = ({ turnoverData }: Props) => {
  const turnoverTotalList = turnoverData.reduce((list, values) => {
    return {
      ...list,
      drop: {
        directTrans: list.drop.directTrans + values.drop.directTrans,
        deadBall: list.drop.deadBall + values.drop.deadBall,
        lostPoints: list.drop.lostPoints + values.drop.lostPoints,
      },
      nonOffensivePass: {
        directTrans: list.nonOffensivePass.directTrans + values.nonOffensivePass.directTrans,
        deadBall: list.nonOffensivePass.deadBall + values.nonOffensivePass.deadBall,
        lostPoints: list.nonOffensivePass.lostPoints + values.nonOffensivePass.lostPoints,
      },
      offensivePass: {
        directTrans: list.offensivePass.directTrans + values.offensivePass.directTrans,
        deadBall: list.offensivePass.deadBall + values.offensivePass.deadBall,
        lostPoints: list.offensivePass.lostPoints + values.offensivePass.lostPoints,
      },
      paintPass: {
        directTrans: list.paintPass.directTrans + values.paintPass.directTrans,
        deadBall: list.paintPass.deadBall + values.paintPass.deadBall,
        lostPoints: list.paintPass.lostPoints + values.paintPass.lostPoints,
      },
      others: list.others + values.others,
      totalTurnovers: list.totalTurnovers + values.totalTurnovers,
      totalLostPoints: list.totalLostPoints + values.totalLostPoints,
    };
  }, initialSingleData);

  return (
    <StyledRow>
      {Object.keys(turnoverTotalList).map((key) => {
        switch (key) {
          case 'drop':
          case 'nonOffensivePass':
          case 'offensivePass':
          case 'paintPass':
            return (
              <StyledCells key={key}>
                <TurnoverCell value={turnoverTotalList[key]} />
              </StyledCells>
            );
          case 'playerName':
          case 'others':
          case 'totalTurnovers':
          case 'totalLostPoints':
            return (
              <StyledCells key={key}>
                <span>{turnoverTotalList[key]}</span>
              </StyledCells>
            );
          default:
            throw new Error('Invalid key');
        }
      })}
    </StyledRow>
  );
};

export default TurnoverTotalRow;
