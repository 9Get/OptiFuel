using Microsoft.AspNetCore.Mvc;
using OptiFuel.API.Models;
using OptiFuel.API.Services;

namespace OptiFuel.API.Controllers;

[ApiController]
[Route("api/")]
public class PredictionController : ControllerBase
{
    private readonly MlApiService _mlApiService;
    private readonly ILogger<PredictionController> _logger;

    public PredictionController(MlApiService mlApiService, ILogger<PredictionController> logger)
    {
        _mlApiService = mlApiService;
        _logger = logger;
    }

    [HttpPost("predict")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PredictionResponse))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public async Task<IActionResult> GetFuelPrediction([FromBody] PredictionRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var predictionResponse = await _mlApiService.GetPredictionAsync(request);

            if (predictionResponse == null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Prediction service returned an invalid response." });
            }

            return Ok(predictionResponse);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Failed to communicate with the ML service.");
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new { message = "The prediction service is currently unavailable. Please try again later." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occured during prediction");
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal server error occurred. Please try again later." });
        }
    }
}