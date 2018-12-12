import {utils, Contract} from 'ethers';
import deployDoppelgangerContract from './deploy';

const prepareAbi = (abiOrString) => (typeof abiOrString === 'string' ? JSON.parse(abiOrString) : abiOrString);

export default class Doppelganger {
  constructor(abiOrString, contractInstance = null) {
    this.abi = prepareAbi(abiOrString);
    this.contractInstance = contractInstance;

    const {functions} = new utils.Interface(this.abi);
    const encoder = new utils.AbiCoder();
    for (const funcName of Object.keys(functions)) {
      const func = functions[funcName];
      this[funcName] = {
        returns: async (...args) => {
          const encoded = encoder.encode(func.outputs, args);
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
