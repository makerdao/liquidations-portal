/** @jsx jsx */
import Head from 'next/head';
import { Flex, jsx } from 'theme-ui';

import PrimaryLayout from '../components/layouts/Primary';
import Stack from '../components/layouts/Stack';

type Props = {};

export default function Education({}: Props) {
  return (
    <div>
      <Head>
        <title>Maker liquidations Portal – Education</title>
      </Head>

      <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'] }}>
        <Flex>It's time to learn</Flex>
      </PrimaryLayout>
    </div>
  );
}
