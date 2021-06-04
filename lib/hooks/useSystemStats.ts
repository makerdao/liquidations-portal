import { useAuctions, useUnsafeVaults, useGlobalMax, useHoleAndDirt } from 'lib/hooks';

export function useSystemStats(): any {
  const { data: auctions, error: auctionsError } = useAuctions('all');
  const { data: unsafeVaults, error: unsafeVaultsError } = useUnsafeVaults();
  const { data: totalDai, error: totalDaiError } = useGlobalMax();

  // return data needed for each field in fieldMap and let format function do the rest
  // ['Active Auctions', 'Inactive Auctions', 'Vaults requiring kick', 'Dai required for Auctions', 'Global max available']
  const data =
    auctions && unsafeVaults && totalDai ? [auctions, auctions, unsafeVaults, auctions, totalDai] : null;
  const error = auctionsError || unsafeVaultsError || totalDaiError;

  return {
    data,
    loading: !error && !data,
    error
  };
}

export function useSystemStatsSidebar(ilk: string): any {
  const { data: auctions, error: auctionsError } = useAuctions(ilk);
  const { data: unsafeVaults, error: unsafeVaultsError } = useUnsafeVaults(ilk);
  const { data: holeAndDirt, error: holeAndDirtError } = useHoleAndDirt(ilk);

  // return data needed for each field in fieldMap and let format function do the rest
  // ['Undercollateralized Vaults', 'Active Auctions', 'Inactive Auctions', 'Dai required for Auctions', 'Limit per collateral available']
  const data = auctions && unsafeVaults ? [unsafeVaults, auctions, auctions, auctions, holeAndDirt] : null;
  const error = auctionsError || unsafeVaultsError || holeAndDirtError;

  return {
    data,
    loading: !error && !data,
    error
  };
}
