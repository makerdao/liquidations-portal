import useSWR from 'swr';
import { getVatGemBalance } from 'lib/api';
import { fromWad } from 'lib/utils';

async function fetchVatGemBalance(ilk?: string, address?: string): Promise<any> {
  const response = await getVatGemBalance(ilk, address);
  return fromWad(response);
}

export function useVatGemBalance(ilk?: string, address?: string): any {
  const { data, error } = useSWR(address && ilk ? `/balances/vat/${ilk}` : null, () =>
    fetchVatGemBalance(ilk, address)
  );

  return {
    data,
    loading: !error && !data,
    error
  };
}
