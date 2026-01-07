import osmnx as ox
import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Point
import os

# Configuration
PLACE_NAME = "Manado, Indonesia"
TAGS = {
    'amenity': ['marketplace', 'waste_disposal', 'waste_transfer_station', 'school', 'university', 'hospital'],
    'building': ['residential', 'apartments', 'house'],
    'leisure': ['park']
}

def fetch_and_process_data():
    print(f"Fetching data for {PLACE_NAME} from OpenStreetMap...")
    print("This may take a minute depending on internet connection...")

    # 1. Fetch Features (POIs)
    try:
        gdf = ox.features.features_from_place(PLACE_NAME, tags=TAGS)
        print(f"Retrieved {len(gdf)} features.")
    except Exception as e:
        print(f"Error fetching data: {e}")
        return

    # Filter only Points and Polygons (convert polygons to centroids for simplicity)
    gdf['geometry'] = gdf['geometry'].apply(lambda geom: geom.centroid if geom.geom_type == 'Polygon' else geom)
    gdf = gdf[gdf['geometry'].geom_type == 'Point']

    # 2. Assign Categories
    def get_category(row):
        amenity = row.get('amenity', '')
        building = row.get('building', '')
        
        if amenity == 'marketplace': return 'Market'
        if amenity in ['waste_disposal', 'waste_transfer_station']: return 'TPS'
        if amenity in ['school', 'university']: return 'Education'
        if building in ['residential', 'apartments', 'house']: return 'Residential'
        return 'Other'

    gdf['zone_type'] = gdf.apply(get_category, axis=1)
    
    # Filter only relevant zones
    relevant_zones = ['Market', 'TPS', 'Education', 'Residential']
    gdf = gdf[gdf['zone_type'].isin(relevant_zones)].copy()
    
    print(f"Filtered to {len(gdf)} relevant points.")

    # 3. Feature Engineering from Real Data
    
    # Separate TPS locations for distance calculation
    tps_locations = gdf[gdf['zone_type'] == 'TPS']
    
    # If no TPS found in OSM (common in some areas), generate a few synthetic ones based on Markets (markets usually have waste points)
    if len(tps_locations) < 5:
        print("Warning: Few TPS found in OSM. Using Markets as proxy for waste collection points.")
        tps_locations = gdf[gdf['zone_type'] == 'Market']

    def calculate_nearest_tps(point):
        if len(tps_locations) == 0: return 2000 # Default if absolutely nothing found
        distances = tps_locations.geometry.distance(point)
        return distances.min() * 111000 # Convert degrees approx to meters

    # Calculate Distances
    # Note: simple distance calculation in deg, converted roughly to meters
    gdf['dist_tps'] = gdf.geometry.apply(calculate_nearest_tps)

    # Simulate missing attributes (Population, Waste) based on Zone
    # Real data for these usually requires government census, so we infer logic from the Real Map Location.
    
    np.random.seed(42)
    def estimate_volume(row):
        base = 0
        if row['zone_type'] == 'Market': base = 500
        elif row['zone_type'] == 'Residential': base = 20
        elif row['zone_type'] == 'Education': base = 100
        return base + np.random.normal(0, base * 0.2)

    gdf['waste_volume'] = gdf.apply(estimate_volume, axis=1)
    gdf['waste_volume'] = gdf['waste_volume'].clip(lower=0) 

    # Pop density proxy
    gdf['pop_density'] = np.where(gdf['zone_type'] == 'Residential', 
                                  np.random.randint(1000, 5000, len(gdf)), 
                                  np.random.randint(50, 500, len(gdf)))
                                  
    # Road Access (Mock for now, hard to get without routing graph)
    gdf['road_access'] = np.random.choice(['Good', 'Moderate', 'Poor'], len(gdf))

    # 4. Calculate Risk Label (Scientific Logic)
    # Norm & Score
    norm_pop = (gdf['pop_density'] - gdf['pop_density'].min()) / (gdf['pop_density'].max() - gdf['pop_density'].min())
    norm_waste = (gdf['waste_volume'] - gdf['waste_volume'].min()) / (gdf['waste_volume'].max() - gdf['waste_volume'].min())
    norm_dist = (gdf['dist_tps'] - gdf['dist_tps'].min()) / (gdf['dist_tps'].max() - gdf['dist_tps'].min())
    
    road_map = {'Poor': 1.0, 'Moderate': 0.5, 'Good': 0.0}
    road_score = gdf['road_access'].map(road_map)
    
    risk_score = (0.35 * norm_waste) + (0.25 * norm_pop) + (0.2 * norm_dist) + (0.2 * road_score)
    
    gdf['risk_score'] = risk_score
    gdf['risk_level'] = pd.cut(risk_score, bins=[-1, 0.4, 0.7, 1.5], labels=['Low', 'Medium', 'High'])
    # Convert categorical to string to avoid save errors
    gdf['risk_level'] = gdf['risk_level'].astype(str)

    # Clean columns
    cols = ['zone_type', 'pop_density', 'waste_volume', 'dist_tps', 'road_access', 'risk_score', 'risk_level', 'geometry']
    gdf_final = gdf[cols]

    # Save to absolute path to be sure
    base_dir = os.path.dirname(os.path.abspath(__file__)) # backend/
    project_root = os.path.dirname(base_dir) # root
    out_dir = os.path.join(project_root, 'data', 'raw')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'manado_osm_final.geojson')
    
    # GeoJSON doesn't support NaN well, fillna
    gdf_final = gdf_final.fillna(0)
    
    gdf_final.to_file(out_path, driver='GeoJSON')
    print(f"Successfully saved OSM data to {out_path}")
    print(f"File size: {os.path.getsize(out_path) / 1024:.2f} KB")
    print(gdf_final.head())

if __name__ == "__main__":
    fetch_and_process_data()
