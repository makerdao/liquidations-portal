/** @jsx jsx */
import Head from 'next/head';
import useSWR from 'swr';
import { Heading, Container, Text, NavLink, Box, Flex, Grid, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { Global } from '@emotion/core';

import Auction from '../types/auction';
import AuctionPreviewCard from '../components/index/AuctionPreviewCard';
import AuctionPreviewSkeleton from '../components/index/AuctionPreviewSkeleton';
import PrimaryLayout from '../components/layouts/Primary';
import Stack from '../components/layouts/Stack';
import SystemStats from '../components/index/SystemStats';
import getMaker from '../lib/maker';

const mockAuctions: Auction[] = [
  {
    id: 123,
    name: 'link',
    initialCollateral: '8000',
    urn: '0x123',
    collateralAvailable: '3000',
    daiNeeded: '4000',
    dustLimit: '111',
    maxBid: '999'
  },
  {
    id: 234,
    name: 'yfi',
    initialCollateral: '4000',
    urn: '0x345',
    collateralAvailable: '1000',
    daiNeeded: '6000',
    dustLimit: '222',
    maxBid: '888'
  }
];

export async function fetchAuctions(): Promise<Auction[]> {
  return Promise.resolve(mockAuctions);
}

export default function LandingPage(): JSX.Element {
  const { data: auctions } = useSWR('/auctions/fetch-all', () => getMaker().then(fetchAuctions));
  return (
    <div>
      <Head>
        <title>Maker Liquidation Portal</title>
      </Head>

      <PrimaryLayout sx={{ maxWidth: 'page' }}>
        <Stack gap={[5, 6]}>
          <section>
            <Stack gap={[4, 6]}>
              <Container pt={4} sx={{ maxWidth: 'title', textAlign: 'center' }}>
                <Stack gap={3}>
                  <Heading as="h1" sx={{ color: 'text', fontSize: [7, 8] }}>
                    Maker Liquidation Portal
                  </Heading>
                  <Text
                    as="p"
                    mb="3"
                    sx={{
                      color: 'text',
                      opacity: '0.7',
                      fontWeight: 500,
                      fontSize: [3, 5],
                      px: [3, 'inherit']
                    }}
                  >
                    ....lorem ipsum...Giving humans the ability to access large blocks of collateral without
                    slippage....lorem ipsum...
                  </Text>
                  <Flex sx={{ width: ['100%', '85%'], justifyContent: 'center', alignSelf: 'center' }}>
                    <NavLink
                      href={'/education'}
                      sx={{
                        fontSize: 2,
                        px: '3',
                        borderRadius: 'round',
                        border: '1px solid',
                        borderColor: 'primary',
                        color: 'surface',
                        alignItems: 'center',
                        backgroundColor: 'primary',
                        display: 'inline-flex',
                        '&:hover': {
                          backgroundColor: 'primaryEmphasis',
                          color: 'surface'
                        }
                      }}
                    >
                      <Box pb="2px">Learn more about liquidations</Box>
                      <Icon name="chevron_right" color="surface" size="3" ml="3" pb="1px" />
                    </NavLink>
                  </Flex>
                </Stack>
              </Container>
            </Stack>
          </section>

          <section>
            <SystemStats />
          </section>

          <section>
            <Stack>
              <Heading as="h2">Active Auctions</Heading>
              <Grid gap={4} columns={[1, 3]}>
                {auctions ? (
                  auctions.map(auction => <AuctionPreviewCard key={auction.id} auction={auction} />)
                ) : (
                  <AuctionPreviewSkeleton />
                )}
              </Grid>
            </Stack>
          </section>
        </Stack>
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
