from pydantic import BaseModel, Field
from typing import Literal

# Using Literal for strict validation of string inputs to prevent typos
ShipType = Literal["Oil Service Boat", "Fishing Trawler", "Surfer Boat", "Tanker Ship"]
RouteID = Literal["Warri-Bonny", "Port Harcourt-Lagos", "Lagos-Apapa", "Escravos-Lagos"]
FuelType = Literal["HFO", "Diesel"]
WeatherConditions = Literal["Calm", "Moderate", "Stormy"]

class PredictionRequest(BaseModel):
    """
    Defines the structure and validation rules for the prediction request body.
    """
    distance: float = Field(..., gt=0, description="Distance traveled (e.g., in nautical miles)")
    engine_efficiency: float = Field(..., ge=0, le=100, description="Engine efficiency as a percentage (0-100)")
    ship_type: ShipType = Field(..., description="Type of the ship")
    route_id: RouteID = Field(..., description="Identifier for the route")
    fuel_type: FuelType = Field(..., description="Type of fuel used")
    weather_conditions: WeatherConditions = Field(..., description="Predominant weather conditions during the voyage")
    month: int = Field(..., ge=1, le=12, description="Month of the year (1 for January, 12 for December)")

    class Config:
        """Configuration to provide a sample payload in the API documentation."""
        json_schema_extra = {
            "example": {
                "distance": 250.5,
                "engine_efficiency": 91.3,
                "ship_type": "Tanker Ship",
                "route_id": "Lagos-Apapa",
                "fuel_type": "Diesel",
                "weather_conditions": "Stormy",
                "month": 11
            }
        }

class PredictionResponse(BaseModel):
    """
    Defines the structure for the API's prediction response.
    """
    predicted_fuel_consumption: float = Field(..., description="The predicted fuel consumption in liters")