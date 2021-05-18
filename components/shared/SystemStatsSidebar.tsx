/** @jsx jsx */
import { Badge, Card, Flex, Link as ExternalLink, Text, Box, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Skeleton from 'react-loading-skeleton';

import { getVulcanizeParam } from 'lib/maker';
import { getAuctionCountByStatus, getDaiRequiredForAuctions } from 'lib/utils';
import { useSystemStatsSidebar } from 'lib/hooks';
import { TOOLTIP_DICT } from 'lib/constants';
import SystemStat from 'types/systemStat';
import Stack from 'components/layouts/Stack';
import Tooltip from 'components/shared/Tooltip';

type Props = {
  ilk: string;
};

export default function SystemStatsSidebar({ ilk }: Props): JSX.Element {
  const { data, error } = useSystemStatsSidebar(ilk);

  const usingVulcanize = getVulcanizeParam();

  const fieldMap: SystemStat[] = [
    {
      title: 'Undercollateralized Vaults',
      format: val => val.length,
      tooltip: TOOLTIP_DICT.UNDERCOLLATERALIZED_VAULTS
    },
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
      title: 'Dai required for Auctions',
      format: val => `${getDaiRequiredForAuctions(val).toFormat(0)} DAI`,
      tooltip: TOOLTIP_DICT.DAI_REQUIRED
    },
    {
      title: 'Limit per collateral available',
      format: val => `${val && val.diff ? val.diff.toFormat(2) : '--'} DAI`,
      tooltip: TOOLTIP_DICT.MAX_AVAILABLE
    }
  ];

  if (error) {
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Badge variant="circle" p="3px" mr="3" bg="error" />
          <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Stats</Text>
        </Flex>
        <Text sx={{ fontSize: 3, color: 'textSecondary' }}>{'Unable to fetch system data at this time'}</Text>
      </Flex>
    );
  }

  const statData = fieldMap.map((stat, i) => {
    return { title: stat.title, value: data ? stat.format(data[i]) : null, tooltip: stat.tooltip };
  });

  return (
    <>
      <Box sx={{ display: ['none', 'block'] }}>
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
                See all
                <Icon ml={2} name="arrowTopRight" size="2" color="primary" />
              </Text>
            </Flex>
          </ExternalLink>
        </Flex>
        <Card variant="compact">
          <Stack gap={3}>
            {statData.map(stat => (
              <Flex key={stat.title} sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                {stat.tooltip ? (
                  <Tooltip sx={{ padding: 3, maxWidth: 360, whiteSpace: 'normal' }} label={stat.tooltip}>
                    <Text sx={{ fontSize: 3, color: 'textSecondary' }}>{stat.title}</Text>
                  </Tooltip>
                ) : (
                  <Text sx={{ fontSize: 3, color: 'textSecondary' }}>{stat.title}</Text>
                )}
                {stat.value !== null ? (
                  <Text variant="h2" sx={{ fontSize: 3 }}>
                    {stat.value}
                  </Text>
                ) : (
                  <Box sx={{ width: 4 }}>
                    <Skeleton />
                  </Box>
                )}
              </Flex>
            ))}
          </Stack>
        </Card>
      </Box>
    </>
  );
}
