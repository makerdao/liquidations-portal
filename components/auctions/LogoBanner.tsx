/** @jsx jsx */
import { Flex, Text, Image, jsx } from 'theme-ui';

import { COLLATERAL_MAP } from 'lib/constants';

type Props = {
  name: string;
};

const LogoBanner = ({ name }: Props): JSX.Element => {
  const { bannerPng, iconSvg } = COLLATERAL_MAP[name.toLowerCase()];

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
          transform: 'translate(-50%, -50%)'
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
            fontSize: 8
          }}
        >
          {name}
        </Text>
      </Flex>
    </Flex>
  );
};

export default LogoBanner;
