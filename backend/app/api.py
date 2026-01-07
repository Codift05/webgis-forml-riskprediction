from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import joblib
import pandas as pd
import json
import os
import numpy as np

router = APIRouter()

# Paths (relative to where we run uvicorn, usually 'backend')
# If running from 'backend', data is at '../data/raw/'
# Adjust paths helper
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, '../data/raw/manado_osm_final.geojson')
MODEL_PATH = os.path.join(BASE_DIR, 'models/risk_model.pkl')

class PredictionRequest(BaseModel):
    pop_density: float
    dist_tps: float
    waste_volume: float
    road_access: str # 'Good', 'Moderate', 'Poor'
    zone_type: str # 'Residential', 'Market', etc.

class PredictionResponse(BaseModel):
    risk_level: str
    risk_score: float # Probability of high risk or similar
    details: dict

def get_model():
    if not os.path.exists(MODEL_PATH):
        return None
    return joblib.load(MODEL_PATH)

@router.get("/risk-data")
def get_risk_data():
    """Serve the GeoJSON with all risk data."""
    if not os.path.exists(DATA_PATH):
        raise HTTPException(status_code=404, detail="Risk data not generated yet.")
    
    with open(DATA_PATH, 'r') as f:
        data = json.load(f)
    return data

@router.post("/predict", response_model=PredictionResponse)
def predict_risk(request: PredictionRequest):
    """Predict risk for a single point."""
    model = get_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Model not trained yet.")
    
    # Prepare input DataFrame
    input_data = pd.DataFrame([{
        'pop_density': request.pop_density,
        'dist_tps': request.dist_tps,
        'waste_volume': request.waste_volume,
        'road_access': request.road_access,
        'zone_type': request.zone_type
    }])
    
    try:
        # Predict Class
        prediction = model.predict(input_data)[0]
        
        # Predict Proba (if available) to get "Score"
        # Classes are likely ['High', 'Low', 'Medium'] sorted alphabetically or similar.
        # We need to map probability to a single risk score if possible, or just return max prob.
        probs = model.predict_proba(input_data)[0]
        classes = model.classes_
        
        # Create a dictionary of probabilities
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probs)}
        
        # Define a "Risk Score" as weighted sum or just prob of 'High' + 0.5*'Medium'
        # Or just return the probability of the predicted class.
        # Let's return the prob of 'High' risk as the risk score, or similar.
        # If 'High' is in classes:
        high_prob = prob_dict.get('High', 0.0)
        medium_prob = prob_dict.get('Medium', 0.0)
        
        # Simplify: Risk Score = Prob(High) + 0.5 * Prob(Medium) normalized?
        # Or just return the probability of the predicted label for now.
        confidence = prob_dict[prediction]
        
        return {
            "risk_level": prediction,
            "risk_score": confidence, # Start with confidence
            "details": prob_dict
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model-info")
def get_model_info():
    return {
        "model": "Random Forest Classifier",
        "features": ["pop_density", "dist_tps", "waste_volume", "road_access", "zone_type"],
        "classes": ["Low", "Medium", "High"]
    }
