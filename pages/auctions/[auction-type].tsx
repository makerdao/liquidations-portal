/** @jsx jsx */
import Head from 'next/head';
import useSWR from 'swr';
import { Heading, Image, Text, Box, Flex, jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import SystemStatsSidebar from 'components/shared/SystemStatsSidebar';
import ResourceBox from 'components/shared/ResourceBox';
import SidebarLayout from 'components/layouts/Sidebar';
import PrimaryLayout from 'components/layouts/Primary';
import AuctionOverviewCard from 'components/auctions/AuctionOverviewCard';
import AuctionOverviewSkeleton from 'components/auctions/AuctionOverviewSkeleton';
import Stack from 'components/layouts/Stack';
import getMaker from 'lib/maker';
import { COLLATERAL_MAP } from 'lib/constants';
import Auction from 'types/auction';
import { fetchAuctions } from '../index'; //todo move to lib/api

export default function Auctions(): JSX.Element | null {
  const router = useRouter();
  const type = router.query['auction-type']?.toString();

  // return loading indicator instead?
  if (!type) return null;

  const { bannerPng, iconSvg, symbol } = COLLATERAL_MAP[type];

  // TODO: update to pull the right auctions
  const { data: auctions } = useSWR<Auction[]>(`/auctions/fetch-${type}`, () =>
    getMaker().then(fetchAuctions)
  );
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

      {/* full width banner image */}
      <Flex
        sx={{
          top: 90,
          left: 0,
          width: '100vw',
          height: 150,
          zIndex: -1,
          position: 'absolute',
          backgroundImage: `url(${bannerPng})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          src={iconSvg}
          sx={{
            height: 44,
            maxWidth: 'none'
          }}
        />
        <Text variant="largeHeading" sx={{ pl: 3, color: 'surface' }}>
          {symbol}
        </Text>
      </Flex>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'], mt: 180 }}>
        <SidebarLayout sx={{ mt: 4 }}>
          <Stack gap={5}>
            <Box>
              <Stack gap={2}>
                <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Heading as="h2">{`Active ${type?.toUpperCase()} Auctions`}</Heading>
                  {/* TODO: replace with dynamic auction data */}
                  <Text variant="smallText" sx={{ color: 'textSecondary' }}>
                    3 AUCTIONS - POSTED MAY 18 2021 16:01 UTC{' '}
                  </Text>
                </Flex>
                {/* TODO: implement refresh when network calls integrated */}
                {/* <Flex sx={{ alignItems: 'center' }} onClick={console.log}>
                <Icon name="edit" size={3} mr={1} sx={{ color: 'primary' }} />
                <Text>Refresh Data</Text>
              </Flex> */}
              </Stack>
              <Stack gap={2}>
                {auctions ? (
                  auctions?.map(
                    auction =>
                      auction.name === type && (
                        <AuctionOverviewCard key={auction.id} auction={auction} vatBalance={vatBalance} />
                      )
                  )
                ) : (
                  <AuctionOverviewSkeleton />
                )}
              </Stack>
            </Box>
            <Box>
              <Stack gap={2}>
                {/* TODO: replace with inactive auction data */}
                <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Heading as="h2">{`Inactive ${type?.toUpperCase()} Auctions`}</Heading>
                  {/* TODO: replace with dynamic auction data */}
                  <Text variant="smallText" sx={{ color: 'textSecondary' }}>
                    3 AUCTIONS - POSTED MAY 18 2021 16:01 UTC{' '}
                  </Text>
                </Flex>
                {/* TODO: implement refresh when network calls integrated */}
                {/* <Flex sx={{ alignItems: 'center' }} onClick={console.log}>
                <Icon name="edit" size={3} mr={1} sx={{ color: 'primary' }} />
                <Text>Refresh Data</Text>
              </Flex> */}
              </Stack>
              <Stack>
                {auctions ? (
                  auctions?.map(
                    auction =>
                      auction.name === type && (
                        <AuctionOverviewCard key={auction.id} auction={auction} vatBalance={vatBalance} />
                      )
                  )
                ) : (
                  <AuctionOverviewSkeleton />
                )}
              </Stack>
            </Box>
          </Stack>
          <Stack gap={3}>
            <SystemStatsSidebar />
            <ResourceBox />
          </Stack>
        </SidebarLayout>
      </PrimaryLayout>
    </div>
  );
}
