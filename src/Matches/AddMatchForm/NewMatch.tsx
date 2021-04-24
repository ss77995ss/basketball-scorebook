import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TeamType } from '../types';

type MatchType = {
  type: string;
  name: string;
  homeTeamId: string;
  awayTeamId: string;
  date: Date;
};

const StyledSection = styled.section`
  text-align: center;
`;

const NewMatch: React.FC<{ teams: TeamType[] }> = ({ teams }: { teams: TeamType[] }) => {
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const { isLoading, isError, mutate } = useMutation(
    (formData: MatchType) =>
      fetch('http://localhost:8080/matches', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        history.push('/matches');
      },
    },
  );
  const { register, handleSubmit } = useForm();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Something went wrong</div>;

  if (!teams) return null;

  const onSubmit = (newMatch: MatchType): void => {
    if (window.confirm(`新增新比賽： ${newMatch.name}？`)) {
      mutate({
        ...newMatch,
        date: startDate,
      });
    }
  };

  return (
    <StyledSection>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="type">賽事類型：</label>
          <input ref={register} name="type" />
        </div>
        <div>
          <label htmlFor="name">比賽名稱：</label>
          <input ref={register} name="name" />
        </div>
        <div>
          <label htmlFor="homeTeamId">主隊：</label>
          <select ref={register} name="homeTeamId">
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="awayTeamId">客隊：</label>
          <select ref={register} name="awayTeamId">
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">日期：</label>
          <DatePicker name="date" selected={startDate} onChange={(date: Date) => setStartDate(date)} />
        </div>
        <div>
          <label htmlFor="matchModeBA">基本紀錄</label>
          <input id="matchModeBA" type="radio" name="mode" value="basic" checked />
          <label htmlFor="matchModeAD">進階紀錄</label>
          <input id="matchModeAD" type="radio" name="mode" value="advanced" />
        </div>
        <button type="submit">送出</button>
      </form>
    </StyledSection>
  );
};

export default NewMatch;