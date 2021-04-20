/** @jsx jsx */
import Head from 'next/head';
import useSWR from 'swr';
import { useState } from 'react';
import { Button, Heading, Image, Text, Box, Flex, jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';
import Skeleton from 'react-loading-skeleton';

import SystemStatsSidebar from 'components/shared/SystemStatsSidebar';
import ResourceBox from 'components/shared/ResourceBox';
import SidebarLayout from 'components/layouts/Sidebar';
import PrimaryLayout from 'components/layouts/Primary';
import AuctionOverviewCard from 'components/auctions/AuctionOverviewCard';
import AuctionOverviewSkeleton from 'components/auctions/AuctionOverviewSkeleton';
import Stack from 'components/layouts/Stack';
import getMaker from 'lib/maker';
import { COLLATERAL_MAP } from 'lib/constants';
import { getAuctionsByStatus } from 'lib/utils';
import { useAuctions, useVatGemBalance } from 'lib/hooks';
import { transactionsApi } from 'stores/transactions';
import useAccountsStore from 'stores/accounts';

export default function Auctions(): JSX.Element | null {
  const router = useRouter();
  const type = router.query['auction-type']?.toString().toLowerCase();
  const account = useAccountsStore(state => state.currentAccount);
  const [isTxProcessing, setIsTxProcessing] = useState(false);

  const { data: auctions } = useAuctions(type);

  //TODO: get ilk type from collateral map
  const { data: vatGemBalance } = useVatGemBalance('LINK-A', account?.address);

  const { data: vatBalance } = useSWR<BigNumber>('/balances/vat', () =>
    getMaker().then(maker =>
      maker.service('smartContract').getContract('MCD_VAT').dai(maker.currentAddress())
    )
  );
  const redeemCollateral = async ilk => {
    const maker = await getMaker();
    const txCreator = () => maker.service('liquidation').exitGemFromAdapter(ilk, vatGemBalance);

    await transactionsApi.getState().track(txCreator, `Exiting ${vatGemBalance.toFormat(18)} ${ilk}`, {
      pending: () => {
        setIsTxProcessing(true);
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, `Exited ${vatGemBalance.toFormat(18)} ${ilk}`);
        setIsTxProcessing(false);
      },
      error: () => {
        setIsTxProcessing(false);
      }
    });
  };

  if (!type) return null;

  const ilkData = COLLATERAL_MAP[type];

  // TODO: add error state here if true
  if (!ilkData) return null;

  const { bannerPng, iconSvg, ilk } = ilkData;

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
          {ilk}
        </Text>
      </Flex>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'], mt: 180 }}>
        <SidebarLayout sx={{ mt: 4 }}>
          <Stack gap={5}>
            <Box>
              <Stack gap={2}>
                <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Heading as="h2">{`Active ${type?.toUpperCase()} Auctions`}</Heading>
                  {vatGemBalance && vatGemBalance.gt(0) && (
                    <Button
                      sx={{
                        variant: 'buttons.card',
                        borderRadius: 'round',
                        '&:hover': {
                          color: 'text',
                          borderColor: 'onSecondary',
                          backgroundColor: 'white'
                        }
                      }}
                      onClick={() => redeemCollateral(ilk)}
                      disabled={isTxProcessing}
                    >
                      <Text sx={{ fontSize: 2, color: 'textMuted', px: 2 }}>
                        {vatGemBalance.toFormat(2)} LINK to Redeem
                      </Text>
                    </Button>
                  )}
                </Flex>
              </Stack>
              <Stack gap={2}>
                {auctions ? (
                  (activeAuctions || []).map(
                    auction =>
                      auction.ilk === type && (
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
                      auction.ilk === type && (
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
            <SystemStatsSidebar ilk={ilk} />
            <ResourceBox />
          </Stack>
        </SidebarLayout>
      </PrimaryLayout>
    </div>
  );
}
