/** @jsx jsx */
import { useState } from 'react';
import { Button, Text, Flex, Grid, jsx, Badge } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';

import Stack from '../layouts/Stack';
import { getNetwork } from '../../lib/maker';
import CountdownTimer from '../CountdownTimer';
import Auction from '../../types/auction';
import BigNumber from 'bignumber.js';
import BidModal from './BidModal';

type Props = {
  auction: Auction;
  vatBalance: BigNumber | undefined;
};

const AuctionOverviewCard = ({ auction, vatBalance, ...props }: Props): JSX.Element => {
  const [showDialog, setShowDialog] = useState(false);

  const network = getNetwork();
  const bpi = useBreakpointIndex();

  const {
    name,
    initialCollateral,
    urn,
    collateralAvailable,
    daiNeeded,
    dustLimit,
    maxBid,
    endDate
  } = auction;

  return (
    <>
      <BidModal
        showDialog={showDialog}
        onDismiss={() => setShowDialog(false)}
        mobile={bpi === 0}
        auction={auction}
        vatBalance={vatBalance}
      />

      <div {...props}>
        <Grid sx={{ variant: 'cards.primary', p: 0 }} columns="1fr 1fr 1fr 1fr">
          <Stack gap={1} sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge variant="circle" mr={2} />
                <Text sx={{ color: 'textSecondary' }}>Active</Text>
              </Flex>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>Auction ID {auction.id}</Text>
            </Flex>
            <CountdownTimer endText="Auction ended" endDate={endDate} />
          </Stack>
          <Stack gap={4}>
            <Flex sx={{ flexDirection: 'column', color: 'textSecondary' }}>
              <Text sx={{ color: 'textSecondary' }}>Initial Collateral</Text>
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {initialCollateral} {name.toUpperCase()}
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
              <Text sx={{ fontWeight: 'bold', fontSize: 6 }}>
                {collateralAvailable} {name.toUpperCase()}
              </Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ color: 'textSecondary' }}>DAI needed</Text>
              <Text>{daiNeeded} DAI</Text>
            </Flex>
          </Stack>
          <Flex sx={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <Button onClick={() => setShowDialog(true)}>Place a bid</Button>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Dust limit</Text>
                <Text>{dustLimit} DAI</Text>
              </Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Max bid</Text>
                <Text>{maxBid} DAI</Text>
              </Flex>
            </Flex>
          </Flex>
        </Grid>
      </div>
    </>
  );
};

export default AuctionOverviewCard;
