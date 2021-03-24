/** @jsx jsx */
import { Badge, Card, Flex, Link as ExternalLink, Text, Box, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import useSWR, { mutate } from 'swr';
import Skeleton from 'react-loading-skeleton';

import Stack from './layouts/Stack';
import getMaker from '../lib/maker';
import CurrencyObject from '../types/currency';

async function getSystemStats(): Promise<CurrencyObject[]> {
  const maker = await getMaker();
  return Promise.all([
    maker.service('mcd:savings').getYearlyRate(),
    maker.service('mcd:systemData').getTotalDai()
  ]);
}

// if we are on the browser, trigger a prefetch as soon as possible
if (typeof window !== 'undefined') {
  getSystemStats().then(stats => {
    mutate('/system-stats', stats, false);
  });
}

type StatField = 'savings rate' | 'total dai';

export default function SystemStatsSidebar({ fields = [], ...props }: { fields: StatField[] }): JSX.Element {
  const { data } = useSWR<CurrencyObject[]>('/system-stats-sidebar', getSystemStats);
  const { data: chiefAddress } = useSWR<string>('/chief-address', () =>
    getMaker().then(maker => maker.service('smartContract').getContract('MCD_ADM').address)
  );
  const { data: pollingAddress } = useSWR<string>('/polling-address', () =>
    getMaker().then(maker => maker.service('smartContract').getContract('POLLING').address)
  );

  const [savingsRate, totalDai] = data || [];

  const statsMap = {
    'savings rate': key => (
      <Flex key={key} sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text sx={{ fontSize: 3, color: 'textSecondary' }}>Dai Savings Rate</Text>
        <Text variant="h2" sx={{ fontSize: 3 }}>
          {data ? (
            `${savingsRate.toFixed(2)}%`
          ) : (
            <Box sx={{ width: 6 }}>
              <Skeleton />
            </Box>
          )}
        </Text>
      </Flex>
    ),

    'total dai': key => (
      <Flex key={key} sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text sx={{ fontSize: 3, color: 'textSecondary' }}>Total Dai</Text>
        <Text variant="h2" sx={{ fontSize: 3 }}>
          {data ? (
            `${totalDai.toBigNumber().toFormat(2)} DAI`
          ) : (
            <Box sx={{ width: 6 }}>
              <Skeleton />
            </Box>
          )}
        </Text>
      </Flex>
    )
  };

  return (
    <>
      <Box sx={{ display: ['none', 'block'] }} {...props}>
        <Flex sx={{ justifyContent: 'space-between', mb: 1 }}>
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
                See all
                <Icon ml={2} name="arrowTopRight" size="2" />
              </Text>
            </Flex>
          </ExternalLink>
        </Flex>
        <Card variant="compact">
          <Stack gap={3}>{fields.map(field => statsMap[field](field))}</Stack>
        </Card>
      </Box>
    </>
  );
}
