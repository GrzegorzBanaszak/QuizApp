using QuizApp.Api.Hubs;
using QuizApp.Api.Services;
using Microsoft.AspNetCore.HttpOverrides;

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

//Rejestracja usług
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

    // Reverse proxy jest poza kontenerem aplikacji, więc nie ograniczamy się
    // do lokalnych adresów proxy.
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// Konfiguracja potoku żądań HTTP (Middleware)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseForwardedHeaders();
app.UseHttpsRedirection();

// AKTYWUJEMY CORS (musi być przed mapowaniem endpointów/hubów)
app.UseCors("AllowFrontend");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

// MAPUJEMY NASZEGO HUBA NA KONKRETNY ADRES URL
app.MapHub<GameHub>("/gameHub");
app.MapGet("/health", () => true);

// --- TYMCZASOWY ENDPOINT DO TESTOWANIA AI W SWAGGERZE ---
app.MapGet("/api/test-ai/{topic}", async (string topic, QuizApp.Api.Services.IAiQuestionGenerator aiService) =>
{
    try
    {
        // Generujemy tylko 3 pytania dla szybszego testu
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


