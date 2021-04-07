/** @jsx jsx */
import { useState } from 'react';
import { Button, Text, Flex, Grid, Link as ExternalLink, jsx, Badge } from 'theme-ui';
import { useBreakpointIndex } from '@theme-ui/match-media';
import { Icon } from '@makerdao/dai-ui-icons';

import { getNetwork } from 'lib/maker';
import Auction from 'types/auction';
import Tooltip from 'components/shared/Tooltip';
import Stack from 'components/layouts/Stack';
import CountdownTimer from 'components/shared/CountdownTimer';
import BidModal from './BidModal';
import BigNumber from 'bignumber.js';

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

  const canBid = vatBalance?.gt(0);

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
            <Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Flex
                  sx={{
                    alignItems: 'center'
                  }}
                >
                  <Tooltip label="Placeholder text explaining what a Urn Handler is">
                    <Text sx={{ color: 'textSecondary' }}>Urn Handler</Text>
                  </Tooltip>
                  <ExternalLink href={`https://etherscan.io/address/${urn}`} target="_blank">
                    <Icon ml={2} name="arrowTopRight" size="2" color="primary" />
                  </ExternalLink>
                </Flex>
                <Text>{urn}</Text>
              </Flex>
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
            <Button disabled={!canBid} onClick={() => setShowDialog(true)}>
              Place a bid
            </Button>
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
