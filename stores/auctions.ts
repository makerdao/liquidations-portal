import Auction from 'types/auction';
import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  submitBid: (ilk, id, amount, maxPrice, address) => Promise<void>;
};

const [useAuctionStore] = create<Store>((set, get) => ({
  submitBid: async (ilk, id, amount, maxPrice, address) => {
    console.log('submit bid called with', id, amount, maxPrice, address);
    const maker = await getMaker();

    // maxPrice is approximate, or else we get "Clipper/too-expensive" errors
    const txCreator = () =>
      maker.service('liquidation').take(ilk, id, amount.toFormat(18), maxPrice.toFormat(2), address);
    await transactionsApi.getState().track(txCreator, `Submit bid on ID: ${id}`, {
      pending: txId => {
        console.log('bid tx pending', txId);
      },
      mined: txId => {
        console.log('bid tx mined', txId);
        transactionsApi.getState().setMessage(txId, `Submit bid finished for ID: ${id}`);
      }
    });
  }
}));

export default useAuctionStore;
//485.62
