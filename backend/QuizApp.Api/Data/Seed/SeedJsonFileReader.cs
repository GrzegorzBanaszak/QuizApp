using System.Text.Json;
using System.Text.Json.Serialization;

namespace QuizApp.Api.Data.Seed;

internal static class SeedJsonFileReader
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters =
        {
            new JsonStringEnumConverter()
        }
    };

    public static async Task<List<TItem>?> ReadListAsync<TItem>(string filePath, CancellationToken cancellationToken)
    {
        var json = await File.ReadAllTextAsync(filePath, cancellationToken);
        return JsonSerializer.Deserialize<List<TItem>>(json, JsonOptions);
    }
}
