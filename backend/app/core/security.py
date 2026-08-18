from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(data: dict, token_type: str, expires_minutes: int) -> str:
    """Create a signed JWT with type claim and expiry."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload.update({"exp": expire, "type": token_type, "iat": datetime.now(timezone.utc)})
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(data: dict) -> str:
    return create_token(data, "access", settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def create_refresh_token(data: dict) -> str:
    return create_token(data, "refresh", settings.REFRESH_TOKEN_EXPIRE_MINUTES)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None


def get_token_expires_in() -> int:
    """Return access token lifetime in seconds."""
    return settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
