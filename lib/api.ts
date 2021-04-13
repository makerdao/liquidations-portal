import getMaker from 'lib/maker';

export async function getTotalDai(): Promise<any> {
  const maker = await getMaker();

  return maker.service('mcd:systemData').getTotalDai();
}

export async function getUnsafeVaults(ilk: string): Promise<any> {
  const maker = await getMaker();

  return maker.service('liquidation').getUnsafeVaults(ilk);
}

export async function getAllClips(ilk: string): Promise<any> {
  const maker = await getMaker();

  return await maker.service('liquidation').getAllClips(ilk);
}
