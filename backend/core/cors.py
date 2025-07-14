from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os
import logging

logger = logging.getLogger(__name__)


def configure_cors(app: FastAPI) -> None:
    """
    Configure CORS middleware based on environment.
    
    Args:
        app: FastAPI application instance
    """
    environment = os.getenv("ENVIRONMENT", "development")
    
    if environment == "development":
        # Development: Allow local origins
        allowed_origins = [
            "http://localhost:5173",    # Vite dev server
            "http://localhost:3000",    # React dev server
            "http://127.0.0.1:5173",    # Alternative localhost
            "http://127.0.0.1:3000"     # Alternative localhost
        ]
        allow_credentials = True
        logger.info("CORS configured for development environment")
    else:
        # Production: Restrict to actual domain
        allowed_origins = [
            os.getenv("FRONTEND_URL", "https://cleverdocs.app"),
            # Add other production domains as needed
        ]
        allow_credentials = False  # More secure for production
        logger.info(f"CORS configured for production environment: {allowed_origins}")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=allow_credentials,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Authorization", 
            "Accept",
            "Origin",
            "X-Requested-With"
        ],  # More restrictive than "*"
    )