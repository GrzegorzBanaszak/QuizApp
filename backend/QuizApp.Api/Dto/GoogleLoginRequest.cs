using System.Text.Json.Serialization;

namespace QuizApp.Api.Dto;

public sealed record GoogleLoginRequest(
    [property: JsonPropertyName("id_token")] string IdToken);
