namespace BoneX.Api.Contracts.Doctor;

public record DoctorRecommendation(string DoctorId, double Distance);


public record DoctorRecommendationResponse(List<DoctorRecommendation> Recommendations);
