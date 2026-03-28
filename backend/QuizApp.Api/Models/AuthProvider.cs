using System.Text.Json.Serialization;

namespace QuizApp.Api.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AuthProvider
{
    Guest,
    Google,
    Facebook
}
