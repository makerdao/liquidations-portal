/** @jsx jsx */
import { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Text,
  jsx,
  Input,
  Link as ExternalLink,
  Heading,
  Divider,
  Close,
  Spinner
} from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import BigNumber from 'bignumber.js';
import { Icon } from '@makerdao/dai-ui-icons';
import Auction from 'types/auction';
import { fadeIn, slideUp } from 'lib/keyframes';
import { bigNumToFormat, calculateCollateralAmt, getEtherscanLink } from 'lib/utils';
import { COLLATERAL_MAP, TOOLTIP_DICT } from 'lib/constants';
import { getNetwork } from 'lib/maker';
import useAuctionStore from 'stores/auctions';
import useAccountsStore from 'stores/accounts';
import useApprovalsStore from 'stores/approvals';
import { useModalsStore } from 'stores/modals';
import Tooltip from 'components/shared/Tooltip';
import LogoBanner from './LogoBanner';

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
  const [bidTxPending, bidTxSuccess, bidTxError, resetBidState, submitBid] = useAuctionStore(state => [
    state.bidTxPending,
    state.bidTxSuccess,
    state.bidTxError,
    state.resetBidState,
    state.submitBid
  ]);
  const hasIlkHopeApproval = hasIlkHope[ilk];
  const ilkHopePending = joinIlkHopePending[ilk];
  const { symbol, colorIconName, decimals } = COLLATERAL_MAP[ilk];

  const updateValue = (e: { currentTarget: { value: string } }) => {
    const newValueStr = e.currentTarget.value;
    if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers

    setValue(newValueStr);
  };

  useEffect(() => {
    const colAmt = calculateCollateralAmt(new BigNumber(value), unitPrice);
    setColAmount(colAmt);
  }, [value, unitPrice]);

  const setMax = () => {
    // if the user's vat balance is greater than the value of the auction, use the auctionPrice
    const max = vatBalance.gt(auctionPrice) ? auctionPrice : vatBalance;
    setValue(max.toFixed(decimals));
  };

  // determine if bid would fail dust limit check
  const dustLimitExceeded =
    auctionPrice.minus(new BigNumber(value)).lte(dustLimit) && auctionPrice.minus(new BigNumber(value)).gt(0);

  // maximum non-total amount allowable without failing dust limit check
  const dustLimitAllowance = auctionPrice.minus(dustLimit).toFormat(2);

  const insufficientFunds = vatBalance.lt(new BigNumber(value));
  const disabled = !account || insufficientFunds || bidTxPending || dustLimitExceeded;

  const onClose = () => {
    resetBidState();
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
          <Tooltip sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }} label={TOOLTIP_DICT.DAI_IN_VAT}>
            <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
          </Tooltip>
          <Text>{bigNumToFormat(vatBalance, 'DAI')}</Text>
        </Flex>
        <Button variant="outline" onClick={handleDepositMore} sx={{ mb: 4 }}>
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
        <Text variant="smallHeading" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }}>
          Bid approved!
        </Text>
        <Text color="textMuted" sx={{ mb: 2 }}>
          Collateral you received
        </Text>
        <Text variant="smallHeading" sx={{ mb: 5 }}>
          {colAmount.gte(0.01) ? colAmount.toFormat(2) : colAmount.toFormat(4)} {symbol}
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

  const ErrorContent = () => {
    return (
      <Flex sx={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Icon name="warning" color="error" size={6} sx={{ mt: 2 }} />
        <Text variant="smallHeading" sx={{ mt: 2, mb: 4, fontWeight: 'bold' }}>
          Bid failed
        </Text>
        <Text sx={{ px: 4, mb: 5, textAlign: 'center' }}>
          Something went wrong with your transaction. Please try again.
        </Text>
        <Text sx={{ px: 4, mb: 2, fontSize: 2, textAlign: 'center' }}>
          View more details about the failed transaction.
        </Text>
        <ExternalLink
          href={getEtherscanLink(getNetwork(), (bidTxError && bidTxError.hash) || '', 'transaction')}
          target="_blank"
        >
          <Text
            variant="text"
            sx={{
              color: 'accentBlue',
              fontSize: 2
            }}
          >
            View on Etherscan <Icon name="arrowTopRight" size="2" color="accentBlue" />
          </Text>
        </ExternalLink>
        <Button variant="primaryOutline" onClick={resetBidState} sx={{ width: '100%', mt: 4, mb: 2 }}>
          Go back and try again
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
        {bidTxSuccess || bidTxError ? (
          <>
            {bidTxSuccess && <SuccessContent />}
            {bidTxError && <ErrorContent />}
          </>
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
                {bigNumToFormat(collateralAvailable, ilk)} {symbol}
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
                        <Tooltip
                          sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                          label={TOOLTIP_DICT.DAI_IN_VAT}
                        >
                          <Text sx={{ fontSize: 2, color: 'textSecondary' }}>DAI in the VAT:</Text>
                        </Tooltip>
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
                      value={
                        typeof value === 'undefined' ? '0.00' : value.length > 15 ? value.slice(0, 15) : value
                      }
                    />
                    <Flex sx={{ position: 'absolute', right: '30px', top: '13px', alignItems: 'center' }}>
                      <Button
                        variant="textual"
                        sx={{
                          color: 'textSecondary',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          border: '1px solid #D4D9E1',
                          borderRadius: 'round',
                          mr: 1,
                          cursor: 'pointer',
                          textTransform: 'uppercase'
                        }}
                        onClick={setMax}
                      >
                        max
                      </Button>
                      <Flex sx={{ alignItems: 'center', ml: 1 }}>
                        <Icon size={30} name="daiCircleColor" />
                        <Text sx={{ fontSize: 3, fontWeight: 'semiBold', ml: 2 }}>DAI</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                  <Flex sx={{ justifyContent: 'space-between', mt: 2, px: 2 }}>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Tooltip
                        sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                        label={TOOLTIP_DICT.DUST_LIMIT}
                      >
                        <Text sx={{ color: 'textSecondary', fontSize: 2 }}>Dust limit</Text>
                      </Tooltip>
                      <Text sx={{ color: 'textMuted', fontSize: 2 }}>{dustLimit.toFormat(2)} DAI</Text>
                    </Flex>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Tooltip
                        sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                        label={TOOLTIP_DICT.AUCTION_PRICE}
                      >
                        <Text sx={{ color: 'textSecondary', fontSize: 2 }}>Auction price</Text>
                      </Tooltip>
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
                      {colAmount.gte(0.01) ? colAmount.toFormat(2) : colAmount.toFormat(4)}
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
                {(insufficientFunds || dustLimitExceeded) && (
                  <Text sx={{ color: 'onWarning', textAlign: 'center', mt: 2 }}>
                    {dustLimitExceeded
                      ? `Please bid the full amount or any amount lower than ${dustLimitAllowance} DAI. It is not permitted to leave less than the dust limit of ${dustLimit.toFormat(
                          2
                        )} DAI in the auction.`
                      : 'Insufficient funds'}
                  </Text>
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
