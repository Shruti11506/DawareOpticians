from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class UserProfile(BaseModel):
    username: str
    name: str
    role: str

class LoginResponse(BaseModel):
    success: bool
    user: UserProfile
    message: str

# Only 1 authorized person: shrutidaware06 / dbmsproj
AUTHORIZED_USERNAME = "shrutidaware06"
AUTHORIZED_PASSWORD = "dbmsproj"
AUTHORIZED_NAME = "Shruti Daware"
AUTHORIZED_ROLE = "Store Owner & Optometrist"

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest):
    """
    Authenticate store owner with strictly authorized credentials.
    Authorized user: shrutidaware06 / dbmsproj
    """
    if creds.username.strip() == AUTHORIZED_USERNAME and creds.password == AUTHORIZED_PASSWORD:
        return LoginResponse(
            success=True,
            user=UserProfile(
                username=AUTHORIZED_USERNAME,
                name=AUTHORIZED_NAME,
                role=AUTHORIZED_ROLE
            ),
            message=f"Welcome back, {AUTHORIZED_NAME}!"
        )
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password. Access is restricted to the store owner."
    )

