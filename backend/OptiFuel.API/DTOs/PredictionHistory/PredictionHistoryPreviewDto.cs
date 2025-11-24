namespace OptiFuel.API.DTOs.PredictionHistory;

public class PredictionHistoryPreviewDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }

    public string RouteId { get; set; } = null!;
    public string ShipType { get; set; } = null!;
    public double PredictedFuelConsumption { get; set; }
    public double Distance { get; set; }
    public double EngineEfficiency { get; set; }
    public string FuelType { get; set; } = null!;
    public string WeatherConditions { get; set; } = null!;
    public double? ActualFuelConsumption { get; set; }
}