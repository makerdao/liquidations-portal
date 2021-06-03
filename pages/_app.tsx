import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import { ThemeProvider, Flex } from 'theme-ui';
import { Global } from '@emotion/core';
import mixpanel from 'mixpanel-browser';
import debug from 'debug';

import '@reach/dialog/styles.css';
import '@reach/tooltip/styles.css';

import { mixpanelInit } from 'lib/analytics';
import { fetchJson } from 'lib/utils';
import theme from 'lib/theme';
import Header from 'components/shared/Header';

const vitalslog = debug('liqpo:vitals');

export const reportWebVitals = vitalslog;

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const dev = process.env.NODE_ENV === 'development';
  const router = useRouter();
  useEffect(() => {
    mixpanelInit();
    const handleRouteChange = url => {
      mixpanel.track('route-change', {
        id: url,
        product: 'liquidations-portal'
      });
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Head>
        {/* TODO: come back to this/ */}
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content={
            "default-src 'none';" +
            'frame-src https://connect.trezor.io;' +
            "font-src 'self';" +
            "connect-src 'self' https: wss:;" +
            "style-src 'self' 'unsafe-inline';" +
            `script-src 'self' ${dev ? "'unsafe-eval'" : ''};` +
            "img-src 'self' https: data:"
          }
        /> */}
        <meta
          name="description"
          content="Allowing ecosystem actors to view and participate in MakerDAO collateral liquidation auctions."
        />
      </Head>

      <SWRConfig
        value={{
          refreshInterval: 10000,
          fetcher: url => fetchJson(url)
        }}
      >
        <Global
          styles={{
            '*': {
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            },
            body: {
              backgroundColor: theme.colors.background
            }
          }}
        />
        <Flex
          sx={{
            flexDirection: 'column',
            variant: 'layout.root',
            px: [3, 4]
          }}
        >
          <Header />
          <Component {...pageProps} />
        </Flex>
      </SWRConfig>
    </ThemeProvider>
  );
};

export default MyApp;
