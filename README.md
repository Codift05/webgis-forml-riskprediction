# WebGIS Machine Learning for Environmental Risk Prediction
### Case Study: Urban Waste Accumulation Risk Analysis in Manado City

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Lambang_Kota_Manado.png" alt="Manado City Coat of Arms" width="100"/>
</div>

<br/>

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-005571?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3-F7931E?style=flat-square&logo=scikit-learn)

</div>

## 📌 Abstract
This project presents the development of an integrated **WebGIS** application designed to assess and predict environmental risks, specifically focusing on illegal waste accumulation in Manado City. By leveraging **Spatial Analysis** and **Machine Learning** algorithms, the system provides a data-driven approach to urban environmental management. The core prediction engine utilizes a **Random Forest Classifier** to evaluate risk levels based on multi-dimensional spatial data, serving as a decision support system for local municipal authorities.

## ✨ Key Features

*   **Geospatial Risk Visualization**: Interactive mapping interface displaying risk classification (High, Medium, Low) across different city zones using choropleth or point-based visualization.
*   **Predictive Modeling**: Implementation of a Machine Learning model to forecast risk probability based on critical variables:
    *   Population Density
    *   Proximity to Waste Disposal Sites (TPS)
    *   Historical Waste Volume
*   **Real-time Analytics Dashboard**: Comprehensive statistical overview regarding risk distribution and contributing factors.
*   **Granular Region Analysis**: Detailed inspection capabilities for specific coordinates or administrative boundaries, providing explainable insights into risk scoring.

## 🛠️ System Architecture
The application follows a modern decoupled Client-Server architecture:

### Backend (API & Model)
*   **Core Framework**: FastAPI (Python) for high-performance, asynchronous API delivery.
*   **Machine Learning**: Scikit-Learn (Random Forest) for model training and inference.
*   **Data Processing**: Pandas and GeoPandas for spatial data manipulation.

### Frontend (User Interface)
*   **Framework**: React.js (via Vite) for a reactive and component-based UI.
*   **Mapping Library**: Leaflet & React-Leaflet for rendering interactive geospatial layers.
*   **Data Visualization**: Chart.js for rendering statistical analytics.

## 🚀 Installation & Setup Guide

### Prerequisites
*   Python 3.8 or higher
*   Node.js & NPM

### 1. Backend Service Initialization
```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Unix/MacOS:
# source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Run Data Simulation (Optional: If real datasets are measuring unavailable)
python generate_data.py

# Train the Prediction Model
python train_model.py

# Launch API Server
uvicorn app.main:app --reload
```
*The API service will be accessible at: `http://localhost:8000`*

### 2. Frontend Application Initialization
```bash
cd frontend

# Install Dependencies
npm install

# Start Development Server
npm run dev
```
*The Web Application will be accessible at: `http://localhost:5173`*

## ⚠️ Data Disclaimer
> **Important Note for Reviewers:**
>
> This prototype currently operates using **Synthetic Data Simulation**. The geospatial coordinates and attribute data (Population, Waste Volume) are generated programmatically to mimic the topological and demographic characteristics of Manado City for demonstration purposes. 
> 
> The system architecture is designed to seamlessly ingest real-world datasets (GeoJSON/CSV) without requiring structural code modifications.

## 👥 Contributors
Developed as a final year project by **[Your Name/Team Name]**.

---
<div align="center">
  Copyright © 2026 WebGIS Manado Project. All Rights Reserved.
</div>
