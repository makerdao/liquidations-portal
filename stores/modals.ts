import create from 'zustand';

type Store = {
  isDepositWithdrawOpen: boolean;
  toggleDepositWithdraw: () => void;
};

const [useModalsStore] = create<Store>(set => ({
  isDepositWithdrawOpen: false,
  toggleDepositWithdraw: () => set(state => ({ isDepositWithdrawOpen: !state.isDepositWithdrawOpen }))
}));

export { useModalsStore };
