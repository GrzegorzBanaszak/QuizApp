namespace QuizApp.Api.Services;

public sealed class UsernameTakenException : Exception
{
    public UsernameTakenException() : base("Username is already taken.")
    {
    }
}
