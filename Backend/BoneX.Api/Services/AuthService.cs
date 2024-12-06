using BoneX.Api.Contracts.Authentication;
using BoneX.Api.Entities;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace BoneX.Api.Services;

public class AuthService(UserManager<ApplicationUser> userManager
    , IJwtProvider jwtProvider) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly IJwtProvider _jwtProvider = jwtProvider;

    private readonly int _refreshTokenExpiryDays = 14;

    public async Task<AuthResponse?> GetTokenAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        // check user?
        var user = await _userManager.FindByEmailAsync(email);

        if (user is null)
            return null;

        // check password
        var isValidPassword = await _userManager.CheckPasswordAsync(user, password);

        if (!isValidPassword) return null;

        // generate jwt token
        var (token, expiresIn) = _jwtProvider.GenerateJwtToken(user);

        // ------ generate refresh token ------
        var refreshToken = GenerateRefreshToken();
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(_refreshTokenExpiryDays);

        // save refresh token in db
        user.RefreshTokens.Add(new RefreshToken
        {
            Token = refreshToken,
            ExpiresOn = refreshTokenExpiration
        });

        await _userManager.UpdateAsync(user);

        return new AuthResponse(user.Id, user.Email, user.FirstName, user.LastName, token, expiresIn * 60, refreshToken, refreshTokenExpiration);
    }

    public async Task<AuthResponse?> GetRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default)
    {
        var userId = _jwtProvider.ValidateToken(token);

        if (userId is null) 
            return null;

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return null;

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken && x.IsActive);

        if (userRefreshToken is null) 
            return null;

        userRefreshToken.RevokeOn = DateTime.UtcNow;

        var (newToken, expiresIn) = _jwtProvider.GenerateJwtToken(user);

        // ------ generate refresh token ------
        var NewRefreshToken = GenerateRefreshToken();
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(_refreshTokenExpiryDays);

        // save refresh token in db
        user.RefreshTokens.Add(new RefreshToken
        {
            Token = NewRefreshToken,
            ExpiresOn = refreshTokenExpiration
        });

        await _userManager.UpdateAsync(user);

        return new AuthResponse(user.Id, user.Email, user.FirstName, user.LastName, newToken, expiresIn * 60, NewRefreshToken, refreshTokenExpiration);

    }

    public async Task<bool> RevokeRefreshTokenAsync(string token, string refreshToken, CancellationToken cancellationToken = default)
    {
        var userId = _jwtProvider.ValidateToken(token);

        if (userId is null)
            return false;

        var user = await _userManager.FindByIdAsync(userId);

        if (user is null)
            return false;

        var userRefreshToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken && x.IsActive);

        if (userRefreshToken is null)
            return false;

        userRefreshToken.RevokeOn = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return true;
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }    
}
