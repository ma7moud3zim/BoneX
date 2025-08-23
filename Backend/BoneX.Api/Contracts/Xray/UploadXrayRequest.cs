namespace BoneX.Api.Contracts.Xray;

public record UploadXrayRequest(
    IFormFile XrayImage,
    string? Description = null
);