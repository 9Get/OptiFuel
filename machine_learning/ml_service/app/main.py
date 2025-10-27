import logging
import joblib
from pathlib import Path
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager

# Імпортуємо моделі з локального модуля
from .models import PredictionRequest, PredictionResponse

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# --- Словник для зберігання ML артефактів ---
ml_artifacts = {}

# --- Lifespan Manager для завантаження ресурсів ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код, що виконується на старті застосунку
    logging.info("Application startup: Loading ML artifacts...")
    
    artifacts_path = Path("/app/artifacts")
    
    try:
        ml_artifacts["model"] = joblib.load(artifacts_path / "best_model.joblib")
        ml_artifacts["scaler"] = joblib.load(artifacts_path / "scaler.joblib")
        ml_artifacts["feature_order"] = joblib.load(artifacts_path / "feature_order.joblib")
        logging.info("ML artifacts loaded successfully.")
    except FileNotFoundError as e:
        logging.error(f"Artifact loading error: {e}. Run the training pipeline first.")
    
    yield
    
    # Код, що виконується при зупинці застосунку
    logging.info("Application shutdown: Clearing ML artifacts...")
    ml_artifacts.clear()

# --- FastAPI App Initialization ---
app = FastAPI(
    title="OptiFuel: Ship Fuel Consumption API",
    description="An intelligent system to predict fuel consumption for maritime vessels.",
    version="1.0.0",
    lifespan=lifespan
)

def preprocess_input(data: pd.DataFrame, feature_order: list) -> pd.DataFrame:
    """
    Перетворює вхідні дані з запиту у формат, придатний для моделі.
    """
    processed_data = data.copy()

    # Інжиніринг ознак, ідентичний до preprocessor.py
    weather_mapping = {'Calm': 0, 'Moderate': 1, 'Stormy': 2}
    processed_data['weather_conditions'] = processed_data['weather_conditions'].map(weather_mapping)

    processed_data['month_sin'] = np.sin(2 * np.pi * processed_data['month'] / 12)
    processed_data['month_cos'] = np.cos(2 * np.pi * processed_data['month'] / 12)
    processed_data.drop('month', axis=1, inplace=True)
    
    # One-Hot Encoding
    categorical_cols = ['ship_type', 'route_id', 'fuel_type']
    processed_data = pd.get_dummies(processed_data, columns=categorical_cols)

    # Узгодження колонок з тим порядком, на якому навчалася модель
    processed_data = processed_data.reindex(columns=feature_order, fill_value=0)

    return processed_data


@app.get("/", tags=["General"])
def read_root():
    return {"message": "Welcome to the OptiFuel API!"}


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(request: PredictionRequest):
    if not all(k in ml_artifacts for k in ["model", "scaler", "feature_order"]):
        raise HTTPException(
            status_code=503,
            detail="Service Unavailable: ML artifacts not loaded. Check application logs."
        )

    try:
        input_df = pd.DataFrame([request.dict()])
        processed_df = preprocess_input(input_df, ml_artifacts["feature_order"])
        
        # Масштабування
        scaled_features = ml_artifacts["scaler"].transform(processed_df)
        
        # Прогноз
        prediction = ml_artifacts["model"].predict(scaled_features)

        return PredictionResponse(predicted_fuel_consumption=round(prediction[0], 2))

    except Exception as e:
        logging.error(f"Error during prediction: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Failed to process request: {str(e)}")