import { useEffect, useState } from 'react';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { getAuctionStatus } from 'lib/api';
import { RAY, WAD, RAD } from 'lib/utils';

async function fetchAuctionStatus(ilk, id): Promise<any> {
  const response = await getAuctionStatus(ilk, id);

  return response;
}

export function useAuctionStatus(ilk: string, id: number): any {
  const [auctionPrice, setAuctionPrice] = useState(new BigNumber(0));
  const [daiNeeded, setDaiNeeded] = useState('0');
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [needsRedo, setNeedsRedo] = useState(false);

  const { data, error } = useSWR(`/auctions/getStatus-${id}`, () => fetchAuctionStatus(ilk, id), {
    // arbitrary time, could be tuned to with the abaci if desired
    refreshInterval: 30000
  });

  useEffect(() => {
    if (data) {
      setCollateralAmount(new BigNumber(data.lot._hex).div(WAD).toString());
      setAuctionPrice(new BigNumber(data.price._hex).div(RAY));
      setDaiNeeded(new BigNumber(data.tab._hex).div(RAD).toString());
      setNeedsRedo(data.needsRedo);
    }
  }, [data]);

  return {
    collateralAmount,
    auctionPrice,
    daiNeeded,
    needsRedo,
    loading: !error && !data,
    error
  };
}
