from dotenv import load_dotenv
load_dotenv()

import requests
import os
from rich.console import Console
from rich.traceback import install
from rich.status import Status
from rich.logging import RichHandler
import logging
from web3 import Web3

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
    contract_address = w3.to_checksum_address(os.getenv('CONTRACT_ADDR'))
    oracle_contract_abi = [
        # ABI of the oracle contract
    ]
    oracle_contract = w3.eth.contract(address=os.getenv('ORACLE_ADDR'), abi=oracle_contract_abi)
    logger.info("Oracle contract initialized.")
except Exception as e:
    console.print(f"[bold red]Failed to initialize oracle contract: {e}[/bold red]")
    raise

def trigger_external_action():
    try:
        with Status("[bold green]Calling Web2 API...[/bold green]", console=console):
            api_url = "https://example.com/api"
            data = {"key": "value"}  # Sample data to send in the POST request
            response = requests.post(api_url, json=data)
            logger.info(f"Web2 API call to {api_url} completed with status code {response.status_code}.")

        if response.status_code == 200:
            api_response_data = response.json().get("data")
            logger.info(f"API response data: {api_response_data}")

            result_data = Web3.toBytes(text=api_response_data)
            nonce = w3.eth.getTransactionCount(os.getenv('WALLET_ADDR'))
            txn = oracle_contract.functions.updateData(result_data).buildTransaction({
                'chainId': 1,  # Mainnet chain ID or change to your network
                'gas': 2000000,
                'gasPrice': w3.toWei('20', 'gwei'),
                'nonce': nonce,
            })
            logger.info("Transaction built successfully.")

            # Uncomment and handle signing and sending transaction
            # signed_txn = w3.eth.account.sign_transaction(txn, os.getenv('WALLET_PKEY'))
            # txn_hash = w3.eth.sendRawTransaction(signed_txn.rawTransaction)
            # txn_receipt = w3.eth.waitForTransactionReceipt(txn_hash)
            # if txn_receipt['status'] == 1:
            #     logger.info("Data successfully returned to contract.")
            # else:
            #     logger.error("Transaction failed.")
        else:
            logger.error("Failed to call Web2 API.")
    except Exception as e:
        console.print(f"[bold red]Error in trigger_external_action: {e}[/bold red]")
        logger.exception("Exception occurred in trigger_external_action.")

def listen_for_contract_requests():
    try:
        with Status("[bold green]Listening for contract requests...[/bold green]", console=console):
            while True:
                events = oracle_contract.events.YourEvent.createFilter(fromBlock='latest').get_new_entries()
                for event in events:
                    logger.info(f"Event received: {event}")
                    if event['event'] == 'RequestData':
                        trigger_external_action()
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