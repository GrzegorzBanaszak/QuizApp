using AutoMapper;
using QuizApp.Api.Data;
using QuizApp.Api.Services.Abstractions;
using QuizApp.Api.Services.Implementations;
using QuizApp.Api.Profiles;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using QuizApp.Api.Dto;
using QuizApp.Api.Data.Seed;

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
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddSingleton<IMapper>(_ =>
{
    var configuration = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<UserProfile>();
        cfg.AddProfile<SingleplayerProfile>();
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
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var cookieName =
                    context.HttpContext.RequestServices.GetRequiredService<IConfiguration>()["Jwt:CookieName"]
                    ?? "quizapp_auth";

                if (string.IsNullOrWhiteSpace(context.Token) &&
                    context.Request.Cookies.TryGetValue(cookieName, out var cookieToken))
                {
                    context.Token = cookieToken;
                }

                return Task.CompletedTask;
            }
        };
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
builder.Services.AddHttpClient();
builder.Services.Configure<CategorySeedOptions>(builder.Configuration.GetSection(CategorySeedOptions.SectionName));
builder.Services.Configure<LevelSeedOptions>(builder.Configuration.GetSection(LevelSeedOptions.SectionName));
builder.Services.Configure<SingleplayerQuestionSeedOptions>(builder.Configuration.GetSection(SingleplayerQuestionSeedOptions.SectionName));
builder.Services.Configure<AchievementSeedOptions>(builder.Configuration.GetSection(AchievementSeedOptions.SectionName));
builder.Services.Configure<AvatarSeedOptions>(builder.Configuration.GetSection(AvatarSeedOptions.SectionName));
builder.Services.AddScoped<CategorySeedService>();
builder.Services.AddScoped<LevelSeedService>();
builder.Services.AddScoped<SingleplayerQuestionSeedService>();
builder.Services.AddScoped<AchievementSeedService>();
builder.Services.AddScoped<AvatarSeedService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProgressionService, ProgressionService>();
builder.Services.AddScoped<IAchievementService, AchievementService>();
builder.Services.AddScoped<ISingleplayerService, SingleplayerService>();
builder.Services.AddScoped<IAvatarService, AvatarService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHostedService<TemporaryGuestCleanupService>();


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

await using (var scope = app.Services.CreateAsyncScope())
{
    var categorySeedService = scope.ServiceProvider.GetRequiredService<CategorySeedService>();
    var levelSeedService = scope.ServiceProvider.GetRequiredService<LevelSeedService>();
    var singleplayerQuestionSeedService = scope.ServiceProvider.GetRequiredService<SingleplayerQuestionSeedService>();
    var achievementSeedService = scope.ServiceProvider.GetRequiredService<AchievementSeedService>();
    var avatarSeedService = scope.ServiceProvider.GetRequiredService<AvatarSeedService>();

    await categorySeedService.SeedAsync();
    await levelSeedService.SeedAsync();
    await singleplayerQuestionSeedService.SeedAsync();
    await achievementSeedService.SeedAsync();
    await avatarSeedService.SeedAsync();
}

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

app.MapGet("/health", () => true);


app.Run();
