using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OptiFuel.API.Data;
using OptiFuel.API.DTOs.Voyage;
using OptiFuel.API.Models;
using OptiFuel.API.Services;

namespace OptiFuel.API.Controllers;

[Authorize]
[ApiController]
[Route("api/voyages")]
public class VoyagesController : ControllerBase
{
    private readonly MlApiService _mlApiService;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<VoyagesController> _logger;

    public VoyagesController(MlApiService mlApiService, AppDbContext context, ILogger<VoyagesController> logger)
    {
        _mlApiService = mlApiService;
        _dbContext = context;
        _logger = logger;
    }

    private string GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
        {
            throw new InvalidOperationException("User ID not found in token. This should not happen for authorized requests.");
        }

        return userId;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Voyage>))]
    public async Task<IActionResult> GetMyVoyages()
    {
        var userId = GetCurrentUserId();
        var voyages = await _dbContext.Voyages
            .Where(v => v.UserId == userId)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return Ok(voyages);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Voyage))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetVoyageById(int id)
    {
        var userId = GetCurrentUserId();
        var voyage = await _dbContext.Voyages
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);

        if (voyage == null)
        {
            return NotFound(new { message = "Voyage not found or does not belong to the user." });
        }

        return Ok(voyage);
    }

    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Voyage))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> CreateVoyage([FromBody] PredictionRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetCurrentUserId();

        try
        {
            var predictionResponse = await _mlApiService.GetPredictionAsync(request);
            if (predictionResponse == null)
            {
                return StatusCode(500, "Invalid response from ML service.");
            }

            var newVoyage = new Voyage
            {
                Distance = request.Distance,
                EngineEfficiency = request.EngineEfficiency,
                ShipType = request.ShipType,
                RouteId = request.RouteId,
                FuelType = request.FuelType,
                WeatherConditions = request.WeatherConditions,
                Month = request.Month,
                PredictedFuelConsumption = predictionResponse.PredictedFuelConsumption,
                UserId = userId
            };

            _dbContext.Voyages.Add(newVoyage);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("New voyage created with ID {VoyageId} for user {UserId}", newVoyage.Id, userId);
            return CreatedAtAction(nameof(GetVoyageById), new { id = newVoyage.Id }, newVoyage);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to communicate with the ML service for a stateless prediction.");
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new { message = "The prediction service is currently unavailable. Please try again later." }
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured during stateless prediction");
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { message = "An internal server error occurred. Please try again later." }
            );
        }
    }

    [HttpPost("{id}/explain")]
    public async Task<IActionResult> ExplainVoyage(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        var voyage = await _dbContext.Voyages
            .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId);
        
        if (voyage == null) return NotFound();

        var predictionRequest = new PredictionRequest
        {
            Distance = voyage.Distance,
            EngineEfficiency = voyage.EngineEfficiency,
            ShipType = voyage.ShipType,
            RouteId = voyage.RouteId,
            FuelType = voyage.FuelType,
            WeatherConditions = voyage.WeatherConditions,
            Month = voyage.Month
        };

        try
        {
            var explanation = await _mlApiService.GetExplanationAsync(predictionRequest);
            return Ok(explanation);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to generate explanation", error = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Voyage))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateActualConsumption(int id, [FromBody] UpdateVoyageRequest updateRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetCurrentUserId();
        var voyageToUpdate = await _dbContext.Voyages
            .FirstOrDefaultAsync(v => v.Id == id && v.UserId == userId);

        if (voyageToUpdate == null)
        {
            return NotFound(new { message = "Voyage not found or does not belong to the user." });
        }

        voyageToUpdate.ActualFuelConsumption = updateRequest.ActualFuelConsumption;
        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Voyage with ID {VoyageId} updated by user {UserId}", id, userId);
        return Ok(voyageToUpdate);
    }
}