import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createMockProvider, getWallets } from 'ethereum-waffle';

import Doppelganger from '../../lib';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);

describe('Doppelganger - Integration (called directly)', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('mocking mechanism works', async () => {
    const doppelganger = new Doppelganger(Counter.interface);
    await doppelganger.deploy(wallet);
    await doppelganger.read.returns(45291);
    const contract = doppelganger.pretendedContract(wallet);

    const ret = await expect(contract.read()).to.be.eventually.fulfilled;
    expect(ret.toNumber()).to.be.equal(45291);
  });
});
