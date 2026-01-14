from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PromptBase(BaseModel):
    id: int          # timestamp in ms
    content: str
    isUser: bool

@router.post("/prompts")
def handlePrompt(payload: PromptBase):
    print(payload)
    return payload
