/** @jsx jsx */
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { jsx } from 'theme-ui';
import renderToString from 'next-mdx-remote/render-to-string';
import hydrate from 'next-mdx-remote/hydrate';

import PrimaryLayout from '../components/layouts/Primary';

export default function Education({ source }): JSX.Element {
  const content = hydrate(source);
  return (
    <div>
      <Head>
        <title>Maker Liquidations Portal – Education</title>
      </Head>

      <PrimaryLayout
        shortenFooter={true}
        sx={{ maxWidth: [null, null, null, 'page', 'dashboard'], img: { maxWidth: ['100%', null] } }}
      >
        {content}
      </PrimaryLayout>
    </div>
  );
}

export async function getStaticProps() {
  // See: https://github.com/hashicorp/next-mdx-remote
  const source = fs.readFileSync(path.join(path.join(process.cwd(), 'content'), 'education.mdx'), 'utf8');
  const mdxSource = await renderToString(source);
  return { props: { source: mdxSource } };
}
