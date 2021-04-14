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
import { getAllClips } from 'lib/api';
import getMaker from 'lib/maker';
import { COLLATERAL_MAP } from 'lib/constants';
import { transformAuctions, getAuctionsByStatus } from 'lib/utils';
import Auction from 'types/auction';
import Skeleton from 'react-loading-skeleton';

export async function fetchIlkAuctions(): Promise<Auction[]> {
  const response = await getAllClips('LINK-A');

  return transformAuctions(response);
}

export default function Auctions(): JSX.Element | null {
  const router = useRouter();
  const type = router.query['auction-type']?.toString().toLowerCase();

  // TODO: return loading indicator instead?
  if (!type) return null;

  const ilkData = COLLATERAL_MAP[type];

  // TODO: add error state here if true
  if (!ilkData) return null;

  const { bannerPng, iconSvg, symbol } = ilkData;

  const fetchIlkAuctions = async (ilk: string): Promise<Auction[]> => {
    const response = await getAllClips(ilk);

    return transformAuctions(response);
  };

  // TODO: update to pull the right auctions
  const { data: auctions } = useSWR<Auction[]>(`/auctions/fetch-${type}`, () => fetchIlkAuctions(type));
  const { data: vatBalance } = useSWR<BigNumber>('/balances/vat', () =>
    getMaker().then(maker =>
      maker.service('smartContract').getContract('MCD_VAT').dai(maker.currentAddress())
    )
  );

  const activeAuctions = auctions && getAuctionsByStatus(auctions, true);
  const inactiveAuctions = auctions && getAuctionsByStatus(auctions, false);
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
                    {auctions ? (
                      `${(activeAuctions || []).length} AUCTIONS - POSTED MAY 18 2021 16:01 UTC`
                    ) : (
                      <Box sx={{ width: 7 }}>
                        <Skeleton />
                      </Box>
                    )}
                  </Text>
                </Flex>
              </Stack>
              <Stack gap={2}>
                {auctions ? (
                  (activeAuctions || []).map(
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
                    {auctions ? (
                      `${(inactiveAuctions || []).length} AUCTIONS - POSTED MAY 18 2021 16:01 UTC`
                    ) : (
                      <Box sx={{ width: 7 }}>
                        <Skeleton />
                      </Box>
                    )}
                  </Text>
                </Flex>
              </Stack>
              <Stack gap={2}>
                {auctions ? (
                  (inactiveAuctions || []).map(
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
            <SystemStatsSidebar ilk={symbol} />
            <ResourceBox />
          </Stack>
        </SidebarLayout>
      </PrimaryLayout>
    </div>
  );
}
