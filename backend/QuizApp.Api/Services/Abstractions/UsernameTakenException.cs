namespace QuizApp.Api.Services.Abstractions;

public sealed class UsernameTakenException : Exception
{
    public UsernameTakenException() : base("Username is already taken.")
    {
    }
}
