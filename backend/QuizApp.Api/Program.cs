using AutoMapper;
using QuizApp.Api.Hubs;
using QuizApp.Api.Data;
using QuizApp.Api.Services;
using QuizApp.Api.Profiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = new[]
{
    "http://localhost:5173",
    "http://quiz.lan",
    "http://192.168.1.245:5173",
    "http://gbanaszak.pl",
    "https://gbanaszak.pl",
    "http://www.gbanaszak.pl",
    "https://www.gbanaszak.pl"
};

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IMapper>(_ =>
{
    var configuration = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<UserProfile>();
    });

    return configuration.CreateMapper();
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Missing ConnectionStrings:DefaultConnection configuration value.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key configuration value.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddSignalR();
builder.Services.AddSingleton<GameManager>();

builder.Services.AddHttpClient<IAiQuestionGenerator, GeminiAiService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto |
        ForwardedHeaders.XForwardedHost;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseForwardedHeaders();
app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapHub<GameHub>("/gameHub");
app.MapGet("/health", () => true);

app.MapGet("/api/test-ai/{topic}", async (string topic, QuizApp.Api.Services.IAiQuestionGenerator aiService) =>
{
    try
    {
        var questions = await aiService.GenerateQuestionsAsync(topic, 3);
        return Results.Ok(questions);
    }
    catch (Exception ex)
    {
        return Results.Problem(detail: ex.Message, title: "Błąd podczas łączenia z AI");
    }
})
.WithName("TestAiGeneration")
.WithOpenApi();

app.Run();
