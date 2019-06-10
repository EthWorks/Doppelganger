import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createMockProvider, getWallets, deployContract } from 'ethereum-waffle';
import { Contract, utils } from 'ethers';

import DoppelgangerContract from '../../lib/Doppelganger.json';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let contract: Contract;

  beforeEach(async () => {
    contract = await deployContract(wallet, DoppelgangerContract);
  });

  describe('mocking mechanism', () => {
    let pretender: Contract;
    const readSignature = '0x57de26a4';

    beforeEach(async () => {
      pretender = new Contract(contract.address, Counter.interface, wallet);
    });

    it('returns preprogrammed return values for mocked functions', async () => {
      const value = '0x1000000000000000000000000000000000000000000000000000000000004234';
      await contract.mockReturns(readSignature, value);
      const ret = await expect(pretender.read()).to.eventually.be.fulfilled;
      expect(utils.hexlify(ret)).to.equal(value);
    });
  });
});
