/** @jsx jsx */
import { Badge, Card, Flex, Link as ExternalLink, Text, Box, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Skeleton from 'react-loading-skeleton';

import Stack from 'components/layouts/Stack';
import Tooltip from 'components/shared/Tooltip';
import SystemStat from 'types/systemStat';
import { getAuctionCountByStatus, getDaiRequiredForAuctions } from 'lib/utils';
import { useSystemStatsSidebar } from 'lib/hooks';

type Props = {
  ilk: string;
};

export default function SystemStatsSidebar({ ilk }: Props): JSX.Element {
  const { data, error } = useSystemStatsSidebar(ilk);

  const fieldMap: SystemStat[] = [
    {
      title: 'Undercollateralized Vaults',
      format: val => val.length,
      tooltip: 'This is placeholder text explaining what Undercollateralized Vaults represents'
    },
    {
      title: 'Active Auctions',
      format: val => getAuctionCountByStatus(val, true),
      tooltip: 'This is placeholder text explaining what Active Auctions represents'
    },
    {
      title: 'Inactive Auctions',
      format: val => getAuctionCountByStatus(val, false),
      tooltip: 'This is placeholder text explaining what Inactive Auctions represents'
    },
    {
      title: 'Dai required for Auctions',
      format: val => `${getDaiRequiredForAuctions(val)} DAI`,
      tooltip: 'This is placeholder text explaining what Dai required for Auctions represents'
    },
    {
      title: 'Limit per collateral available',
      format: val => `${val.diff.toFormat(2)} DAI`,
      tooltip: 'This is placeholder text explaining what Limit per collateral available represents'
    }
  ];

  if (error) {
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Badge variant="circle" p="3px" mr="3" bg="error" />
          <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Status</Text>
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
            <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Status</Text>
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
                  <Tooltip label={stat.tooltip}>
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
