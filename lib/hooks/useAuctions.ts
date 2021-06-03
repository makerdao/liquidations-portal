import useSWR from 'swr';
import { getAllClips } from 'lib/api';
import Auction from 'types/auction';
import { transformAuctions } from 'lib/utils';
import { COLLATERAL_MAP } from 'lib/constants';

async function fetchAuctions(ilk?: string): Promise<Auction[]> {
  if (!ilk) return [];

  if (ilk === 'all') {
    const response = await Promise.all(Object.keys(COLLATERAL_MAP).map(c => getAllClips(c)));
    return transformAuctions(response.flat());
  } else {
    const response = await getAllClips(ilk);
    return transformAuctions(response);
  }
}

export function useAuctions(ilk?: string): { data?: Auction[]; loading: boolean; error: string } {
  const { data, error } = useSWR(ilk ? `/auctions/fetch-${ilk}` : null, () => fetchAuctions(ilk), {
    // sets interval to 60 seconds for "all ilk" queries, 10 seconds for ilk-specific
    refreshInterval: ilk === 'all' ? 60000 : 10000
  });

  return {
    data,
    loading: !error && !data,
    error
  };
}
