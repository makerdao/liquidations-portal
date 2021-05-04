import BigNumber from 'bignumber.js';

export enum SupportedNetworks {
  MAINNET = 'mainnet',
  KOVAN = 'kovan',
  TESTNET = 'testnet'
}

export const DEFAULT_NETWORK = SupportedNetworks.MAINNET;

export const ETHERSCAN_PREFIXES = {
  [SupportedNetworks.MAINNET]: '',
  [SupportedNetworks.KOVAN]: 'kovan.'
};

type CollateralInfo = {
  name: string;
  ilk: string;
  symbol: string;
  bigNumFormatter: (val: BigNumber) => string;
  cardTexturePng: string;
  bannerPng: string;
  iconSvg: string;
  colorIconName: string;
};

export const COLLATERAL_MAP: Record<string, CollateralInfo> = {
  'ETH-A': {
    name: 'Ether',
    ilk: 'ETH-A',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'etherCircleColor'
  },
  'ETH-B': {
    name: 'Ether',
    ilk: 'ETH-B',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'etherCircleColor'
  },
  'ETH-C': {
    name: 'Ether',
    ilk: 'ETH-C',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'etherCircleColor'
  },
  'LINK-A': {
    name: 'chainlink',
    ilk: 'LINK-A',
    symbol: 'LINK',
    bigNumFormatter: val => val.toFormat(2),
    cardTexturePng: '/assets/link-card-texture.png',
    bannerPng: '/assets/link-banner-texture.png',
    iconSvg: '/assets/link-icon.svg',
    colorIconName: 'linkCircleColor'
  },
  'YFI-A': {
    name: 'yearn.finance',
    ilk: 'YFI-A',
    symbol: 'YFI',
    bigNumFormatter: val => val.toFormat(2),
    cardTexturePng: '/assets/yfi-card-texture.png',
    bannerPng: '/assets/yfi-banner-texture.png',
    iconSvg: '/assets/yfi-icon.svg',
    colorIconName: 'yfiCircleColor'
  },
  'WBTC-A': {
    name: 'Wrapped Bitcoin',
    ilk: 'WBTC-A',
    symbol: 'WBTC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/wbtc-card-texture.png',
    bannerPng: '/assets/wbtc-banner-texture.png',
    iconSvg: '/assets/wbtc-icon.svg',
    colorIconName: 'wbtcCircleColor'
  }
};

export const COLLATERAL_ARRAY = Object.keys(COLLATERAL_MAP).map(currency => ({
  ...COLLATERAL_MAP[currency],
  key: currency
}));
