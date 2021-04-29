import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  submitBid: (ilk, id, amount, maxPrice, address) => Promise<void>;
  bidTxPending: boolean;
  bidTxSuccess: boolean;
  bidTxError: boolean;
  resetBidSuccess: () => void;
};

const [useAuctionStore] = create<Store>((set, get) => ({
  bidTxPending: false,
  bidTxSuccess: false,
  bidTxError: false,
  resetBidSuccess: () => set(state => ({ bidTxSuccess: false })),
  submitBid: async (ilk, id, amount, maxPrice, address) => {
    const maker = await getMaker();

    // maxPrice is approximate, or else we get "Clipper/too-expensive" errors
    const txCreator = () =>
      maker.service('liquidation').take(ilk, id, amount.toFormat(18), maxPrice.toFormat(2), address);
    await transactionsApi.getState().track(txCreator, `Submit bid on ID: ${id}`, {
      pending: () => {
        set({
          bidTxPending: true,
          bidTxError: false
        });
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, `Submit bid finished for ID: ${id}`);
        set({
          bidTxPending: false,
          bidTxSuccess: true,
          bidTxError: false
        });
      },
      error: () => {
        set({
          bidTxPending: false,
          bidTxError: true
        });
      }
    });
  }
}));

export default useAuctionStore;
