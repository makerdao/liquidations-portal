/** @jsx jsx */
import { useState } from 'react';
// import useSWR from 'swr';
import { Button, Flex, jsx, Heading, Close, Text, Input } from 'theme-ui';
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
  const [isDeposit, setIsDeposit] = useState(true);

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
          <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Heading sx={{ fontWeight: 'bold' }}>Unlock DAI to bid</Heading>
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
          </Flex>
          {/* // this text will probably be dynamic based on user's account */}
          <Text sx={{ color: 'secondaryEmphasis', mb: 2 }}>
            To participate in auctions you need to sign the approval transactions below and move Dai that will
            be used for bidding to the Vat
          </Text>
          <Flex sx={{ mb: 4 }}>
            <Button
              sx={{
                width: '100%',
                backgroundColor: 'surface',
                fontSize: 3,
                fontWeight: 'semiBold',
                color: isDeposit ? 'text' : 'coolGrey',
                borderBottom: 'solid 1px',
                borderBottomColor: isDeposit ? 'primary' : 'coolGrey',
                borderRadius: 0,
                ':hover': {
                  backgroundColor: 'surface'
                }
              }}
              onClick={() => setIsDeposit(!isDeposit)}
            >
              Deposit Dai
            </Button>
            <Button
              sx={{
                width: '100%',
                backgroundColor: 'surface',
                fontSize: 3,
                fontWeight: 'semiBold',
                color: !isDeposit ? 'text' : 'coolGrey',
                borderBottom: 'solid 1px',
                borderBottomColor: !isDeposit ? 'primary' : 'coolGrey',
                borderRadius: 0,
                ':hover': {
                  backgroundColor: 'surface'
                }
              }}
              onClick={() => setIsDeposit(!isDeposit)}
            >
              Redeem Dai
            </Button>
          </Flex>
          {isDeposit ? (
            <>
              <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                <Text sx={{ fontWeight: 'semiBold' }}>Dai Wallet Balance</Text>
                <Text>9,819.97</Text>
              </Flex>
              <Flex sx={{ mb: 4 }}>
                <Input
                  sx={{ mr: 2 }}
                  placeholder="0.00"
                  onChange={() => console.log('update input')}
                  type="number"
                  value={0.0}
                />
                <Button sx={{ width: 160 }}>Unlock Dai</Button>
              </Flex>
              <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                <Text sx={{ fontWeight: 'semiBold' }}>Dai in the VAT</Text>
                <Text>9,819.97</Text>
              </Flex>
              <Flex sx={{ mb: 4 }}>
                <Input
                  sx={{ mr: 2 }}
                  placeholder="0.00"
                  onChange={() => console.log('update input')}
                  type="number"
                  value={0.0}
                />
                <Button sx={{ width: 160 }}>Unlock Dai</Button>
              </Flex>
            </>
          ) : (
            <>
              <Flex sx={{ justifyContent: 'space-between', mb: 2 }}>
                <Text sx={{ fontWeight: 'semiBold' }}>Dai Wallet Balance</Text>
                <Text>9,819.97</Text>
              </Flex>
              <Flex sx={{ mb: 4 }}>
                <Input
                  sx={{ mr: 2 }}
                  placeholder="0.00"
                  onChange={() => console.log('update input')}
                  type="number"
                  value={0.0}
                />
                <Button sx={{ width: 160 }}>Redeem Dai</Button>
              </Flex>
            </>
          )}
          {/* TODO update button style below */}
          <Button sx={{ mt: 3 }}>Explore Auctions</Button>
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default DepositRedeemModal;
