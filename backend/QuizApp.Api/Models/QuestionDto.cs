namespace QuizApp.Api.Models;

// Obiekt, który bezpiecznie wysyłamy na frontend
public class QuestionDto
{
    public string Text { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new();
    public int QuestionNumber { get; set; } // np. 1 (dla informacji "Pytanie 1/6")
    public int TotalQuestions { get; set; }
    public int TimeLimitSeconds { get; set; } = 20; // Czas na odpowiedź
}