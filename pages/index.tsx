/** @jsx jsx */
import Head from 'next/head';
import { Heading, Container, Text, NavLink, Box, Flex, Grid, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { Global } from '@emotion/core';

import AuctionPreviewCard from '../components/index/AuctionPreviewCard';
import PrimaryLayout from '../components/layouts/Primary';
import Stack from '../components/layouts/Stack';
import SystemStats from '../components/index/SystemStats';

export default function LandingPage(): JSX.Element {
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
                <AuctionPreviewCard />
                <AuctionPreviewCard />
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
