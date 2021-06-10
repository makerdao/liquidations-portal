import useSWR from 'swr';
import { getHoleAndDirtForIlk } from 'lib/api';

async function fetchHoleAndDirt(ilk: string): Promise<any[]> {
  const response = await getHoleAndDirtForIlk(ilk);

  return response;
}

export function useHoleAndDirt(ilk: string): any {
  const { data, error } = useSWR(`/hole-and-dirt/fetch-${ilk}`, () => fetchHoleAndDirt(ilk), {
    refreshInterval: 3600000
  });

  return {
    data,
    loading: !error && !data,
    error
  };
}
