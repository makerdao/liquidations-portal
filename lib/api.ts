import { stringToBytes } from '@makerdao/dai-plugin-mcd/dist/utils';
import getMaker from 'lib/maker';
import Auction from 'types/auction';
import BigNumber from 'bignumber.js';

export async function getTotalDai(): Promise<any> {
  const maker = await getMaker();

  return maker.service('mcd:systemData').getTotalDai();
}

export async function getUnsafeVaults(ilk: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getUnsafeVaults(ilk);
}

export async function getAllClips(ilk: string): Promise<any> {
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

export async function getAuctionStatus(ilk: string, id: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getStatus(ilk, id);
}
