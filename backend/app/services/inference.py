import joblib
import numpy as np
from app.core.config import settings

class ModelInference:
    def __init__(self):
        self.model = None
    
    def load(self):
        self.model = joblib.load(settings.MODEL_PATH)
    
    def predict(self, df):
        log_pred = self.model.predict(df)
        return float(np.expm1(log_pred)[0])

inference = ModelInference()