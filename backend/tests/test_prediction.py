from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/api/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

def test_predict():
    r = client.post("/api/predict", json={
        "location": "other", "carpet_area_sqft": 1200, "floor_num": 3,
        "bathroom": 2, "balcony": 1, "furnishing": "Furnished",
        "transaction": "New Property", "ownership": "Freehold",
        "facing": "East", "status": "Ready to Move"
    })
    assert r.status_code == 200
    assert "predicted_price" in r.json()