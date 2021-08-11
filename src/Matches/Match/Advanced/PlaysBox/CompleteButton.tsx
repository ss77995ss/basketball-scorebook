import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { PlayerResultsType } from '../../../types';
import { API_DOMAIN } from '../../../constants';

interface Props {
  matchId: string;
  playerResults: PlayerResultsType[];
}

const CompleteButton: React.FC<Props> = ({ matchId, playerResults }: Props) => {
  const history = useHistory();
  const { isLoading, isError, mutate } = useMutation(
    (formData: { matchId: string; results: PlayerResultsType[] }) =>
      fetch(`${API_DOMAIN}/playerResults/complete`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => history.push('/matches'),
    },
  );

  const onComplete = (): void => {
    if (window.confirm('確認完成此比賽紀錄？')) {
      mutate({
        matchId,
        results: playerResults,
      });
    }
  };
  return (
    <>
      <button onClick={onComplete} disabled={isLoading}>
        完成紀錄
      </button>
      {isError && <div>Something went wrong</div>}
    </>
  );
};

export default CompleteButton;
