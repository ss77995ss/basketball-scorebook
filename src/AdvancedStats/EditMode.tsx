import { useState } from 'react';
import styled from 'styled-components';
import StatsTable from './StatsTable';
import { TableNavigations } from './TableNavigations';

const StyledEditModeRoot = styled.div`
  text-align: center;
  padding-bottom: 28px;
`;

const StyledChangeTeamNameButton = styled.div`
  margin-top: 4px;

  button {
    margin-right: 4px;
  }
`;

interface Props {
  teamName: {
    HOME: string;
    AWAY: string;
  };
  setTeamName: React.Dispatch<
    React.SetStateAction<{
      HOME: string;
      AWAY: string;
    }>
  >;
}

const EditMode: React.FC<Props> = ({ teamName, setTeamName }: Props) => {
  const [team, setTeam] = useState<keyof typeof teamName>('HOME');
  const { HOME, AWAY } = teamName;

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'HOME' || event.target.value === 'AWAY') {
      setTeam(event.target.value);
    } else {
      throw new Error('Something went wrong');
    }
  };

  const handleClick = (): void => {
    const newTeamName = prompt('請輸入新的隊伍名稱', teamName[team]) || teamName[team];
    setTeamName((prev) => ({
      ...prev,
      [team]: newTeamName,
    }));
  };

  // Remove temporary. Bring back after save system is done
  // const handleReset = (): void => {
  //   statsDispatch({ type: 'RESET' });
  // };

  return (
    <StyledEditModeRoot>
      <input type="radio" id="home" name="team" value="HOME" onChange={handleCheck} defaultChecked />
      <label htmlFor="home">{HOME}</label>
      <input type="radio" id="away" name="team" value="AWAY" onChange={handleCheck} />
      <label htmlFor="away">{AWAY}</label>
      <StyledChangeTeamNameButton>
        <button onClick={handleClick}>變更選取隊伍名稱</button>
      </StyledChangeTeamNameButton>
      <TableNavigations />
      <StatsTable team={team === 'HOME' ? 'home' : 'away'} />
    </StyledEditModeRoot>
  );
};

export default EditMode;
