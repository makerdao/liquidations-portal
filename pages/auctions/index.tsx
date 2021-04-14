/** @jsx jsx */
import Head from 'next/head';
import useSWR from 'swr';
import { Heading, Text, Box, Flex, jsx } from 'theme-ui';
import BigNumber from 'bignumber.js';

import SystemStatsSidebar from 'components/shared/SystemStatsSidebar';
import ResourceBox from 'components/shared/ResourceBox';
import SidebarLayout from 'components/layouts/Sidebar';
import PrimaryLayout from 'components/layouts/Primary';
import AuctionOverviewCard from 'components/auctions/AuctionOverviewCard';
import AuctionOverviewSkeleton from 'components/auctions/AuctionOverviewSkeleton';
import Stack from 'components/layouts/Stack';
import getMaker from 'lib/maker';
import { useAuctions } from 'lib/hooks';

export default function Auctions(): JSX.Element {
  const { data: auctions } = useAuctions();
  const { data: vatBalance } = useSWR<BigNumber>('/balances/vat', () =>
    getMaker().then(maker =>
      maker.service('smartContract').getContract('MCD_VAT').dai(maker.currentAddress())
    )
  );
  return (
    <div>
      <Head>
        <title>Maker Liquidation Portal - Auctions</title>
      </Head>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'] }}>
        <SidebarLayout sx={{ mt: 4 }}>
          <Box>
            <Stack gap={2}>
              <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Heading as="h2">Active Auctions</Heading>
                {/* TODO: replace with dynamic auction data */}
                <Text variant="smallText" sx={{ color: 'textSecondary' }}>
                  3 AUCTIONS - POSTED MAY 18 2021 16:01 UTC{' '}
                </Text>
              </Flex>
            </Stack>
            <Stack>
              {auctions ? (
                auctions?.map(auction => (
                  <AuctionOverviewCard key={auction.id} auction={auction} vatBalance={vatBalance} />
                ))
              ) : (
                <AuctionOverviewSkeleton />
              )}
            </Stack>
          </Box>
          <Stack gap={3}>
            {/* <SystemStatsSidebar /> */}
            <ResourceBox />
          </Stack>
        </SidebarLayout>
      </PrimaryLayout>
    </div>
  );
}
