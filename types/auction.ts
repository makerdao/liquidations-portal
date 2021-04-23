import BigNumber from 'bignumber.js';

type Auction = {
  id: number;
  active: boolean;
  ilk: string;
  initialCollateral: string;
  urn: string;
  collateralAvailable: string;
  daiNeeded: string;
  dustLimit: BigNumber;
  startDate: number;
  endDate: number;
};

export default Auction;
