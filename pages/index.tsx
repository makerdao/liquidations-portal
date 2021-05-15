/** @jsx jsx */
import Head from 'next/head';
import { Badge, Button, Heading, Container, Text, NavLink, Box, Flex, Grid, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

import { COLLATERAL_ARRAY } from 'lib/constants';
import { useAuctions } from 'lib/hooks';
import { getAuctionsByStatus, getAuctionsByIlk } from 'lib/utils';
import AuctionPreviewCard from 'components/index/AuctionPreviewCard';
import AuctionPreviewSkeleton from 'components/index/AuctionPreviewSkeleton';
import SystemStats from 'components/index/SystemStats';
import PrimaryLayout from 'components/layouts/Primary';
import Stack from 'components/layouts/Stack';
import NoActiveAuctions from 'components/shared/NoActiveAuctions';
import useAccountsStore from 'stores/accounts';
import { useModalsStore } from 'stores/modals';

export default function LandingPage(): JSX.Element {
  const { data: auctions, loading: auctionsLoading, error: auctionsError } = useAuctions('all');
  const activeAuctions = getAuctionsByStatus(auctions, true);
  const inactiveAuctions = getAuctionsByStatus(auctions, false);
  const account = useAccountsStore(state => state.currentAccount);
  const toggleDepositWithdraw = useModalsStore(state => state.toggleDepositWithdraw);

  return (
    <div>
      <Head>
        <title>Maker Liquidations Portal</title>
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
                        onClick={toggleDepositWithdraw}
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
          <Stack gap={5}>
            <Stack>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge
                  variant="circle"
                  p="3px"
                  mr="3"
                  bg={activeAuctions.length > 0 ? 'primary' : auctionsError ? 'error' : 'textSecondary'}
                />
                <Heading as="h3" sx={{ fontWeight: 'heading' }}>
                  Active Auctions
                </Heading>
              </Flex>
              <Grid gap={4} columns={[1, 3]}>
                {auctionsLoading ? (
                  <>
                    <AuctionPreviewSkeleton />
                    <AuctionPreviewSkeleton />
                    <AuctionPreviewSkeleton />
                  </>
                ) : (
                  COLLATERAL_ARRAY.map(type => {
                    const ilkAuctions = getAuctionsByIlk(activeAuctions, type.ilk);
                    return (
                      auctions &&
                      ilkAuctions.length > 0 && (
                        <Box key={type.ilk}>
                          <AuctionPreviewCard key={type.name} type={type} auctions={ilkAuctions} />
                        </Box>
                      )
                    );
                  })
                )}
              </Grid>
              {((auctions && activeAuctions.length === 0) || (!auctions && auctionsError)) && (
                <NoActiveAuctions error={!auctions && auctionsError ? auctionsError : undefined} />
              )}
            </Stack>
            {auctions && inactiveAuctions.length > 0 && (
              <Stack>
                <Flex sx={{ alignItems: 'center' }}>
                  <Badge variant="circle" p="3px" mr="3" bg="badgeOrange" />
                  <Heading as="h3" sx={{ fontWeight: 'heading' }}>
                    Inactive Auctions
                  </Heading>
                </Flex>
                <Grid gap={4} columns={[1, 3]}>
                  {COLLATERAL_ARRAY.map(type => {
                    const ilkAuctions = getAuctionsByIlk(inactiveAuctions, type.ilk);
                    return (
                      <Box key={type.ilk}>
                        {auctionsLoading && <AuctionPreviewSkeleton />}
                        {auctions && ilkAuctions.length > 0 && (
                          <AuctionPreviewCard key={type.name} type={type} auctions={ilkAuctions} />
                        )}
                      </Box>
                    );
                  })}
                </Grid>
              </Stack>
            )}
          </Stack>
        </section>
      </PrimaryLayout>
    </div>
  );
}
