import { useState } from 'react';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';
import EditMode from './EditMode';
import StatsTable from './StatsTable';
import { Game, Possession } from './types';

const StyledRoot = styled.section`
  text-align: center;
  padding-bottom: 28px;

  > div button,
  > div select {
    margin: 8px;
  }
`;

// ponytail: history lives in localStorage for now; Game is shaped to become a Supabase row later
const DefenseSheet: React.FC = () => {
  const [games = [], setGames] = useLocalStorage<Game[]>('defenseGames', []);
  const [gameId, setGameId] = useLocalStorage<string>('defenseGameId', '');
  const [mode, setMode] = useState('編輯');
  // undefined until the first game is created; the annotation makes TS enforce the guards below
  const game: Game | undefined = games.find(({ id }) => id === gameId) ?? games[0];

  const handleNewGame = (): void => {
    const name = prompt('輸入對手名稱');
    if (name === null) return;

    const newGame = {
      id: Date.now().toString(36),
      name: name || '對手',
      createdAt: new Date().toISOString(),
      possessions: [],
    };

    setGames([newGame, ...games]);
    setGameId(newGame.id);
  };

  const handleDeleteGame = (): void => {
    if (!game || !window.confirm(`確定要刪除 vs ${game.name} 的紀錄嗎？`)) return;

    setGames(games.filter(({ id }) => id !== game.id));
    setGameId('');
  };

  const setPossessions = (possessions: Possession[]): void =>
    setGames(games.map((item) => (item.id === game?.id ? { ...item, possessions } : item)));

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void =>
    setMode(event.currentTarget.value);

  return (
    <StyledRoot>
      <div>
        {game && (
          <select value={game.id} onChange={(event): void => setGameId(event.target.value)}>
            {games.map(({ id, name, createdAt }) => (
              <option key={id} value={id}>
                {`${new Date(createdAt).toLocaleDateString('zh-TW')} vs ${name}`}
              </option>
            ))}
          </select>
        )}
        <button type="button" onClick={handleNewGame}>
          新比賽
        </button>
        {game && (
          <button type="button" onClick={handleDeleteGame}>
            刪除比賽
          </button>
        )}
      </div>
      {game ? (
        <>
          <div>
            <button type="button" value="編輯" onClick={handleClick}>
              編輯
            </button>
            <button type="button" value="檢視" onClick={handleClick}>
              檢視
            </button>
          </div>
          {mode === '編輯' ? (
            <EditMode key={game.id} possessions={game.possessions} setPossessions={setPossessions} />
          ) : (
            <StatsTable possessions={game.possessions} />
          )}
        </>
      ) : (
        <p>尚無比賽紀錄，按「新比賽」開始</p>
      )}
    </StyledRoot>
  );
};

export default DefenseSheet;
