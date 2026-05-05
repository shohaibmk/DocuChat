from fastapi import APIRouter

router = APIRouter(tags=["chats"])


@router.get("/chat")
async def chats() -> str:
    """
    Chat endpoint.
    
    Returns:
        str: A string containing the response to the chat.
    """
    return "ok"
