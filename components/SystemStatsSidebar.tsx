/** @jsx jsx */
import { Card, Flex, Link as ExternalLink, Text, Box, Heading, jsx } from 'theme-ui';
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
        <Flex sx={{ flexDirection: 'row', justifyContent: 'space-between', mb: 2, mt: 4 }}>
          <Heading as="h3" variant="microHeading">
            System Info
          </Heading>
          <ExternalLink
            href="https://daistats.com/"
            target="_blank"
            sx={{ color: 'accentBlue', fontSize: 3, ':hover': { color: 'blueLinkHover' } }}
          >
            <Flex sx={{ alignItems: 'center' }}>
              <Text>
                See more
                <Icon ml={2} name="arrowTopRight" size={2} />
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
