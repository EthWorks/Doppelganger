import { use, expect } from 'chai';
import chaiAsPromised = require('chai-as-promised');
import { Wallet, Contract } from 'ethers';
import { createMockProvider, deployContract, getWallets } from 'ethereum-waffle';

import Doppelganger from '../../lib';
const Counter = require('../helpers/interfaces/Counter.json');
const Cap = require('../helpers/interfaces/Cap.json');

use(chaiAsPromised);

describe('Doppelganger - Integration (called by other contract)', () => {
  let provider;
  let wallet: Wallet;
  let doppelganger: Doppelganger;
  let capContract: Contract;

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
