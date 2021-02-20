import create from 'zustand';

import getMaker from '../lib/maker';
import Account from '../types/account';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type Store = {
  currentAccount?: Account;
  addAccountsListener: () => Promise<void>;
  disconnectAccount: () => Promise<void>;
};

const [useAccountsStore, accountsApi] = create<Store>((set, get) => ({
  currentAccount: undefined,
  proxies: {},
  oldProxy: { role: '', address: '' },

  addAccountsListener: async () => {
    const maker = await getMaker();
    maker.on('accounts/CHANGE', async ({ payload: { account } }) => {
      if (!account) {
        set({ currentAccount: account });
        return;
      }

      const { address } = account;
      set({
        currentAccount: account
      });
    });
  },

  // explicitly setting this as `undefined` is an anti-pattern, but it's only a bandaid until
  // disconnect functionality is added to dai.js
  disconnectAccount: async () => {
    set({ currentAccount: undefined });
  }
}));

// if we are on the browser start listening for account changes as soon as possible
if (typeof window !== 'undefined') {
  accountsApi.getState().addAccountsListener();
}
export default useAccountsStore;
export { accountsApi };
