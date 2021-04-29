/** @jsx jsx */
import { useState, useEffect } from 'react';
import { Button, Flex, Text, jsx, Input, Heading, Divider, Close, Spinner } from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import BigNumber from 'bignumber.js';
import { Icon } from '@makerdao/dai-ui-icons';
import Auction from 'types/auction';
import { fadeIn, slideUp } from 'lib/keyframes';
import { bigNumToFormat, calculateCollateralAmt } from 'lib/utils';
import useAuctionStore from 'stores/auctions';
import useAccountsStore from 'stores/accounts';
import useApprovalsStore from 'stores/approvals';
import { useModalsStore } from 'stores/modals';
import LogoBanner from './LogoBanner';
import { COLLATERAL_MAP } from 'lib/constants';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  auction: Auction;
  vatBalance: BigNumber;
  unitPrice: BigNumber;
  auctionPrice: BigNumber;
};

const BidModal = ({
  showDialog,
  onDismiss,
  mobile,
  auction,
  vatBalance,
  unitPrice,
  auctionPrice
}: Props): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const [colAmount, setColAmount] = useState<BigNumber>(new BigNumber(0));
  const [hasIlkHope, enableIlkHope, joinIlkHopePending] = useApprovalsStore(state => [
    state.hasIlkHope,
    state.enableIlkHope,
    state.joinIlkHopePending
  ]);

  const toggleDepositWithdraw = useModalsStore(state => state.toggleDepositWithdraw);
  const { ilk, collateralAvailable, dustLimit, id } = auction;
  const account = useAccountsStore(state => state.currentAccount);
  const [bidTxPending, bidTxSuccess, bidTxError, resetBidSuccess, submitBid] = useAuctionStore(state => [
    state.bidTxPending,
    state.bidTxSuccess,
    state.bidTxError,
    state.resetBidSuccess,
    state.submitBid
  ]);
  const hasIlkHopeApproval = hasIlkHope[ilk];
  const ilkHopePending = joinIlkHopePending[ilk];
  const { symbol, colorIconName } = COLLATERAL_MAP[ilk];

  const updateValue = (e: { currentTarget: { value: string } }) => {
    const newValueStr = e.currentTarget.value;
    if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers

    setValue(newValueStr);
  };

  useEffect(() => {
    const colAmt = calculateCollateralAmt(new BigNumber(value), unitPrice);
    setColAmount(colAmt);
  }, [value]);

  const setMax = () => {
    // if the user's vat balance is greater than the value of the auction, use the auctionPrice
    const max = vatBalance.gt(auctionPrice) ? auctionPrice : vatBalance;
    setValue(max.toFormat(18));
  };

  const insufficientFunds = vatBalance.lt(new BigNumber(value));
  const disabled = !account || insufficientFunds || bidTxPending;

  const onClose = () => {
    resetBidSuccess();
    setValue('');
    onDismiss();
  };

  const handleDepositMore = () => {
    onClose();
    toggleDepositWithdraw();
  };

  const ApprovalContent = () => {
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ justifyContent: 'space-between', my: 3 }}>
          <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
          <Text>{bigNumToFormat(vatBalance, 'DAI')}</Text>
        </Flex>
        {/* TODO: add button action */}
        <Button variant="outline" onClick={() => console.log('go to deposit modal')} sx={{ mb: 4 }}>
          Deposit more DAI in the VAT
        </Button>
        <Button
          onClick={() => enableIlkHope(ilk)}
          sx={{ mb: 3 }}
          variant={ilkHopePending ? 'outline' : 'primary'}
          disabled={ilkHopePending}
        >
          {!ilkHopePending ? (
            `Authorize DAI in ${ilk} Auctions`
          ) : (
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
              Authorizing DAI in {ilk} Auctions <Spinner size={20} ml={2} />
            </Flex>
          )}
        </Button>
        <Text sx={{ color: 'textSecondary', textAlign: 'center' }}>
          To start bidding you need to authorize Dai in {ilk} Auctions
        </Text>
      </Flex>
    );
  };

  const SuccessContent = () => {
    return (
      <Flex sx={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Icon name="bidWin" size={6} sx={{ mt: 2 }} />
        <Text variant="smallHeading" sx={{ mt: 2, mb: 4 }}>
          Bid Approved!
        </Text>
        <Text color="textMuted" sx={{ mb: 2 }}>
          Collateral you received
        </Text>
        <Text variant="smallHeading" sx={{ mb: 5 }}>
          {colAmount.toFormat(2)} {symbol}
        </Text>
        <Button variant="outline" onClick={onClose} sx={{ width: '100%', mb: 3 }}>
          Bid on more auctions
        </Button>
        <Button onClick={onClose} sx={{ width: '100%' }}>
          Redeem Collateral
        </Button>
      </Flex>
    );
  };

  return (
    <DialogOverlay isOpen={showDialog} onDismiss={onClose}>
      <DialogContent
        aria-label="Place a bid"
        sx={
          mobile
            ? { variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }
            : { variant: 'dialog.desktop', animation: `${fadeIn} 350ms ease`, width: '450px' }
        }
      >
        {bidTxSuccess ? (
          <SuccessContent />
        ) : (
          <Flex sx={{ flexDirection: 'column', pb: 3 }}>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Heading sx={{ fontWeight: 'bold' }}>{`Auction ${id}`}</Heading>
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
                onClick={onClose}
              />
            </Flex>
            <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end', my: 2 }}>
              <Text sx={{ fontSize: 3, fontWeight: 'semiBold' }}>Collateral Available</Text>
              <Text>
                {collateralAvailable} {symbol}
              </Text>
            </Flex>
            <LogoBanner ilk={ilk} />
            {!hasIlkHopeApproval ? (
              <ApprovalContent />
            ) : (
              <>
                <Flex sx={{ flexDirection: 'column', mb: 2 }}>
                  <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                    <Text sx={{ fontWeight: 'semiBold', fontSize: 3 }}>DAI you pay</Text>
                    <Flex sx={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Button
                        variant="textual"
                        onClick={handleDepositMore}
                        sx={{ color: 'primary', fontSize: 3, p: 0 }}
                      >
                        Deposit
                      </Button>
                      <Flex sx={{ alignItems: 'center' }}>
                        <Text sx={{ fontSize: 2, color: 'textSecondary' }}>DAI in the VAT:</Text>
                        <Text sx={{ ml: 2 }}>{bigNumToFormat(vatBalance, 'DAI')}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex
                    sx={{
                      width: '100%',
                      position: 'relative',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Input
                      sx={{
                        width: '100%',
                        fontWeight: 'bold',
                        fontSize: 6,
                        // TODO why do we need this override?
                        fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu'
                      }}
                      placeholder="0.00"
                      onChange={updateValue}
                      type="number"
                      value={value}
                    />
                    <Flex sx={{ position: 'absolute', right: '30px', top: '13px', alignItems: 'center' }}>
                      <Button
                        variant="textual"
                        sx={{
                          color: 'text',
                          fontSize: 3,
                          p: 0,
                          cursor: 'pointer'
                        }}
                        // TODO fix max calc
                        onClick={setMax}
                      >
                        Set Max
                      </Button>
                      <Flex sx={{ alignItems: 'center', ml: 1 }}>
                        <Icon size={30} name="daiCircleColor" />
                        <Text sx={{ fontSize: 3, fontWeight: 'semiBold', ml: 2 }}>DAI</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', mt: 2, px: 2 }}>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Text sx={{ color: 'textSecondary', fontSize: 2 }}>Dust limit</Text>
                      <Text sx={{ color: 'textMuted', fontSize: 2 }}>{dustLimit.toFixed(0)} DAI</Text>
                    </Flex>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Text sx={{ color: 'textSecondary', fontSize: 2 }}>Auction price</Text>
                      <Text sx={{ color: 'textMuted', fontSize: 2, textAlign: 'right' }}>
                        {auctionPrice.toFormat(2)} DAI
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
                <Divider sx={{ my: 3 }} />
                <Flex sx={{ flexDirection: 'column' }}>
                  <Text sx={{ fontSize: 3, fontWeight: 'semiBold' }}>Collateral you receive</Text>
                  <Flex sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text sx={{ fontWeight: 'bold', fontSize: 6, color: 'textMuted', pl: 2 }}>
                      {colAmount.toFormat(2)}
                    </Text>
                    <Flex sx={{ alignItems: 'center' }}>
                      <Icon size={30} name={colorIconName} />
                      <Text sx={{ fontSize: 3, fontWeight: 'semiBold', ml: 2 }}>{symbol}</Text>
                    </Flex>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', mt: 2 }}>
                    <Text sx={{ ml: 2, fontSize: 2, color: 'textSecondary' }}>Price</Text>
                    <Text sx={{ fontSize: 2, color: 'textMuted' }}>{`≈ ${bigNumToFormat(
                      unitPrice,
                      ilk
                    )} DAI per ${symbol}`}</Text>
                  </Flex>
                </Flex>
                <Button
                  disabled={disabled}
                  sx={{ mt: 3 }}
                  onClick={() => submitBid(ilk, id, colAmount, unitPrice, account?.address)}
                >
                  <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    {!bidTxPending ? 'Place a bid' : <Spinner size={20} ml={2} />}
                  </Flex>
                </Button>
                {insufficientFunds && (
                  <Text sx={{ color: 'onWarning', textAlign: 'center', mt: 2 }}>Insufficient funds</Text>
                )}
                {bidTxError && (
                  <Text sx={{ color: 'onWarning', textAlign: 'center', mt: 2 }}>Transaction failed</Text>
                )}
              </>
            )}
          </Flex>
        )}
      </DialogContent>
    </DialogOverlay>
  );
};

export default BidModal;
