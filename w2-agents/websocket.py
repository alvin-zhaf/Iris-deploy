from fastapi import FastAPI, WebSocket
import json
import logging
import os
import agent
from web3 import Web3

# dotenv
from dotenv import load_dotenv
load_dotenv()


app = FastAPI()

logger = logging.getLogger("websocket")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = json.loads(await websocket.receive_text())
    try:
        w3 = Web3(Web3.HTTPProvider(f"https://sepolia.infura.io/v3/{os.getenv('INFURA_API_KEY')}"))
        logger.info("Connected to Web3 provider.")
    except Exception as e:
        logger.error(f"Failed to connect to Web3 provider: {e}")
        raise e
    data_wallet = data.get("wallet")
    data_input = data.get("input")
    agent.call_contract_function(w3, data_wallet, data_input, logger, "")
    
    await websocket.close()
    print("WebSocket closed.")