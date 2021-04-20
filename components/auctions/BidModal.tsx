/** @jsx jsx */
import { useState } from 'react';
import { Button, Flex, Text, jsx, Input, Heading, Divider, Close, Spinner } from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import BigNumber from 'bignumber.js';
import { Icon } from '@makerdao/dai-ui-icons';
import Auction from 'types/auction';
import { fadeIn, slideUp } from 'lib/keyframes';
import { fromRad, calculateCollateralAmt, calculateColValue } from 'lib/utils';
import useAuctionStore from 'stores/auctions';
import useAccountsStore from 'stores/accounts';
import useApprovalsStore from 'stores/approvals';
import LogoBanner from './LogoBanner';
import { COLLATERAL_MAP } from 'lib/constants';

// TODO where do we get collateral price info?
const colPrice = new BigNumber(28.19);

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  auction: Auction;
  vatBalance: string;
  daiBalance: string;
  auctionPrice: BigNumber;
};

const BidModal = ({
  showDialog,
  onDismiss,
  mobile,
  auction,
  vatBalance,
  daiBalance,
  auctionPrice
}: Props): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const [colAmtStr, setColAmtStr] = useState<string>('0.00');
  const [hasIlkHope, enableIlkHope, joinIlkHopePending] = useApprovalsStore(state => [
    state.hasIlkHope,
    state.enableIlkHope,
    state.joinIlkHopePending
  ]);

  const { ilk, collateralAvailable, dustLimit, id } = auction;
  const account = useAccountsStore(state => state.currentAccount);
  const hasIlkHopeApproval = hasIlkHope[ilk];
  const ilkHopePending = joinIlkHopePending[ilk];
  const { symbol, colorIconName } = COLLATERAL_MAP[ilk];

  const updateValue = (e: { currentTarget: { value: string } }) => {
    const newValueStr = e.currentTarget.value;
    if (!/^((0|[1-9]\d*)(\.\d+)?)?$/.test(newValueStr)) return; // only non-negative valid numbers

    setValue(newValueStr);

    const newDaiAmt = new BigNumber(newValueStr || '0');
    const colAmount = calculateCollateralAmt(newDaiAmt, colPrice);
    setColAmtStr(colAmount.toFormat(2));
  };

  const setMax = () => {
    // if the user's vat balance is greater than the value of the available collateral, just use that
    const colAvailableValue = calculateColValue(new BigNumber(collateralAvailable), colPrice);
    const max = fromRad(vatBalance).gt(colAvailableValue) ? colAvailableValue : fromRad(vatBalance);
    setValue(max.toFormat());

    const colAmount = calculateCollateralAmt(max, colPrice);
    setColAmtStr(colAmount.toFormat(2));
  };

  const submitBid = useAuctionStore(state => state.submitBid);

  // Hardcoding data to match current active kovan auction
  const bidAmt = '1';
  const bidMax = '50';

  const disabled = !account;

  const ApprovalContent = () => {
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ justifyContent: 'space-between', my: 3 }}>
          <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
          <Text>{vatBalance}</Text>
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
              onClick={onDismiss}
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
                    <Button variant="textual" sx={{ color: 'primary', fontSize: 3, p: 0 }}>
                      Deposit
                    </Button>
                    <Flex sx={{ alignItems: 'center' }}>
                      <Text sx={{ fontSize: 2, color: 'textSecondary' }}>DAI in the VAT:</Text>
                      <Text sx={{ ml: 2 }}>{daiBalance}</Text>
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
                    // TODO can we use type=number without the spinbox arrows being added to right side of input?
                    // type="number"
                    value={value}
                  />
                  <Flex sx={{ position: 'absolute', right: '10px', top: '13px', alignItems: 'center' }}>
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
                    <Text sx={{ color: 'textMuted', fontSize: 2 }}>{dustLimit} DAI</Text>
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
                  <Text sx={{ fontWeight: 'bold', fontSize: 6, color: 'textMuted', pl: 2 }}>{colAmtStr}</Text>
                  <Flex sx={{ alignItems: 'center' }}>
                    <Icon size={30} name={colorIconName} />
                    <Text sx={{ fontSize: 3, fontWeight: 'semiBold', ml: 2 }}>{symbol}</Text>
                  </Flex>
                </Flex>
              </Flex>
              <Button
                disabled={disabled}
                sx={{ mt: 3 }}
                onClick={() => submitBid(auction.id, bidAmt, bidMax, account?.address)}
              >
                Place a bid
              </Button>
            </>
          )}
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BidModal;
