from dotenv import load_dotenv
load_dotenv()

import random
import os
import time
from rich.console import Console
from rich.traceback import install
from rich.status import Status
from rich.logging import RichHandler
import logging
from web3 import Web3


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
				"indexed": True,
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
    logger.log("[bold green]Triggering external action...[/]")
    logger.log("[bold green]Arguments received:[/]")
    for arg in args:
        logger.log(arg)
    logger.log("[bold green]External action triggered successfully![/]")
    
    # Should pass to next ai is a 80% chance:
    if random.random() < 0:
        logger.log("[bold green]Passing to next AI...[/]")
        # Call the contract function
        try:
            next_address = 0
            agent = w3.eth.contract(address=next_address, abi=agent_abi)
            agent_function = agent.functions.requestData(args[0], args[1])
            
            nonce = w3.eth.get_transaction_count(os.getenv('WALLET_ADDR'))
            tx = agent_function.build_transaction({
                'from': os.getenv('WALLET_ADDR'),
                'gas': 2000000,
                'gasPrice': w3.eth.gas_price,
                'nonce': nonce,
                'chainId': w3.eth.chain_id
            })
            
            signed_tx = w3.eth.account.sign_transaction(tx, os.getenv('WALLET_PKEY'))
            tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
            logger.info(f"Transaction sent: {tx_hash.hex()}")
            
            logger.info("Waiting for transaction confirmation...")
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
            
        except Exception as e:
            console.print(f"[bold red]Failed to call contract function: {e}[/]")
            logger.exception("Exception occurred while calling contract function.")
    else:
        logger.log("[bold red]Failed to pass to next AI.[/]")
    

def listen_for_contract_requests():
    try:
        with Status("[bold green]Listening for contract requests...[/]", console=console):
            # Instead of creating a filter for a specific contract,
            # we'll process each new block and look for events
            last_block_processed = w3.eth.block_number
            
            while True:
                # Wait 1 second
                time.sleep(1)
                
                # Check for new blocks
                current_block = w3.eth.block_number
                if current_block > last_block_processed:
                    logger.info(f"Checking blocks {last_block_processed+1} to {current_block}")
                    
                    # Loop through each new block
                    for block_num in range(last_block_processed + 1, current_block + 1):
                        # Get all logs with the IRISRequestAgentData event signature
                        event_signature = w3.keccak(text="IRISRequestAgentData(address,string)").hex()
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
                                    trigger_external_action(*[argsdict[k] for k in sorted(argsdict)])
                            except Exception as e:
                                logger.error(f"Failed to process event: {e}")
                    
                    # Update the last processed block
                    last_block_processed = current_block
    except Exception as e:
        console.print(f"[bold red]Error in listen_for_contract_requests: {e}[/]")
        logger.exception("Exception occurred in listen_for_contract_requests.")


if __name__ == "__main__":
    try:
        listen_for_contract_requests()
    except KeyboardInterrupt:
        console.print("[bold red]Process interrupted by user.[/]")
    except Exception as e:
        console.print(f"[bold red]Unexpected error: {e}[/]")
        logger.exception("Unexpected error occurred in main.")