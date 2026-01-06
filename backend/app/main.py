from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router
import os

app = FastAPI(title="WebGIS Risk Prediction API", description="API for predicting environmental risk in Manado")

# CORS
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "WebGIS API is running. Go to /docs for Swagger UI."}
