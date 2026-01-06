import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Point
import os

# Define Manado approximate bounds
LAT_MIN, LAT_MAX = 1.4500, 1.5500
LON_MIN, LON_MAX = 124.8000, 124.9000
NUM_SAMPLES = 500

def generate_data():
    np.random.seed(42)
    
    # Generate random points
    lats = np.random.uniform(LAT_MIN, LAT_MAX, NUM_SAMPLES)
    lons = np.random.uniform(LON_MIN, LON_MAX, NUM_SAMPLES)
    geometry = [Point(xy) for xy in zip(lons, lats)]
    
    # Generate features
    # 1. Population Density (people per km2 approx)
    pop_density = np.random.randint(50, 5000, NUM_SAMPLES)
    
    # 2. Distance to TPS (meters)
    dist_tps = np.random.uniform(100, 5000, NUM_SAMPLES)
    
    # 3. Road Access (Categorical mapped to int for simplicity first, or keep cat)
    # 1: Poor, 2: Moderate, 3: Good
    road_access = np.random.choice(['Poor', 'Moderate', 'Good'], NUM_SAMPLES, p=[0.2, 0.5, 0.3])
    
    # 4. Zone Type
    zone_type = np.random.choice(['Residential', 'Market', 'Campus', 'Office', 'Industrial'], NUM_SAMPLES)
    
    # 5. Waste Volume (kg/day)
    # Correlated with population and zone
    base_waste = pop_density * 0.5
    zone_multiplier = {'Residential': 1.0, 'Market': 2.5, 'Campus': 1.2, 'Office': 0.8, 'Industrial': 1.5}
    waste_volume = [base * zone_multiplier[z] + np.random.normal(0, 50) for base, z in zip(base_waste, zone_type)]
    waste_volume = np.maximum(waste_volume, 0) # Ensure non-negative
    
    # Create DataFrame
    df = pd.DataFrame({
        'pop_density': pop_density,
        'dist_tps': dist_tps,
        'road_access': road_access,
        'zone_type': zone_type,
        'waste_volume': waste_volume
    })
    
    # Calculate Synthetic Risk Score (Ground Truth)
    # Logic: High density + High Waste - Good Road - Short Dist TPS = High Risk
    # Normalize inputs for calculation
    norm_pop = (df['pop_density'] - df['pop_density'].min()) / (df['pop_density'].max() - df['pop_density'].min())
    norm_waste = (df['waste_volume'] - df['waste_volume'].min()) / (df['waste_volume'].max() - df['waste_volume'].min())
    norm_dist = (df['dist_tps'] - df['dist_tps'].min()) / (df['dist_tps'].max() - df['dist_tps'].min())
    
    # Road access score (Poor=1, Good=0)
    road_map = {'Poor': 1.0, 'Moderate': 0.5, 'Good': 0.0}
    road_score = df['road_access'].map(road_map)
    
    # Risk Formula
    risk_score = (0.3 * norm_pop) + (0.4 * norm_waste) + (0.2 * road_score) + (0.1 * norm_dist)
    
    # Categorize Risk
    # Quintiles or simple thresholds
    df['risk_score'] = risk_score
    df['risk_level'] = pd.cut(risk_score, bins=3, labels=['Low', 'Medium', 'High'])
    
    # Create GeoDataFrame
    gdf = gpd.GeoDataFrame(df, geometry=geometry)
    
    # Ensure output directory
    os.makedirs('../data/raw', exist_ok=True)
    
    # Save
    output_path = '../data/raw/manado_risk_data.geojson'
    gdf.to_file(output_path, driver='GeoJSON')
    print(f"Data generated at {output_path}")

if __name__ == "__main__":
    generate_data()
