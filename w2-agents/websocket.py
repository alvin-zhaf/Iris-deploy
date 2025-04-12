from fastapi import FastAPI, WebSocket

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_text()
    print(f"Received: {data}")
    await websocket.send_text(f"Echo: {data}")
    
    await websocket.close()
    print("WebSocket closed.")