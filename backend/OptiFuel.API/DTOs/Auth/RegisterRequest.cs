using System.ComponentModel.DataAnnotations;

namespace OptiFuel.API.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = null!;

    [Required(ErrorMessage = "Email is required.")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required.")]
    public string Password { get; set; } = null!;
}