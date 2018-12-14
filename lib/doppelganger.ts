import {utils, Contract, Wallet} from 'ethers';
import deployDoppelgangerContract from './deploy';

const prepareAbi = (abiOrString: any) => (typeof abiOrString === 'string' ? JSON.parse(abiOrString) : abiOrString);

export default class Doppelganger {
  abi: any;
  contractInstance?: Contract;
  [key: string]: any;

  constructor(abiOrString: any, contractInstance?: Contract) {
    this.abi = prepareAbi(abiOrString);
    this.contractInstance = contractInstance;

    const {functions} = new utils.Interface(this.abi);
    const encoder = new utils.AbiCoder();
    for (const funcName of Object.keys(functions)) {
      const func = functions[funcName];
      // This will override properties like abi, address or contractInstance!
      this[funcName] = {
        returns: async (...args: any) => {
          const encoded = encoder.encode(func.outputs, args);
          // This will throw an exception when instance is undefined!
          await this.contractInstance!.mockReturns(func.sighash, encoded);
        }
      };
    }
  }

  pretendedContract(wallet: Wallet) {
    // This will throw an exception when instance is undefined!
    return new Contract(this.contractInstance!.address, this.abi, wallet);
  }

  get address() {
    // This will throw an exception when instance is undefined!
    return this.contractInstance!.address;
  }

  async deploy(wallet: Wallet) {
    this.contractInstance = await deployDoppelgangerContract(wallet);
  }
}
