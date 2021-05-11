/** @jsx jsx */
import { Flex, Text, Image, jsx } from 'theme-ui';

import { COLLATERAL_MAP } from 'lib/constants';

type Props = {
  ilk: string;
};

const LogoBanner = ({ ilk }: Props): JSX.Element => {
  const { bannerPng, iconSvg } = COLLATERAL_MAP[ilk];

  return (
    <Flex sx={{ position: 'relative', display: 'inline-block' }}>
      <Image variant="bannerSmall" src={bannerPng} />
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}
      >
        <Image
          src={iconSvg}
          sx={{
            height: 44,
            maxWidth: 'none'
          }}
        />
        <Text
          sx={{
            pl: 3,
            color: 'background',
            fontSize: 8,
            fontWeight: 'semiBold'
          }}
        >
          {ilk}
        </Text>
      </Flex>
    </Flex>
  );
};

export default LogoBanner;
