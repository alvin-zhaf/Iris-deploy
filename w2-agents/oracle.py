from dotenv import load_dotenv
load_dotenv()

import random
import os
import db
from rich.console import Console
from rich.traceback import install
from rich.logging import RichHandler
import logging
from web3 import Web3

from openai import OpenAI

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

def trigger_external_action(me, *args):
    wallet = args[0]
    data = args[1]
    agents = [a for a in db.list_agent() if a["address"] != me]
    my_agent = [a for a in db.list_agent() if a["address"] == me][0]
    tools = [{
		"type": "function",
            "function": {
                "name": agent["id"],
                "description": agent["description"],
                "parameters": {
                    "type": "object",
                    "properties": {
                        "input": {
                            "type": "string",
                            "description": f"A text description detailing anything that could relate to {agent["id"]}."
                        }
                    },
                    "required": ["input"]
                }
            }
	} for agent in agents]
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    system_prompt = (
        "You are a routing system for a multi-agent blockchain service network. "
        "You need to determine which service should process the input next based on the query, "
        "the current service, and its response. You may choose one of the provided tools, OR just respond if you have the answer to the query."
        "Select the service that would be most helpful for the next step in processing this request."
        "Your skills include: "
        f"{my_agent['description']}. "
    )
    
    response = client.chat.completions.create(
        model="gpt-4o",
		messages=[
			{"role": "system", "content": system_prompt},
			{"role": "user", "content": f"Query: {data}"},
		],
		tools=tools,
		tool_choice="auto"
	)
    
    # Debug response
    logger.info(f"Response tool calls: {response.choices[0].message.tool_calls}")
    logger.info(f"Response message: {response.choices[0].message.content}")
    
    next_address = ""
    if response.choices[0].message.tool_calls:
        next_name = response.choices[0].message.tool_calls[0].function.name
        console.print(f"[bold green]Next AI: {next_name}[/]")
        next_address = [agent["address"] for agent in agents if agent["id"] == next_name][0]
    

    agent.call_contract_function(w3, wallet, data, logger, next_address)
    
    
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
                            trigger_external_action(contract_address, argsdict['userAddress'], argsdict['data'])
                    except Exception as e:
                        logger.error(f"Failed to process event: {e}")
                        raise e
            
            # Update the last processed block
            last_block_processed = current_block
    except Exception as e:
        console.print(f"[bold red]Error in listen_for_contract_requests: {e}[/]")
        logger.exception("Exception occurred in listen_for_contract_requests.")