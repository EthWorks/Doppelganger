import { use, expect } from 'chai';
import chaiAsPromised = require('chai-as-promised');
import { createMockProvider, getWallets } from 'ethereum-waffle';
import { Contract, utils, Wallet } from 'ethers';

import deployDoppelganger from '../../lib/deploy';
const Counter = require('../helpers/interfaces/Counter.json');

use(chaiAsPromised);

describe('Doppelganger - Contract', () => {
  let provider;
  let wallet: Wallet;
  let contract: Contract;

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
  });

  beforeEach(async () => {
    contract = await deployDoppelganger(wallet);
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
