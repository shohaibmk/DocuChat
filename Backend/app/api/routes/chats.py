import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.logging import get_logger
from app.services.chat_manager import ChatManager

logger = get_logger(__name__)

router = APIRouter(tags=["chats"])


class ChatSessionData(BaseModel):
    session_id: uuid.UUID
    expires_at: datetime


class ChatSessionResponse(BaseModel):
    status: str
    message: str
    data: ChatSessionData


@router.get("/chat")
async def chats() -> str:
    """
    Chat endpoint.

    Returns:
        str: A string containing the response to the chat.
    """
    return "ok"


@router.get("/chat/request-session", response_model=ChatSessionResponse)
async def request_chat_session(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ChatSessionResponse:
    """
    Create a new chat session.

    Returns:
        ChatSessionResponse: New session_id and its expiry timestamp.
    """
    try:
        # TODO: pass authenticated user_id once auth is wired up
        user_id = "444f7c6c-aa52-4532-a095-cd5ef3bf9043"
        manager = ChatManager(db)
        session = await manager.create_chat_session(user_id=user_id)
        return ChatSessionResponse(
            status="ok",
            message="New chat session created",
            data=ChatSessionData(
                session_id=session.session_id,
                expires_at=session.expires_at,
            ),
        )
    except Exception as e:
        logger.exception("Failed to create chat session: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"reason": str(e)},
        )
