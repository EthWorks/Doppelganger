import {ContractFactory} from 'ethers';
const DoppelgangerContract = require('./contracts/Doppelganger.json');

const bytecode = `0x${DoppelgangerContract.bytecode}`;
const abi = DoppelgangerContract.interface;

const deployDoppelgangerContract = async (wallet) => {
  const factory = new ContractFactory(abi, bytecode, wallet);
  return await factory.deploy();
};

export default deployDoppelgangerContract;
