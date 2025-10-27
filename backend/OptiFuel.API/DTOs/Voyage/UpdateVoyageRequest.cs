using System.ComponentModel.DataAnnotations;

namespace OptiFuel.API.DTOs.Voyage;

public class UpdateVoyageRequest
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Actual fuel consumption must be a positive number.")]
    public double ActualFuelConsumption { get; set; }
}