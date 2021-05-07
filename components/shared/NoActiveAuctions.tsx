import { Flex, Box, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

type Props = {
  error?: string;
};
const NoActiveAuctions = ({ error }: Props): JSX.Element => (
  <Flex
    sx={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px dashed #D8E0E3',
      borderColor: error ? 'error' : '#D8E0E3',
      borderRadius: 'small',
      textAlign: 'center',
      py: 6,
      px: 4
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
      {error
        ? 'It looks like something went wrong. Please check back later.'
        : 'Currently there are no active auctions. Please check back later.'}
    </Text>
  </Flex>
);

export default NoActiveAuctions;
