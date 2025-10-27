using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OptiFuel.API.Models;

public class Voyage
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    public double Distance { get; set; }

    [Required]
    public double EngineEfficiency { get; set; }

    [Required]
    public string ShipType { get; set; } = null!;

    [Required]
    public string RouteId { get; set; } = null!;

    [Required]
    public string FuelType { get; set; } = null!;

    [Required]
    public string WeatherConditions { get; set; } = null!;

    [Required]
    public int Month { get; set; }

    [Required]
    public double PredictedFuelConsumption { get; set; }

    public double? ActualFuelConsumption { get; set; }

    [Required]
    public string UserId { get; set; } = null!;

    [ForeignKey(nameof(UserId))]
    public AppUser AppUser { get; set; } = null!;
}