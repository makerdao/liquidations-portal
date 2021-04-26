import Maker from '@makerdao/dai';
import McdPlugin, { DAI } from '@makerdao/dai-plugin-mcd';
import LedgerPlugin from '@makerdao/dai-plugin-ledger-web';
import TrezorPlugin from '@makerdao/dai-plugin-trezor-web';
import { Web3ReactPlugin } from './maker/web3react';
import LiquidationPlugin from '@makerdao/dai-plugin-liquidations';

import { SupportedNetworks, DEFAULT_NETWORK } from './constants';
import { networkToRpc } from './maker/network';

export const ETH = Maker.ETH;
export const USD = Maker.USD;

function chainIdToNetworkName(chainId: number): SupportedNetworks {
  switch (chainId) {
    case 1:
      return SupportedNetworks.MAINNET;
    case 42:
      return SupportedNetworks.KOVAN;
    case 999:
      return SupportedNetworks.TESTNET;
    case 1337:
      return SupportedNetworks.TESTNET;
    default:
      throw new Error(`Unsupported chain id ${chainId}`);
  }
}

// make a snap judgement about which network to use so that we can immediately start loading state
function determineNetwork(): SupportedNetworks {
  if (typeof (global as any).__TESTCHAIN__ !== 'undefined' && (global as any).__TESTCHAIN__) {
    // if the testhchain global is set, connect to the testchain
    return SupportedNetworks.TESTNET;
  } else if (typeof window === 'undefined') {
    // if not on the browser, connect to the default network
    // (eg when generating static pages at build-time)
    return DEFAULT_NETWORK;
  } else {
    // otherwise, to determine the network...
    // 1) check the URL
    if (window.location.search.includes('mainnet')) {
      return SupportedNetworks.MAINNET;
    } else if (window.location.search.includes('kovan')) {
      return SupportedNetworks.KOVAN;
    } else if (window.location.search.includes('testnet')) {
      return SupportedNetworks.TESTNET;
    }
    // 2) check the browser provider if there is one
    if (typeof (window as any).ethereum !== 'undefined') {
      const chainId = parseInt((window as any).ethereum.chainId);
      try {
        const providerNetwork = chainIdToNetworkName(chainId);
        return providerNetwork;
      } catch (err) {
        console.log(`Browser provider connected to unsupported network with id ${chainId}`);
      }
    }
    // if it's not clear what network to connect to, use the default
    return DEFAULT_NETWORK;
  }
}

export function getVulcanizeParam(): boolean {
  // let vulcanize;
  // if (typeof window !== 'undefined') {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   vulcanize = urlParams.get('vulcanize');
  // }

  // // no vulcanize param, default to true
  // if (vulcanize === null) {
  //   return true;
  // }

  // // vulcanize param exists, convert from string to boolean
  // return vulcanize === 'true';

  // TODO remove hardcoded 'false' when vulcanize is ready

  return false;
}

let makerSingleton: Promise<Maker>;
function getMaker(): Promise<Maker> {
  const usingVulcanize = getVulcanizeParam();

  if (!makerSingleton) {
    makerSingleton = Maker.create('http', {
      plugins: [
        [McdPlugin, { prefetch: false }],
        Web3ReactPlugin,
        LedgerPlugin,
        TrezorPlugin,
        [LiquidationPlugin, { vulcanize: usingVulcanize }]
      ],
      provider: {
        url: networkToRpc(getNetwork(), 'infura'),
        type: 'HTTP'
      },
      web3: {
        pollingInterval: null
      },
      log: false,
      multicall: true
    }).then(maker => {
      if (typeof window !== 'undefined') (window as any).maker = maker;
      return maker;
    });
  }

  return makerSingleton;
}

let networkSingleton: SupportedNetworks;
function getNetwork(): SupportedNetworks {
  if (!networkSingleton) networkSingleton = determineNetwork();
  return networkSingleton;
}

function isDefaultNetwork(): boolean {
  return getNetwork() === DEFAULT_NETWORK;
}

function isSupportedNetwork(_network: string): _network is SupportedNetworks {
  return Object.values(SupportedNetworks).some(network => network.toLowerCase() === _network);
}

function isTestnet(): boolean {
  return getNetwork() === 'testnet' || !!process.env.TESTNET;
}

async function personalSign(message) {
  const maker = await getMaker();
  const provider = maker.service('web3')._web3.currentProvider;
  const from = maker.currentAddress();
  return new Promise((resolve, reject) => {
    provider.sendAsync(
      {
        method: 'personal_sign',
        params: [message, from],
        from
      },
      (err, res) => {
        if (err) reject(err);
        resolve(res.result);
      }
    );
  });
}

export default getMaker;
export {
  DAI,
  getNetwork,
  isDefaultNetwork,
  isSupportedNetwork,
  chainIdToNetworkName,
  isTestnet,
  personalSign
};
