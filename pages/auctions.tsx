/** @jsx jsx */
import Head from 'next/head';
import { Heading, Text, Box, Flex, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { Global } from '@emotion/core';

import SystemStatsSidebar from '../components/SystemStatsSidebar';
import ResourceBox from '../components/ResourceBox';
import SidebarLayout from '../components/layouts/Sidebar';
import PrimaryLayout from '../components/layouts/Primary';
import AuctionOverviewCard from '../components/auctions/AuctionOverviewCard';
import Stack from '../components/layouts/Stack';

const auctions = [{ id: 998 }];

export default function Auctions(): JSX.Element {
  return (
    <div>
      <Head>
        <title>Maker Liquidation Portal - Auctions</title>
      </Head>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'] }}>
        <Stack gap={2}>
          <Box>
            <Heading as="h2">Active Auctions</Heading>
          </Box>
          <Flex sx={{ alignItems: 'center' }} onClick={console.log}>
            <Icon name="edit" size={3} mr={1} sx={{ color: 'primary' }} />
            <Text>Refresh Data</Text>
          </Flex>
        </Stack>
        <SidebarLayout sx={{ mt: 4 }}>
          <Stack>
            {auctions.map(auction => (
              <AuctionOverviewCard key={auction.id} auction={auction} />
            ))}
          </Stack>
          <Stack gap={3}>
            <SystemStatsSidebar />
            <ResourceBox />
          </Stack>
        </SidebarLayout>
      </PrimaryLayout>
      <Global
        styles={theme => ({
          body: {
            backgroundColor: theme.colors.surface
          }
        })}
      />
    </div>
  );
}
