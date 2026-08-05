

\## Dataset

Download from: 

https://www.kaggle.com/datasets/juhibhojani/house-price



put `house\_prices.csv` in `notebooks/data/`



\## Setup



\### Generate Model (Important!)



in command prompt::



cd notebooks

jupyter notebook



\# Open house\_price\_model.ipynb and run all cells

\# Copy house\_price.pkl to backend/models/





\##Backend



in command prompt::



cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload





\##Frontend



in command prompt::



cd frontend

npm install

npm run dev





\###  Note ###



The model file (house\_price.pkl) is not included due to size limits.

Generate it from the notebook before running the backend.







