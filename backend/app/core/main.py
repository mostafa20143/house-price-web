from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import prediction
from app.services.inference import inference

@asynccontextmanager
async def lifespan(app: FastAPI):
    inference.load()
    yield

app = FastAPI(title="House Price API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "House Price Prediction API"}