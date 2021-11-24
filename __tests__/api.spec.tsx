import { DAI } from '@makerdao/dai-plugin-mcd';
import BigNumber from 'bignumber.js';
import {
  getGlobalMax,
  getUnsafeVaults,
  getAllClips,
  getVatGemBalance,
  getAccountVatBalance,
  getAccountTokenBalance,
  getHoleAndDirtForIlk,
  getAuctionStatus
} from 'lib/api';

const me = '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6';

jest.setTimeout(30000);

function isEthersBN(val) {
  return val._isBigNumber && !!val._hex;
}

test('can get the global max', async () => {
  const gm = await getGlobalMax();

  expect(BigNumber.isBigNumber(gm)).toBe(true);
  expect(gm.toString()).toBe('4000');
});

test('can get unsafe vaults', async () => {
  const ilk = 'ETH-A';
  const vaults = await getUnsafeVaults(ilk);

  expect(vaults.length).toBe(0);
  expect(Array.isArray(vaults)).toBe(true);
});

test('can get all clips', async () => {
  const ilk = 'ETH-B';
  const clips = await getAllClips(ilk);

  expect(clips.length).toBe(0);
  expect(Array.isArray(clips)).toBe(true);
});

test('can get the gem balance of the vat', async () => {
  const ilk = 'ETH-B';
  const vatGembal = await getVatGemBalance(ilk, me);

  expect(isEthersBN(vatGembal)).toBe(true);
  expect(vatGembal.toString()).toBe('0');
});

test('can get the gem balance of the vat', async () => {
  const vatDaibal = await getAccountVatBalance(me);

  expect(isEthersBN(vatDaibal)).toBe(true);
  expect(vatDaibal.toString()).toBe('0');
});

test('can get the gem balance of the vat', async () => {
  const token = 'DAI';
  const acctTokenbal = await getAccountTokenBalance(token, me);

  expect(acctTokenbal).toEqual(DAI(0));
});

test('can get the hole and dirt value for an ilk', async () => {
  const ilk = 'ETH-B';
  const expected = { hole: '1000', dirt: '0', diff: '1000' };

  const val = await getHoleAndDirtForIlk(ilk);
  for (const v in val) expect(BigNumber.isBigNumber(val[v])).toBe(true);

  expect(val.hole.toString()).toBe(expected.hole);
  expect(val.dirt.toString()).toBe(expected.dirt);
  expect(val.diff.toString()).toBe(expected.diff);
});

test('can get "needsRedo", "price", "lot", and "tab" values of an auction', async () => {
  const ilk = 'ETH-B';
  const id = '0';

  const [needsRedo, ...others] = await getAuctionStatus(ilk, id);
  for (const v in others) expect(BigNumber.isBigNumber(others[v])).toBe(true);

  expect(needsRedo).toBe(false);
  expect(others[0].toString()).toBe('0');
  expect(others[1].toString()).toBe('0');
});
