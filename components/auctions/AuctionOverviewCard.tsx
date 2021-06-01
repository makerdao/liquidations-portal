/** @jsx jsx */
import { useState } from 'react';
import { Box, Button, Text, Flex, Grid, Link as ExternalLink, jsx, Badge } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { Icon } from '@makerdao/dai-ui-icons';
import BigNumber from 'bignumber.js';

import Auction from 'types/auction';
import { useAuctionStatus } from 'lib/hooks';
import { getNetwork } from 'lib/maker';
import { bigNumToFormat, calculateColValue, formatAddress, getEtherscanLink } from 'lib/utils';
import { TOOLTIP_DICT } from 'lib/constants';
import Stack from 'components/layouts/Stack';
import CountdownTimer from 'components/shared/CountdownTimer';
import Tooltip from 'components/shared/Tooltip';
import BidModal from './BidModal';
import { COLLATERAL_MAP } from 'lib/constants';
import useAccountsStore from 'stores/accounts';
import { useModalsStore } from 'stores/modals';

type Props = {
  auction: Auction;
  vatBalance: BigNumber;
};

const AuctionOverviewCard = ({ auction, vatBalance }: Props): JSX.Element => {
  const {
    id,
    active,
    ilk,
    // initialCollateral,
    urn,
    collateralAvailable,
    dustLimit,
    startDate,
    endDate
  } = auction;

  const [showDialog, setShowDialog] = useState(false);
  const bpi = useBreakpointIndex();
  const { auctionPrice: unitPrice } = useAuctionStatus(ilk, id);
  const account = useAccountsStore(state => state.currentAccount);
  const address = account?.address;

  const { symbol, bigNumFormatter } = COLLATERAL_MAP[ilk];

  // determine if auction needs reset
  const now = Math.floor(new Date().getTime() / 1000);
  const endTime = Math.floor(new Date(endDate).getTime() / 1000);
  const timeLeft = endTime - now;
  const requiresReset = timeLeft <= 0;

  // check vat balance exists
  const hasDai = vatBalance.gt(0);

  const auctionPrice = calculateColValue(collateralAvailable, unitPrice);

  const toggleDepositWithdraw = useModalsStore(state => state.toggleDepositWithdraw);

  return (
    <>
      <BidModal
        showDialog={showDialog}
        onDismiss={() => setShowDialog(false)}
        mobile={bpi === 0}
        auction={auction}
        vatBalance={vatBalance}
        unitPrice={unitPrice}
        auctionPrice={auctionPrice}
      />

      {/* Desktop */}
      <Box sx={{ display: ['none', 'none', 'block', 'none', 'block'] }}>
        <Grid sx={{ variant: 'cards.primary', p: 0 }} columns="1fr 1fr 1fr 1fr">
          <Stack gap={1} sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge variant="circle" mr={2} />
                <Text sx={{ color: 'textSecondary' }}>Active</Text>
              </Flex>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>Auction ID {auction.id}</Text>
            </Flex>
            <Stack gap={2}>
              <Flex sx={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap' }}>
                <Icon mr={1} name="calendar" sx={{ color: active ? 'primary' : 'secondary' }} />
                <Text variant="caps" color="secondary">
                  {`${new Date(startDate).toLocaleString('default', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                    timeZone: 'UTC'
                  })} UTC`}
                </Text>
              </Flex>
              <CountdownTimer
                endText={collateralAvailable.gt(0) ? 'Requires Reset' : 'Auction ended'}
                endDate={endDate}
              />
            </Stack>
          </Stack>
          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column', color: 'textSecondary' }}>
              <Text sx={{ color: 'textSecondary' }}>Initial Collateral</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {/* TODO add this when we have the data */}
                {/* {initialCollateral} {symbol.toUpperCase()} */}
                --
              </Text>
            </Flex>
            <Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Vault Owner</Text>
                <ExternalLink href={getEtherscanLink(getNetwork(), urn, 'address')} target="_blank">
                  <Text
                    variant="text"
                    sx={{
                      ':hover': { color: 'primary' },
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatAddress(urn)}
                  </Text>
                </ExternalLink>
              </Flex>
            </Flex>
          </Stack>

          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Collateral Available</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {bigNumToFormat(collateralAvailable, ilk)} {symbol}
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>{`DAI per ${symbol}`}</Text>
              <Text>{bigNumFormatter(unitPrice)}</Text>
            </Flex>
          </Stack>
          <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Button disabled={!hasDai || requiresReset} onClick={() => setShowDialog(true)}>
              {address ? (requiresReset ? 'Auction requires reset' : 'Place a bid') : 'Connect to bid'}
            </Button>
            {address && !hasDai && (
              <Button
                variant="textual"
                sx={{ color: 'primary', fontSize: 1, p: 0 }}
                onClick={toggleDepositWithdraw}
              >
                Deposit DAI to Bid
              </Button>
            )}
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ flexDirection: ['row', 'column'] }}>
                <Tooltip
                  sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                  label={TOOLTIP_DICT.DUST_LIMIT}
                >
                  <Text sx={{ color: 'textSecondary' }}>Dust limit</Text>
                </Tooltip>
                <Text>{dustLimit.toFormat(2)} DAI</Text>
              </Flex>
              <Flex sx={{ flexDirection: ['row', 'column'] }}>
                <Tooltip
                  sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                  label={TOOLTIP_DICT.AUCTION_PRICE}
                >
                  <Text sx={{ color: 'textSecondary' }}>Auction price</Text>
                </Tooltip>
                <Text>{auctionPrice.toFormat(2)} DAI</Text>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </Box>

      {/* Mobile */}
      <Box sx={{ display: ['block', 'block', 'none', 'block', 'none'] }}>
        <Grid sx={{ variant: 'cards.primary', p: 3 }} columns="4fr">
          <Grid columns="2fr 2fr">
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge variant="circle" mr={2} />
                <Text sx={{ color: 'textSecondary' }}>Active</Text>
              </Flex>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>Auction ID {auction.id}</Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap', mb: 1 }}>
                <Icon mr={1} name="calendar" sx={{ color: active ? 'primary' : 'secondary' }} />
                <Text variant="caps" color="secondary">
                  {`${new Date(startDate).toLocaleString('default', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                    timeZone: 'UTC'
                  })} UTC`}
                </Text>
              </Flex>
              <CountdownTimer
                endText={collateralAvailable.gt(0) ? 'Requires Reset' : 'Auction ended'}
                endDate={endDate}
              />
            </Flex>
          </Grid>
          <Grid columns="2fr 2fr">
            <Flex sx={{ flexDirection: 'column', color: 'textSecondary' }}>
              <Text sx={{ color: 'textSecondary' }}>Initial Collateral</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {/* TODO add this when we have the data */}
                {/* {initialCollateral} {symbol.toUpperCase()} */}
                --
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Collateral Available</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {bigNumToFormat(collateralAvailable, ilk)} {symbol}
              </Text>
            </Flex>
          </Grid>
          <Grid columns="2fr 2fr">
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Vault Owner</Text>
              <ExternalLink href={getEtherscanLink(getNetwork(), urn, 'address')} target="_blank">
                <Text
                  variant="text"
                  sx={{
                    ':hover': { color: 'primary' },
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {formatAddress(urn)}
                </Text>
              </ExternalLink>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>{`DAI per ${symbol}`}</Text>
              <Text>{bigNumFormatter(unitPrice)}</Text>
            </Flex>
          </Grid>
          <Button disabled={!hasDai || requiresReset} onClick={() => setShowDialog(true)}>
            {address ? (requiresReset ? 'Auction requires reset' : 'Place a bid') : 'Connect to bid'}
          </Button>
          {address && !hasDai && (
            <Button
              variant="textual"
              sx={{ color: 'primary', fontSize: 1, p: 0 }}
              onClick={toggleDepositWithdraw}
            >
              Deposit DAI to Bid
            </Button>
          )}
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Tooltip
                sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                label={TOOLTIP_DICT.DUST_LIMIT}
              >
                <Text sx={{ color: 'textSecondary' }}>Dust limit</Text>
              </Tooltip>
              <Text>{dustLimit.toFormat(2)} DAI</Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Tooltip
                sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }}
                label={TOOLTIP_DICT.AUCTION_PRICE}
              >
                <Text sx={{ color: 'textSecondary' }}>Auction price</Text>
              </Tooltip>
              <Text sx={{ textAlign: 'right' }}>{auctionPrice.toFormat(2)} DAI</Text>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </>
  );
};

export default AuctionOverviewCard;
