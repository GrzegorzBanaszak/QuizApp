using System.Text;
using System.Text.Json;
using QuizApp.Api.Models;

namespace QuizApp.Api.Services;

public class GeminiAiService : IAiQuestionGenerator
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _modelName;

    public GeminiAiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["Gemini:ApiKey"] ?? throw new ArgumentNullException("Brak klucza Gemini w appsettings.json");
        _modelName = configuration["Gemini:Model"] ?? "gemini-2.5-flash";
    }

    public async Task<List<Question>> GenerateQuestionsAsync(string topic, int count = 6)
    {
        try
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_modelName}:generateContent";

            var prompt = $@"
Jesteś generatorem pytań do quizu. Wygeneruj {count} pytań na temat: '{topic}'.
Zwróć wynik TYLKO i WYŁĄCZNIE jako czystą tablicę JSON, bez żadnego formatowania Markdown, bez bloków ```json.
Struktura pojedynczego obiektu w tablicy musi wyglądać dokładnie tak:
{{
  ""Text"": ""Treść pytania?"",
  ""Options"": [""Odp A"", ""Odp B"", ""Odp C"", ""Odp D""],
  ""CorrectOptionIndex"": 0
}}
Upewnij się, że CorrectOptionIndex to liczba od 0 do 3 wskazująca na poprawną odpowiedź w tablicy Options. Odpowiedzi powinny być sensowne, a pytania nie za trudne.";

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
            };
            request.Headers.Add("x-goog-api-key", _apiKey);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Gemini API returned {(int)response.StatusCode} {response.ReasonPhrase}: {errorBody}");
                return GetFallbackQuestions(topic, count);
            }

            var responseString = await response.Content.ReadAsStringAsync();

            using var jsonDocument = JsonDocument.Parse(responseString);
            var generatedText = jsonDocument.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(generatedText))
                return GetFallbackQuestions(topic, count);

            try
            {
                var cleanJson = generatedText.Replace("```json", "").Replace("```", "").Trim();
                var questions = JsonSerializer.Deserialize<List<Question>>(cleanJson);
                return questions ?? GetFallbackQuestions(topic, count);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Błąd parsowania JSON z AI: {ex.Message}");
                return GetFallbackQuestions(topic, count);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Błąd podczas łączenia z Gemini API: {ex.Message}");
            return GetFallbackQuestions(topic, count);
        }
    }

    private List<Question> GetFallbackQuestions(string topic, int count)
    {
        var list = new List<Question>();
        for (int i = 0; i < count; i++)
        {
            list.Add(new Question
            {
                Text = $"[Awaryjne] Pytanie {i + 1} o {topic}?",
                Options = new List<string> { "A", "B", "C", "D" },
                CorrectOptionIndex = 0
            });
        }

        return list;
    }
}
