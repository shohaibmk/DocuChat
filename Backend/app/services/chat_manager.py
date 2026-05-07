from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import get_logger
from app.models.chat_session import ChatSession

logger = get_logger(__name__)

class ChatManager:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chat_session(
        self,
        user_id: uuid.UUID
    ) -> ChatSession:
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=settings.CHAT_EXPIRY)

        session = ChatSession(
            user_id=user_id,
            expires_at=expires_at,
        )
        self.db.add(session)
        await self.db.commit()
        await self.db.refresh(session)
        logger.debug("Session created",session)
        logger.debug(
            "Created chat session session_id=%s user_id=%s expires_at=%s",
            session.session_id,
            session.user_id,
            session.expires_at,
        )
        return session
