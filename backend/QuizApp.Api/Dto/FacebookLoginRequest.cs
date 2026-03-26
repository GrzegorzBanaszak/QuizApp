using System.Text.Json.Serialization;

namespace QuizApp.Api.Dto;

public sealed record FacebookLoginRequest(
    [property: JsonPropertyName("access_token")] string AccessToken);
