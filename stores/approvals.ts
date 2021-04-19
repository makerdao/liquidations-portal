import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  hasJoinDaiApproval: boolean;
  hasJoinDaiHope: boolean;
  hasIlkHope: Record<string, string>;

  setHasJoinDaiApproval: (address: string | undefined) => Promise<void>;
  setHasJoinDaiHope: (address: string | undefined) => Promise<void>;
  setHasIlkHope: (address: string, ilk: string) => Promise<void>;

  enableJoinDaiApproval: () => Promise<void>;
  enableJoinDaiHope: () => Promise<void>;
  enableIlkHope: (ilk: string) => Promise<void>;

  joinDaiApprovalPending: boolean;
  joinDaiHopePending: boolean;

  initApprovals: (address: string, ilks?: string[]) => Promise<void>;
};

const [useApprovalsStore] = create<Store>((set, get) => ({
  hasJoinDaiApproval: false,
  hasJoinDaiHope: false,
  hasIlkHope: {},
  joinDaiApprovalPending: false,
  joinDaiHopePending: false,

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
  setHasIlkHope: async (address, ilk) => {
    const maker = await getMaker();
    const clipperAddress = maker.service('liquidation')._clipperContractByIlk(ilk).address;

    const can = await maker.service('smartContract').getContract('MCD_VAT').can(address, clipperAddress);

    set(state => ({
      hasIlkHope: {
        ...state.hasIlkHope,
        [`MCD_CLIP_${ilk.replace('-', '_')}`]: can.toNumber() === 1
      }
    }));
  },

  enableJoinDaiApproval: async () => {
    const maker = await getMaker();
    const address = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
    const txCreator = () => maker.getToken('DAI').approveUnlimited(address);

    await transactionsApi.getState().track(txCreator, 'Join DAI approval sent', {
      pending: () => {
        set({
          joinDaiApprovalPending: true
        });
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'Join DAI approval finished');
        set({
          hasJoinDaiApproval: true,
          joinDaiApprovalPending: false
        });
      },
      error: () => {
        set({
          joinDaiApprovalPending: false
        });
      }
    });
  },
  enableJoinDaiHope: async () => {
    const maker = await getMaker();
    const address = maker.service('smartContract').getContract('MCD_JOIN_DAI').address;
    const txCreator = () => maker.service('smartContract').getContract('MCD_VAT').hope(address);

    await transactionsApi.getState().track(txCreator, 'Join DAI hope sent', {
      pending: () => {
        set({
          joinDaiHopePending: true
        });
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'Join DAI hope finished');
        set({
          hasJoinDaiHope: true,
          joinDaiHopePending: false
        });
      },
      error: () => {
        set({
          joinDaiHopePending: false
        });
      }
    });
  },
  enableIlkHope: async ilk => {
    const maker = await getMaker();
    const clipperAddress = maker.service('liquidation')._clipperContractByIlk(ilk).address;
    const txCreator = () => maker.service('smartContract').getContract('MCD_VAT').hope(clipperAddress);

    await transactionsApi.getState().track(txCreator, `${ilk} clipper hope sent`, {
      mined: txId => {
        transactionsApi.getState().setMessage(txId, `${ilk} clipper hope finished`);
        set(state => ({
          hasIlkHope: {
            ...state.hasIlkHope,
            [ilk]: true
          }
        }));
      }
    });
  },

  initApprovals: async (address, ilks) => {
    get().setHasJoinDaiApproval(address);
    get().setHasJoinDaiHope(address);
    ilks?.forEach(ilk => get().setHasIlkHope(address, ilk));
  }
}));

export default useApprovalsStore;
