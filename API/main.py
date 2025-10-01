from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load trained CatBoost model
model = joblib.load("models/catboost_model.pkl")

app = FastAPI(title="CatBoost Model 4 API (Important Features)")
origins = [
    " http://localhost:5173/",   # React local
    "http://127.0.0.1:3000",   # Alternative localhost
    "*"  # (optional) allow all origins — use only in dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allowed frontend origins
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

# Define input schema with only important_fea
class PatientData(BaseModel):
    alcohol_consumption: int
    insurance: int
    pet_owner: int
    family_history: int
    caffeine_intake: int
    mental_health_support: int
    gender: int
    meals_per_day: float
    stress_level: float
    mental_health_score: float
    age: float
    insulin: float
    weight: float
    bmi: float
    income: float
    heart_rate: float
    physical_activity: float
    blood_pressure: float
    daily_steps: float
    height: float
    screen_time: float
    sugar_intake: float
    sleep_hours: float
    waist_size: float
    work_hours: float
    cholesterol: float
    daily_supplement_dosage: float
    calorie_intake: float
    glucose: float
    water_intake: float

@app.post("/predict")
def predict(data: PatientData):
    # Convert to numpy array in the correct order
    features = np.array([
        data.alcohol_consumption, data.insurance, data.pet_owner, data.family_history,
        data.caffeine_intake, data.mental_health_support, data.gender, data.meals_per_day,
        data.stress_level, data.mental_health_score, data.age, data.insulin, data.weight,
        data.bmi, data.income, data.heart_rate, data.physical_activity, data.blood_pressure,
        data.daily_steps, data.height, data.screen_time, data.sugar_intake,
        data.sleep_hours, data.waist_size, data.work_hours, data.cholesterol,
        data.daily_supplement_dosage, data.calorie_intake, data.glucose, data.water_intake
    ]).reshape(1, -1)
    
    # Predict
    prediction = model.predict(features)[0]
    prob = model.predict_proba(features)[0][int(prediction)]
    
    return {
        "prediction": int(prediction),  # 0 = healthy, 1 = diseased
        "probability": float(prob)
    }
