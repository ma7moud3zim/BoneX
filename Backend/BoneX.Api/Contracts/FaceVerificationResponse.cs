namespace BoneX.Api.Contracts;

public class FaceVerificationResponse
{
    public bool Success { get; set; }
    public bool Match { get; set; }
    public double Distance { get; set; }
    public double Threshold { get; set; }
    public string Model { get; set; }
}
