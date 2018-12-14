import { use, expect } from 'chai';
import chaiAsPromised = require('chai-as-promised');
import { Wallet, Contract } from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';

import Doppelganger from '../../lib';
const Counter = require('../helpers/interfaces/Counter.json');

use(chaiAsPromised);

describe('Doppelganger - Integration (called directly)', () => {
  let provider;
  let wallet: Wallet;
  let doppelganger: Doppelganger;
  let pretendedContract: Contract;

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
