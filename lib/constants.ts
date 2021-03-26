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

export const COLLATERAL_LOGOS = {
  link: 'chainlink',
  yfi: 'yfi'
};

type CollateralInfo = {
  name: string;
  symbol: string;
  cardTexturePng: string;
  bannerPng: string;
  iconSvg: string;
};

export const COLLATERAL_MAP: Record<string, CollateralInfo> = {
  link: {
    name: 'chainlink',
    symbol: 'LINK',
    cardTexturePng: '/assets/link-card-texture.png',
    bannerPng: '/assets/link-banner-texture.png',
    iconSvg: '/assets/link-icon.svg'
  },
  yfi: {
    name: 'yfi',
    symbol: 'YFI',
    cardTexturePng: '/assets/yfi-card-texture.png',
    bannerPng: '/assets/yfi-banner-texture.png',
    iconSvg: '/assets/yfi-icon.svg'
  }
};

export const COLLATERAL_ARRAY = Object.keys(COLLATERAL_MAP).map(currency => COLLATERAL_MAP[currency]);
