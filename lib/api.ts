import { stringToBytes } from '@makerdao/dai-plugin-mcd/dist/utils';
import getMaker from 'lib/maker';
import Auction from 'types/auction';

export async function getTotalDai(): Promise<any> {
  const maker = await getMaker();

  return maker.service('mcd:systemData').getTotalDai();
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
    dustLimit: '111',
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
    dustLimit: '222',
    // auctionPrice: '888',
    startDate: 1619894140000,
    endDate: 1619994140000
  }
];

export async function getAllClips(ilk: string): Promise<any> {
  if (process.env.USE_MOCK_GRAPHQL) return Promise.resolve(mockAuctions);
  const maker = await getMaker();

  return maker.service('liquidation').getAllClips(ilk);
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

export async function getAuctionStatus(id: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getStatus(id);
}
