import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';

import Doppelganger from '../../lib';
import Counter from '../helpers/interfaces/Counter';
import Cap from '../helpers/interfaces/Cap';

chai.use(chaiAsPromised);

describe('Doppelganger - Integration (called by other contract)', () => {
  let provider;
  let wallet;
  let doppelganger;
  let capContract;

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  beforeEach(async () => {
    doppelganger = new Doppelganger(Counter.interface);
    await doppelganger.deploy(wallet);
    capContract = await deployContract(wallet, Cap, [doppelganger.address]);
  });

  it('mocking mechanism works', async () => {
    await doppelganger.read.returns(5);
    const ret1 = await expect(capContract.read()).to.be.eventually.fulfilled;
    expect(ret1.toNumber()).to.be.equal(5);

    await doppelganger.read.returns(12);
    const ret2 = await expect(capContract.read()).to.be.eventually.fulfilled;
    expect(ret2.toNumber()).to.be.equal(10);
  });
});
