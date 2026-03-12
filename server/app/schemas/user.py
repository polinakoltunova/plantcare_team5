from uuid import UUID
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserMeResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role_id: UUID

    class Config:
        from_attributes = True