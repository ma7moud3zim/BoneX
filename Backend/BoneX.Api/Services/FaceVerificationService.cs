using BoneX.Api.Contracts;
using BoneX.Api.Contracts.DoctorVerification;
using System.Text.Json;

namespace BoneX.Api.Services;

public class FaceVerificationService(HttpClient httpClient) : IFaceVerificationService
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task<FaceVerificationResponse?> VerifyFacesAsync(string imagePath1, string imagePath2)
    {
        using var content = new MultipartFormDataContent();
        content.Add(new StreamContent(File.OpenRead(imagePath1)), "image1", Path.GetFileName(imagePath1));
        content.Add(new StreamContent(File.OpenRead(imagePath2)), "image2", Path.GetFileName(imagePath2));

        var response = await _httpClient.PostAsync("http://164.90.223.123:6000/verify-face", content);
        if (!response.IsSuccessStatusCode) return null;

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<FaceVerificationResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
    }

}
