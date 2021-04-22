import useSWR from 'swr';
import { getUnsafeVaults } from 'lib/api';

async function fetchUnsafeVaults(ilk: string): Promise<any[]> {
  const type = ilk ?? 'all';

  const response = await getUnsafeVaults(type);

  return response;
}

export function useUnsafeVaults(ilk?: string): any {
  const type = ilk ?? 'all';

  const { data, error } = useSWR(`/unsafe-vaults/fetch-${type}`, () => fetchUnsafeVaults(type), {
    // set interval to 60 seconds for "all ilk" queries, 10 seconds for ilk-specific
    refreshInterval: type === 'all' ? 60000 : 10000
  });

  return {
    data,
    loading: !error && !data,
    error
  };
}
