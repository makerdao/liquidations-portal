import useSWR from 'swr';
import { getUnsafeVaults } from 'lib/api';

async function fetchUnsafeVaults(): Promise<any[]> {
  const response = await getUnsafeVaults('LINK-A');
  return response;
}

export function useUnsafeVaults(): any {
  const { data, error } = useSWR('/unsafe-vaults/fetch-all', fetchUnsafeVaults);

  return {
    data,
    loading: !error && !data,
    error: error
  };
}
