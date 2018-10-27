/* solium-disable security/no-inline-assembly */
pragma solidity ^0.4.24;

import "./Counter.sol";

contract Cap {
    Counter private counter;

    constructor (Counter _counter) public {
        counter = _counter;
    }

    function read() public view returns (uint) {
        uint a = counter.read();
        if (a > 10) {
            return 10;
        }
        return a;
    }
}