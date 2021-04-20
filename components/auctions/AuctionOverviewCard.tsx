/** @jsx jsx */
import { useState } from 'react';
import { Box, Button, Text, Flex, Grid, Link as ExternalLink, jsx, Badge } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { Icon } from '@makerdao/dai-ui-icons';
import BigNumber from 'bignumber.js';

import Auction from 'types/auction';
import { useAuctionStatus } from 'lib/hooks';
// import Tooltip from 'components/shared/Tooltip';
import Stack from 'components/layouts/Stack';
import CountdownTimer from 'components/shared/CountdownTimer';
import BidModal from './BidModal';
import { COLLATERAL_MAP } from 'lib/constants';

type Props = {
  auction: Auction;
  vatBalance: string;
  daiBalance: string;
};

const AuctionOverviewCard = ({ auction, vatBalance, daiBalance }: Props): JSX.Element => {
  const {
    id,
    active,
    ilk,
    initialCollateral,
    urn,
    collateralAvailable,
    daiNeeded,
    dustLimit,
    startDate,
    endDate
  } = auction;

  const [showDialog, setShowDialog] = useState(false);
  const bpi = useBreakpointIndex();

  const { auctionPrice } = useAuctionStatus(id);
  const { symbol } = COLLATERAL_MAP[ilk];
  const canBid = new BigNumber(vatBalance).gt(0);

  return (
    <>
      <BidModal
        showDialog={showDialog}
        onDismiss={() => setShowDialog(false)}
        mobile={bpi === 0}
        auction={auction}
        vatBalance={vatBalance}
        daiBalance={daiBalance}
        auctionPrice={auctionPrice}
      />

      <Box>
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
              <CountdownTimer endText="Auction ended" endDate={endDate} />
            </Stack>
          </Stack>
          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column', color: 'textSecondary' }}>
              <Text sx={{ color: 'textSecondary' }}>Initial Collateral</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {initialCollateral} {symbol.toUpperCase()}
              </Text>
            </Flex>
            <Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                {/* TODO do we want a tooltip here? */}
                {/* <Tooltip label="Placeholder text explaining what Urn handler/Vault owner is"> */}
                <Text sx={{ color: 'textSecondary' }}>Vault Owner</Text>
                {/* </Tooltip> */}
                <ExternalLink href={`https://etherscan.io/address/${urn}`} target="_blank">
                  <Text
                    variant="text"
                    sx={{
                      ':hover': { color: 'primary' },
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {urn}
                  </Text>
                </ExternalLink>
              </Flex>
            </Flex>
          </Stack>

          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Collateral Available</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {collateralAvailable} {symbol.toUpperCase()}
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>DAI needed</Text>
              <Text>{daiNeeded} DAI</Text>
            </Flex>
          </Stack>
          <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Button disabled={!canBid} onClick={() => setShowDialog(true)}>
              Place a bid
            </Button>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Dust limit</Text>
                <Text>{dustLimit} DAI</Text>
              </Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Auction price</Text>
                <Text>{auctionPrice.toFormat(2)} DAI</Text>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </Box>
    </>
  );
};

export default AuctionOverviewCard;
