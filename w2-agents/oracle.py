from dotenv import load_dotenv
load_dotenv()

import requests
import os
import time
import json
from rich.console import Console
from rich.traceback import install
from rich.status import Status
from rich.logging import RichHandler
import logging
from web3 import Web3

# Oracle contract ABI (including RequestData event and functions)
oracle_contract_abi = [
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "internalType": "address", "name": "userAddress", "type": "address"},
            {"indexed": False, "internalType": "string", "name": "data", "type": "string"},
            {"indexed": False, "internalType": "address[]", "name": "contractAddresses", "type": "address[]"}
        ],
        "name": "RequestData",
        "type": "event"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "userAddress", "type": "address"},
            {"internalType": "address", "name": "callingAddress", "type": "address"},
            {"internalType": "string", "name": "data", "type": "string"},
            {"internalType": "address[]", "name": "contractAddresses", "type": "address[]"}
        ],
        "name": "callOtherContracts",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "address", "name": "userAddress", "type": "address"},
            {"internalType": "string", "name": "data", "type": "string"},
            {"internalType": "address[]", "name": "contractAddresses", "type": "address[]"}
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
    console.print(f"[bold red]Failed to connect to Web3 provider: {e}[/bold red]")
    raise

try:
    oracle_contract = w3.eth.contract(address=os.getenv('ORACLE_ADDR'), abi=oracle_contract_abi)
    logger.info("Oracle contract initialized.")
except Exception as e:
    console.print(f"[bold red]Failed to initialize oracle contract: {e}[/bold red]")
    raise

def open_api_call(prompt):
    """
    Calls an external OpenAPI endpoint with the given prompt.
    Expected response examples:
      - To continue processing:
          { "continue_processing": true, "next_agent_address": "0xNextAgent", "data": "Processed data so far" }
      - For final result:
          { "continue_processing": false, "final_result": "Your final output" }
    """
    open_api_url = "https://example.com/openai"  # Replace with your actual OpenAPI endpoint
    try:
        response = requests.post(open_api_url, json={"prompt": prompt})
        logger.info(f"OpenAPI call completed with status code {response.status_code}")
        if response.status_code == 200:
            return response.json()
        else:
            logger.error("OpenAPI call failed with non-200 status code")
            return None
    except Exception as e:
        logger.exception("Exception occurred during OpenAPI call")
        return None

def trigger_next_agent(user_address, ai_result):
    """
    Triggers the next agent by calling callOtherContracts on the oracle contract.
    The ai_result is expected to include:
       - next_agent_address (str): The address of the chosen next agent.
       - data (str): The data to pass to the next agent.
    """
    next_agent_address = ai_result.get("next_agent_address")
    agent_data = ai_result.get("data")
    if not next_agent_address or not agent_data:
        logger.error("Missing next agent address or data in OpenAPI result. Cannot trigger next agent.")
        return
    logger.info(f"Triggering next agent at address: {next_agent_address} with data: {agent_data}")
    try:
        nonce = w3.eth.getTransactionCount(os.getenv('WALLET_ADDR'))
        txn = oracle_contract.functions.callOtherContracts(
            user_address,         # userAddress: original user address
            next_agent_address,   # callingAddress: next agent's address
            agent_data,           # data to pass along
            []                    # contractAddresses (empty in this example)
        ).buildTransaction({
            'chainId': 1,  # Change as needed for your network
            'gas': 2000000,
            'gasPrice': w3.toWei('20', 'gwei'),
            'nonce': nonce,
        })
        logger.info("Transaction built to trigger next agent. (Transaction signing/sending is commented out.)")
        # To actually trigger the agent, uncomment below and ensure your WALLET_PKEY is set:
        # signed_txn = w3.eth.account.sign_transaction(txn, os.getenv('WALLET_PKEY'))
        # tx_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
        # logger.info(f"Next agent triggered, tx hash: {tx_hash.hex()}")
    except Exception as e:
        console.print(f"[bold red]Error triggering next agent: {e}[/bold red]")
        logger.exception("Exception occurred while triggering next agent.")

