// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Agent.sol";

/**
 * @title AgentFactory
 * @dev Factory contract for creating and managing Agent instances
 */
contract AgentFactory {
    // Event emitted when a new Agent is created
    event AgentCreated(address indexed owner, address agentAddress, string name, string description);
    
    // Mapping from owner address to their agents
    mapping(address => address[]) public ownerToAgents;
    
    // Mapping from agent address to agent details
    mapping(address => AgentInfo) public agentDetails;
    
    // Agent information structure
    struct AgentInfo {
        string name;
        string description;
        address owner;
        uint256 createdAt;
        bool active;
    }
    
    /**
     * @dev Creates a new Agent instance
     * @param name The name of the agent
     * @param description A description of the agent's purpose
     * @return The address of the newly created Agent
     */
    function createAgent(string memory name, string memory description) public returns (address) {
        // Create a new Agent instance
        Agent newAgent = new Agent();
        address agentAddress = address(newAgent);
        
        // Store the agent information
        agentDetails[agentAddress] = AgentInfo({
            name: name,
            description: description,
            owner: msg.sender,
            createdAt: block.timestamp,
            active: true
        });
        
        // Add the agent to the owner's list
        ownerToAgents[msg.sender].push(agentAddress);
        
        // Emit the creation event
        emit AgentCreated(msg.sender, agentAddress, name, description);
        
        return agentAddress;
    }
    
    /**
     * @dev Gets all agents owned by a specific address
     * @param owner The address of the owner
     * @return Array of agent addresses owned by the specified address
     */
    function getAgentsByOwner(address owner) public view returns (address[] memory) {
        return ownerToAgents[owner];
    }
    
    /**
     * @dev Gets the details of a specific agent
     * @param agentAddress The address of the agent
     * @return name The name of the agent
     * @return description The description of the agent
     * @return owner The owner of the agent
     * @return createdAt The timestamp when the agent was created
     * @return active Whether the agent is active
     */
    function getAgentDetails(address agentAddress) public view returns (
        string memory name,
        string memory description,
        address owner,
        uint256 createdAt,
        bool active
    ) {
        AgentInfo storage info = agentDetails[agentAddress];
        return (
            info.name,
            info.description,
            info.owner,
            info.createdAt,
            info.active
        );
    }
    
    /**
     * @dev Toggles the active status of an agent
     * @param agentAddress The address of the agent
     * @return The new active status
     */
    function toggleAgentStatus(address agentAddress) public returns (bool) {
        require(agentDetails[agentAddress].owner == msg.sender, "Only the owner can toggle agent status");
        
        agentDetails[agentAddress].active = !agentDetails[agentAddress].active;
        return agentDetails[agentAddress].active;
    }
    
    /**
     * @dev Request data through a specific agent
     * @param agentAddress The address of the agent to use
     * @param data The data to request
     * @param contractAddresses The addresses of contracts to call
     */
    function requestDataViaAgent(address agentAddress, string memory data, address[] memory contractAddresses) public {
        require(agentDetails[agentAddress].active, "Agent is not active");
        
        Agent agent = Agent(agentAddress);
        agent.requestData(msg.sender, data, contractAddresses);
    }
}