using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OptiFuel.API.Data;
using OptiFuel.API.Models;
using OptiFuel.API.Services;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.Configure<MlApiServiceSettings>(
    builder.Configuration.GetSection("MlApiServiceSettings")
);

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddHttpClient<MlApiService>((serviceProvider, client) =>
{
    var settings = serviceProvider.GetRequiredService<IOptions<MlApiServiceSettings>>().Value;
    client.BaseAddress = new Uri(settings.BaseUrl);
});

builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

const string frontendOrigin = "AllowFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: frontendOrigin, policy =>
    {
        // For development, you can be more permissive. For production, specify the exact domain.
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
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

var app = builder.Build();

// await ApplyMigrations(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();


// async Task ApplyMigrations(IHost app)
// {
//     using var scope = app.Services.CreateScope();
//     var services = scope.ServiceProvider;
//     try
//     {
//         var dbContext = services.GetRequiredService<AppDbContext>();
     
//         await dbContext.Database.MigrateAsync(); 
//         Console.WriteLine("Database migrations applied successfully.");
//     }
//     catch (Exception ex)
//     {
//         var logger = services.GetRequiredService<ILogger<Program>>();
//         logger.LogError(ex, "An error occurred while migrating the database.");
//     }
// }