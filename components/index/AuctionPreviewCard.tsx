/** @jsx jsx */
import Link from 'next/link';
import { Text, Button, Box, Image, Flex, jsx } from 'theme-ui';

import Auction from '../../types/auction';
import { COLLATERAL_MAP } from '../../lib/constants';

type Props = {
  auction?: Auction;
};

export default function AuctionPreviewCard({ auction, ...otherProps }: Props): JSX.Element | null {
  if (!auction) return null;

  const { collateralAvailable, name } = auction;
  const { cardTexturePng, iconSvg, symbol } = COLLATERAL_MAP[auction.name];

  return (
    <Link href={`/auctions/${name}`}>
      <Box
        variant="cards.tight"
        sx={{
          p: [3, 3],
          borderRadius: 'medium',
          width: 304,
          height: 264,
          ':hover': { borderColor: 'onSecondary', 'div:first-child': { opacity: 1 }, cursor: 'pointer' }
        }}
        {...otherProps}
      >
        <Box
          sx={{
            position: 'relative'
          }}
        >
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '160px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '5px',
              background: 'rgba(0, 0, 0, 0.5)',
              opacity: 0,
              transition: 'opacity 0.3s',
              zIndex: 1
            }}
          >
            <Button variant="buttons.primaryLarge" sx={{ margin: 'auto' }}>
              View auctions
            </Button>
          </Flex>
          <Box sx={{ position: 'relative' }}>
            <Image
              src={cardTexturePng}
              sx={{
                objectFit: 'cover',
                height: 160,
                width: '100%',
                borderRadius: '5px'
              }}
            />
          </Box>
          <Flex
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '100%'
            }}
          >
            <Image
              src={iconSvg}
              sx={{
                height: 44,
                maxWidth: 'none'
              }}
            />
            <Text
              sx={{
                pl: 3,
                color: 'background',
                fontSize: 8,
                fontWeight: 'semiBold'
              }}
            >
              {symbol}
            </Text>
          </Flex>
        </Box>

        <Flex sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Text
              pt={2}
              sx={{ textAlign: 'left', color: 'onSecondary', textTransform: 'uppercase', fontSize: 3 }}
            >
              Total Available
            </Text>
            <Text
              pt={1}
              sx={{
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                fontSize: 5,
                textAlign: 'left',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              {collateralAvailable}
            </Text>
          </Box>

          <Box>
            <Text
              pt={2}
              sx={{ textAlign: 'right', color: 'onSecondary', textTransform: 'uppercase', fontSize: 3 }}
            >
              Auctions
            </Text>
            <Text
              pt={1}
              sx={{
                fontWeight: 'bold',
                textOverflow: 'ellipsis',
                fontSize: 5,
                textAlign: 'right',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}
            >
              01
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
}
