import { cloneElement } from 'react';
import BigNumber from 'bignumber.js';
import { jsx, SxStyleProp } from 'theme-ui';
import { css } from '@theme-ui/css';
import { SupportedNetworks, ETHERSCAN_PREFIXES } from './constants';
import round from 'lodash/round';

export async function fetchJson(url: RequestInfo, init?: RequestInit): Promise<any> {
  const response = await fetch(url, init);
  const json = await response.json();

  if (!response.ok) throw new Error(`${response.statusText}: ${json.error?.message || JSON.stringify(json)}`);
  return json;
}

export function timeoutPromise(ms: number, promise: Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject('promise timeout');
    }, ms);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

export function wait(duration: number) {
  return new Promise(res => setTimeout(res, duration));
}

export function backoffRetry(retries: number, fn: () => Promise<any>, delay = 500): Promise<any> {
  return fn().catch(err =>
    retries > 1 ? wait(delay).then(() => backoffRetry(retries - 1, fn, delay * 2)) : Promise.reject(err)
  );
}

export function getEtherscanLink(
  network: SupportedNetworks,
  data: string,
  type: 'transaction' | 'address'
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[network] || ETHERSCAN_PREFIXES[SupportedNetworks.MAINNET]
  }etherscan.io`;

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`;
    case 'address':
    default:
      return `${prefix}/address/${data}`;
  }
}

/* eslint-disable no-useless-escape */
// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
export function slugify(string: string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, c => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
/* eslint-enable no-useless-escape */

/** Add sx styles to the passed in component. Provided styles override component styles if there's a clash. */
export function styledClone(component, { sx: stylesToMerge }: { sx: SxStyleProp }): React.ReactNode {
  if ('css' in component.props) {
    return cloneElement(component, {
      css: theme => [component.props.css(theme), css(stylesToMerge)(theme)]
    });
  } else {
    const { sx, ...componentProps } = component.props;
    return jsx(component.type, {
      key: component.key,
      ...componentProps,
      css: theme => [css(sx instanceof Function ? sx(theme) : sx)(theme), css(stylesToMerge)(theme)]
    });
  }
}

export const formatDateWithTime = dateString => {
  if (!dateString) return;
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
    timeZone: 'UTC',
    timeZoneName: 'short'
  };
  try {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (err) {
    console.error(err);
    return '??';
  }
};

function now() {
  return Math.floor(new Date().getTime());
}

export function formatAddress(address: string) {
  return address.slice(0, 7) + '...' + address.slice(-4);
}

export function cutMiddle(text = '', left = 6, right = 4) {
  if (text.length <= left + right) return text;
  return `${text.substring(0, left)}...${text.substring(text.length - right - 1, text.length - 1)}`;
}

export const formatRound = (num, decimals = 2) =>
  isNaN(num) ? '----' : round(num, decimals).toLocaleString({}, { minimumFractionDigits: decimals });

export function fromRad(value): BigNumber {
  return new BigNumber(value).shiftedBy(-45);
}

export const calculateCollateralAmt = (colAmt: BigNumber, colPrice: BigNumber): BigNumber =>
  colAmt.div(colPrice);

export const calculateColValue = (colAmt: BigNumber, colPrice: BigNumber): BigNumber =>
  colAmt.times(colPrice);

export const zeroPad = (num: string, width = 2): string =>
  num.length >= width ? num : '0'.repeat(width - num.length) + num;
