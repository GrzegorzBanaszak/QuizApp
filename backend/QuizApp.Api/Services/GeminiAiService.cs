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
            var prompt = BuildPrompt(topic, count);

            var requestBody = new
            {
                contents = new[]
                {
                    new { parts = new[] { new { text = prompt } } }
                },
                generationConfig = new
                {
                    temperature = 0.9,
                    topP = 0.95,
                    topK = 40
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

    private static string BuildPrompt(string topic, int count)
    {
        return $@"
You are a quiz question generator.
Generate exactly {count} questions about: ""{topic}"".

Requirements:
- Return ONLY a raw JSON array, no Markdown, no comments, no code fences.
- Use Polish language only for every question, answer option, and scenario text.
- Every item must contain exactly these fields: Text, Options, CorrectOptionIndex.
- Options must contain exactly 4 answers.
- CorrectOptionIndex must be an integer from 0 to 3.
- Make the questions diverse in style: definition, comparison, example, application, fact recognition, short scenario.
- Do not repeat the same wording pattern or start two questions with the same opening.
- If the topic is broad, spread the questions across different subtopics instead of using one narrow angle.
- Keep distractors plausible and similar in length so the answer is not obvious by formatting alone.
- Avoid questions that are too hard, but do not make them trivial or repetitive.
- Control difficulty distribution:
  - For 6 questions, make exactly 3 easy, 2 medium, and 1 medium-hard.
  - If the requested count is different from 6, keep the same approximate ratio: 50% easy, 33% medium, 17% medium-hard.
  - Easy questions should ask about basic facts or simple recognition.
  - Medium questions should require a bit of comparison, reasoning, or recall.
  - Medium-hard questions should require combining two facts or making a short inference, but still remain fair.
- Do not use options like ""all of the above"" or ""none of the above"".

Example item:
{{
  ""Text"": ""Sample question?"",
  ""Options"": [""Option A"", ""Option B"", ""Option C"", ""Option D""],
  ""CorrectOptionIndex"": 0
}}";
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
