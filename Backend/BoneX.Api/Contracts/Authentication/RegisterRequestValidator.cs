using BoneX.Api.Abstraction.Consts;

namespace BoneX.Api.Contracts.Authentication;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
             .Matches(RegexPatterns.Password)
             .WithMessage("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .Length(3, 100);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .Length(3, 100);

    }
}
