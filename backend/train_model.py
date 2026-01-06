import pandas as pd
import geopandas as gpd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_model():
    # Load data
    data_path = '../data/raw/manado_risk_data.geojson'
    if not os.path.exists(data_path):
        print("Data file not found. Please run generate_data.py first.")
        return

    print("Loading data...")
    gdf = gpd.read_file(data_path)
    
    # Features and Target
    # Drop geometry and targets from features
    X = gdf.drop(columns=['geometry', 'risk_score', 'risk_level'])
    y = gdf['risk_level']
    
    # Define preprocessing
    numeric_features = ['pop_density', 'dist_tps', 'waste_volume']
    categorical_features = ['road_access', 'zone_type'] # road_access as categorical for OHE or keep it ordinal?
    
    # Using simple OHE for categorical to be safe
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(), categorical_features)
        ])
    
    # Pipeline
    clf = Pipeline(steps=[('preprocessor', preprocessor),
                          ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))])
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    print("Training Random Forest model...")
    clf.fit(X_train, y_train)
    
    # Evaluate
    y_pred = clf.predict(X_test)
    print("Model Performance:")
    print(classification_report(y_test, y_pred))
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    # Save Model
    os.makedirs('../models', exist_ok=True)
    model_path = '../models/risk_model.pkl'
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_model()
