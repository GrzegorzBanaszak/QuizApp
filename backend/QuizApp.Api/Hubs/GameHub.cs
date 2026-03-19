using Microsoft.AspNetCore.SignalR;
using QuizApp.Api.Models;
using QuizApp.Api.Services;

namespace QuizApp.Api.Hubs;

public class GameHub : Hub<IGameClient>
{
    private readonly GameManager _gameManager;
    private readonly IAiQuestionGenerator _aiService;

    public GameHub(GameManager gameManager, IAiQuestionGenerator aiService)
    {
        _gameManager = gameManager;
        _aiService = aiService;
    }

    // Create a room and immediately add the host to it.
    public async Task CreateRoom(string playerName, string avatarUrl)
    {
        var room = _gameManager.CreateRoom(Context.ConnectionId, playerName, avatarUrl);

        await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);

        await Clients.Caller.RoomCreated(room.RoomId);
        await Clients.Group(room.RoomId).PlayerJoined(room.Players[Context.ConnectionId]);
        await Clients.Group(room.RoomId).UpdatePlayersList(room.Players.Values);

        await BroadcastRoomsList();
    }

    // Join an existing room.
    public async Task JoinRoom(string roomId, string playerName, string avatarUrl)
    {
        if (_gameManager.TryJoinRoom(roomId, Context.ConnectionId, playerName, avatarUrl, out var room, out var player) && room != null && player != null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).PlayerJoined(player);
            await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
        }
        else
        {
            await Clients.Caller.Error("Nie udało się dołączyć do pokoju.");
        }
    }

    public async Task GetAvailableRooms()
    {
        await Clients.Caller.ReceiveRoomsList(_gameManager.GetRooms());
    }

    public async Task SetNumberOfTopics(string roomId, int numberOfTopics)
    {
        if (_gameManager.TrySetNumberOfTopics(roomId, Context.ConnectionId, numberOfTopics, out var room, out var clampedNumberOfTopics) && room != null)
        {
            await Clients.Group(roomId).NumberOfTopicsChanged(clampedNumberOfTopics);
        }
    }

    public async Task SetReadyStatus(string roomId, bool isReady)
    {
        if (_gameManager.TrySetReadyStatus(roomId, Context.ConnectionId, isReady, out var room, out var canStart) && room != null)
        {
            await Clients.Group(roomId).PlayerReadyStatusChanged(Context.ConnectionId, isReady);
            await Clients.Group(roomId).CanStartGame(canStart);
        }
    }

    public async Task StartGame(string roomId)
    {
        if (_gameManager.TryStartGame(roomId, Context.ConnectionId, out var room) && room != null)
        {
            await BroadcastRoomsList();
            await Clients.Group(roomId).GameStarted();
            await StartVotingRound(room);
        }
    }

    private async Task StartVotingRound(Room room)
    {
        var topics = _gameManager.StartVotingRound(room);
        await Clients.Group(room.RoomId).ReceiveVotingTopics(topics);
    }

    public async Task SubmitVote(string roomId, string topic)
    {
        if (_gameManager.TryGetRoom(roomId, out var room))
        {
            if (!_gameManager.TrySubmitVote(room, Context.ConnectionId, topic, out var allVotesCast))
            {
                return;
            }

            await Clients.Group(roomId).PlayerVoted(Context.ConnectionId);

            if (allVotesCast)
            {
                await ProcessVotingResults(room);
            }
        }
    }

    private async Task ProcessVotingResults(Room room)
    {
        var winningTopic = _gameManager.ResolveVoting(room);
        await Clients.Group(room.RoomId).VotingFinished(winningTopic);

        room.CurrentQuestions = await _aiService.GenerateQuestionsAsync(winningTopic, 6);
        room.CurrentQuestionIndex = 0;

        await Clients.Group(room.RoomId).QuestionsGenerated();
    }

    private async Task BroadcastRoomsList()
    {
        await Clients.All.ReceiveRoomsList(_gameManager.GetRooms());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_gameManager.TryRemovePlayerFromAnyRoom(Context.ConnectionId, out var roomId, out var room) && roomId != null)
        {
            if (room != null)
            {
                await Clients.Group(roomId).PlayerLeft(Context.ConnectionId);
                await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
            }

            await BroadcastRoomsList();
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task StartNextQuestion(string roomId)
    {
        if (_gameManager.TryGetRoom(roomId, out var room))
        {
            if (_gameManager.TryPrepareNextQuestion(room, out var questionDto) && questionDto != null)
            {
                await Clients.Group(roomId).ReceiveQuestion(questionDto);

                _ = Task.Run(async () =>
                {
                    await Task.Delay(TimeSpan.FromSeconds(31));
                    await EndQuestion(roomId);
                });
            }
            else
            {
                await EndRound(roomId);
            }
        }
    }

    public async Task SubmitAnswer(string roomId, int answerIndex)
    {
        if (_gameManager.TryGetRoom(roomId, out var room) && room.IsQuestionActive)
        {
            if (!_gameManager.TrySubmitAnswer(room, Context.ConnectionId, answerIndex, DateTime.UtcNow))
            {
                return;
            }

            await Clients.Group(roomId).PlayerAnswered(Context.ConnectionId);

            if (room.CurrentAnswers.Count == room.Players.Count)
            {
                await EndQuestion(roomId);
            }
        }
    }

    private async Task EndQuestion(string roomId)
    {
        if (_gameManager.TryGetRoom(roomId, out var room))
        {
            if (_gameManager.TryFinalizeQuestion(room, out var results) && results != null)
            {
                await Clients.Group(roomId).QuestionResults(results);
            }
        }
    }

    private async Task EndRound(string roomId)
    {
        if (_gameManager.TryGetRoom(roomId, out var room))
        {
            var summary = _gameManager.FinalizeRound(room);

            if (summary.IsFinished)
            {
                await BroadcastRoomsList();
                await Clients.Group(roomId).GameOver(summary.Leaderboard);
            }
            else
            {
                await Clients.Group(roomId).RoundEnded(summary);
            }
        }
    }

    public async Task StartNextRoundVoting(string roomId)
    {
        if (_gameManager.TryGetRoom(roomId, out var room) && room.HostConnectionId == Context.ConnectionId)
        {
            if (room.PlayedTopics.Count < room.NumberOfTopics)
            {
                await StartVotingRound(room);
            }
        }
    }
}
