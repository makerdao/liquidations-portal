import useSWR from 'swr';
import { getAccountTokenBalance } from 'lib/api';

async function fetchBalance(token: string, address?: string): Promise<any> {
  const response = await getAccountTokenBalance(token, address);

  return response._amount.toFixed(2).replace('.', ',');
}

export function useAccountTokenBalance(token: string, address?: string): any {
  const { data, error } = useSWR(address ? `/account-balance/${token}/${address}` : null, () =>
    fetchBalance(token, address)
  );

  return {
    data,
    loading: !error && !data,
    error: error
  };
}
