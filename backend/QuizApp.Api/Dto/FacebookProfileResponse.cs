using System.Text.Json.Serialization;

namespace QuizApp.Api.Dto;

public sealed class FacebookProfileResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("first_name")]
    public string? FirstName { get; set; }

    [JsonPropertyName("last_name")]
    public string? LastName { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("picture")]
    public FacebookPictureResponse Picture { get; set; } = new();
}

public sealed class FacebookPictureResponse
{
    [JsonPropertyName("data")]
    public FacebookPictureDataResponse? Data { get; set; }
}

public sealed class FacebookPictureDataResponse
{
    [JsonPropertyName("url")]
    public string? Url { get; set; }
}
