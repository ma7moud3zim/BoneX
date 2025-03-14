﻿using BoneX.Api.Abstraction;
using BoneX.Api.Contracts.Users;

namespace BoneX.Api.Services;

public interface IUserService
{
    Task<Result<UserProfileResponse>> GetProfileAsync(string userId);
    Task<Result> UpdateProfileAsync(string userId, UpdateProfileRequest request);
    Task<Result> ChangePasswordAsync(string userId, ChangePasswordRequest request);
}
