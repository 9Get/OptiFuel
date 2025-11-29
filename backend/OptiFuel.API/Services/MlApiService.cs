using OptiFuel.API.Models;

namespace OptiFuel.API.Services;

public class MlApiServiceSettings
{
    public string BaseUrl { get; set; } = null!;
}

public class MlApiService
{
    private readonly HttpClient _httpClient;

    public MlApiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<PredictionResponse?> GetPredictionAsync(PredictionRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/predict", request);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<PredictionResponse>();
    }

    public async Task<Dictionary<string, double>?> GetExplanationAsync(PredictionRequest request)
    {
        var response = await _httpClient.PostAsJsonAsync("/explain", request);

        response.EnsureSuccessStatusCode();
        
        return await response.Content.ReadFromJsonAsync<Dictionary<string, double>>();
    }
}