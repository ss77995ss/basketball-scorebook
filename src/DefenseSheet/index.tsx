import { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import styled from 'styled-components';
import EditMode from './EditMode';
import MatchDrawer from './MatchDrawer';
import StatsTable from './StatsTable';
import { Game } from './types';
import { findResumable } from './utils';

const StyledRoot = styled.section`
  text-align: center;
  padding-bottom: 28px;

  > div > button,
  > div > label {
    margin: 8px;
  }

  > div > button[aria-pressed='true'] {
    background: #3b5bdb;
    border-color: #3b5bdb;
    color: white;
    font-weight: bold;
  }
`;

const newGameId = (): string => Date.now().toString(36);

// ponytail: history lives in localStorage for now; Game is shaped to become a Supabase row later
const DefenseSheet: React.FC = () => {
  const [games = [], setGames] = useLocalStorage<Game[]>('defenseGames', []);
  // coming back mid-game (tab switch, reload, PWA evicted) reopens the match still being recorded;
  // otherwise a fresh match, only saved once something is recorded or named
  const [gameId, setGameId] = useState(() => findResumable(games)?.id ?? newGameId());
  const [mode, setMode] = useState('編輯');

  // keep the tablet awake courtside; the browser drops the lock whenever the tab is hidden, so re-request on return
  useEffect(() => {
    let lock: WakeLockSentinel | undefined;
    const request = (): void => {
      if (document.visibilityState !== 'visible') return;
      // unsupported or refused (e.g. battery saver) just means the screen may sleep as before
      navigator.wakeLock
        ?.request('screen')
        .then((sentinel) => {
          lock = sentinel;
        })
        .catch(() => {});
    };

    request();
    document.addEventListener('visibilitychange', request);
    return (): void => {
      document.removeEventListener('visibilitychange', request);
      lock?.release();
    };
  }, []);

  const game: Game = games.find(({ id }) => id === gameId) ?? { id: gameId, name: '', createdAt: '', possessions: [] };

  const updateGame = (patch: Partial<Game>): void => {
    const updatedAt = new Date().toISOString();
    setGames(
      games.some(({ id }) => id === game.id)
        ? games.map((item) => (item.id === game.id ? { ...item, ...patch, updatedAt } : item))
        : [{ ...game, createdAt: updatedAt, ...patch, updatedAt }, ...games],
    );
  };

  // deleting the open match leaves gameId pointing at nothing, which is just an empty new match
  const handleDeleteGame = (target: Game): void => {
    if (window.confirm(`確定要刪除 vs ${target.name || '對手'} 的紀錄嗎？`))
      setGames(games.filter(({ id }) => id !== target.id));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void =>
    setMode(event.currentTarget.value);

  return (
    <StyledRoot>
      <div>
        <MatchDrawer
          games={games}
          gameId={game.id}
          onSelect={setGameId}
          onNew={(): void => {
            setGameId(newGameId());
            setMode('編輯');
          }}
          onDelete={handleDeleteGame}
        />
        <label>
          vs{' '}
          <input
            placeholder="對手名稱"
            value={game.name}
            onChange={(event): void => updateGame({ name: event.target.value })}
          />
        </label>
      </div>
      <div>
        <button type="button" value="編輯" aria-pressed={mode === '編輯'} onClick={handleClick}>
          編輯
        </button>
        <button type="button" value="檢視" aria-pressed={mode === '檢視'} onClick={handleClick}>
          檢視
        </button>
      </div>
      {mode === '編輯' ? (
        <EditMode
          key={game.id}
          possessions={game.possessions}
          setPossessions={(possessions): void => updateGame({ possessions })}
        />
      ) : (
        <StatsTable possessions={game.possessions} />
      )}
    </StyledRoot>
  );
};

export default DefenseSheet;
