import os

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

def call_contract_function(w3, wallet, input, logger, to):
    try:
        agent = w3.eth.contract(address=to, abi=agent_abi)
        agent_function = agent.functions.requestData(wallet, input)
        
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
        return receipt
        
    except Exception as e:
        logger.error(f"[bold red]Failed to call contract function: {e}[/]")
        logger.exception("Exception occurred while calling contract function.")