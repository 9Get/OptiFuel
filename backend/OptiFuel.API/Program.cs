using OptiFuel.API.Extensions;
using OptiFuel.API.Services;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.ConfigureMlServiceRegistration(configuration);

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.ConfigureDatabase(configuration);

const string frontendOrigin = "AllowFrontend";
builder.Services.ConfigureCors(frontendOrigin);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.ConfigureAuthentication(configuration);

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