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

  // TODO comment this back when removing test ilk

  // 'ZRX-A': {
  //   name: '0x',
  //   ilk: 'ZRX-A',
  //   symbol: 'ZRX',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },

  // test ilk
  'ZRX-A': {
    name: 'UNIV2DAIETH LP',
    ilk: 'ZRX-A',
    symbol: 'UNIV2DAIETH',
    bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
    cardTexturePng: '/assets/zrx-card-texture.png',
    bannerPng: '/assets/zrx-banner-texture.png',
    iconSvg: '/assets/zrx-icon.svg',
    colorIconName: 'zrxCircleColor',
    decimals: 18,
    lpToken: true,
    protocol: 'UNI V2',
    protocolSvg: '/assets/uni-icon.svg',
    pool: 'DAIETH-A',
    poolSvg: '/assets/eth-icon.svg'
  }
  // end test ilk

  // 'UNIV2DAIETH-A': {
  //   name: 'UNIV2DAIETH LP',
  //   ilk: 'UNIV2DAIETH-A',
  //   symbol: 'UNIV2DAIETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2USDCETH-A': {
  //   name: 'UNIV2USDCETH LP',
  //   ilk: 'UNIV2USDCETH-A',
  //   symbol: 'UNIV2USDCETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2ETHUSDT-A': {
  //   name: 'UNIV2ETHUSDT LP',
  //   ilk: 'UNIV2ETHUSDT-A',
  //   symbol: 'UNIV2ETHUSDT',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2WBTCDAI-A': {
  //   name: 'UNIV2WBTCDAI LP',
  //   ilk: 'UNIV2WBTCDAI-A',
  //   symbol: 'UNIV2WBTCDAI',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2WBTCETH-A': {
  //   name: 'UNIV2WBTCETH LP',
  //   ilk: 'UNIV2WBTCETH-A',
  //   symbol: 'UNIV2WBTCETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2LINKETH-A': {
  //   name: 'UNIV2LINKETH LP',
  //   ilk: 'UNIV2LINKETH-A',
  //   symbol: 'UNIV2LINKETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2UNIETH-A': {
  //   name: 'UNIV2UNIETH LP',
  //   ilk: 'UNIV2UNIETH-A',
  //   symbol: 'UNIV2UNIETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2AAVEETH-A': {
  //   name: 'UNIV2AAVEETH LP',
  //   ilk: 'UNIV2AAVEETH-A',
  //   symbol: 'UNIV2AAVEETH',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // },
  // 'UNIV2DAIUSDT-A': {
  //   name: 'UNIV2DAIUSDT LP',
  //   ilk: 'UNIV2DAIUSDT-A',
  //   symbol: 'UNIV2DAIUSDT',
  //   bigNumFormatter: (val: BigNumber): string => val.toFormat(2),
  //   cardTexturePng: '/assets/zrx-card-texture.png',
  //   bannerPng: '/assets/zrx-banner-texture.png',
  //   iconSvg: '/assets/zrx-icon.svg',
  //   colorIconName: 'zrxCircleColor',
  //   decimals: 18
  // }
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
