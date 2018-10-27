import {Interface, utils, Contract} from 'ethers';
import deployDoppelgangerContract from './deploy';

export default class Doppelganger {
  constructor(abi, contractInstance = null) {
    this.contractInstance = contractInstance;
    this.abi = abi;
    const {functions} = new Interface(abi);
    const encoder = new utils.AbiCoder ();
    const funcNames = abi.filter((value) => value.type === 'function').map((value) => value.name);
    for (const funcName of funcNames) {
      const func = functions[funcName];
      this[funcName] = {
        returns: async (...args) => {
          const encoded = encoder.encode(func.outputs.types, args);
          await this.contractInstance.mockReturns(func.sighash, encoded);
        }
      };
    }
  }

  pretendedContract(wallet) {
    return new Contract(this.contractInstance.address, this.abi, wallet);
  }

  get address() {
    return this.contractInstance.address;
  }

  async deploy(wallet) {
    this.contractInstance = await deployDoppelgangerContract(wallet);
  }
}
