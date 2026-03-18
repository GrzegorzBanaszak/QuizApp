using QuizApp.Api.Hubs;
using QuizApp.Api.Services;

var builder = WebApplication.CreateBuilder(args);
//Rejestracja usług
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();
builder.Services.AddSingleton<GameManager>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://quiz.lan")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Konfiguracja potoku żądań HTTP (Middleware)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// AKTYWUJEMY CORS (musi być przed mapowaniem endpointów/hubów)
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// MAPUJEMY NASZEGO HUBA NA KONKRETNY ADRES URL
app.MapHub<GameHub>("/gameHub");
app.MapGet("/health", () => true);

app.Run();


