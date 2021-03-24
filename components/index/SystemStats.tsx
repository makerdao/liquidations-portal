/** @jsx jsx */
import { Badge, Box, Link as ExternalLink, Flex, Text, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

export default function SystemStats(): JSX.Element {
  const mockStats = [
    { title: 'Number of undercollateralized vaults', value: '15' },
    { title: 'Active auctions', value: '3' },
    { title: 'Inactive Auctions', value: '10' },
    { title: 'Dai required for auctions', value: '1478' },
    { title: 'Limit per collateral type (hole)', value: '9999 DAI' }
  ];

  return (
    <Box>
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
      <Flex sx={{ justifyContent: 'space-between', px: 4, py: 4 }}>
        {mockStats.map(stat => (
          <Flex key={stat.title} sx={{ flexDirection: 'column', maxWidth: '11rem' }}>
            <Text sx={{ fontSize: 3, color: 'textSecondary', height: '72px' }}>{stat.title}</Text>
            <Text sx={{ fontSize: 6, mt: 1 }}>{stat.value}</Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
