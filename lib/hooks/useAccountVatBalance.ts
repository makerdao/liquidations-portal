import useSWR from 'swr';
import { getAccountVatBalance } from 'lib/api';
import BigNumber from 'bignumber.js';
import { fromRad } from 'lib/utils';

async function fetchAccountVatBalance(address?: string): Promise<any> {
  const response = await getAccountVatBalance(address);

  return fromRad(new BigNumber(response));
}

export function useAccountVatBalance(address?: string): { data: BigNumber; loading: boolean; error: string } {
  const { data, error } = useSWR(address ? `/balances/vat/dai/${address}` : null, () =>
    fetchAccountVatBalance(address)
  );

  return {
    data,
    loading: !error && !data,
    error
  };
}
