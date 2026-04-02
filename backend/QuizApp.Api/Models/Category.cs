namespace QuizApp.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ICollection<Level> Levels { get; set; } = new List<Level>();
    public ICollection<SingleplayerQuestion> Questions { get; set; } = new List<SingleplayerQuestion>();
}
