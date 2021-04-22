import Maker from '@makerdao/dai';
import McdPlugin from '@makerdao/dai-plugin-mcd';
import LedgerPlugin from '@makerdao/dai-plugin-ledger-web';
import TrezorPlugin from '@makerdao/dai-plugin-trezor-web';
import LiquidationPlugin from '@makerdao/dai-plugin-liquidations';

import { networkToRpc } from '../../../lib/maker/network';
import { SupportedNetworks } from '../../../lib/constants';

const cachedMakerObjs = {};
export async function getConnectedMakerObj(network: SupportedNetworks): Promise<any> {
  if (cachedMakerObjs[network]) {
    return cachedMakerObjs[network];
  }
  const makerObj = await Maker.create('http', {
    plugins: [[McdPlugin, { prefetch: false }], LedgerPlugin, TrezorPlugin, LiquidationPlugin],
    provider: {
      url: networkToRpc(network, 'infura'),
      type: 'HTTP'
    },
    web3: {
      pollingInterval: null
    },
    log: false,
    multicall: true
  });

  cachedMakerObjs[network] = makerObj;
  return makerObj;
}
