using BoneX.Api.Contracts.Doctor;
using System.Text.Json;

namespace BoneX.Api.Services;

public class RecommenderService : IRecommenderService
{
    private readonly HttpClient _httpClient;

    public RecommenderService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<List<DoctorRecommend>> GetRecommendationsAsync(string userLocation)
    {
        var formData = new MultipartFormDataContent();
        formData.Add(new StringContent(userLocation), "user_location");

        var response = await _httpClient.PostAsync("http://207.154.221.184:8000/recommend", formData);

        if (response.IsSuccessStatusCode)
        {
            var json = await response.Content.ReadAsStringAsync();
            var doctors = JsonSerializer.Deserialize<List<DoctorRecommend>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return doctors;
        }

        return new List<DoctorRecommend>();
    }
}
