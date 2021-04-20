import useSWR from 'swr';
import { getAllClips } from 'lib/api';
import Auction from 'types/auction';
import { transformAuctions } from 'lib/utils';

async function fetchAuctions(ilk: string): Promise<Auction[]> {
  const type = ilk ?? 'all';

  const response = await getAllClips(type);

  return transformAuctions(response);
}

export function useAuctions(ilk?: string): any {
  // remove this
  const type = ilk ?? 'all';

  // set null if type is null
  const { data, error } = useSWR(`/auctions/fetch-${type}`, () => fetchAuctions(type), {
    // set interval to 60 seconds for "all ilk" queries, 10 seconds for ilk-specific
    refreshInterval: type === 'all' ? 60000 : 10000
  });

  return {
    data,
    loading: !error && !data,
    error: error
  };
}
