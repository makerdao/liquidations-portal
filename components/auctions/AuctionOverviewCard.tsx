/** @jsx jsx */
import { useState } from 'react';
import { Button, Text, Flex, Grid, jsx } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import Stack from '../layouts/Stack';
import { fadeIn, slideUp } from '../../lib/keyframes';
import { getNetwork } from '../../lib/maker';
import CountdownTimer from '../CountdownTimer';
import Auction from '../../types/auction';
import BidModal from './BidModal';

// Remove and replace with data from the plugin
const mocks = {
  colAvailable: '9899.78',
  minBid: '9899.78',
  maxBid: '120',
  vatBalance: '9992.00'
};

type Props = {
  auction: Auction;
};

const AuctionOverviewCard = ({ auction, ...props }: Props): JSX.Element => {
  const [showDialog, setShowDialog] = useState(false);

  const network = getNetwork();
  const bpi = useBreakpointIndex();

  const { name, initialCollateral, urn, collateralAvailable, daiNeeded, minBid, maxBid } = auction;

  return (
    <>
      <BidModal
        showDialog={showDialog}
        onDismiss={() => setShowDialog(false)}
        mobile={bpi === 0}
        auction={auction}
        vatBalance={mocks.vatBalance}
      />

      <div {...props}>
        <Grid sx={{ variant: 'cards.primary', p: 0 }} columns="1fr 1fr 1fr 1fr">
          <Stack gap={1} sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Active</Text>
              <Text sx={{ fontWeight: 'semiBold', fontSize: 3 }}>Auction ID {auction.id}</Text>
            </Flex>
            <CountdownTimer endText="Poll ended" endDate={'1617115343902'} />
            {/* <Text
              variant="caps"
              sx={{
                color: 'textSecondary'
              }}
            >
              <Text>Auction ID {auction.id}</Text>
              {/* {new Date(poll.startDate).toLocaleString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })} */}
          </Stack>
          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column', color: 'textSecondary' }}>
              <Text sx={{ color: 'textSecondary' }}>Initial Collateral</Text>
              <Text>
                {initialCollateral} {name}
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Urn Handler</Text>
              <Text>{urn}</Text>
            </Flex>
          </Stack>

          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Collateral Available</Text>
              <Text>
                {collateralAvailable} {name}
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>Dai to raise</Text>
              <Text>{daiNeeded} DAI</Text>
            </Flex>
          </Stack>
          <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Button onClick={() => setShowDialog(true)}>Place a bid</Button>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Min bid</Text>
                <Text>{minBid} Dai</Text>
              </Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Max bid</Text>
                <Text>{maxBid} Dai</Text>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </div>
    </>
  );
};

export default AuctionOverviewCard;
