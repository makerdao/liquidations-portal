/** @jsx jsx */
import { Button, Flex, Text, Label, jsx, Input, Heading, Divider } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import { fadeIn, slideUp } from '../../lib/keyframes';

type Props = {
  showDialog: boolean;
  onDismiss: () => void;
  mobile: boolean;
  colAvailable: string;
};

const BidModal = ({ showDialog, onDismiss, mobile, colAvailable }: Props): JSX.Element => {
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
        <Flex sx={{ flexDirection: 'column' }}>
          <Heading>Place a Bid</Heading>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Heading>Collateral Available</Heading>
            <Heading>{colAvailable}</Heading>
          </Flex>
          <Divider />
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Label variant="microHeading" sx={{ fontSize: 3 }}>
              Amount of Dai
            </Label>
            <Label variant="microHeading" sx={{ fontSize: 3 }}>
              Wallet balance
            </Label>
          </Flex>
          <Input placeholder="0.0"></Input>
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text>Min bid</Text>
              <Text>120 Dai</Text>
            </Flex>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text>Max bid</Text>
              <Text>9999.2 Dai</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Label>Amount of Collateral</Label>
              <Text>0.00 LINK</Text>
            </Flex>
            <Text>≈ $0.00</Text>
          </Flex>
          <Button>Place a bid</Button>
        </Flex>
      </DialogContent>
    </DialogOverlay>
  );
};

export default BidModal;
