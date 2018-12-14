import { use, expect } from 'chai';
import chaiAsPromised = require('chai-as-promised');
import sinon = require('sinon');
import sinonChai = require('sinon-chai');
import { Contract } from 'ethers';

import Doppelganger from '../../lib/doppelganger';
const Counter = require('../helpers/interfaces/Counter.json');

use(chaiAsPromised);
use(sinonChai);

describe('Doppelgenger - Tool', () => {
  let doppelgenger: Doppelganger;
  let contractStub: Contract;

  beforeEach(async () => {
    contractStub = <any>{
      mockReturns: sinon.stub(),
      address: '0xABCD',
    };
    doppelgenger = new Doppelganger(JSON.parse(Counter.interface), contractStub);
  });

  it('address property proxies the contract instance address', () => {
    expect(doppelgenger.address).to.equal('0xABCD');
  });

  describe('behaviour controls', () => {
    it('are created for all abi defined functions', () => {
      expect(doppelgenger.read).to.be.an('object');
    });

    it('each containing a returns method', () => {
      expect(doppelgenger.read.returns).to.be.a('function');
    });

    describe('setter method', () => {
      it('calls the mockReturns method of the mock contract', async () => {
        await expect(doppelgenger.read.returns(1234)).to.eventually.be.fulfilled;
        expect(contractStub.mockReturns).to.have.been.calledOnceWith(
          '0x57de26a4',
          '0x00000000000000000000000000000000000000000000000000000000000004d2',
        );
      });
    });
  });
});
