/** @jsx jsx */
import { Flex, Text, Image, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

type Props = {
  name: string;
  icon: string;
};

const LogoBanner = ({ name, icon }: Props): JSX.Element => {
  return (
    <Flex sx={{ position: 'relative', display: 'inline-block' }}>
      <Image variant="bannerSmall" src={`/assets/${name}-banner-texture.png`} />
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
        <Icon name={icon} size="auto" height="50" width="50" color="background" />
        <Text
          sx={{
            pl: 2,
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
