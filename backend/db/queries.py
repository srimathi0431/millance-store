from sqlalchemy.orm import Session
from db.models import User, UserRole


# ---------------------------------------------------------------------------
# Read operations
# ---------------------------------------------------------------------------

def get_user_by_email(db: Session, email: str) -> User | None:
    """Return a User record matching the given email, or None."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Return a User record matching the given id, or None."""
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session) -> list[User]:
    """Return all user records."""
    return db.query(User).all()


# ---------------------------------------------------------------------------
# Write operations
# ---------------------------------------------------------------------------

def create_user(db: Session, email: str, hashed_password: str, role: UserRole) -> User:
    """
    Create and persist a new user.
    Accepts an already-hashed password — hashing is the caller's responsibility.
    """
    user = User(
        email=email,
        hashed_password=hashed_password,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_password(db: Session, user_id: int, new_hashed_password: str) -> User | None:
    """Update the hashed password for a given user id."""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    user.hashed_password = new_hashed_password
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, user_id: int) -> User | None:
    """Set is_active = False for the given user."""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user
