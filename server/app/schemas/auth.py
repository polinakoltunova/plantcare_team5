from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    first_name: str | None = None
    last_name: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


LoginRequest.model_rebuild()
RegisterRequest.model_rebuild()
Token.model_rebuild()