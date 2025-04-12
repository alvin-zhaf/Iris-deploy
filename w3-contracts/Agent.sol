// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agent {

    // Define the event that the oracle listens for
    event RequestData(address indexed userAddress, string data, address[] contractAddresses);

    // Function to invoke when a user or contract calls the oracle
    function requestData(address userAddress, string memory data, address[] memory contractAddresses) public {
        // Emit the event to notify listeners (oracles)
        emit RequestData(userAddress, data, contractAddresses);
    }

    // Allow the contract to be called by other contracts, ensuring security and authorization
    function callOtherContracts(address userAddress, address callingAddress, string memory data, address[] memory contractAddresses) public {
        (bool success, ) = callingAddress.call(abi.encodeWithSignature("requestData(address,string,address[])", userAddress, data, contractAddresses));
        require(success, "Failed to call contract");
    }
}
