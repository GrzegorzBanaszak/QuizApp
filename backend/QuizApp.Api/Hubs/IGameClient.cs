using QuizApp.Api.Models;

namespace QuizApp.Api.Hubs;

// Ten interfejs definiuje, co potrafi odebrać frontend
public interface IGameClient
{
    Task RoomCreated(string roomId);
    Task ReceiveRoomsList(IEnumerable<Room> rooms);
    Task PlayerJoined(Player player);
    Task UpdatePlayersList(IEnumerable<Player> players);
    Task PlayerLeft(string connectionId);
    Task NumberOfTopicsChanged(int numberOfTopics);
    Task PlayerReadyStatusChanged(string connectionId, bool isReady);
    Task GameStarted();
    Task ReceiveVotingTopics(List<string> topics);
    Task PlayerVoted(string connectionId);
    Task VotingFinished(string winningTopic);
    Task QuestionsGenerated();
    Task ReceiveQuestion(QuestionDto question);
    Task QuestionTimeExpired();
    Task PlayerAnswered(string connectionId);
    Task QuestionResults(object results);
    Task RoundEnded(object roundSummary);
    Task GameOver(object leaderboard);
    Task Error(string message);
    Task CanStartGame(bool canStart);
}
