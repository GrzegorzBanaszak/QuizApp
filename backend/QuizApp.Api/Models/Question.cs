namespace QuizApp.Api.Models;

public class Question
{
    public string Text { get; set; } = string.Empty;
    public List<string> Options { get; set; } = new(); // Dokładnie 4 warianty
    public int CorrectOptionIndex { get; set; } // Indeks poprawnej odpowiedzi (0-3)
}