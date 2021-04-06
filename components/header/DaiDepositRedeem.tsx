import { Button, Flex, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons-branding';
import useAccountsStore from 'stores/accounts';

const DaiDepositRedeem = (props: any): JSX.Element | null => {
  const account = useAccountsStore(state => state.currentAccount);
  const address = account?.address;

  return address ? (
    <Button
      aria-label="Deposit or Redeem Dai"
      sx={{
        variant: 'buttons.card',
        borderRadius: 'round',
        color: 'textMuted',
        px: [2, 3],
        py: 2,
        alignSelf: 'flex-end',
        '&:hover': {
          color: 'text',
          borderColor: 'onSecondary',
          backgroundColor: 'white'
        }
      }}
      {...props}
      onClick={() => console.log('open modal')}
    >
      <Flex sx={{ alignItems: 'center' }}>
        {/* TODO: add dynamic DAI balance */}
        <Text>0,00</Text>
        <Icon name="dai" size="16px" sx={{ mx: 2 }} />
        <Text>Deposit/Redeem</Text>
      </Flex>
    </Button>
  ) : null;
};

export default DaiDepositRedeem;
