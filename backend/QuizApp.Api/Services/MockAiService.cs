using QuizApp.Api.Models;

namespace QuizApp.Api.Services;

public class MockAiService : IAiQuestionGenerator
{
    public async Task<List<Question>> GenerateQuestionsAsync(string topic, int count = 6)
    {
        // Udajemy, że AI "myśli" przez 3 sekundy
        await Task.Delay(3000);

        var questions = new List<Question>();
        for (int i = 1; i <= count; i++)
        {
            questions.Add(new Question
            {
                Text = $"[Wygenerowane przez AI] Pytanie {i} z tematu: {topic}?",
                Options = new List<string> { "Odp A", "Odp B", "Odp C", "Odp D" },
                CorrectOptionIndex = 0 // Zakładamy dla testów, że A jest zawsze poprawne
            });
        }
        return questions;
    }
}