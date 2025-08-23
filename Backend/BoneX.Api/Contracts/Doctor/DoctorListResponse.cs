namespace BoneX.Api.Contracts.Doctor;

public record DoctorListResponse(
    string Id,
    string FullName,
    string Speciality,
    string Brief,
    string ProfilePicture
);

public record DoctorListAdminResponse(
    string Id,
    string FullName,
    string active,
    string Speciality,
    string Brief,
    string ProfilePicture
);