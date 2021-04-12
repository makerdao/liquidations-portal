/** @jsx jsx */
import { jsx, Flex, Grid } from 'theme-ui';
import Skeleton from 'react-loading-skeleton';

export default function AuctionPreviewCard(): JSX.Element {
  return (
    <Flex
      variant="cards.primary"
      sx={{
        p: [3, 3],
        borderRadius: 'medium',
        height: '206px',
        flexDirection: 'column',
        justifyContent: 'space-around'
      }}
    >
      <Grid columns={4} gap={4}>
        <Flex sx={{ flexDirection: 'column' }}>
          <Skeleton />
          <Skeleton />
        </Flex>
        <Flex sx={{ flexDirection: 'column' }}>
          <Skeleton />
          <Skeleton />
        </Flex>
        <Flex sx={{ flexDirection: 'column' }}>
          <Skeleton />
          <Skeleton />
        </Flex>
        <Skeleton height="40px" />
      </Grid>

      <Grid columns={4} gap={4}>
        <Flex sx={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Skeleton />
        </Flex>
        <Flex sx={{ flexDirection: 'column' }}>
          <Skeleton />
          <Skeleton />
        </Flex>
        <Flex sx={{ flexDirection: 'column' }}>
          <Skeleton />
          <Skeleton />
        </Flex>
        <Grid columns={2}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Skeleton />
            <Skeleton />
          </Flex>
          <Flex sx={{ flexDirection: 'column' }}>
            <Skeleton />
            <Skeleton />
          </Flex>
        </Grid>
      </Grid>
    </Flex>
  );
}
