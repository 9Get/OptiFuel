using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OptiFuel.API.Data;
using OptiFuel.API.Models;
using OptiFuel.API.Services;

namespace OptiFuel.API.Extensions;

public static class ServiceExtensions
{
    /// <summary>
    /// Configures the CORS policy for the application.
    /// </summary>
    public static void ConfigureCors(this IServiceCollection services, string policyName)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(policyName, policy =>
            {
                // For production, specify the exact domain.
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
    }

    /// <summary>
    /// Configures the database context for PostgreSQL.
    /// </summary>
    public static void ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        });
    }

    /// <summary>
    /// Configures HttpClient for the ML service.
    /// </summary>
    public static void ConfigureMlServiceRegistration(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MlApiServiceSettings>(
            configuration.GetSection("MlApiServiceSettings")
        );

        services.AddHttpClient<MlApiService>((serviceProvider, client) =>
        {
            var settings = serviceProvider.GetRequiredService<IOptions<MlApiServiceSettings>>().Value;
            client.BaseAddress = new Uri(settings.BaseUrl);
        });
    }

    /// <summary>
    /// Configures ASP.NET Core Identity and JWT Authentication.
    /// </summary>
    public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentity<AppUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false; // В проде лучше true
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = configuration["JWT:ValidAudience"],
                ValidIssuer = configuration["JWT:ValidIssuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!))
            };
        });
    }
}