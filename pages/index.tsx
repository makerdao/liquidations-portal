/** @jsx jsx */
import Head from 'next/head';
import useSWR from 'swr';
import { Button, Heading, Container, Text, NavLink, Box, Flex, Grid, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { transformAuctions } from 'lib/utils';
import { getAllClips } from 'lib/api';
import Auction from 'types/auction';
import AuctionPreviewCard from 'components/index/AuctionPreviewCard';
import AuctionPreviewSkeleton from 'components/index/AuctionPreviewSkeleton';
import PrimaryLayout from 'components/layouts/Primary';
import Stack from 'components/layouts/Stack';
import SystemStats from 'components/index/SystemStats';
import useAccountsStore from 'stores/accounts';
import { useModalsStore } from 'stores/modals';

export async function fetchAuctions(): Promise<Auction[]> {
  const response = await getAllClips('LINK-A');

  return transformAuctions(response);
}

export default function LandingPage(): JSX.Element {
  const { data: auctions } = useSWR('/auctions/fetch-all', fetchAuctions);
  const account = useAccountsStore(state => state.currentAccount);
  const toggleDepositRedeem = useModalsStore(state => state.toggleDepositRedeem);

  return (
    <div>
      <Head>
        <title>Maker Liquidation Portal</title>
      </Head>

      {/* full width banner image */}
      <Box
        sx={{
          width: '100vw',
          position: 'absolute',
          backgroundImage: 'url(/assets/hero-visual.svg)',
          backgroundSize: ['cover'],
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          top: 0,
          left: 0,
          height: 525,
          zIndex: -1
        }}
      />

      {/* full width white background */}
      <Box
        sx={{
          display: ['none', 'none', 'block'],
          position: 'absolute',
          bg: 'surface',
          width: '100vw',
          top: 530,
          left: 0,
          height: 185,
          zIndex: -2
        }}
      />

      <PrimaryLayout sx={{ maxWidth: 'page' }}>
        <Stack gap={[5, 6]}>
          <section>
            <Stack gap={[4, 6]}>
              <Container pt={4} sx={{ maxWidth: 'title', textAlign: 'center' }}>
                <Stack gap={3}>
                  <Heading as="h1" sx={{ color: 'text', fontSize: [7, 8] }}>
                    Liquidations 2.0
                  </Heading>
                  <Text
                    as="p"
                    sx={{
                      color: 'bannerText',
                      fontSize: [3, '18px'],
                      px: [3, 6],
                      py: 3
                    }}
                  >
                    To participate in collateral auctions, first you need to deposit Dai in the VAT
                  </Text>
                  <Flex
                    sx={{ flexDirection: ['column', 'row'], justifyContent: 'center', alignItems: 'center' }}
                  >
                    <NavLink
                      href={'/education'}
                      sx={{
                        px: 3,
                        borderRadius: 'round',
                        border: '1px solid',
                        borderColor: 'primary',
                        color: account ? 'text' : 'surface',
                        backgroundColor: account ? 'surface' : 'primary',
                        display: 'inline-flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minWidth: [295, 'auto'],
                        '&:hover': {
                          borderColor: 'primaryEmphasis',
                          color: account ? 'primaryEmphasis' : 'surface'
                        }
                      }}
                    >
                      <Text>Learn more about liquidations</Text>
                      <Icon name="chevron_right" color={account ? 'primary' : 'surface'} size="3" ml="3" />
                    </NavLink>
                    {account && (
                      <Button
                        onClick={toggleDepositRedeem}
                        sx={{
                          px: 3,
                          ml: [0, 3],
                          mt: [3, 0],
                          borderRadius: 'round',
                          border: '1px solid',
                          borderColor: 'primary',
                          color: 'surface',
                          backgroundColor: 'primary',
                          display: 'inline-flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          minWidth: [295, 'auto'],
                          '&:hover': {
                            backgroundColor: 'primaryEmphasis',
                            color: 'surface'
                          }
                        }}
                      >
                        <Text sx={{ fontSize: 3, fontWeight: 'normal' }}>Deposit DAI to start bidding</Text>
                        <Icon name="chevron_right" color="surface" size="3" ml="3" />
                      </Button>
                    )}
                  </Flex>
                </Stack>
              </Container>
            </Stack>
          </section>

          <section>
            <SystemStats />
          </section>
        </Stack>

        <section sx={{ py: 4 }}>
          <Stack>
            <Heading as="h3" sx={{ fontWeight: 'heading' }}>
              Active Auctions
            </Heading>
            <Grid gap={4} columns={[1, 3]}>
              {auctions ? (
                auctions.map(auction => <AuctionPreviewCard key={auction.id} auction={auction} />)
              ) : (
                <AuctionPreviewSkeleton />
              )}
            </Grid>
          </Stack>
        </section>
      </PrimaryLayout>
    </div>
  );
}
