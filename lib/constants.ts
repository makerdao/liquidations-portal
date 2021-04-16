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
  cardTexturePng: string;
  bannerPng: string;
  iconSvg: string;
};

export const COLLATERAL_MAP: Record<string, CollateralInfo> = {
  'link-a': {
    name: 'chainlink',
    ilk: 'LINK-A',
    symbol: 'LINK',
    cardTexturePng: '/assets/link-card-texture.png',
    bannerPng: '/assets/link-banner-texture.png',
    iconSvg: '/assets/link-icon.svg'
  }
  // yfi: {
  //   name: 'yfi',
  //   ilk: 'YFI-A',
  //   symbol: 'YFI',
  //   cardTexturePng: '/assets/yfi-card-texture.png',
  //   bannerPng: '/assets/yfi-banner-texture.png',
  //   iconSvg: '/assets/yfi-icon.svg'
  // }
};

export const COLLATERAL_ARRAY = Object.keys(COLLATERAL_MAP).map(currency => ({
  ...COLLATERAL_MAP[currency],
  key: currency
}));
