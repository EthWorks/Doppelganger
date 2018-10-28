import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets} from 'ethereum-waffle';

import Doppelganger from '../../lib';
import Counter from '../helpers/interfaces/Counter';

chai.use(chaiAsPromised);

describe('Doppelganger - Integration (called directly)', () => {
  let provider;
  let wallet;
  let doppelganger;
  let pretendedContract;

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  beforeEach(async () => {
    doppelganger = new Doppelganger(Counter.interface);
    await doppelganger.deploy(wallet);
    pretendedContract = doppelganger.pretendedContract(wallet);
  });

  it('mocking mechanism works', async () => {
    await doppelganger.read.returns(45291);
    const ret = await expect(pretendedContract.read()).to.be.eventually.fulfilled;
    expect(ret.toNumber()).to.be.equal(45291);
  });
});
