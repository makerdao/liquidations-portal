type Auction = {
  id: number;
  name: string;
  initialCollateral: string;
  urn: string;
  collateralAvailable: string;
  daiNeeded: string;
  dustLimit: string;
  maxBid: string;
  endDate: number;
};

export default Auction;
