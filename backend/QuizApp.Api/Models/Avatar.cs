namespace QuizApp.Api.Models;

public class Avatar
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public AvatarUnlockType UnlockType { get; set; } = AvatarUnlockType.Default;
    public string? RequiredLevelKey { get; set; }
    public string? RequiredAchievementCode { get; set; }
    public int Price { get; set; }
    public ICollection<UserOwnedAvatar> Owners { get; set; } = new List<UserOwnedAvatar>();
    public ICollection<User> SelectedByUsers { get; set; } = new List<User>();
}
