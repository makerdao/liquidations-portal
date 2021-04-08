/** @jsx jsx */
// import { useState } from 'react';
// import useSWR from 'swr';
import { Button, Flex, jsx, Heading, Close } from 'theme-ui';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import BigNumber from 'bignumber.js';

import { fadeIn, slideUp } from 'lib/keyframes';
// import getMaker from 'lib/maker';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  vatBalance: BigNumber | undefined;
};

const DepositRedeemModal = ({ showDialog, onDismiss, mobile }: Props): JSX.Element => {
  // const { data: daiBalance } = useSWR('/balances/dai', () =>
  //   getMaker().then(maker => maker.getToken('DAI').balance())
  // );

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
          <Heading sx={{ fontWeight: 'bold' }}>Unlock DAI to bid</Heading>

          <Button sx={{ mt: 3 }}>Explore Auctions</Button>
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default DepositRedeemModal;
