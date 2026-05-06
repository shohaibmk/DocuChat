from sqlalchemy.ext.asyncio import AsyncSession


class ChatManager:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_chat_session(self) -> None:
        # TODO: implement chat session creation
        raise NotImplementedError
