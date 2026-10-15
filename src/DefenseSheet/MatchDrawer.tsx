import { useRef } from 'react';
import styled from 'styled-components';
import { Game } from './types';

// native modal <dialog> pinned to the left edge: focus trap, Esc and top layer come for free
const StyledDrawer = styled.dialog`
  margin: 0;
  width: min(320px, 85vw);
  height: 100dvh;
  max-height: none;
  padding: 0;
  border: 0;
  text-align: left;

  &::backdrop {
    background: rgb(0 0 0 / 0.4);
  }

  > div {
    box-sizing: border-box;
    min-height: 100%;
    padding: 16px;
  }

  ul {
    list-style-type: none;
    margin: 16px 0 0;
    padding: 0;
  }

  li {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  li button {
    min-height: 44px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  li button:first-child {
    flex: 1;
    text-align: left;
  }

  li button[aria-current='true'] {
    color: #3b5bdb;
    font-weight: bold;
  }
`;

interface Props {
  games: Game[];
  gameId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (game: Game) => void;
}

const MatchDrawer: React.FC<Props> = ({ games, gameId, onSelect, onNew, onDelete }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  const closeAfter = (action: () => void) => (): void => {
    action();
    ref.current?.close();
  };

  return (
    <>
      <button type="button" onClick={(): void => ref.current?.showModal()}>
        比賽列表
      </button>
      <StyledDrawer
        ref={ref}
        // the inner div covers the whole panel, so a click landing on the dialog itself is the backdrop
        onClick={(event): void => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div>
          <button type="button" onClick={closeAfter(onNew)}>
            新比賽
          </button>
          {games.length ? (
            <ul>
              {games.map((game) => (
                <li key={game.id}>
                  <button type="button" aria-current={game.id === gameId} onClick={closeAfter(() => onSelect(game.id))}>
                    {`${new Date(game.createdAt).toLocaleDateString('zh-TW')} vs ${game.name || '對手'}`}
                  </button>
                  <button
                    type="button"
                    aria-label={`刪除 vs ${game.name || '對手'}`}
                    onClick={(): void => onDelete(game)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>尚無比賽紀錄</p>
          )}
        </div>
      </StyledDrawer>
    </>
  );
};

export default MatchDrawer;
