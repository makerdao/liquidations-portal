/** @jsx jsx */
import Head from 'next/head';
import { useState } from 'react';
import { Button, Heading, Image, Text, Box, Flex, jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';

import SystemStatsSidebar from 'components/shared/SystemStatsSidebar';
import ResourceBox from 'components/shared/ResourceBox';
import SidebarLayout from 'components/layouts/Sidebar';
import PrimaryLayout from 'components/layouts/Primary';
import AuctionOverviewCard from 'components/auctions/AuctionOverviewCard';
import AuctionOverviewSkeleton from 'components/auctions/AuctionOverviewSkeleton';
import NoActiveAuctions from 'components/shared/NoActiveAuctions';
import Stack from 'components/layouts/Stack';
import { COLLATERAL_MAP } from 'lib/constants';
import getMaker from 'lib/maker';
import { getAuctionsByStatus } from 'lib/utils';
import { useAuctions, useVatGemBalance, useAccountVatBalance } from 'lib/hooks';
import { transactionsApi } from 'stores/transactions';
import useAccountsStore from 'stores/accounts';

export default function Auctions(): JSX.Element | null {
  // router params
  const router = useRouter();
  const type = router.query['auction-type']?.toString().toLowerCase();

  const ilkData = type ? COLLATERAL_MAP[type.toUpperCase()] : undefined;

  // auction data
  const { data: auctions, error: auctionsError } = useAuctions(ilkData?.ilk);
  const activeAuctions = auctions && getAuctionsByStatus(auctions, true);
  const inactiveAuctions = auctions && getAuctionsByStatus(auctions, false);

  // account data
  const account = useAccountsStore(state => state.currentAccount);
  const address = account?.address;

  // balances
  const { data: vatGemBalance } = useVatGemBalance(ilkData?.ilk, address);
  const { data: vatBalance = new BigNumber(0) } = useAccountVatBalance(address);

  // tx processing state
  const [isTxProcessing, setIsTxProcessing] = useState(false);

  // TODO: add error state here if true
  if (!ilkData) return null;

  const {
    bannerPng,
    iconSvg,
    ilk,
    symbol,
    decimals,
    lpToken,
    protocol,
    protocolSvg,
    pool,
    poolSvg
  } = ilkData;

  // TODO move to store so this can be reused
  const redeemCollateral = async ilk => {
    const maker = await getMaker();
    const txCreator = () =>
      maker.service('liquidation').exitGemFromAdapter(
        ilk,
        //account for non-standard decimals, also subtract one wei to avoid any rounding issues
        vatGemBalance
          .times(Math.pow(10, decimals - 18))
          .minus(Math.pow(10, -18))
          .toFixed(18)
      );
    await transactionsApi.getState().track(txCreator, `Exiting ${vatGemBalance.toFormat(4)} ${ilk}`, {
      pending: () => {
        setIsTxProcessing(true);
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, `Exited ${vatGemBalance.toFormat(4)} ${ilk}`);
        setIsTxProcessing(false);
      },
      error: () => {
        setIsTxProcessing(false);
      }
    });
  };

  return (
    <div>
      <Head>
        <title>Maker Liquidations Portal - Auctions</title>
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
        {lpToken ? (
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text
                sx={{
                  pr: 2,
                  color: 'background',
                  fontSize: 6
                }}
              >
                {protocol}
              </Text>
              <Image
                src={protocolSvg}
                sx={{
                  height: 24,
                  maxWidth: 'none'
                }}
              />
            </Flex>
            <Flex sx={{ alignItems: 'center' }}>
              <Image
                src={poolSvg}
                sx={{
                  height: 38,
                  maxWidth: 'none'
                }}
              />
              <Text
                sx={{
                  pl: 3,
                  color: 'background',
                  fontSize: '38px',
                  fontWeight: 'semiBold'
                }}
              >
                {pool}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <>
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
          </>
        )}
      </Flex>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'], mt: 180 }}>
        <SidebarLayout sx={{ mt: 4 }}>
          <Stack gap={5}>
            <Box>
              <Stack gap={2}>
                <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Heading as="h2">{`Active ${type?.toUpperCase()} Auctions`}</Heading>
                  {vatGemBalance && vatGemBalance.gt(Math.pow(10, -decimals)) && (
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
                        {vatGemBalance.gte(0.01) ? vatGemBalance.toFormat(2) : vatGemBalance.toFormat(4)}{' '}
                        {symbol} to Redeem
                      </Text>
                    </Button>
                  )}
                </Flex>
              </Stack>
              <Stack gap={2}>
                {auctions ? (
                  activeAuctions && activeAuctions.length > 0 ? (
                    activeAuctions.map(
                      auction =>
                        auction.ilk === ilk && (
                          <Box key={auction.id}>
                            <AuctionOverviewCard auction={auction} vatBalance={vatBalance} />
                          </Box>
                        )
                    )
                  ) : (
                    <NoActiveAuctions />
                  )
                ) : auctionsError ? (
                  <NoActiveAuctions error={auctionsError} />
                ) : (
                  <AuctionOverviewSkeleton />
                )}
              </Stack>
            </Box>
            {inactiveAuctions && inactiveAuctions.length > 0 && (
              <Box>
                <Stack gap={2}>
                  <Heading as="h2" sx={{ mb: 3 }}>{`Inactive ${type?.toUpperCase()} Auctions`}</Heading>
                  {auctions ? (
                    (inactiveAuctions || []).map(
                      auction =>
                        auction.ilk === ilk && (
                          <AuctionOverviewCard key={auction.id} auction={auction} vatBalance={vatBalance} />
                        )
                    )
                  ) : (
                    <AuctionOverviewSkeleton />
                  )}
                </Stack>
              </Box>
            )}
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
