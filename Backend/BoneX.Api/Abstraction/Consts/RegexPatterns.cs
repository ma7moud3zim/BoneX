namespace BoneX.Api.Abstraction.Consts;

public static class RegexPatterns
{
    public const string Password = "(?=(.*[0-9]))(?=.*[\\!@#$%^&*()\\\\[\\]{}\\-_+=~`|:;\"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}";
    public const string PhoneNumber = @"^(\+20|0)(10|11|12|15)\d{8}$";

}
