import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

const NewTeam: React.FC<{ teamId: string }> = ({ teamId }: { teamId: string }) => {
  const { isLoading, isError, mutate } = useMutation((formData: { teamId: string; name: string; number: string }) =>
    fetch('http://localhost:8080/players', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );
  const { register, handleSubmit } = useForm();

  const onSubmit = (newPlayerInfo: { name: string; number: string }): void => {
    if (window.confirm(`新增球員 名字：${newPlayerInfo.name} 背號：${newPlayerInfo.number}？`)) {
      mutate({
        teamId,
        name: newPlayerInfo.name,
        number: newPlayerInfo.number || '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">名字：</label>
      <input ref={register({ required: true })} name="name" disabled={isLoading} />
      <label htmlFor="number">背號：</label>
      <input ref={register} name="number" disabled={isLoading} />
      <button type="submit" disabled={isLoading}>
        新增
      </button>
      {isError && <div>Something went wrong</div>}
    </form>
  );
};

export default NewTeam;
