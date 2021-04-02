/** @jsx jsx */
import { Badge, Card, Flex, Link as ExternalLink, Text, Box, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import useSWR, { mutate } from 'swr';
import Skeleton from 'react-loading-skeleton';

import Tooltip from 'components/Tooltip';
import SystemStat from 'types/systemStat';
import Stack from './layouts/Stack';
// import getMaker from '../lib/maker';
// import CurrencyObject from '../types/currency';

async function getSystemStats(): Promise<string[]> {
  // update this section once dai.js plugin is updated

  // const maker = await getMaker();
  // return Promise.all([
  //   maker.service('mcd:savings').getYearlyRate(),
  //   maker.service('mcd:systemData').getTotalDai()
  // ]);

  // for now return whatever data
  return Promise.all([
    Promise.resolve('15'),
    Promise.resolve('03'),
    Promise.resolve('10'),
    Promise.resolve('1,478 DAI'),
    new Promise(resolve => {
      setTimeout(resolve, 3000, '9,999 DAI');
    })
  ]);
}

// if we are on the browser, trigger a prefetch as soon as possible
if (typeof window !== 'undefined') {
  getSystemStats().then(stats => {
    mutate('/system-stats-sidebar', stats, false);
  });
}

export default function SystemStatsSidebar(): JSX.Element {
  const { data, error } = useSWR<string[]>('/system-stats-sidebar', getSystemStats);

  const fieldMap: SystemStat[] = [
    {
      title: 'Undercollateralized Vaults',
      format: val => val,
      tooltip: 'This is placeholder text explaining what Undercollateralized Vaults represents'
    },
    {
      title: 'Active Auctions',
      format: val => val,
      tooltip: 'This is placeholder text explaining what Active Auctions represents'
    },
    {
      title: 'Inactive Auctions',
      format: val => val,
      tooltip: 'This is placeholder text explaining what Inactive Auctions represents'
    },
    {
      title: 'Dai required for Auctions',
      format: val => val,
      tooltip: 'This is placeholder text explaining what Dai required for Auctions represents'
    },
    {
      title: 'Limit per collateral available',
      format: val => val,
      tooltip: 'This is placeholder text explaining what Limit per collateral available represents'
    }
  ];

  const statData = fieldMap.map((stat, i) => {
    return { title: stat.title, value: data ? stat.format(data[i]) : null, tooltip: stat.tooltip };
  });

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
                {stat.value ? (
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
