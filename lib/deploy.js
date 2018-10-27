import {deployContract} from 'ethereum-waffle';
import DoppelgangerContract from './contracts/Doppelganger';

const deployDoppelgangerContract = async (wallet) => deployContract(wallet, DoppelgangerContract);

export default deployDoppelgangerContract;
