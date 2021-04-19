import { useQuery } from 'react-query';
import { TeamType, PlayerType } from '../types';

function useTeams(): { isLoading: boolean; error: unknown; teams: TeamType[] | undefined } {
  const { isLoading, error, data: teams } = useQuery<TeamType[]>('teams', () =>
    fetch(`http://localhost:8080/teams`).then((res) => res.json()),
  );

  return {
    isLoading,
    error,
    teams,
  };
}

function usePlayers(teamId: string): { isLoading: boolean; error: unknown; players: PlayerType[] | undefined } {
  const { isLoading, error, data: players } = useQuery<PlayerType[]>(
    ['players', teamId],
    () => fetch(`http://localhost:8080/players/?teamId=${teamId}`).then((res) => res.json()),
    {
      enabled: !!teamId,
    },
  );

  return {
    isLoading,
    error,
    players,
  };
}

export { useTeams, usePlayers };
