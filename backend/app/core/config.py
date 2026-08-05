from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "House Price Prediction API"
    MODEL_PATH: str = "models/house_price.pkl"

settings = Settings()