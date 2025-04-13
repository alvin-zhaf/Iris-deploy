#!/usr/bin/env python3
"""
Agent Initializer
----------------
This script automatically initializes a set of predefined agents on startup.
It can be run as part of a deployment process or system initialization.
"""

import random
from dotenv import load_dotenv
load_dotenv()

import os
import db
import time
import logging
from web3 import Web3
from rich.console import Console
from rich.logging import RichHandler

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    handlers=[RichHandler(rich_tracebacks=True)]
)
logger = logging.getLogger("agent_initializer")
console = Console()


# Define your initial agents here
INITIAL_AGENTS = [
    {
        "name": "Data Retriever",
        "description": "Fetches external data from APIs and returns it to the blockchain",
        "id": "data_retriever"
    },
    {
        "name": "Market Analyzer",
        "description": "Analyzes cryptocurrency market data and provides insights",
        "id": "market_analyzer"
    },
    {
        "name": "Weather Oracle",
        "description": "Retrieves weather data for smart contracts that need weather information",
        "id": "weather_oracle"
    },
    {
        "name": "Transaction Validator",
        "description": "Verifies external transactions and confirms their validity on-chain",
        "id": "transaction_validator"
    },
    {
		"name": "Data Aggregator",
		"description": "Aggregates data from multiple sources and provides a unified view",
        "id": "data_aggregator"
	},
    {
        "name": "Price Oracle",
        "description": "Provides real-time price data for various cryptocurrencies",
        "id": "price_oracle"
    },
	{
		"name": "Risk Manager",
		"description": "Manages risk and risk mitigation strategies for smart contracts",
		"id": "risk_manager"
	}
]

# Load ABIs and connect to Web3
def setup_web3_and_contracts():
    # Connect to Web3
    infura_key = os.getenv('INFURA_API_KEY')
    if not infura_key:
        raise ValueError("INFURA_API_KEY not found in environment variables")
    
    w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{infura_key}"))
    if not w3.is_connected():
        raise ConnectionError("Failed to connect to Ethereum network")
    
    logger.info(f"Connected to Ethereum network (Chain ID: {w3.eth.chain_id})")
    
    # Load ABIs
    agent_factory_abi = [
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "agentDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "createdAt",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "active",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				}
			],
			"name": "createAgent",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "agentAddress",
					"type": "address"
				}
			],
			"name": "getAgentDetails",
			"outputs": [
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "description",
					"type": "string"
				},
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "createdAt",
					"type": "uint256"
				},
				{
					"internalType": "bool",
					"name": "active",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "owner",
					"type": "address"
				}
			],
			"name": "getAgentsByOwner",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				},
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "ownerToAgents",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "agentAddress",
					"type": "address"
				}
			],
			"name": "toggleAgentStatus",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	]
    
    # Get contract address
    factory_address = os.getenv('AGENT_FACTORY_ADDR')
    if not factory_address or not w3.is_address(factory_address):
        raise ValueError("Invalid or missing AGENT_FACTORY_ADDR in environment variables")
    
    # Initialize contract
    agent_factory = w3.eth.contract(address=factory_address, abi=agent_factory_abi)
    logger.info(f"Agent Factory contract initialized at {factory_address}")
    
    return w3, agent_factory

# Get wallet credentials
def get_wallet_credentials():
    wallet_address = os.getenv('WALLET_ADDR')
    private_key = os.getenv('WALLET_PKEY')
    
    if not wallet_address or not private_key:
        raise ValueError("WALLET_ADDR or WALLET_PKEY not found in environment variables")
    
    return wallet_address, private_key

def generate_random_sparkline_data() -> list:
    """
    Create a sparkline data array of random length (3–10 items),
    each item a random integer between 0 and 50.
    """
    length = random.randint(3, 10)
    return [random.randint(0, 50) for _ in range(length)]


# Send transaction and wait for confirmation
def send_transaction(w3, contract_function, wallet_address, private_key):
    try:
        nonce = w3.eth.get_transaction_count(wallet_address)
        tx = contract_function.build_transaction({
            'from': wallet_address,
            'gas': 2000000,
            'gasPrice': w3.eth.gas_price,
            'nonce': nonce,
            'chainId': w3.eth.chain_id
        })
        
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        logger.info(f"Transaction sent: {tx_hash.hex()}")
        
        logger.info("Waiting for transaction confirmation...")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if receipt['status'] == 1:
            logger.info(f"Transaction confirmed, gas used: {receipt['gasUsed']}")
            return receipt
        else:
            logger.error(f"Transaction failed: {receipt}")
            return None
    except Exception as e:
        logger.exception(f"Error sending transaction: {e}")
        return None

# Check if agent already exists
def agent_exists(agent_factory, wallet_address, agent_name):
    try:
        # Get all agents for this wallet
        agent_addresses = agent_factory.functions.getAgentsByOwner(wallet_address).call()
        
        # Check each agent's name
        for address in agent_addresses:
            details = agent_factory.functions.getAgentDetails(address).call()
            name = details[0]
            if name == agent_name:
                return True, address
        
        return False, None
    except Exception as e:
        logger.exception(f"Error checking if agent exists: {e}")
        return False, None

# Main initialization function
def initialize_agents():
    try:
        console.print("[bold blue]===== Agent Initializer =====\n[/bold blue]")
        
        # Setup web3 and contracts
        w3, agent_factory = setup_web3_and_contracts()
        wallet_address, private_key = get_wallet_credentials()
        logger.info(f"Using wallet: {wallet_address}")
        
        # Initialize each agent if it doesn't already exist
        for agent_config in INITIAL_AGENTS:
            name = agent_config["name"]
            description = agent_config["description"]
            color = "#C084FC"
            sparkline_data = generate_random_sparkline_data()
            
            # Check if agent already exists
            exists, address = agent_exists(agent_factory, wallet_address, name)
            if exists:
                db.add_agent(agent_config["id"], {
                    "name": name,
                    "description": description,
                    "address": address,
                    "sparklineColor" : color,
                    "sparklineData" : sparkline_data
                })
                logger.info(f"Agent '{name}' already exists at {address}")
                continue
            
            logger.info(f"Creating agent: {name}")
            tx_receipt = send_transaction(
                w3,
                agent_factory.functions.createAgent(name, description),
                wallet_address,
                private_key
            )
            
            if tx_receipt:
                print(tx_receipt)
                exists, address = agent_exists(agent_factory, wallet_address, name)
                if exists:
                    db.add_agent(agent_config["id"], {
                        "name": name,
                        "description": description,
                        "address": address,
                        "sparklineColor" : color,
                    	"sparklineData" : sparkline_data
                    })
                    logger.info(f"Agent '{name}' created successfully at {address}")
                else:
                    logger.warning(f"Agent '{name}' created but couldn't extract address from logs")
            else:
                logger.error(f"Failed to create agent: {name}")
            
            # Add a small delay between transactions to avoid nonce issues
            time.sleep(2)
        
        logger.info("Agent initialization completed")
        
    except Exception as e:
        logger.exception(f"Error during agent initialization: {e}")
        return False
    
    return True

# Run the initialization if this script is executed directly
if __name__ == "__main__":
    success = initialize_agents()
    if success:
        console.print("[bold green]Agent initialization successful.[/bold green]")
    else:
        console.print("[bold red]Agent initialization failed. Check logs for details.[/bold red]")