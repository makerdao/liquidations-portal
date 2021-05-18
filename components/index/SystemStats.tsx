/** @jsx jsx */
import { Badge, Box, Grid, Link as ExternalLink, Flex, Text, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Skeleton from 'react-loading-skeleton';

import { getVulcanizeParam } from 'lib/maker';
import { getAuctionCountByStatus, getDaiRequiredForAuctions } from 'lib/utils';
import { useSystemStats } from 'lib/hooks';
import { TOOLTIP_DICT } from 'lib/constants';
import SystemStat from 'types/systemStat';
import Tooltip from 'components/shared/Tooltip';
import Stack from 'components/layouts/Stack';

export default function SystemStats(): JSX.Element {
  const { data, error } = useSystemStats();

  const usingVulcanize = getVulcanizeParam();

  // format property can be used to specify how to format data the particular value
  const fieldMap: SystemStat[] = [
    {
      title: 'Active Auctions',
      format: val => getAuctionCountByStatus(val, true).toString(),
      tooltip: TOOLTIP_DICT.ACTIVE_AUCTIONS
    },
    {
      title: 'Inactive Auctions',
      format: val => (usingVulcanize ? getAuctionCountByStatus(val, false).toString() : '--'),
      tooltip: TOOLTIP_DICT.INACTIVE_AUCTIONS
    },
    {
      title: 'Vaults requiring kick',
      format: val => val.length,
      tooltip: TOOLTIP_DICT.UNDERCOLLATERALIZED_VAULTS
    },
    {
      title: 'Dai required for Auctions',
      format: val => `${getDaiRequiredForAuctions(val).toFormat(0)} DAI`,
      minWidth: 185,
      tooltip: TOOLTIP_DICT.DAI_REQUIRED
    },
    {
      title: 'Global max available',
      format: val => `${val.toFormat(0)} DAI`,
      minWidth: 205,
      tooltip: TOOLTIP_DICT.MAX_AVAILABLE
    }
  ];

  const statData = fieldMap.map((stat, i) => {
    return {
      title: stat.title,
      value: data ? stat.format(data[i]) : null,
      minWidth: stat.minWidth ?? 115,
      tooltip: stat.tooltip
    };
  });

  return (
    <>
      {/* Desktop */}
      <Box sx={{ display: ['none', 'none', 'block'] }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          {!error ? (
            <>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge variant="circle" p="3px" mr="3" />
                <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Stats</Text>
              </Flex>
              <ExternalLink href="https://daistats.com/" target="_blank">
                <Flex sx={{ alignItems: 'center' }}>
                  <Text
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'text',
                      fontSize: [2, 3],
                      fontWeight: 'semiBold',
                      ':hover': { color: 'blueLinkHover' }
                    }}
                  >
                    View more
                    <Icon ml={2} name="arrowTopRight" size="2" color="primary" />
                  </Text>
                </Flex>
              </ExternalLink>
            </>
          ) : (
            <Flex sx={{ alignItems: 'center' }}>
              <Flex sx={{ alignItems: 'center' }}>
                <Badge variant="circle" p="3px" mr="3" bg="error" />
                <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Stats</Text>
              </Flex>
              <Text sx={{ fontSize: 3, color: 'textSecondary', ml: 3 }}>
                {'Unable to fetch system data at this time'}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', py: 5 }}>
          {statData.map(stat => {
            const statWrapper = (
              <Flex key={stat.title} sx={{ flexDirection: 'column', minWidth: stat.minWidth }}>
                <Text sx={{ fontSize: 3, color: 'textSecondary' }}>{stat.title}</Text>
                {stat.value !== null ? (
                  <Text sx={{ fontSize: 6, mt: 1 }}>{stat.value}</Text>
                ) : (
                  <Box sx={{ mt: 3, width: 5 }}>
                    {!error ? <Skeleton /> : <Icon name="warning" size="3" color="error" />}
                  </Box>
                )}
              </Flex>
            );

            return stat.tooltip ? (
              <Box key={stat.title}>
                <Tooltip sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }} label={stat.tooltip}>
                  {statWrapper}
                </Tooltip>
              </Box>
            ) : (
              statWrapper
            );
          })}
        </Flex>
      </Box>

      {/* Mobile */}
      <Box sx={{ display: ['block', 'block', 'none'], backgroundColor: 'surface', p: 2 }}>
        <Grid sx={{ p: 3 }}>
          <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', mb: 3 }}>
            <Text sx={{ fontSize: 3, fontWeight: 'semiBold', color: 'text' }}>System Stats</Text>
            <ExternalLink href="https://daistats.com/" target="_blank">
              <Flex sx={{ alignItems: 'center' }}>
                <Text sx={{ fontSize: 3, color: 'text', fontWeight: 'semiBold' }}>
                  View more
                  <Icon ml="2" name="arrowTopRight" size="2" color="primary" />
                </Text>
              </Flex>
            </ExternalLink>
          </Flex>
          <Stack gap={3}>
            {statData.map(stat => {
              const statWrapper = (
                <Flex
                  key={stat.title}
                  sx={{ flexDirection: 'row', justifyContent: 'space-between', height: '3rem' }}
                >
                  <Text sx={{ fontSize: [2, 3], color: 'textSecondary' }}>{stat.title}</Text>
                  {stat.value !== null ? (
                    <Text sx={{ fontSize: [2, 3] }}>{stat.value}</Text>
                  ) : (
                    <Box sx={{ width: 4 }}>
                      <Skeleton />
                    </Box>
                  )}
                </Flex>
              );
              return stat.tooltip ? (
                <Box key={stat.title}>
                  <Tooltip label={stat.tooltip}>{statWrapper}</Tooltip>
                </Box>
              ) : (
                statWrapper
              );
            })}
          </Stack>
        </Grid>
      </Box>
    </>
  );
}
