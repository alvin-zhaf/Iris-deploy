// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agent {

    // Define the event that the oracle listens for
    event IRISRequestAgentData(
        address indexed userAddress,
        string data,
        uint256 max_hops,
        string originalData,
        address[] hops
    );

    // Function to invoke when a user or contract calls the oracle
    function requestData(
        address userAddress,
        string memory data,
        uint256 max_hops,
        string memory originalData,
        address[] memory hops
    ) public {
        // Emit the event to notify listeners (oracles)
        emit IRISRequestAgentData(userAddress, data, max_hops, originalData, hops);
    }
}
