![Doppelganger](https://raw.githubusercontent.com/EthWorks/Doppelganger/master/assets/doppelganger-logo-512w.png "Doppelganger")

_doppelgänger /ˈdɒp(ə)lˌɡaŋə,ˈdɒp(ə)lˌɡɛŋə/ - an apparition or double of a living person_


[![Build Status](https://travis-ci.com/EthWorks/doppelganger.svg?branch=master)](https://travis-ci.com/EthWorks/doppelganger)


Library for mocking smart contract dependencies during unit testing.

## Install
To start using with npm, type:
```sh
npm i -D ethereum-doppelganger
```

or with Yarn:
```sh
yarn add --dev ethereum-doppelganger
```

Doppelganger is currently developed to work with [ethers-js](https://github.com/ethers-io/ethers.js/) exclusively. Support for other framework will be added in a future version.

## Usage

Create a instance of `Doppelganger` providing the ABI/interface of the smart contract you want to mock:

```js
import Doppelganger from 'ethereum-doppelganger';

...

const doppelganger = new Doppelganger(abi);
```

Deploy a instance of the Doppelganger smart contract:

```js
await doppelganger.deploy(wallet);
```

Doppelganger can now be passed into other contracts by using the `address` attribute.

Return values for mocked functions can be set using:

```js
await doppelganger.<nameOfMethod>.returns(<value>)
```

## Example

Below example illustrates how Doppelganger can be used to test the very simple `AmIRichAlready` contract.

```Solidity
pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract AmIRichAlready {
    IERC20 private tokenContract;
    address private wallet;
    uint private constant RICHNESS = 1000000 * 10 ** 18;

    constructor (IERC20 _tokenContract) public {
        tokenContract = _tokenContract;
        wallet = msg.sender;
    }

    function check() public view returns(bool) {
        uint balance = tokenContract.balanceOf(wallet);
        return balance > RICHNESS;
    }
}
```

We are mostly interested in the `tokenContract.balanceOf` call. Doppelganger will be used to mock exactly this call with values that are significant for the return of the `check()` method.

```js
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ethers from 'ethers';
import {createMockProvider, deployContract, getWallets} from 'ethereum-waffle';
import Doppelganger from 'ethereum-doppelganger';

import IERC20 from '../../build/IERC20';
import AmIRichAlready from '../../build/AmIRichAlready';

chai.use(chaiAsPromised);

describe('Am I Rich Already?', () => {
  let provider; // connector to the ethereum network - in our case a Ganache instance 
  let user; // the account issuing interactions on the network
  let contract; // an instance of the AmIRichAlready contract
  let doppelganger; // an instance of doppelganger for the ERC20 token we want to observe

  before(async () => {
    provider = createMockProvider(); 
    [user] = await getWallets(provider);
  });

  beforeEach(async () => {
    doppelganger = new Doppelganger(IERC20.interface); // say doppelganger what it should pretend to be
    await doppelganger.deploy(user); // deploy the doppelganger to the chain
    contract = await deployContract(user, AmIRichAlready, [doppelganger.address]); // deploy the contract under test to the chain
  });

  describe('check method', () => {
    it('returns false if the wallet has less then 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('999999')); // configure doppelganger to return 999999 when balanceOf is called
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns false if the wallet has exactly 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('1000000')); // subsequent calls override the previous config
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(false);
    });

    it('returns true if the wallet has more then 1000000 DAI', async () => {
      await doppelganger.balanceOf.returns(ethers.utils.parseEther('1000001'));
      await expect(contract.check()).to.eventually.be.fulfilled.and.equal(true);
    });
  });
});
```