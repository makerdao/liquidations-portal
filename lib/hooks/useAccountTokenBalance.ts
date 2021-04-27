import useSWR from 'swr';
import { getAccountTokenBalance } from 'lib/api';
import BigNumber from 'bignumber.js';

async function fetchBalance(token: string, address?: string): Promise<any> {
  const response = await getAccountTokenBalance(token, address);

  return response._amount;
}

export function useAccountTokenBalance(
  token: string,
  address?: string
): { data: BigNumber; loading: boolean; error: string } {
  const { data, error } = useSWR(address ? `/balances/${token}/${address}` : null, () =>
    fetchBalance(token, address)
  );

  return {
    data,
    loading: !error && !data,
    error
  };
}
