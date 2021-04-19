/** @jsx jsx */
import { useState } from 'react';
import { Box, Button, Flex, jsx, Heading, Close, Text, Input, Divider } from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import BigNumber from 'bignumber.js';

import { fadeIn, slideUp } from 'lib/keyframes';
import { useAccountTokenBalance, useAccountVatBalance } from 'lib/hooks';
import getMaker from 'lib/maker';
import useAccountsStore from 'stores/accounts';
import useApprovalsStore from 'stores/approvals';
import { transactionsApi } from 'stores/transactions';
import Stack from 'components/layouts/Stack';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  vatBalance: BigNumber | undefined;
};

const DepositWithdrawModal = ({ showDialog, onDismiss, mobile }: Props): JSX.Element => {
  const [
    hasJoinDaiApproval,
    hasJoinDaiHope,
    enableJoinDaiApproval,
    enableJoinDaiHope,
    joinDaiApprovalPending,
    enableJoinDaiHopePending
  ] = useApprovalsStore(state => [
    state.hasJoinDaiApproval,
    state.hasJoinDaiHope,
    state.enableJoinDaiApproval,
    state.enableJoinDaiHope,
    state.joinDaiApprovalPending,
    state.enableJoinDaiHopePending
  ]);

  const [isDeposit, setIsDeposit] = useState(true);
  const account = useAccountsStore(state => state.currentAccount);
  const address = account?.address;
  const { data: daiBalance } = useAccountTokenBalance('DAI', address);
  const { data: vatBalance } = useAccountVatBalance(address);

  const ApprovalsContent = () => {
    return (
      <>
        <Divider sx={{ width: '100%' }} />
        <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
          <Text sx={{ fontWeight: 'bold' }}>Dai Wallet Balance</Text>
          <Text>{daiBalance}</Text>
        </Flex>
        <Divider sx={{ width: '100%', mb: 3 }} />

        <Stack gap={4} sx={{ mt: 4 }}>
          <Box>
            <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
              <Text sx={{ fontWeight: 'bold' }}>Dai in the VAT</Text>
              <Text>{vatBalance}</Text>
            </Flex>
            <Button
              sx={{ width: '100%' }}
              onClick={enableJoinDaiApproval}
              disabled={hasJoinDaiApproval || joinDaiApprovalPending}
              variant={hasJoinDaiApproval || joinDaiApprovalPending ? 'outline' : 'primary'}
            >
              {!(hasJoinDaiApproval || joinDaiApprovalPending) && 'Unlock Dai in the VAT'}
              {/* TODO: all icons and loading spinner to states below */}
              {joinDaiApprovalPending && 'Dai in the VAT Unlocked'}
              {hasJoinDaiApproval && 'Dai in the VAT Unlocked'}
            </Button>
            {!(hasJoinDaiApproval || joinDaiApprovalPending) && (
              <Text sx={{ color: 'textSecondary', textAlign: 'center', mt: 2 }}>
                This action allows you to deposit Dai into the VAT
              </Text>
            )}
          </Box>
          <Box>
            <Button
              sx={{ width: '100%' }}
              onClick={enableJoinDaiHope}
              // TODO: hasJoinDaiHope and enableJoinDaiHopePending are not updating on tx
              disabled={hasJoinDaiHope || enableJoinDaiHopePending}
              variant={hasJoinDaiHope || enableJoinDaiHopePending ? 'outline' : 'primary'}
            >
              Authorize the VAT
            </Button>
            <Text sx={{ color: 'textSecondary', textAlign: 'center', mt: 2 }}>
              This action allows the VAT to use the DAI you have deposited
            </Text>
          </Box>
        </Stack>
      </>
    );
  };

  const DepositWithdrawContent = () => {
    const [value, setValue] = useState<string>('');

    const updateValue = (e: { currentTarget: { value: string } }) => {
      const newValueStr = e.currentTarget.value;
      if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers

      setValue(newValueStr);
    };

    const moveDai = async () => {
      const maker = await getMaker();
      const txCreator = isDeposit
        ? () => maker.service('liquidation').joinDaiToAdapter(value)
        : () => maker.service('liquidation').exitDaiFromAdapter(value);

      await transactionsApi.getState().track(txCreator, `${isDeposit ? 'Depositing' : 'Withdrawing'} DAI`, {
        mined: txId => {
          transactionsApi.getState().setMessage(txId, `${isDeposit ? 'Deposit' : 'Withdraw'} DAI finished`);
          onDismiss();
        }
      });
    };

    return (
      <>
        <Flex sx={{ mb: 4 }}>
          <Button
            sx={{
              width: '100%',
              backgroundColor: 'surface',
              fontSize: 3,
              fontWeight: 'semiBold',
              color: isDeposit ? 'text' : 'coolGrey',
              borderBottom: 'solid 1px',
              borderBottomColor: isDeposit ? 'primary' : 'coolGrey',
              borderRadius: 0,
              ':hover': {
                backgroundColor: 'surface'
              }
            }}
            onClick={() => setIsDeposit(!isDeposit)}
          >
            Deposit Dai
          </Button>
          <Button
            sx={{
              width: '100%',
              backgroundColor: 'surface',
              fontSize: 3,
              fontWeight: 'semiBold',
              color: !isDeposit ? 'text' : 'coolGrey',
              borderBottom: 'solid 1px',
              borderBottomColor: !isDeposit ? 'primary' : 'coolGrey',
              borderRadius: 0,
              ':hover': {
                backgroundColor: 'surface'
              }
            }}
            onClick={() => setIsDeposit(!isDeposit)}
          >
            Redeem Dai
          </Button>
        </Flex>
        {isDeposit ? (
          <>
            <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
              <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
              <Text>{vatBalance}</Text>
            </Flex>
            <Flex sx={{ mb: 4 }}>
              <Input sx={{ mr: 2 }} placeholder="0.00" onChange={updateValue} type="number" value={value} />
              <Button sx={{ width: 180 }} onClick={moveDai}>
                Deposit Dai
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
              <Text sx={{ fontWeight: 'semiBold' }}>Dai Wallet Balance</Text>
              <Text>{daiBalance}</Text>
            </Flex>
            <Flex sx={{ mb: 4 }}>
              <Input sx={{ mr: 2 }} placeholder="0.00" onChange={updateValue} type="number" value={value} />
              <Button sx={{ width: 180 }} onClick={moveDai}>
                Withdraw Dai
              </Button>
            </Flex>
          </>
        )}
        <Button sx={{ mt: 3 }}>Explore Auctions</Button>
      </>
    );
  };

  return (
    <DialogOverlay isOpen={showDialog} onDismiss={onDismiss}>
      <DialogContent
        aria-label="Place a bid"
        sx={
          mobile
            ? { variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }
            : { variant: 'dialog.desktop', animation: `${fadeIn} 350ms ease`, width: '450px' }
        }
      >
        <Flex sx={{ flexDirection: 'column', pb: 3 }}>
          <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Heading sx={{ fontWeight: 'bold' }}>Unlock DAI to bid</Heading>
            <Close
              sx={{
                alignSelf: 'flex-end',
                height: 4,
                width: 4,
                p: 0,
                position: 'relative',
                top: '-4px',
                left: '8px'
              }}
              onClick={onDismiss}
            />
          </Flex>
          {/* // this text will probably be dynamic based on user's account */}
          <Text sx={{ color: 'secondaryEmphasis', mb: 2 }}>
            To participate in auctions you need to sign the approval transactions below and move Dai that will
            be used for bidding to the VAT
          </Text>
          {hasJoinDaiApproval && hasJoinDaiHope ? <DepositWithdrawContent /> : <ApprovalsContent />}
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default DepositWithdrawModal;
