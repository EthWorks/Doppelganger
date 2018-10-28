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
