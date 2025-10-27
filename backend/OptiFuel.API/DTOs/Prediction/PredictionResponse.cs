using System.Text.Json.Serialization;

namespace OptiFuel.API.Models;

public class PredictionResponse
{
    [JsonPropertyName("predicted_fuel_consumption")]
    public double PredictedFuelConsumption { get; set; }
}