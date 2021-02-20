/** @jsx jsx */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flex, NavLink, Container, Close, Box, IconButton, jsx } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';

import { getNetwork } from '../lib/maker';
import AccountSelect from './header/AccountSelect';
import { useState, useEffect } from 'react';

const Header = (props): JSX.Element => {
  const network = getNetwork();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <Box
      as="header"
      pt={3}
      pb={[4, 5]}
      px={[2, 0]}
      variant="styles.header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}
      {...props}
    >
      <Link href={{ pathname: '/', query: { network } }}>
        <IconButton aria-label="Maker home" sx={{ width: '40px', height: 4, p: 0 }}>
          <Icon name="maker" size="40px" sx={{ cursor: 'pointer' }} />
        </IconButton>
      </Link>
      <Flex sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <AccountSelect sx={{ ml: ['auto', 3, 0] }} />

        <IconButton
          aria-label="Show menu"
          ml="3"
          sx={{ display: [null, 'none'], height: '28px', width: '24px', p: 0 }}
          onClick={() => setShowMobileMenu(true)}
        >
          <Icon name="menu" sx={{ width: '18px' }} />
        </IconButton>
        {showMobileMenu && (
          <MobileMenu hide={() => setShowMobileMenu(false)} router={router} {...{ network }} />
        )}
      </Flex>
    </Box>
  );
};

const MobileMenu = ({ hide, network, router }) => {
  useEffect(() => {
    router.events.on('routeChangeComplete', hide);
  }, []);

  return (
    <Container variant="modal">
      <Close ml="auto" sx={{ display: ['block'], '> svg': { size: [4] } }} onClick={hide} />
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: 4,
          justifyContent: 'space-between',
          height: '40vh',
          '> a': {
            fontSize: 6
          }
        }}
      >
        <Link href={{ pathname: '/', query: { network } }}>
          <NavLink>Home</NavLink>
        </Link>
      </Flex>
    </Container>
  );
};

export default Header;
