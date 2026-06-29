import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Initialize Firebase Admin
cred = credentials.Certificate("firebase-admin-key.json")
firebase_admin.initialize_app(cred)

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify Firebase JWT token and return user info."""
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email", ""),
            "name": decoded_token.get("name", ""),
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token. Please login again.")