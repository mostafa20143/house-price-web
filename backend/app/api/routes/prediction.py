from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.preprocessing import request_to_dataframe
from app.services.inference import inference

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        df = request_to_dataframe(request.dict())
        price = inference.predict(df)
        return PredictionResponse(predicted_price=price)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))