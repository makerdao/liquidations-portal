/** @jsx jsx */
import useSWR from 'swr';
import { Badge, Box, Grid, Link as ExternalLink, Flex, Text, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

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
    Promise.resolve('9999')
  ]);
}

export default function SystemStats(): JSX.Element {
  const { data, error } = useSWR<string[]>('/system-stats-landing', getSystemStats);

  const fieldMap = [
    'Number of undercollateralized vaults',
    'Active auctions',
    'Inactive Auctions',
    'Dai required for auctions',
    'Limit per collateral type (hole)'
  ];

  const statData = fieldMap.map((stat, i) => {
    return { title: stat, value: data ? data[i] : '' };
  });

  if (error) {
    return (
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Badge variant="circle" p="3px" mr="3" bg="warning" />
          <Text sx={{ fontSize: '20px', fontWeight: '500' }}>System Status</Text>
        </Flex>
        <Text sx={{ fontSize: 3, color: 'textSecondary', ml: 3 }}>
          {"We're unable to fetch system data at this time"}
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
              <Text sx={{ fontSize: 3, color: 'textSecondary', height: '72px' }}>{stat.title}</Text>
              <Text sx={{ fontSize: 6, mt: 1 }}>{stat.value}</Text>
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
          {statData.map(stat => (
            <Flex key={stat.title} sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text sx={{ fontSize: 2, color: 'textSecondary' }}>{stat.title}</Text>
              <Text sx={{ fontSize: 2 }}>{stat.value}</Text>
            </Flex>
          ))}
        </Grid>
      </Box>
    </>
  );
}
