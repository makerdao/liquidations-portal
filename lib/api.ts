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
    name: 'link',
    initialCollateral: '8000',
    urn: '0x123',
    collateralAvailable: '3000',
    daiNeeded: '4000',
    dustLimit: '111',
    maxBid: '999',
    endDate: 1619894140000
  },
  {
    id: 234,
    name: 'yfi',
    initialCollateral: '4000',
    urn: '0x345',
    collateralAvailable: '1000',
    daiNeeded: '6000',
    dustLimit: '222',
    maxBid: '888',
    endDate: 1619894140000
  }
];

export async function getAllClips(ilk: string): Promise<any> {
  if (process.env.USE_MOCK_GRAPHQL) return Promise.resolve(mockAuctions);
  const maker = await getMaker();

  return maker.service('liquidation').getAllClips(ilk);
}

export async function getVatGemBalance(ilk: string, address: string): Promise<any> {
  const maker = await getMaker();
  return maker.service('smartContract').getContract('MCD_VAT').gem(stringToBytes(ilk), address);
}
