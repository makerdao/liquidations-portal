/** @jsx jsx */
import useSWR, { mutate } from 'swr';
import { Badge, Box, Grid, Link as ExternalLink, Flex, Text, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Skeleton from 'react-loading-skeleton';

import getMaker from '../../lib/maker';
import { zeroPad } from '../../lib/utils';
import Stack from '../layouts/Stack';

async function getSystemStats(): Promise<string[]> {
  // update this section once dai.js plugin is updated

  const maker = await getMaker();
  // return Promise.all([
  //   maker.service('mcd:savings').getYearlyRate(),
  //   maker.service('mcd:systemData').getTotalDai()
  // ]);

  // for now return whatever data
  return Promise.all([
    Promise.resolve('5'),
    Promise.resolve('10'),
    Promise.resolve('15'),
    new Promise(resolve => {
      setTimeout(resolve, 3000, '159,478');
    }),
    maker.service('mcd:systemData').getTotalDai()
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
    { title: 'Active Auctions', format: val => zeroPad(val) },
    { title: 'Inactive Auctions', format: val => zeroPad(val) },
    { title: 'Vaults requiring kick', format: val => zeroPad(val) },
    { title: 'Dai required for Auctions', format: val => `${zeroPad(val)} DAI`, minWidth: 185 },
    {
      title: 'Global max available',
      format: val => `${zeroPad(val.toBigNumber().toFormat(0))} DAI`,
      minWidth: 205
    }
  ];

  const statData = fieldMap.map((stat, i) => {
    return {
      title: stat.title,
      value: data ? stat.format(data[i]) : null,
      minWidth: stat.minWidth ?? 115
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
                <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Status</Text>
              </Flex>
              <ExternalLink href="https://daistats.com/" target="_blank">
                <Flex sx={{ alignItems: 'center' }}>
                  <Text
                    sx={{
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
                <Text sx={{ fontSize: 5, fontWeight: 'semiBold' }}>System Status</Text>
              </Flex>
              <Text sx={{ fontSize: 3, color: 'textSecondary', ml: 3 }}>
                {'Unable to fetch system data at this time'}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', py: 5 }}>
          {statData.map(stat => (
            <Flex key={stat.title} sx={{ flexDirection: 'column', minWidth: stat.minWidth }}>
              <Text sx={{ fontSize: 3, color: 'badgeGrey' }}>{stat.title}</Text>
              {stat.value ? (
                <Text sx={{ fontSize: 6, mt: 1 }}>{stat.value}</Text>
              ) : (
                <Box sx={{ mt: 3, width: 5 }}>
                  {!error ? <Skeleton /> : <Icon name="warning" size="3" color="error" />}
                </Box>
              )}
            </Flex>
          ))}
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
            {statData.map(stat => (
              <Flex
                key={stat.title}
                sx={{ flexDirection: 'row', justifyContent: 'space-between', height: '3rem' }}
              >
                <Text sx={{ fontSize: [2, 3], color: 'badgeGrey' }}>{stat.title}</Text>
                {stat.value ? (
                  <Text sx={{ fontSize: [2, 3] }}>{stat.value}</Text>
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
