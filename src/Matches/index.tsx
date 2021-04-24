import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MatchType } from './types';

const Matches: React.FC = () => {
  const { isLoading, error, data: matches } = useQuery<MatchType[]>('matches', () =>
    fetch('http://localhost:8080/matches').then((res) => res.json()),
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{`An error has occurred: ${error}`}</div>;

  if (!matches) return <div>暫無資料</div>;

  return (
    <div>
      <div>
        <Link to="/match/add">
          <button>新增比賽</button>
        </Link>
      </div>
      {matches.length > 0 && (
        <ul>
          {matches.map(({ _id, type, name, date }) => (
            <li key={`match-${_id}`}>
              <Link to={`/match/show/${_id}`}>
                <div>{name}</div>
                <div>{type}</div>
                <div>{date}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Matches;