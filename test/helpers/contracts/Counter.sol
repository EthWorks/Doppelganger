/* solium-disable security/no-inline-assembly */
pragma solidity ^0.4.24;

contract Counter {
    uint private value;

    function increment() public {
        value += 1;
    }

    function read() public view returns (uint) {
        return value;
    }
}