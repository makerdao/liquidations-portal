/** @jsx jsx */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Flex, NavLink, Container, Close, Box, IconButton, Divider, jsx, Text } from 'theme-ui';
import { Menu, MenuButton, MenuItem, MenuList } from '@reach/menu-button';
import { Icon } from '@makerdao/dai-ui-icons';

import { COLLATERAL_ARRAY } from 'lib/constants';
import { getNetwork } from 'lib/maker';
import getMaker from 'lib/maker';
import { zeroPad } from 'lib/utils';
import AccountSelect from 'components/header/AccountSelect';
import DaiDepositRedeem from 'components/header/DaiDepositRedeem';
import { fetchAuctions } from 'pages/index'; //todo move to lib/api

const Header = (props: any): JSX.Element => {
  const network = getNetwork();
  const router = useRouter();
  const { data: auctions } = useSWR('/auctions/fetch-all', () => getMaker().then(fetchAuctions));
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
      <Flex sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Menu>
          <MenuButton
            style={{
              borderWidth: 0,
              backgroundColor: 'inherit',
              padding: 0,
              // override CSS from @reach
              fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu',
              lineHeight: '24px',
              letterSpacing: '0.4px',
              color: '#222223',
              fontSize: '16px'
            }}
          >
            <Text
              p={2}
              sx={{
                fontSize: 3,
                display: ['none', 'block'],
                color: router?.asPath?.startsWith('/auctions') ? 'primary' : undefined
              }}
            >
              Auctions
            </Text>
            <MenuList sx={{ variant: 'cards.compact', width: 6 }}>
              {COLLATERAL_ARRAY.map((type, index) => {
                const numberOfAuctions = auctions
                  ? zeroPad(auctions.filter(a => a.name === type.key).length.toString())
                  : '00';
                return (
                  <MenuItem key={index} onSelect={() => router.push(`/auctions/${type.key}`)}>
                    <Flex sx={{ justifyContent: 'space-between', py: 1, cursor: 'pointer', fontSize: 2 }}>
                      <Text>{type.key.toUpperCase()}</Text>
                      <Text sx={{ color: 'textSecondary' }}>{numberOfAuctions}</Text>
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </MenuButton>
        </Menu>

        <Link href={{ pathname: '/education', query: { network } }} passHref>
          <NavLink
            p={0}
            sx={{
              display: ['none', 'block'],
              ml: [0, 2, 4],
              color: router?.asPath?.startsWith('/education') ? 'primary' : undefined
            }}
          >
            Education
          </NavLink>
        </Link>

        <DaiDepositRedeem sx={{ display: ['none', 'block'], ml: [0, 2, 4] }} />

        <AccountSelect sx={{ ml: [0, 2, 4] }} />

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
        <Divider sx={{ width: '100%' }} />
        <Link href={{ pathname: '/auctions', query: { network } }}>
          <NavLink>Auctions</NavLink>
        </Link>
        {COLLATERAL_ARRAY.map(type => {
          return (
            <Link key={type.key} href={{ pathname: `/auctions/${type.key}`, query: { network } }}>
              <NavLink>
                <Text variant="links.nav" sx={{ fontSize: 5 }}>
                  {type.key.toUpperCase()}
                </Text>
              </NavLink>
            </Link>
          );
        })}
        <Divider sx={{ width: '100%' }} />
        <Link href={{ pathname: '/education', query: { network } }}>
          <NavLink>Education</NavLink>
        </Link>
      </Flex>
    </Container>
  );
};

export default Header;
