type Auction = {
  id: number;
  active: boolean;
  ilk: string;
  initialCollateral: string;
  urn: string;
  collateralAvailable: string;
  daiNeeded: string;
  dustLimit: string;
  auctionPrice: string;
  startDate: number;
  endDate: number;
};

export default Auction;
