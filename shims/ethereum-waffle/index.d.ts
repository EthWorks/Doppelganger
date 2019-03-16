declare module 'ethereum-waffle' {
  import { providers, Wallet, Contract } from 'ethers';
  export function createMockProvider(): providers.Provider;
  export function getWallets(provider: providers.Provider): Wallet[];
  export function deployContract(...args: any[]): Contract;
}
