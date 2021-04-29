import { stringToBytes } from '@makerdao/dai-plugin-mcd/dist/utils';
import getMaker from 'lib/maker';
import Auction from 'types/auction';
import BigNumber from 'bignumber.js';
import { COLLATERAL_MAP } from 'lib/constants';

//as the number of ilks grows, this calculation will require a lot of calls.
//should think about how to deal with that.
export async function getTotalDai(): Promise<any> {
  const maker = await getMaker();

  const vals = await Promise.all([
    maker
      .service('liquidation')
      .getHoleAndDirt()
      .then(x => x.diff),
    ...Object.keys(COLLATERAL_MAP).map(c => getHoleAndDirtForIlk(c).then(x => x.diff))
  ]);
  const global = vals[0];
  const ilks = vals.slice(1);
  const ilkSum = ilks.reduce((a, b) => a.plus(b), new BigNumber(0));
  return BigNumber.minimum(global, ilkSum);
}

const mockUnsafeVaults = ['unsafeUrn1'];

export async function getUnsafeVaults(ilk: string): Promise<any> {
  if (process.env.USE_MOCK_GRAPHQL) return Promise.resolve(mockUnsafeVaults);
  const maker = await getMaker();

  return maker.service('liquidation').getUnsafeVaults(ilk);
}

const mockAuctions: Auction[] = [
  {
    id: 123,
    active: true,
    ilk: 'link-a',
    initialCollateral: '8000',
    urn: '0x123',
    collateralAvailable: '3000',
    daiNeeded: '4000',
    dustLimit: new BigNumber(111),
    // auctionPrice: '999',
    startDate: 1619894140000,
    endDate: 1619994140000
  },
  {
    id: 234,
    active: false,
    ilk: 'yfi',
    initialCollateral: '4000',
    urn: '0x345',
    collateralAvailable: '1000',
    daiNeeded: '6000',
    dustLimit: new BigNumber(222),
    // auctionPrice: '888',
    startDate: 1619894140000,
    endDate: 1619994140000
  }
];

export async function getAllClips(ilk: string): Promise<any> {
  if (process.env.USE_MOCK_GRAPHQL) return Promise.resolve(mockAuctions);
  const maker = await getMaker();

  return maker.service('liquidation').getAllClips(ilk, { vulcanize: true });
}

export async function getVatGemBalance(ilk?: string, address?: string): Promise<any> {
  if (!ilk || !address) return;

  const maker = await getMaker();

  return maker.service('smartContract').getContract('MCD_VAT').gem(stringToBytes(ilk), address);
}

export async function getAccountVatBalance(address?: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('smartContract').getContract('MCD_VAT').dai(address);
}

export async function getAccountTokenBalance(token: string, address?: string): Promise<any> {
  const maker = await getMaker();

  return maker.getToken(token).balanceOf(address);
}

export async function getHoleAndDirtForIlk(ilk: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getHoleAndDirtForIlk(ilk);
}

export async function getAuctionStatus(ilk: string, id: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getStatus(ilk, id);
}
