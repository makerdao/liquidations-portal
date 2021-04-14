import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  hasJoinDaiApproval: boolean;
  hasJoinDaiHope: boolean;

  setHasJoinDaiApproval: (address: string | undefined) => Promise<void>;
  setHasJoinDaiHope: (address: string | undefined) => Promise<void>;

  enableJoinDaiApproval: () => Promise<void>;
  enableJoinDaiHope: () => Promise<void>;
};

const [useApprovalsStore] = create<Store>((set, get) => ({
  hasJoinDaiApproval: false,
  hasJoinDaiHope: false,

  setHasJoinDaiApproval: async address => {
    const maker = await getMaker();
    const allowance = await maker
      .getToken('DAI')
      .allowance(address, maker.service('smartContract').getContract('MCD_JOIN_DAI').address);
    set({
      hasJoinDaiApproval: allowance.toBigNumber().gt(0)
    });
  },
  setHasJoinDaiHope: async address => {
    const maker = await getMaker();
    const can = await maker
      .service('smartContract')
      .getContract('MCD_VAT')
      .can(address, maker.service('smartContract').getContract('MCD_JOIN_DAI').address);

    set({
      hasJoinDaiHope: can.toNumber() === 1
    });
  },

  enableJoinDaiApproval: async () => {
    const maker = await getMaker();
    const address = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
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
  enableJoinDaiHope: async () => {
    const maker = await getMaker();
    const address = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
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
