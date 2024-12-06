using BoneX.Api.Contracts.Authentication;

namespace BoneX.Api.Services;

public interface IAuthService
{
    Task<AuthResponse?> GetTokenAsync(string email, string password, CancellationToken cancellationToken = default);
    Task<AuthResponse?> GetRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default);
    Task<bool> RevokeRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default);
}
