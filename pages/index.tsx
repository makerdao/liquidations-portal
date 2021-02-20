/** @jsx jsx */
import Head from 'next/head';
import { Heading, Container, Text, jsx } from 'theme-ui';
import { Global } from '@emotion/core';

import PrimaryLayout from '../components/layouts/Primary';
import Stack from '../components/layouts/Stack';

type Props = {};

export default function LandingPage({}: Props) {
  return (
    <div>
      <Head>
        <title>Maker liquidations Portal</title>
      </Head>

      <PrimaryLayout sx={{ maxWidth: 'page' }}>
        <Stack gap={[5, 6]}>
          <section>
            <Stack gap={[4, 6]}>
              <Container pt={4} sx={{ maxWidth: 'title', textAlign: 'center' }}>
                <Stack gap={3}>
                  <Heading as="h1" sx={{ color: 'text', fontSize: [7, 8] }}>
                    Maker Liquidation Portal
                  </Heading>
                </Stack>
              </Container>
            </Stack>
          </section>
        </Stack>
      </PrimaryLayout>
      <Global
        styles={theme => ({
          body: {
            backgroundColor: theme.colors.surface
          }
        })}
      />
    </div>
  );
}
