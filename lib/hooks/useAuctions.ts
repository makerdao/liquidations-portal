import useSWR from 'swr';
import { getAllClips } from 'lib/api';
import Auction from 'types/auction';
import { transformAuctions } from 'lib/utils';

async function fetchAuctions(): Promise<Auction[]> {
  const response = await getAllClips('LINK-A');

  return transformAuctions(response);
}

export function useAuctions(): any {
  const { data, error } = useSWR('/auctions/fetch-all}', fetchAuctions);

  return {
    data,
    loading: !error && !data,
    error: error
  };
}
