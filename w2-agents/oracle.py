from dotenv import load_dotenv
load_dotenv()

import random
import os
from rich.console import Console
from rich.traceback import install
from rich.status import Status
from rich.logging import RichHandler
import logging
from web3 import Web3

import agent


agent_abi = [
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": True,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "IRISRequestAgentData",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "callingAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "callOtherContracts",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "data",
				"type": "string"
			}
		],
		"name": "requestData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

# Setup rich and logging
install()
console = Console()
logging.basicConfig(level=logging.INFO, format="%(message)s", handlers=[RichHandler()])
logger = logging.getLogger("oracle")

try:
    w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{os.getenv('INFURA_API_KEY')}"))
    logger.info("Connected to Web3 provider.")
except Exception as e:
    console.print(f"[bold red]Failed to connect to Web3 provider: {e}[/]")
    raise

try:
    oracle_contract = w3.eth.contract(address=os.getenv('ORACLE_ADDR'), abi=agent_abi)
    logger.info("Oracle contract initialized.")
except Exception as e:
    console.print(f"[bold red]Failed to initialize oracle contract: {e}[/]")
    raise

def trigger_external_action(*args):
    logger.info("[bold green]Triggering external action...[/]")
    logger.info("[bold green]Arguments received:[/]")
    for arg in args:
        logger.info(arg)
    logger.info("[bold green]External action triggered successfully![/]")
    
    # Should pass to next ai is a 80% chance:
    if random.random() < 0:
        logger.info("[bold green]Passing to next AI...[/]")
        # Call the contract function
        agent.call_contract_function(w3, args[0], args[1], logger, "")
    else:
        logger.info("[bold red]Failed to pass to next AI.[/]")
    
    
def get_initial_block():
    return w3.eth.block_number

def listen_for_contract_requests(last_block_processed):
    try:        
        # Check for new blocks
        current_block = w3.eth.block_number
        if current_block > last_block_processed:
            logger.info(f"Checking blocks {last_block_processed+1} to {current_block}")
            
            # Loop through each new block
            for block_num in range(last_block_processed + 1, current_block + 1):
                # Get all logs with the IRISRequestAgentData event signature
                event_signature = "0x" + w3.keccak(text="IRISRequestAgentData(address,string)").hex()
                logs = w3.eth.get_logs({
                    'fromBlock': block_num,
                    'toBlock': block_num,
                    'topics': [event_signature]
                })
                
                # Process each log
                for log in logs:
                    # Create a contract instance with the log's address
                    contract_address = log['address']
                    temp_contract = w3.eth.contract(address=contract_address, abi=agent_abi)
                    
                    # Process the event data
                    try:
                        event = temp_contract.events.IRISRequestAgentData().process_log(log)
                        logger.info(f"Event received from {contract_address}: {event}")
                        if event['event'] == 'IRISRequestAgentData':
                            argsdict = dict(event['args'])
                            trigger_external_action(argsdict['userAddress'], argsdict['data'])
                    except Exception as e:
                        logger.error(f"Failed to process event: {e}")
                        raise e
            
            # Update the last processed block
            last_block_processed = current_block
    except Exception as e:
        console.print(f"[bold red]Error in listen_for_contract_requests: {e}[/]")
        logger.exception("Exception occurred in listen_for_contract_requests.")