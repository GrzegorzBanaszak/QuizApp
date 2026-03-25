namespace QuizApp.Api.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Email { get; set; }
    public string? ExternalId { get; set; }
    public AuthProvider Provider { get; set; }
}
