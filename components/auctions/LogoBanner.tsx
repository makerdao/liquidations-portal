/** @jsx jsx */
import { Flex, Text, Image, jsx } from 'theme-ui';

import { COLLATERAL_MAP } from 'lib/constants';

type Props = {
  ilk: string;
};

const LogoBanner = ({ ilk }: Props): JSX.Element => {
  const { bannerPng, iconSvg, lpToken, protocol, protocolSvg, pool, poolSvg } = COLLATERAL_MAP[ilk];

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
        {lpToken ? (
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                sx={{
                  pr: 2,
                  color: 'background',
                  fontSize: 6
                }}
              >
                {protocol}
              </Text>
              <Image
                src={protocolSvg}
                sx={{
                  height: 24,
                  maxWidth: 'none'
                }}
              />
            </Flex>
            <Flex sx={{ alignItems: 'center', mt: '-8px' }}>
              <Image
                src={poolSvg}
                sx={{
                  height: 32,
                  maxWidth: 'none'
                }}
              />
              <Text
                sx={{
                  pl: 3,
                  color: 'background',
                  fontSize: 7,
                  fontWeight: 'semiBold'
                }}
              >
                {pool}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <>
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
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default LogoBanner;
