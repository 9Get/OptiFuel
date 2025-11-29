using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OptiFuel.API.Data;
using OptiFuel.API.Models;
using System.Security.Claims;
using System.Linq.Dynamic.Core;
using OptiFuel.API.DTOs;
using OptiFuel.API.DTOs.PredictionHistory;

namespace OptiFuel.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HistoryController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public HistoryController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<PredictionHistoryPreviewDto>))]
    public async Task<IActionResult> GetHistory([FromQuery] ResourceQueryParameters queryParameters)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var query = _dbContext.Voyages
                                .Where(h => h.UserId == userId)
                                .AsQueryable();

        if (!string.IsNullOrEmpty(queryParameters.DeviationCategory))
        {

            switch (queryParameters.DeviationCategory)
            {
                case "Saving": // <= -3%
                    query = query.Where(h => h.ActualFuelConsumption.HasValue &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) <= -3);
                    break;
                case "Normal": // > -3% AND <= 3%
                    query = query.Where(h => h.ActualFuelConsumption.HasValue &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) > -3 &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) <= 3);
                    break;
                case "Warning": // > 3% AND <= 7%
                    query = query.Where(h => h.ActualFuelConsumption.HasValue &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) > 3 &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) <= 7);
                    break;
                case "Critical": // > 7%
                    query = query.Where(h => h.ActualFuelConsumption.HasValue &&
                        ((h.ActualFuelConsumption.Value - h.PredictedFuelConsumption) / h.PredictedFuelConsumption * 100) > 7);
                    break;
            }
        }

        if (!string.IsNullOrEmpty(queryParameters.ShipType))
        {
            query = query.Where(h => h.ShipType == queryParameters.ShipType);
        }

        if (!string.IsNullOrEmpty(queryParameters.WeatherCondition))
        {
            query = query.Where(h => h.WeatherConditions == queryParameters.WeatherCondition);
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.SortBy))
        {
            var sortOrder = queryParameters.SortOrder?.ToLower() == "asc" ? "ascending" : "descending";
            query = query.OrderBy($"{queryParameters.SortBy} {sortOrder}");
        }
        else
        {
            query = query.OrderByDescending(h => h.CreatedAt);
        }

        var totalItemCount = await query.CountAsync();

        var items = await query
                .Skip((queryParameters.PageNumber - 1) * queryParameters.PageSize)
                .Take(queryParameters.PageSize)
                .Select(h => new PredictionHistoryPreviewDto
                {
                    Id = h.Id,
                    CreatedAt = h.CreatedAt,
                    RouteId = h.RouteId,
                    ShipType = h.ShipType,
                    PredictedFuelConsumption = h.PredictedFuelConsumption,
                    Distance = h.Distance,
                    EngineEfficiency = h.EngineEfficiency,
                    FuelType = h.FuelType,
                    WeatherConditions = h.WeatherConditions,
                    ActualFuelConsumption = h.ActualFuelConsumption
                })
                .ToListAsync();

        var paginationMetadata = new PaginationMetadata
        {
            TotalItemCount = totalItemCount,
            PageSize = queryParameters.PageSize,
            CurrentPage = queryParameters.PageNumber,
            TotalPageCount = (int)Math.Ceiling(totalItemCount / (double)queryParameters.PageSize)
        };

        var pagedResult = new Models.PagedResult<PredictionHistoryPreviewDto>
        {
            Items = items,
            Metadata = paginationMetadata
        };

        return Ok(pagedResult);
    }
}