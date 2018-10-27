/* solium-disable security/no-inline-assembly */
pragma solidity ^0.4.24;


contract Doppelganger {
    mapping (uint32 => bytes) mockConfig;
    
    function() public {
        uint32 key;
        bytes memory ret;
        assembly {
            calldatacopy(0x0, 0x0, 0x4)
            key := div(mload(0x0), 0x0000000100000000000000000000000000000000000000000000000000000000)
        }
        ret = mockConfig[key];
        assembly {
            return(add(ret, 0x20), mload(ret))
        }
    }

    function mockReturns(uint32 key, bytes value) public {
        mockConfig[key] = value;
    }
}