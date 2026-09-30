import styled from 'styled-components';
import { StyledSubHeader } from '../styles';
import { TURNOVER_SUB_CATEGORIES_NAME } from './constants';

const StyledMainHeader = styled.section`
  border-bottom: 1px solid black;
  padding: 4px 0;
  width: 220px;

  @media (max-width: 1119px) {
    font-size: 10px;
    width: 150px;
  }
`;

interface Props {
  passType: React.ReactNode;
}

const TurnoverCategoriesHeader: React.FC<Props> = ({ passType }: Props) => {
  const { directTrans, deadBall, lostPoints } = TURNOVER_SUB_CATEGORIES_NAME;
  return (
    <>
      <StyledMainHeader>{passType}</StyledMainHeader>
      <StyledSubHeader>
        <li>{directTrans}</li>
        <li>{deadBall}</li>
        <li>總球數</li>
        <li>{lostPoints}</li>
      </StyledSubHeader>
    </>
  );
};

export default TurnoverCategoriesHeader;
