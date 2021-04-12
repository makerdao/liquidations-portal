import create from 'zustand';

type Store = {
  isDepositRedeemOpen: boolean;
  toggleDepositRedeem: () => void;
};

const [useModalsStore] = create<Store>(set => ({
  isDepositRedeemOpen: false,
  toggleDepositRedeem: () => set(state => ({ isDepositRedeemOpen: !state.isDepositRedeemOpen }))
}));

export { useModalsStore };
