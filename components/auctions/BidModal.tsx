/** @jsx jsx */
import useSWR from 'swr';
import { Button, Flex, Text, jsx, Input, Heading, Divider, Close } from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import LogoBanner from './LogoBanner';
import { fadeIn, slideUp } from '../../lib/keyframes';
import getMaker from '../../lib/maker';
import Auction from '../../types/auction';
import { COLLATERAL_LOGOS } from '../../lib/constants';
import BigNumber from 'bignumber.js';
import { fromRad } from '../../lib/utils';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  auction: Auction;
  vatBalance: BigNumber | undefined;
};

const BidModal = ({
  showDialog,
  onDismiss,
  mobile,
  auction,
  vatBalance = new BigNumber(0)
}: Props): JSX.Element => {
  const { data: daiBalance } = useSWR('/balances/dai', () =>
    getMaker().then(maker => maker.getToken('DAI').balance())
  );

  const { name, collateralAvailable, dustLimit, maxBid } = auction;

  return (
    <DialogOverlay isOpen={showDialog} onDismiss={onDismiss}>
      <DialogContent
        aria-label="Place a bid"
        sx={
          mobile
            ? { variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }
            : { variant: 'dialog.desktop', animation: `${fadeIn} 350ms ease`, width: '450px' }
        }
      >
        <Flex sx={{ flexDirection: 'column', pb: 3 }}>
          <Close
            sx={{
              alignSelf: 'flex-end',
              height: 4,
              width: 4,
              p: 0,
              position: 'relative',
              top: '-4px',
              left: '8px'
            }}
            onClick={onDismiss}
          />
          <Heading sx={{ fontWeight: 'bold' }}>Place a Bid</Heading>
          <LogoBanner name={name.toUpperCase()} icon={COLLATERAL_LOGOS[name]} />
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end', my: 2 }}>
            <Text sx={{ fontSize: 3, fontWeight: 'semiBold' }}>Collateral Available</Text>
            <Heading variant="mediumHeading">
              {collateralAvailable} {name.toUpperCase()}
            </Heading>
          </Flex>
          <Divider />
          <Flex sx={{ justifyContent: 'space-between', my: 2 }}>
            <Text>DAI in the VAT</Text>
            <Flex sx={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <Text>{fromRad(vatBalance).toFormat(2)} DAI</Text>
              <Button variant="textual" sx={{ color: 'primary', fontSize: 2, p: 0 }}>
                Deposit
              </Button>
            </Flex>
          </Flex>
          <Flex sx={{ flexDirection: 'column', my: 3 }}>
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Text sx={{ fontWeight: 'semiBold', fontSize: 3 }}>Amount of Dai</Text>
              <Text sx={{ fontSize: 3, color: 'textMuted' }}>
                Wallet balance: {daiBalance && daiBalance.toBigNumber().toFormat(2)}
              </Text>
            </Flex>
            <Input placeholder="0.0"></Input>
            <Flex sx={{ justifyContent: 'space-between', my: 2, px: 2 }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Dust limit</Text>
                <Text sx={{ color: 'textMuted' }}>{dustLimit} Dai</Text>
              </Flex>
              <Flex sx={{ flexDirection: 'column' }}>
                <Text sx={{ color: 'textSecondary' }}>Max bid</Text>
                <Text sx={{ color: 'textMuted' }}>{maxBid} Dai</Text>
              </Flex>
            </Flex>
          </Flex>
          <Divider />
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text sx={{ fontSize: 3, fontWeight: 'semiBold' }}>Amount of Collateral</Text>
              <Text variant="caps" sx={{ fontWeight: 'body', fontSize: 5, color: 'textMuted', pl: 2 }}>
                0.00 {name}
              </Text>
            </Flex>
            <Text sx={{ color: 'textSecondary', pr: 2 }}>≈ $0.00</Text>
          </Flex>
          <Button sx={{ mt: 3 }}>Place a bid</Button>
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BidModal;
