import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createMockProvider, deployContract, getWallets } from 'ethereum-waffle';

import Doppelganger from '../../lib';
import Counter from '../helpers/interfaces/Counter.json';
import Cap from '../helpers/interfaces/Cap.json';

use(chaiAsPromised);

describe('Doppelganger - Integration (called by other contract)', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);

  it('mocking mechanism works', async () => {
    const doppelganger = new Doppelganger(Counter.interface);
    await doppelganger.deploy(wallet);
    const capContract = await deployContract(
      wallet,
      {
        abi: Cap.interface,
        evm: {
          bytecode: {
            object: Cap.bytecode,
          },
        },
      },
      [doppelganger.address],
    );

    await doppelganger.read.returns(5);
    const ret1 = await expect(capContract.read()).to.be.eventually.fulfilled;
    expect(ret1.toNumber()).to.be.equal(5);

    await doppelganger.read.returns(12);
    const ret2 = await expect(capContract.read()).to.be.eventually.fulfilled;
    expect(ret2.toNumber()).to.be.equal(10);
  });
});
