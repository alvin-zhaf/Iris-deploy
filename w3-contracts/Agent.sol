// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agent {

    // Define the event that the oracle listens for
    event IRISRequestAgentData(address indexed userAddress, string indexed data);

    // Function to invoke when a user or contract calls the oracle
    function requestData(address userAddress, string memory data) public {
        // Emit the event to notify listeners (oracles)
        emit IRISRequestAgentData(userAddress, data);
    }

    // Allow the contract to be called by other contracts, ensuring security and authorization
    function callOtherContracts(address userAddress, address callingAddress, string memory data) public {
        (bool success, ) = callingAddress.call(abi.encodeWithSignature("requestData(address,string)", userAddress, data));
        require(success, "Failed to call contract");
    }
}
