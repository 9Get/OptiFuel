using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using OptiFuel.API.Data;

namespace OptiFuel.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummaty()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Voyages.Where(v => v.UserId == userId);

            var totalVoyages = await query.CountAsync();
            var totalPredicted = await query.SumAsync(v => v.PredictedFuelConsumption);
            var totalActual = await query.Where(h => h.ActualFuelConsumption.HasValue).SumAsync(v => v.ActualFuelConsumption!.Value);

            var completedVoyages = await query.Where(h => h.ActualFuelConsumption.HasValue).ToListAsync();
            double avgDeviation = 0;
            if (completedVoyages.Any())
            {
                avgDeviation = completedVoyages.Average(h => (h.ActualFuelConsumption!.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100);
            }

            var efficiencyByShip = completedVoyages
                .GroupBy(h => h.ShipType)
                .Select(g => new
                {
                    ShipType = g.Key,
                    AvgDeviation = g.Average(h => ((h.ActualFuelConsumption!.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption) * 100)
                })
                .OrderByDescending(x => x.AvgDeviation)
                .ToList();

            return Ok(new
            {
                TotalVoyages = totalVoyages,
                TotalPredictedVolume = totalPredicted,
                TotalActualVolume = totalActual,
                GlobalAverageDeviation = avgDeviation,
                ShipEfficiency = efficiencyByShip
            });
        }

        [HttpGet("charts")]
        public async Task<IActionResult> GetCharts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var query = _context.Voyages
                .Where(h => h.UserId == userId && h.ActualFuelConsumption.HasValue);

            var completedVoyages = await query.ToListAsync();

            var shipStats = completedVoyages
                .GroupBy(h => h.ShipType)
                .Select(g => new
                {
                    ShipType = g.Key,
                    AvgDeviation = g.Average(h => ((h.ActualFuelConsumption!.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption) * 100)
                })
                .ToList();

            var trendStats = completedVoyages
                .OrderByDescending(h => h.CreatedAt)
                .Take(10)
                .OrderBy(h => h.CreatedAt)
                .Select(h => new
                {
                    Date = h.CreatedAt.ToString("MM/dd"),
                    Predicted = h.PredictedFuelConsumption,
                    Actual = h.ActualFuelConsumption
                })
                .ToList();

            var deviations = completedVoyages.Select(h =>
                ((h.ActualFuelConsumption!.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption) * 100).ToList();

            var histogramStats = new List<object>
            {
                new { Range = "Saving (>3%)", Count = deviations.Count(d => d <= -3) },
                new { Range = "Normal (+/-3%)", Count = deviations.Count(d => d > -3 && d <= 3) },
                new { Range = "Warning (3-7%)", Count = deviations.Count(d => d > 3 && d <= 7) },
                new { Range = "Critical (>7%)", Count = deviations.Count(d => d > 7) }
            };

            var weatherStats = completedVoyages
                .GroupBy(h => h.WeatherConditions)
                .Select(g => new
                {
                    Weather = g.Key,
                    AvgConsumption = g.Average(h => h.ActualFuelConsumption!.Value)
                })
                .OrderBy(x => x.AvgConsumption)
                .ToList();

            return Ok(new
            {
                ShipStats = shipStats,
                TrendStats = trendStats,
                HistogramStats = histogramStats,
                WeatherStats = weatherStats
            });
        }
    }
}