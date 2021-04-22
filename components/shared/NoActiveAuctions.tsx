import { Flex, Box, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

const NoActiveAuctions = (): JSX.Element => (
  <Flex
    sx={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px dashed #D8E0E3',
      borderRadius: 'small',
      p: 6
    }}
  >
    <Box>
      <Icon
        name="maker"
        size={5}
        sx={{
          p: 2,
          color: 'textSecondary',
          border: '2px dashed #D8E0E3',
          borderRadius: '50%'
        }}
      />
    </Box>
    <Text sx={{ color: 'textSecondary' }}>
      Currently there are no active auctions. Please check back later.
    </Text>
  </Flex>
);

export default NoActiveAuctions;
