using BoneX.Api.Contracts.Doctor;

namespace BoneX.Api.Services;

public interface IRecommenderService
{
    Task<List<DoctorRecommend>> GetRecommendationsAsync(string userLocation);
}
