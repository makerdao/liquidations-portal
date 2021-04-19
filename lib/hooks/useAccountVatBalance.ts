import useSWR from 'swr';
import { getAccountVatBalance } from 'lib/api';
import BigNumber from 'bignumber.js';
import { fromRad } from 'lib/utils';

async function fetchAccountVatBalance(address?: string): Promise<any> {
  const response = await getAccountVatBalance(address);

  return fromRad(new BigNumber(response)).toFormat(2);
}

export function useAccountVatBalance(address?: string): any {
  const { data, error } = useSWR(address ? '/balances/vat/dai' : null, () => fetchAccountVatBalance(address));

  return {
    data,
    loading: !error && !data,
    error
  };
}
