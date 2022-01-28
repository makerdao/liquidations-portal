import { Box, Link as ExternalLink, Text } from 'theme-ui';

const Banner = (): JSX.Element => {
  return (
    <Box sx={{ bg: '#FDC134', p: 3, textAlign: 'center' }}>
      <Text sx={{ fontSize: [2, 3] }}>
        <strong>IMPORTANT:</strong> This website requires you to hold DAI in order to participate in auctions.
        Consider using the new{' '}
        <ExternalLink href="https://auctions.makerdao.network/collateral?network=mainnet" target="_blank">
          Unified Auctions Portal
        </ExternalLink>{' '}
        where you can use flashloans to participate without your own DAI.
      </Text>
    </Box>
  );
};

export default Banner;
