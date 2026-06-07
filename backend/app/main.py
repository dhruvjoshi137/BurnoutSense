import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.predict import router as predict_router
from app.api.routes.progress import router as progress_router
from app.db import Base, engine
from app.models import db_models  # noqa: F401

app = FastAPI(
    title="BurnoutSense API",
    description=(
        "Research prototype API for estimating student burnout risk with the "
        "Academic Burnout Index (ABI) and generating stress relief recommendations."
    ),
    version="1.0.0",
)

cors_origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(progress_router, prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/", tags=["Health"])
def health_check() -> dict:
    return {"status": "ok", "service": "BurnoutSense API"}
