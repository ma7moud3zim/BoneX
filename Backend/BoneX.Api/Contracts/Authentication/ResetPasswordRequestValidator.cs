using BoneX.Api.Abstraction.Consts;

namespace BoneX.Api.Contracts.Authentication;

public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Code)
            .NotEmpty();

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .Matches(RegexPatterns.Password)
            .WithMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.");
    }
}