def process_agent_loop(user_address, user_data):
    """
    Loop over the agent processing steps:
      1. Call an initial Web2 API to simulate the agent's preliminary processing.
      2. Construct a prompt and call OpenAPI for AI decision making.
      3. If AI indicates to continue, trigger the next agent via a blockchain transaction and loop.
      4. If AI returns final result, send it back to the backend and exit the loop.
    
    Args:
        user_address (str): The address of the user.
        user_data (str): The initial user input.
    """
    while True:
        # --- Step 1: Call initial Web2 API to simulate agent's preliminary processing ---
        with Status("[bold green]Calling initial Web2 API...[/bold green]", console=console):
            api_url = "https://example.com/api"  # Replace with your real API endpoint if applicable
            post_data = {"key": "value"}  # Sample payload; modify as necessary
            initial_response = requests.post(api_url, json=post_data)
            logger.info(f"Initial API call to {api_url} completed with status code {initial_response.status_code}")
        if initial_response.status_code == 200:
            agent_response_data = initial_response.json().get("data")
            logger.info(f"Initial agent API response data: {agent_response_data}")
        else:
            logger.error("Failed initial API call. Aborting agent loop.")
            break

        # --- Step 2: Construct the prompt for OpenAPI ---
        prompt = (f"User input: {user_data}\n"
                  f"Agent preliminary response: {agent_response_data}\n"
                  "Decide if further processing is required or if a final result is ready.\n"
                  "If further processing is needed, respond with {"
                  "\"continue_processing\": true, "
                  "\"next_agent_address\": \"0x...\", "
                  "\"data\": \"Processed data to pass on\"}.\n"
                  "If complete, respond with {"
                  "\"continue_processing\": false, "
                  "\"final_result\": \"The final result\"}.")
        logger.info(f"Constructed prompt for OpenAPI: {prompt}")

        # --- Step 3: Call OpenAPI with the prompt ---
        ai_result = open_api_call(prompt)
        if ai_result is None:
            logger.error("OpenAPI did not return a valid result. Aborting agent loop.")
            break

        # --- Step 4: Decision making from AI result ---
        if ai_result.get("continue_processing", False):
            logger.info("AI decision: Continue processing. Triggering next agent and looping back.")
            trigger_next_agent(user_address, ai_result)
            # Optionally update user_data with the processed data returned to be used in the next iteration
            user_data = ai_result.get("data", user_data)
            time.sleep(2)  # Short delay before the next loop iteration
            continue
        else:
            final_result = ai_result.get("final_result", "")
            logger.info(f"AI decision: Final result ready. Final result: {final_result}")
            # --- Step 5: Send final result back to your backend ---
            backend_api_url = "https://example.com/finalresult"  # Replace with your backend endpoint
            result_payload = {"userAddress": user_address, "finalResult": final_result}
            backend_response = requests.post(backend_api_url, json=result_payload)
            if backend_response.status_code == 200:
                logger.info("Final result successfully sent back to backend.")
            else:
                logger.error("Failed to send final result back to backend.")
            break

def listen_for_contract_requests():
    """
    Continuously listens for RequestData events on-chain and triggers the processing loop.
    """
    try:
        with Status("[bold green]Listening for contract requests...[/bold green]", console=console):
            event_filter = oracle_contract.events.RequestData.create_filter(from_block='latest')  # Creates the filter to listen for events from the latest block
            while True:
                # Poll every 3 seconds
                time.sleep(1)
                events = event_filter.get_new_entries()  # Get new entries (events) that have been emitted
                for event in events:
                    logger.info(f"Event received: {event}")
                    if event['event'] == 'RequestData':
                        # Extract initial user data from the event
                        args = event['args']
                        user_address = args['userAddress']
                        user_data = args['data']  # Assume this is the user input
                        # Start processing loop for this event
                        process_agent_loop(user_address, user_data)
    except Exception as e:
        console.print(f"[bold red]Error in listen_for_contract_requests: {e}[/bold red]")
        logger.exception("Exception occurred in listen_for_contract_requests.")

if __name__ == "__main__":
    try:
        listen_for_contract_requests()
    except KeyboardInterrupt:
        console.print("[bold red]Process interrupted by user.[/bold red]")
    except Exception as e:
        console.print(f"[bold red]Unexpected error: {e}[/bold red]")
        logger.exception("Unexpected error occurred in main.")
