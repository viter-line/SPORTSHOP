from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from typing import Dict
from . import crud

router = APIRouter(prefix="/ws", tags=["chat"])

class ChatManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)

manager = ChatManager()

@router.get("/history/{client_id}")
def get_history(client_id: str):
    """Завантажити історію чату для конкретного клієнта"""
    return crud.get_chat_history(client_id)

@router.get("/admin/active-chats")
def get_admin_chats():
    """Завантажити список усіх клієнтів, які колись писали"""
    return crud.get_active_chats_for_admin()

@router.put("/read/{client_id}")
def mark_chat_as_read(client_id: str):
    """Позначити чат клієнта як прочитаний менеджером"""
    success = crud.mark_messages_as_read(client_id)
    if not success:
        raise HTTPException(status_code=500, detail="Не вдалося оновити статус прочитання в БД")
    return {"status": "success", "client_id": client_id}

@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            
            recipient_id = data.get("recipient_id")
            message_text = data.get("text")
            
            if not recipient_id or not message_text:
                continue

            crud.save_message(sender_id=user_id, recipient_id=recipient_id, text=message_text)
            
            payload = {
                "sender_id": user_id,
                "text": message_text
            }
            
            await manager.send_personal_message(payload, recipient_id)
            
    except WebSocketDisconnect:
        manager.disconnect(user_id)

@router.get("/admin/unanswered-count")
def get_unanswered_count():
    """Ендпоінт для отримання кількості діалогів без відповіді"""
    return {"count": crud.get_unanswered_chats_count()}