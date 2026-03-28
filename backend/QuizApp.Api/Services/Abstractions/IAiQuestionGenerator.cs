using QuizApp.Api.Models;

namespace QuizApp.Api.Services.Abstractions;

public interface IAiQuestionGenerator
{
    // Metoda przyjmująca temat i zwracająca listę pytań
    Task<List<Question>> GenerateQuestionsAsync(string topic, int count = 6);
}
