using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OptiFuel.API.Models;

public class PredictionRequest
{
    [JsonPropertyName("distance")]
    [Required(ErrorMessage = "Distance is required.")]
    [Range(0.1, 10000, ErrorMessage = "Distance must be between 0.1 and 10,000.")]
    public double Distance { get; set; }

    [JsonPropertyName("engine_efficiency")]
    [Required(ErrorMessage = "Engine efficiency is required.")]
    [Range(1, 100, ErrorMessage = "Engine efficiency must be between 1 and 100.")]
    public double EngineEfficiency { get; set; }

    [JsonPropertyName("ship_type")]
    [RegularExpression("^(Oil Service Boat|Fishing Trawler|Surfer Boat|Tanker Ship)$", ErrorMessage = "Invalid ship type.")]
    [Required(ErrorMessage = "Ship type is required.")]
    public string ShipType { get; set; } = null!;

    [JsonPropertyName("route_id")]
    [Required(ErrorMessage = "Route ID is required.")]
    [RegularExpression("^(Warri-Bonny|Port Harcourt-Lagos|Lagos-Apapa|Escravos-Lagos)$", ErrorMessage = "Invalid route ID.")]
    public string RouteId { get; set; } = null!;

    [JsonPropertyName("fuel_type")]
    [Required(ErrorMessage = "Fuel type is required.")]
    [RegularExpression("^(HFO|Diesel)$", ErrorMessage = "Invalid fuel type. Must be 'HFO' or 'Diesel'.")]
    public string FuelType { get; set; } = null!;

    [JsonPropertyName("weather_conditions")]
    [Required(ErrorMessage = "Weather conditions are required.")]
    [RegularExpression("^(Calm|Moderate|Stormy)$", ErrorMessage = "Invalid weather conditions.")]
    public string WeatherConditions { get; set; } = null!;

    [JsonPropertyName("month")]
    [Required(ErrorMessage = "Month is required.")]
    [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
    public int Month { get; set; }
}