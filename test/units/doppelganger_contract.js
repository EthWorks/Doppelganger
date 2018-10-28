import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import ethers from 'ethers';

import deployDoppelganger from '../../lib/deploy';
import Counter from '../helpers/interfaces/Counter';

chai.use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  let provider;
  let wallet;
  let contract;

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  beforeEach(async () => {
    contract = await deployDoppelganger(wallet);
  });

  describe('mocking mechanism', () => {
    let pretender;
    const readSignature = '0x57de26a4';

    beforeEach(async () => {
      pretender = new ethers.Contract(contract.address, Counter.interface, wallet);
    });

    it('returns preprogrammed return values for mocked functions', async () => {
      const value = '0x1000000000000000000000000000000000000000000000000000000000004234';
      await contract.mockReturns(readSignature, value);
      const ret = await expect(pretender.read()).to.eventually.be.fulfilled;
      expect(ethers.utils.hexlify(ret)).to.equal(value);
    });
  });
});
