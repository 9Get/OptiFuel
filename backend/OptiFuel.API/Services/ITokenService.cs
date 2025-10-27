using System.Security.Claims;
using OptiFuel.API.DTOs.Auth;

namespace OptiFuel.API.Services;

public interface ITokenService
{
    TokenResponse GenerateAccessToken(IEnumerable<Claim> claims);    
}