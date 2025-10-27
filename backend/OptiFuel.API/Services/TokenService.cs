using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using OptiFuel.API.DTOs.Auth;

namespace OptiFuel.API.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public TokenResponse GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var secretKey = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret is not configured.");
        var issuer = _configuration["Jwt:ValidIssuer"] ?? throw new InvalidOperationException("JWT Issuer is not configured.");
        var audience = _configuration["Jwt:ValidAudience"] ?? throw new InvalidOperationException("JWT Audience is not configured.");

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            expires: DateTime.UtcNow.AddHours(12),
            claims: claims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );

        return new TokenResponse
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = token.ValidTo
        };
    }
}