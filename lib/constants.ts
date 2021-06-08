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
  lpToken?: boolean;
  protocol?: string;
  protocolSvg?: string;
  pool?: string;
  poolSvg?: string;
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
  'GUSD-A': {
    name: 'Gemini Dollar',
    ilk: 'GUSD-A',
    symbol: 'GUSD',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/gusd-card-texture.png',
    bannerPng: '/assets/gusd-banner-texture.png',
    iconSvg: '/assets/gusd-icon.svg',
    colorIconName: 'gusdCircleColor',
    decimals: 2
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
  'PAXUSD-A': {
    name: 'Paxos Standard',
    ilk: 'PAXUSD-A',
    symbol: 'PAX',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/pax-card-texture.png',
    bannerPng: '/assets/pax-banner-texture.png',
    iconSvg: '/assets/pax-icon.svg',
    colorIconName: 'paxCircleColor',
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
  'TUSD-A': {
    name: 'True USD',
    ilk: 'TUSD-A',
    symbol: 'TUSD',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/tusd-card-texture.png',
    bannerPng: '/assets/tusd-banner-texture.png',
    iconSvg: '/assets/tusd-icon.svg',
    colorIconName: 'tusdCircleColor',
    decimals: 18
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
  'USDC-A': {
    name: 'USD Coin',
    ilk: 'USDC-A',
    symbol: 'USDC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/usdc-card-texture.png',
    bannerPng: '/assets/usdc-banner-texture.png',
    iconSvg: '/assets/usdc-icon.svg',
    colorIconName: 'usdcCircleColor',
    decimals: 6
  },
  'USDC-B': {
    name: 'USD Coin',
    ilk: 'USDC-B',
    symbol: 'USDC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/usdc-card-texture.png',
    bannerPng: '/assets/usdc-banner-texture.png',
    iconSvg: '/assets/usdc-icon.svg',
    colorIconName: 'usdcCircleColor',
    decimals: 6
  },
  'USDT-A': {
    name: 'Tether USD',
    ilk: 'USDT-A',
    symbol: 'USDT',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/usdt-card-texture.png',
    bannerPng: '/assets/usdt-banner-texture.png',
    iconSvg: '/assets/usdt-icon.svg',
    colorIconName: 'usdtCircleColor',
    decimals: 6
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
  },
  'UNIV2DAIETH-A': {
    name: 'UNIV2DAIETH LP',
    ilk: 'UNIV2DAIETH-A',
    symbol: 'UNIV2DAIETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2daieth-card-texture.png',
    bannerPng: '/assets/univ2daieth-banner-texture.png',
    iconSvg: '/assets/univ2daieth-icon.svg',
    colorIconName: 'uniDaiEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'DAIETH-A',
    poolSvg: '/assets/univ2daieth-icon.svg'
  },
  'UNIV2USDCETH-A': {
    name: 'UNIV2USDCETH LP',
    ilk: 'UNIV2USDCETH-A',
    symbol: 'UNIV2USDCETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2usdceth-card-texture.png',
    bannerPng: '/assets/univ2usdceth-banner-texture.png',
    iconSvg: '/assets/univ2usdceth-icon.svg',
    colorIconName: 'uniUsdcEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'USDCETH-A',
    poolSvg: '/assets/univ2usdceth-icon.svg'
  },
  'UNIV2ETHUSDT-A': {
    name: 'UNIV2ETHUSDT LP',
    ilk: 'UNIV2ETHUSDT-A',
    symbol: 'UNIV2ETHUSDT',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2ethusdt-card-texture.png',
    bannerPng: '/assets/univ2ethusdt-banner-texture.png',
    iconSvg: '/assets/univ2ethusdt-icon.svg',
    colorIconName: 'uniEthUsdtLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'ETHUSDT-A',
    poolSvg: '/assets/univ2ethusdt-icon.svg'
  },
  'UNIV2WBTCDAI-A': {
    name: 'UNIV2WBTCDAI LP',
    ilk: 'UNIV2WBTCDAI-A',
    symbol: 'UNIV2WBTCDAI',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2wbtcdai-card-texture.png',
    bannerPng: '/assets/univ2wbtcdai-banner-texture.png',
    iconSvg: '/assets/univ2wbtcdai-icon.svg',
    colorIconName: 'uniWbtcDaiLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'WBTCDAI-A',
    poolSvg: '/assets/univ2wbtcdai-icon.svg'
  },
  'UNIV2WBTCETH-A': {
    name: 'UNIV2WBTCETH LP',
    ilk: 'UNIV2WBTCETH-A',
    symbol: 'UNIV2WBTCETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2wbtceth-card-texture.png',
    bannerPng: '/assets/univ2wbtceth-banner-texture.png',
    iconSvg: '/assets/univ2wbtceth-icon.svg',
    colorIconName: 'uniWbtcEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'WBTCETH-A',
    poolSvg: '/assets/univ2wbtceth-icon.svg'
  },
  'UNIV2LINKETH-A': {
    name: 'UNIV2LINKETH LP',
    ilk: 'UNIV2LINKETH-A',
    symbol: 'UNIV2LINKETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2linketh-card-texture.png',
    bannerPng: '/assets/univ2linketh-banner-texture.png',
    iconSvg: '/assets/univ2linketh-icon.svg',
    colorIconName: 'uniLinkEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'LINKETH-A',
    poolSvg: '/assets/univ2linketh-icon.svg'
  },
  'UNIV2UNIETH-A': {
    name: 'UNIV2UNIETH LP',
    ilk: 'UNIV2UNIETH-A',
    symbol: 'UNIV2UNIETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2unieth-card-texture.png',
    bannerPng: '/assets/univ2unieth-banner-texture.png',
    iconSvg: '/assets/univ2unieth-icon.svg',
    colorIconName: 'uniUniEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'UNIETH-A',
    poolSvg: '/assets/univ2unieth-icon.svg'
  },
  'UNIV2AAVEETH-A': {
    name: 'UNIV2AAVEETH LP',
    ilk: 'UNIV2AAVEETH-A',
    symbol: 'UNIV2AAVEETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2aaveeth-card-texture.png',
    bannerPng: '/assets/univ2aaveeth-banner-texture.png',
    iconSvg: '/assets/univ2aaveeth-icon.svg',
    colorIconName: 'uniAaveEthLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'AAVEETH-A',
    poolSvg: '/assets/univ2aaveeth-icon.svg'
  },
  'UNIV2DAIUSDT-A': {
    name: 'UNIV2DAIUSDT LP',
    ilk: 'UNIV2DAIUSDT-A',
    symbol: 'UNIV2DAIUSDT',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2daiusdt-card-texture.png',
    bannerPng: '/assets/univ2daiusdt-banner-texture.png',
    iconSvg: '/assets/univ2daiusdt-icon.svg',
    colorIconName: 'uniDaiUsdtLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'DAIUSDT-A',
    poolSvg: '/assets/univ2daiusdt-icon.svg'
  },
  'UNIV2DAIUSDC-A': {
    name: 'UNIV2DAIUSDC LP',
    ilk: 'UNIV2DAIUSDC-A',
    symbol: 'UNIV2DAIUSDC',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/univ2daiusdc-card-texture.png',
    bannerPng: '/assets/univ2daiusdc-banner-texture.png',
    iconSvg: '/assets/univ2daiusdc-icon.svg',
    colorIconName: 'uniDaiUsdcLp',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'DAIUSDC-A',
    poolSvg: '/assets/univ2daiusdc-icon.svg'
  }
};

export const COLLATERAL_ARRAY = Object.keys(COLLATERAL_MAP).map(currency => ({
  ...COLLATERAL_MAP[currency],
  key: currency
}));

export const TOOLTIP_DICT = {
  ACTIVE_AUCTIONS: 'The number of active auctions in which you can place a bid.',
  INACTIVE_AUCTIONS: 'The number of auctions that ended in which you can no longer place a bid.',
  UNDERCOLLATERALIZED_VAULTS: 'The number of undercollateralized vaults that need to be initiated.',
  DAI_REQUIRED: 'The amount of DAI required to purchase available auction collateral',
  MAX_AVAILABLE: 'Max amount of DAI that can be auctioned.',
  DAI_IN_VAT:
    'The VAT contract is the core vault engine of the Maker Protocol and manages DAI accounting. Depositing DAI into this contract and approving permissions is necessary in order to participate in auctions.',
  DUST_LIMIT: 'Minimum vault debt.',
  AUCTION_PRICE: 'The maximum acceptable price.'
};
