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
  colAvailable: '9899.78'
};

type Props = {
  auction: Auction;
};

const AuctionOverviewCard = ({ auction, ...props }: Props): JSX.Element => {
  const [showDialog, setShowDialog] = useState(false);

  const network = getNetwork();
  const bpi = useBreakpointIndex();

  return (
    <>
      <BidModal
        showDialog={showDialog}
        onDismiss={() => setShowDialog(false)}
        colAvailable={mocks.colAvailable}
        mobile={bpi === 0}
      />

      <div {...props}>
        <Grid sx={{ variant: 'cards.primary', p: 0 }} columns="1fr 1fr 1fr 1fr">
          <Stack gap={1}>
            <CountdownTimer endText="Poll ended" endDate={'1617115343902'} />
            <Text sx={{ fontWeight: 'semiBold', fontSize: 3 }}>Auction ID {auction.id}</Text>
            <Text>Active</Text>
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
              <Text>Initial Collateral</Text>
              <Text>8000 LINK</Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text>Urn Handler</Text>
              <Text>0x123849</Text>
            </Flex>
          </Stack>

          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text>Collateral Available</Text>
              <Text>3000 LINK</Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text>Dai to raise</Text>
              <Text>4000 DAI</Text>
            </Flex>
          </Stack>
          <Flex sx={{ flexDirection: 'column' }}>
            <Button onClick={() => setShowDialog(true)}>Place a bid</Button>
          </Flex>
        </Grid>
      </div>
    </>
  );
};

export default AuctionOverviewCard;
