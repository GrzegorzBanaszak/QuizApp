# Etap 1: Budowanie
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Kopiujemy plik projektu i przywracamy zależności (dobre dla cache'owania warstw Dockera)
COPY ["QuizApp.Api/QuizApp.Api.csproj", "QuizApp.Api/"]
RUN dotnet restore "QuizApp.Api/QuizApp.Api.csproj"

# Kopiujemy resztę kodu i budujemy aplikację
COPY . .
WORKDIR "/src/QuizApp.Api"
RUN dotnet publish "QuizApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Etap 2: Uruchamianie (lekki obraz)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Ustawiamy port, na którym nasłuchuje aplikacja wewnątrz kontenera
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "QuizApp.Api.dll"]