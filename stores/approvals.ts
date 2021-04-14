import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  hasJoinDaiApproval: boolean;
  hasJoinDaiHope: boolean;
  setJoinDaiApproval: () => Promise<void>;
  setJoinDaiHope: () => Promise<void>;
};

const [useApprovalsStore] = create<Store>((set, get) => ({
  hasJoinDaiApproval: false,
  hasJoinDaiHope: false,

  setJoinDaiApproval: async () => {
    const maker = await getMaker();
    const address = maker.getContract('MCD_JOIN_DAI').address;
    const txCreator = () => maker.getToken('DAI').approveUnlimited(address);

    await transactionsApi.getState().track(txCreator, 'Join DAI approval sent', {
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'Join DAI approval finished');
      }
    });

    set({
      hasJoinDaiApproval: true
    });
  },
  setJoinDaiHope: async () => {
    const maker = await getMaker();
    const address = maker.getContract('MCD_JOIN_DAI').address;
    const txCreator = () => maker.service('smartContract').getContract('MCD_VAT').hope(address);

    await transactionsApi.getState().track(txCreator, 'Join DAI hope sent', {
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'Join DAI hope finished');
      }
    });

    set({
      hasJoinDaiHope: true
    });
  }
}));

export default useApprovalsStore;
