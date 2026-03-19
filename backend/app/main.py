from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.predict import router as predict_router

app = FastAPI(
    title="BurnoutSense API",
    description=(
        "Research prototype API for estimating student burnout risk with the "
        "Academic Burnout Index (ABI) and generating stress relief recommendations."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")


@app.get("/", tags=["Health"])
def health_check() -> dict:
    return {"status": "ok", "service": "BurnoutSense API"}
