/* solium-disable security/no-inline-assembly */
pragma solidity ^0.4.24;


contract Doppelganger {
    mapping (bytes4 => bytes) mockConfig;
    
    function() public {
        bytes memory ret = mockConfig[msg.sig];
        assembly {
            return(add(ret, 0x20), mload(ret))
        }
    }

    function mockReturns(bytes4 key, bytes value) public {
        mockConfig[key] = value;
    }
}