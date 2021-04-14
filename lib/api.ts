import { stringToBytes } from '@makerdao/dai-plugin-mcd/dist/utils';
import getMaker from 'lib/maker';

export async function getVatGemBalance(ilk: string, address: string): Promise<any> {
  const maker = await getMaker();
  return maker.service('smartContract').getContract('MCD_VAT').gem(stringToBytes(ilk), address);
}
