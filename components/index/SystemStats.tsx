/** @jsx jsx */
import useSWR, { mutate } from 'swr';
import { Badge, Box, Grid, Link as ExternalLink, Flex, Text, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Skeleton from 'react-loading-skeleton';

import Stack from '../layouts/Stack';

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
    Promise.resolve('3'),
    Promise.resolve('10'),
    Promise.resolve('1478'),
    new Promise(resolve => {
      setTimeout(resolve, 3000, '9999');
    })
  ]);
}

// if we are on the browser, trigger a prefetch as soon as possible
if (typeof window !== 'undefined') {
  getSystemStats().then(stats => {
    mutate('/system-stats-landing', stats, false);
  });
}

export default function SystemStats(): JSX.Element {
  const { data, error } = useSWR<string[]>('/system-stats-landing', getSystemStats);

  // format property can be used to specify how to format data the particular value
  const fieldMap = [
    { title: 'Undercollateralized Vaults requiring Kicking', format: val => val },
    { title: 'Active Auctions', format: val => val },
    { title: 'Inactive Auctions', format: val => val },
    { title: 'Dai required for Auctions', format: val => val },
    { title: 'Global Max', format: val => val }
  ];

  const statData = fieldMap.map((stat, i) => {
    return { title: stat.title, value: data ? stat.format(data[i]) : null };
  });

  if (error) {
    return (
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Badge variant="circle" p="3px" mr="3" bg="error" />
          <Text sx={{ fontSize: '20px', fontWeight: '500' }}>System Status</Text>
        </Flex>
        <Text sx={{ fontSize: 3, color: 'textSecondary', ml: 3 }}>
          {'Unable to fetch system data at this time'}
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {/* Desktop */}
      <Box sx={{ display: ['none', 'block'] }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Flex sx={{ alignItems: 'center' }}>
            <Badge variant="circle" p="3px" mr="3" />
            <Text sx={{ fontSize: '20px', fontWeight: '500' }}>System Status</Text>
          </Flex>
          <ExternalLink href="https://daistats.com/" target="_blank">
            <Flex sx={{ alignItems: 'center' }}>
              <Text
                sx={{
                  color: 'accentBlue',
                  fontSize: [2, 3],
                  fontWeight: '500',
                  ':hover': { color: 'blueLinkHover' }
                }}
              >
                View more stats
                <Icon ml={2} name="arrowTopRight" size="2" />
              </Text>
            </Flex>
          </ExternalLink>
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', p: 4 }}>
          {statData.map(stat => (
            <Flex key={stat.title} sx={{ flexDirection: 'column', maxWidth: '11rem' }}>
              <Text sx={{ fontSize: 3, color: 'textSecondary', height: '3rem' }}>{stat.title}</Text>
              {stat.value ? (
                <Text sx={{ fontSize: 6, mt: 1 }}>{stat.value}</Text>
              ) : (
                <Box sx={{ mt: 3, width: 5 }}>
                  <Skeleton />
                </Box>
              )}
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Mobile */}
      <Box sx={{ display: ['block', 'none'], backgroundColor: 'background', p: 2 }}>
        <Grid sx={{ p: 3 }}>
          <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text sx={{ fontSize: 3, fontWeight: '500', color: 'text' }}>System Stats</Text>
            <ExternalLink href="https://daistats.com/" target="_blank">
              <Flex sx={{ alignItems: 'center' }}>
                <Text sx={{ color: 'accentBlue', fontSize: 3 }}>
                  View more
                  <Icon ml="2" name="arrowTopRight" size="2" />
                </Text>
              </Flex>
            </ExternalLink>
          </Flex>
          <Stack gap={3}>
            {statData.map(stat => (
              <Flex
                key={stat.title}
                sx={{ flexDirection: 'row', justifyContent: 'space-between', height: '3rem' }}
              >
                <Text sx={{ fontSize: 2, color: 'textSecondary' }}>{stat.title}</Text>
                {stat.value ? (
                  <Text sx={{ fontSize: 2 }}>{stat.value}</Text>
                ) : (
                  <Box sx={{ width: 4 }}>
                    <Skeleton />
                  </Box>
                )}
              </Flex>
            ))}
          </Stack>
        </Grid>
      </Box>
    </>
  );
}
