import useSWR from 'swr';
import { getAllClips } from 'lib/api';
import Auction from 'types/auction';
import { transformAuctions } from 'lib/utils';

async function fetchAuctions(ilk?: string): Promise<Auction[]> {
  const type = ilk ?? 'all';

  const response = await getAllClips(type);

  return transformAuctions(response);
}

// TODO: define an Ilk type with all possible values (based on collateral map in lib/constants)
export function useAuctions(ilk?: string): any {
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
