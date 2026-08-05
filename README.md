
## Model kpl Link
https://drive.google.com/drive/folders/1P__ZbuIFeboPgyTF6uHElFIfCCSujbsp

put in bath:

backend/models/house_price.pkl

## Dataset
https://www.kaggle.com/datasets/juhibhojani/house-price

## Setup
### Backend:
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

### Frontend:
cd frontend
npm install
npm run dev