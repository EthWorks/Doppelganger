import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Contract } from 'ethers';

import Doppelganger from '../../lib';
import Counter from '../helpers/interfaces/Counter.json';

use(chaiAsPromised);
use(sinonChai);

describe('Doppelganger - Tool', () => {
  let doppelganger: Doppelganger;
  let contractStub: Contract;

  beforeEach(async () => {
    contractStub = <any>{
      mockReturns: sinon.stub(),
      address: '0xABCD',
    };
    doppelganger = new Doppelganger(JSON.parse(Counter.interface), contractStub);
  });

  it('address property proxies the contract instance address', () => {
    expect(doppelganger.address).to.equal('0xABCD');
  });

  describe('behavior controls', () => {
    it('are created for all abi defined functions', () => {
      expect(doppelganger.read).to.be.an('object');
    });

    it('each containing a returns method', () => {
      expect(doppelganger.read.returns).to.be.a('function');
    });

    describe('setter method', () => {
      it('calls the mockReturns method of the mock contract', async () => {
        await expect(doppelganger.read.returns(1234)).to.eventually.be.fulfilled;
        expect(contractStub.mockReturns).to.have.been.calledOnceWith(
          '0x57de26a4',
          '0x00000000000000000000000000000000000000000000000000000000000004d2',
        );
      });
    });
  });
});
