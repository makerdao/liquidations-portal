/** @jsx jsx */
import { Text, Box, Image, Link as ExternalLink, Flex, jsx } from 'theme-ui';

import Auction from '../../types/auction';

type Props = {
  auction?: Auction;
};

export default function AuctionPreviewCard({ auction, ...otherProps }: Props): JSX.Element {
  return (
    <ExternalLink
      target="_blank"
      variant="card"
      // href={blogPost.link}
      sx={{
        p: [3, 3],
        borderRadius: 'medium',
        width: 300,
        height: 350,
        ':hover': { borderColor: 'onSecondary', boxShadow: 'faint' }
      }}
      {...otherProps}
    >
      <Box>
        <Image
          src={'/assets/link-card-texture.png'}
          sx={{
            objectFit: 'cover',
            height: 6,
            width: '100%',
            borderRadius: '5px'
          }}
        />

        <Flex sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Text
              pt={2}
              sx={{ textAlign: 'left', color: 'onSecondary', textTransform: 'uppercase', fontSize: 1 }}
            >
              Total Link Available
            </Text>
            <Text
              pt={1}
              sx={
                {
                  fontWeight: 'bold',
                  textOverflow: 'ellipsis',
                  fontSize: 5,
                  textAlign: 'left',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2
                } as any
              }
            >
              40000
            </Text>
          </Box>

          <Box>
            <Text
              pt={2}
              sx={{ textAlign: 'right', color: 'onSecondary', textTransform: 'uppercase', fontSize: 1 }}
            >
              Auctions
            </Text>
            <Text
              pt={1}
              sx={
                {
                  fontWeight: 'bold',
                  textOverflow: 'ellipsis',
                  fontSize: 5,
                  textAlign: 'right',
                  display: '-webkit-box',
                  overflow: 'hidden',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2
                } as any
              }
            >
              01
            </Text>
          </Box>
        </Flex>
      </Box>
    </ExternalLink>
  );
}
