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
  decimals: number;
};

export const COLLATERAL_MAP: Record<string, CollateralInfo> = {
  'AAVE-A': {
    name: 'AAVE',
    ilk: 'AAVE-A',
    symbol: 'AAVE',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/aave-card-texture.png',
    bannerPng: '/assets/aave-banner-texture.png',
    iconSvg: '/assets/aave-icon.svg',
    colorIconName: 'aaveCircleColor',
    decimals: 18
  },
  'BAL-A': {
    name: 'Balancer',
    ilk: 'BAL-A',
    symbol: 'BAL',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/bal-card-texture.png',
    bannerPng: '/assets/bal-banner-texture.png',
    iconSvg: '/assets/bal-icon.svg',
    colorIconName: 'balCircleColor',
    decimals: 18
  },
  'BAT-A': {
    name: 'Basic Attention Token',
    ilk: 'BAT-A',
    symbol: 'BAT',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/bat-card-texture.png',
    bannerPng: '/assets/bat-banner-texture.png',
    iconSvg: '/assets/bat-icon.svg',
    colorIconName: 'batCircleColor',
    decimals: 18
  },
  'COMP-A': {
    name: 'Compound',
    ilk: 'COMP-A',
    symbol: 'COMP',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/comp-card-texture.png',
    bannerPng: '/assets/comp-banner-texture.png',
    iconSvg: '/assets/comp-icon.svg',
    colorIconName: 'compCircleColor',
    decimals: 18
  },
  'ETH-A': {
    name: 'Ether',
    ilk: 'ETH-A',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'ethCircleColor',
    decimals: 18
  },
  'ETH-B': {
    name: 'Ether',
    ilk: 'ETH-B',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'ethCircleColor',
    decimals: 18
  },
  'ETH-C': {
    name: 'Ether',
    ilk: 'ETH-C',
    symbol: 'ETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/eth-card-texture.png',
    bannerPng: '/assets/eth-banner-texture.png',
    iconSvg: '/assets/eth-icon.svg',
    colorIconName: 'ethCircleColor',
    decimals: 18
  },
  'KNC-A': {
    name: 'Kyber Network Crystal',
    ilk: 'KNC-A',
    symbol: 'KNC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/knc-card-texture.png',
    bannerPng: '/assets/knc-banner-texture.png',
    iconSvg: '/assets/knc-icon.svg',
    colorIconName: 'kncCircleColor',
    decimals: 18
  },
  'LINK-A': {
    name: 'Chainlink',
    ilk: 'LINK-A',
    symbol: 'LINK',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/link-card-texture.png',
    bannerPng: '/assets/link-banner-texture.png',
    iconSvg: '/assets/link-icon.svg',
    colorIconName: 'linkCircleColor',
    decimals: 18
  },
  'LRC-A': {
    name: 'Loopring',
    ilk: 'LRC-A',
    symbol: 'LRC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/lrc-card-texture.png',
    bannerPng: '/assets/lrc-banner-texture.png',
    iconSvg: '/assets/lrc-icon.svg',
    colorIconName: 'lrcCircleColor',
    decimals: 18
  },
  'MANA-A': {
    name: 'Decentraland',
    ilk: 'MANA-A',
    symbol: 'MANA',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/mana-card-texture.png',
    bannerPng: '/assets/mana-banner-texture.png',
    iconSvg: '/assets/mana-icon.svg',
    colorIconName: 'manaCircleColor',
    decimals: 18
  },
  'RENBTC-A': {
    name: 'renBTC',
    ilk: 'RENBTC-A',
    symbol: 'RENBTC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/renbtc-card-texture.png',
    bannerPng: '/assets/renbtc-banner-texture.png',
    iconSvg: '/assets/renbtc-icon.svg',
    colorIconName: 'renbtcCircleColor',
    decimals: 8
  },
  'UNI-A': {
    name: 'Uniswap',
    ilk: 'UNI-A',
    symbol: 'UNI',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/uni-card-texture.png',
    bannerPng: '/assets/uni-banner-texture.png',
    iconSvg: '/assets/uni-icon.svg',
    colorIconName: 'uniCircleColor',
    decimals: 18
  },
  'WBTC-A': {
    name: 'Wrapped Bitcoin',
    ilk: 'WBTC-A',
    symbol: 'WBTC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/wbtc-card-texture.png',
    bannerPng: '/assets/wbtc-banner-texture.png',
    iconSvg: '/assets/wbtc-icon.svg',
    colorIconName: 'wbtcCircleColor',
    decimals: 8
  },
  'YFI-A': {
    name: 'yearn.finance',
    ilk: 'YFI-A',
    symbol: 'YFI',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/yfi-card-texture.png',
    bannerPng: '/assets/yfi-banner-texture.png',
    iconSvg: '/assets/yfi-icon.svg',
    colorIconName: 'yfiCircleColor',
    decimals: 18
  },
  'ZRX-A': {
    name: '0x',
    ilk: 'ZRX-A',
    symbol: 'ZRX',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/zrx-card-texture.png',
    bannerPng: '/assets/zrx-banner-texture.png',
    iconSvg: '/assets/zrx-icon.svg',
    colorIconName: 'zrxCircleColor',
    decimals: 18
  }
};

export const COLLATERAL_ARRAY = Object.keys(COLLATERAL_MAP).map(currency => ({
  ...COLLATERAL_MAP[currency],
  key: currency
}));
