/** @jsx jsx */
import { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  jsx,
  Heading,
  Close,
  Text,
  Input,
  Divider,
  Spinner,
  Checkbox,
  Label,
  Link
} from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { Icon } from '@makerdao/dai-ui-icons';
import BigNumber from 'bignumber.js';

import { fadeIn, slideUp } from 'lib/keyframes';
import { useAccountTokenBalance, useAccountVatBalance } from 'lib/hooks';
import getMaker from 'lib/maker';
import { bigNumToFormat } from 'lib/utils';
import useAccountsStore from 'stores/accounts';
import useApprovalsStore from 'stores/approvals';
import { transactionsApi } from 'stores/transactions';
import Stack from 'components/layouts/Stack';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
};

const DepositWithdrawModal = ({ showDialog, onDismiss, mobile }: Props): JSX.Element => {
  const [
    hasJoinDaiApproval,
    hasJoinDaiHope,
    enableJoinDaiApproval,
    enableJoinDaiHope,
    joinDaiApprovalPending,
    joinDaiHopePending
  ] = useApprovalsStore(state => [
    state.hasJoinDaiApproval,
    state.hasJoinDaiHope,
    state.enableJoinDaiApproval,
    state.enableJoinDaiHope,
    state.joinDaiApprovalPending,
    state.joinDaiHopePending
  ]);
  const [isDeposit, setIsDeposit] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const account = useAccountsStore(state => state.currentAccount);
  const address = account?.address;
  const { data: daiBalance } = useAccountTokenBalance('DAI', address);
  const { data: vatBalance } = useAccountVatBalance(address);

  const handleTermsChecked = () => setTermsChecked(!termsChecked);
  const handleAcceptTerms = () => setHasAcceptedTerms(true);

  const LegalContent = () => {
    return (
      <>
        <Box variant="cards.primary" sx={{ mt: 2 }}>
          <Text sx={{ fontWeight: 'bold', mb: 2 }}>Acceptance of Terms</Text>
          <Text>
            Please read these{' '}
            <Link href={'/terms'} target="_blank" sx={{ fontWeight: 'semiBold' }}>
              Terms of Service
            </Link>{' '}
            (this “Agreement”) carefully. Your use or access of the Site or the Services (as defined below)
            constitutes your consent to this Agreement.
          </Text>
        </Box>
        <Flex sx={{ flexDirection: 'row', mt: 3 }}>
          <Label>
            <Checkbox checked={termsChecked} onClick={handleTermsChecked} />
            <Text>
              I have read and accept the{' '}
              <Link href={'/terms'} target="_blank">
                Terms of Service
              </Link>
              .
            </Text>
          </Label>
        </Flex>
        <Button disabled={!termsChecked} onClick={handleAcceptTerms} sx={{ mt: 2, width: '100%' }}>
          Continue
        </Button>
      </>
    );
  };

  const ApprovalsContent = () => {
    return (
      <>
        <Text sx={{ color: 'secondaryEmphasis', mb: 2 }}>
          To participate in auctions you need to sign the approval transactions below and move Dai that will
          be used for bidding to the VAT
        </Text>
        <Divider sx={{ width: '100%' }} />
        <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
          <Text sx={{ fontWeight: 'semiBold' }}>Dai Wallet Balance</Text>
          <Text>{bigNumToFormat(daiBalance, 'DAI')}</Text>
        </Flex>
        <Divider sx={{ width: '100%', mb: 3 }} />

        <Stack gap={4} sx={{ mt: 4 }}>
          <Box>
            <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
              <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
              <Text>{vatBalance}</Text>
            </Flex>
            <Button
              sx={{ width: '100%' }}
              onClick={enableJoinDaiApproval}
              disabled={hasJoinDaiApproval || joinDaiApprovalPending}
              variant={hasJoinDaiApproval || joinDaiApprovalPending ? 'outline' : 'primary'}
            >
              {!hasJoinDaiApproval && !joinDaiApprovalPending && 'Unlock Dai in the VAT'}
              {joinDaiApprovalPending && (
                <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  Unlocking DAI in the VAT <Spinner size={20} ml={2} />
                </Flex>
              )}
              {hasJoinDaiApproval && (
                <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  Dai in the VAT Unlocked <Icon name="checkmark" color="primary" ml={2} />
                </Flex>
              )}
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
              disabled={hasJoinDaiHope || joinDaiHopePending}
              variant={hasJoinDaiHope || joinDaiHopePending ? 'outline' : 'primary'}
            >
              {!joinDaiHopePending ? (
                'Authorize the VAT'
              ) : (
                <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  Authorizing the VAT <Spinner size={20} ml={2} />
                </Flex>
              )}
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
    const [isTxProcessing, setIsTxProcessing] = useState(false);

    const canDeposit = new BigNumber(value).lte(new BigNumber(daiBalance));
    const canWithdraw = new BigNumber(value).lte(new BigNumber(vatBalance));

    const updateValue = (e: { currentTarget: { value: string } }) => {
      const newValueStr = e.currentTarget.value;
      if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers

      setValue(newValueStr);
    };

    const depositMax = () => {
      setValue(daiBalance.toFormat(6));
    };

    const withdrawMax = () => {
      setValue(vatBalance.toFormat(6));
    };

    const moveDai = async () => {
      const maker = await getMaker();
      const txCreator = isDeposit
        ? () => maker.service('liquidation').joinDaiToAdapter(value)
        : () => maker.service('liquidation').exitDaiFromAdapter(value);

      await transactionsApi.getState().track(txCreator, `${isDeposit ? 'Depositing' : 'Withdrawing'} DAI`, {
        pending: () => {
          setIsTxProcessing(true);
        },
        mined: txId => {
          transactionsApi.getState().setMessage(txId, `${isDeposit ? 'Deposit' : 'Withdraw'} DAI finished`);
          setIsTxProcessing(false);
          onDismiss();
        },
        error: () => {
          setIsTxProcessing(false);
        }
      });
    };

    return (
      <>
        <Text sx={{ color: 'secondaryEmphasis', mb: 2 }}>
          You can deposit Dai in the VAT here. This is the DAI that you will be able to use for bidding on
          auctions.
        </Text>
        <Divider sx={{ width: '100%' }} />
        <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
          <Text sx={{ fontWeight: 'semiBold' }}>Dai Wallet Balance</Text>
          <Text>{bigNumToFormat(daiBalance, 'DAI')}</Text>
        </Flex>
        <Divider sx={{ width: '100%', mb: 3 }} />
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
            Withdraw Dai
          </Button>
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
          <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
          <Text>{bigNumToFormat(vatBalance, 'DAI')}</Text>
        </Flex>
        {isDeposit ? (
          <Flex sx={{ mb: 4, position: 'relative' }}>
            <Input sx={{ mr: 2 }} placeholder="0.00" onChange={updateValue} type="number" value={value} />
            <Button
              variant="textual"
              disabled={daiBalance.lte(0)}
              onClick={depositMax}
              sx={{
                position: 'absolute',
                right: 166,
                top: 1,
                cursor: daiBalance.lte(0) ? 'not-allowed' : 'cursor',
                color: daiBalance.lte(0) ? 'textSecondary' : 'primary',
                px: 0
              }}
            >
              Max
            </Button>
            <Button sx={{ width: 180 }} onClick={moveDai} disabled={isTxProcessing || !canDeposit}>
              {isTxProcessing ? <Spinner size={20} sx={{ color: 'primary' }} /> : 'Deposit Dai'}
            </Button>
          </Flex>
        ) : (
          <Flex sx={{ mb: 4, position: 'relative' }}>
            <Input
              sx={{ mr: 2 }}
              placeholder="0.00"
              onChange={updateValue}
              type="number"
              value={value}
              disabled={isTxProcessing}
            />
            <Button
              variant="textual"
              disabled={vatBalance.lte(0)}
              onClick={withdrawMax}
              sx={{
                position: 'absolute',
                right: 166,
                top: 1,
                cursor: vatBalance.lte(0) ? 'not-allowed' : 'cursor',
                color: vatBalance.lte(0) ? 'textSecondary' : 'primary',
                px: 0
              }}
            >
              Max
            </Button>
            <Button sx={{ width: 180 }} onClick={moveDai} disabled={isTxProcessing || !canWithdraw}>
              {isTxProcessing ? <Spinner size={20} sx={{ color: 'primary' }} /> : 'Withdraw Dai'}
            </Button>
          </Flex>
        )}
        <Button onClick={onDismiss} sx={{ mt: 3 }}>
          Explore Auctions
        </Button>
      </>
    );
  };

  return (
    <DialogOverlay isOpen={showDialog} onDismiss={onDismiss}>
      <DialogContent
        aria-label="Deposit or withdraw Dai"
        sx={
          mobile
            ? { variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }
            : { variant: 'dialog.desktop', animation: `${fadeIn} 350ms ease`, width: '450px' }
        }
      >
        <Flex sx={{ flexDirection: 'column', pb: 3 }}>
          <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Heading sx={{ fontWeight: 'bold' }}>
              {!hasJoinDaiApproval && !hasJoinDaiHope && !hasAcceptedTerms
                ? 'Terms of Use'
                : 'Unlock DAI to bid'}
            </Heading>
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
          {hasJoinDaiApproval && hasJoinDaiHope ? (
            <DepositWithdrawContent />
          ) : !hasAcceptedTerms ? (
            <LegalContent />
          ) : (
            <ApprovalsContent />
          )}
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default DepositWithdrawModal;
