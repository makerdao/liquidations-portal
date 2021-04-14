import useSWR from 'swr';
import { getTotalDai } from 'lib/api';

async function fetchTotalDai(): Promise<any[]> {
  const response = await getTotalDai();

  return response;
}

export function useTotalDai(): any {
  const { data, error } = useSWR('/total-dai', fetchTotalDai);

  return {
    data,
    loading: !error && !data,
    error: error
  };
}
