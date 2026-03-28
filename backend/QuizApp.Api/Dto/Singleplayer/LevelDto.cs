namespace QuizApp.Api.Dto.Singleplayer;

public sealed record LevelDto
{
    public int Id { get; init; }
    public int CategoryId { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Difficulty { get; init; } = string.Empty;
    public bool IsUnlocked { get; init; }
}
