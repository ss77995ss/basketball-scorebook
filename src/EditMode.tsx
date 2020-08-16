import React, { useState } from 'react';
import StatsTable from './StatsTable';

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
    setTeamName(prev => ({
      ...prev,
      [team]: newTeamName,
    }));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <input type="radio" id="home" name="team" value="HOME" onChange={handleCheck} defaultChecked />
      <label htmlFor="home">{HOME}</label>
      <input type="radio" id="away" name="team" value="AWAY" onChange={handleCheck} />
      <label htmlFor="away">{AWAY}</label>
      <p onClick={handleClick}>{`Current: ${teamName[team]}`}</p>
      <StatsTable team={team === 'HOME' ? 'home' : 'away'} />
    </div>
  );
};

export default EditMode;
