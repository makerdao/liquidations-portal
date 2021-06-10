import useSWR from 'swr';
import { getGlobalMax } from 'lib/api';

async function fetchGlobalMax(): Promise<any[]> {
  const response = await getGlobalMax();

  return response;
}

export function useGlobalMax(): any {
  const { data, error } = useSWR('/total-dai', fetchGlobalMax, { refreshInterval: 3600000 });

  return {
    data,
    loading: !error && !data,
    error
  };
}
