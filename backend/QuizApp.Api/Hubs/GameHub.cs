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
        var roomId = _gameManager.CreateRoom(Context.ConnectionId);

        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            var player = CreatePlayer(playerName, avatarUrl);
            room.Players.TryAdd(Context.ConnectionId, player);

            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Caller.RoomCreated(roomId);
            await Clients.Group(roomId).PlayerJoined(player);
            await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
        }

        await BroadcastRoomsList();
    }

    // Join an existing room.
    public async Task JoinRoom(string roomId, string playerName, string avatarUrl)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            var player = CreatePlayer(playerName, avatarUrl);

            room.Players.TryAdd(Context.ConnectionId, player);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            await Clients.Group(roomId).PlayerJoined(player);
            await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
        }
        else
        {
            await Clients.Caller.Error("Nie znaleziono takiego pokoju.");
        }
    }

    public async Task GetAvailableRooms()
    {
        await Clients.Caller.ReceiveRoomsList(_gameManager.Rooms.Values);
    }

    public async Task SetNumberOfTopics(string roomId, int numberOfTopics)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (room.HostConnectionId == Context.ConnectionId)
            {
                room.NumberOfTopics = Math.Clamp(numberOfTopics, 1, 10);
                await Clients.Group(roomId).NumberOfTopicsChanged(room.NumberOfTopics);
            }
        }
    }

    public async Task SetReadyStatus(string roomId, bool isReady)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (room.Players.TryGetValue(Context.ConnectionId, out var player))
            {
                player.IsReady = isReady;
                await Clients.Group(roomId).PlayerReadyStatusChanged(Context.ConnectionId, isReady);

                bool canStart = room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);
                await Clients.Group(roomId).CanStartGame(canStart);
            }
        }
    }

    public async Task StartGame(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room) && room.HostConnectionId == Context.ConnectionId)
        {
            bool canStart = room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);
            if (canStart)
            {
                room.Status = RoomStatus.Playing;
                await BroadcastRoomsList();
                await Clients.Group(roomId).GameStarted();
                await StartVotingRound(roomId);
            }
        }
    }

    private async Task StartVotingRound(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            var allTopics = new List<string> {
                "Historia", "Geografia", "Programowanie", "Kino",
                "Gry Komputerowe", "Zwierzeta", "Kosmos", "Sport", "Muzyka", "Jedzenie"
            };

            var random = new Random();

            room.AvailableTopics = allTopics
                .Except(room.PlayedTopics)
                .OrderBy(x => random.Next())
                .Take(3)
                .ToList();

            room.PlayerVotes.Clear();
            await Clients.Group(roomId).ReceiveVotingTopics(room.AvailableTopics);
        }
    }

    public async Task SubmitVote(string roomId, string topic)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            room.PlayerVotes.TryAdd(Context.ConnectionId, topic);
            await Clients.Group(roomId).PlayerVoted(Context.ConnectionId);

            if (room.PlayerVotes.Count == room.Players.Count)
            {
                await ProcessVotingResults(roomId, room);
            }
        }
    }

    private async Task ProcessVotingResults(string roomId, Room room)
    {
        var winningTopic = room.PlayerVotes.Values
            .GroupBy(v => v)
            .OrderByDescending(g => g.Count())
            .First().Key;

        room.SelectedTopic = winningTopic;
        await Clients.Group(roomId).VotingFinished(winningTopic);

        room.CurrentQuestions = await _aiService.GenerateQuestionsAsync(winningTopic, 6);
        room.CurrentQuestionIndex = 0;

        await Clients.Group(roomId).QuestionsGenerated();
    }

    private async Task BroadcastRoomsList()
    {
        await Clients.All.ReceiveRoomsList(_gameManager.Rooms.Values);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_gameManager.RemovePlayerFromAnyRoom(Context.ConnectionId, out var roomId) && roomId != null)
        {
            if (_gameManager.Rooms.TryGetValue(roomId, out var room))
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
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (room.CurrentQuestionIndex < room.CurrentQuestions.Count)
            {
                var question = room.CurrentQuestions[room.CurrentQuestionIndex];

                var questionDto = new QuestionDto
                {
                    Text = question.Text,
                    Options = question.Options,
                    QuestionNumber = room.CurrentQuestionIndex + 1,
                    TotalQuestions = room.CurrentQuestions.Count,
                    TimeLimitSeconds = 30
                };

                room.CurrentAnswers.Clear();
                room.IsQuestionActive = true;
                room.CurrentQuestionStartTime = DateTime.UtcNow;

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
        if (_gameManager.Rooms.TryGetValue(roomId, out var room) && room.IsQuestionActive)
        {
            if (room.CurrentAnswers.ContainsKey(Context.ConnectionId)) return;

            var timeTaken = (long)(DateTime.UtcNow - room.CurrentQuestionStartTime).TotalMilliseconds;
            room.CurrentAnswers.TryAdd(Context.ConnectionId, (timeTaken, answerIndex));

            await Clients.Group(roomId).PlayerAnswered(Context.ConnectionId);

            if (room.CurrentAnswers.Count == room.Players.Count)
            {
                await EndQuestion(roomId);
            }
        }
    }

    private async Task EndQuestion(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            lock (room)
            {
                if (!room.IsQuestionActive) return;
                room.IsQuestionActive = false;
            }

            var question = room.CurrentQuestions[room.CurrentQuestionIndex];
            var results = new Dictionary<string, object>();

            foreach (var player in room.Players.Values)
            {
                int pointsEarned = 0;
                bool isCorrect = false;

                if (room.CurrentAnswers.TryGetValue(player.ConnectionId, out var answer))
                {
                    isCorrect = (answer.AnswerIndex == question.CorrectOptionIndex);

                    if (isCorrect)
                    {
                        int speedPenalty = (int)(answer.ResponseTimeMs / 10);
                        pointsEarned = Math.Max(100, 1000 - speedPenalty);
                        player.Score += pointsEarned;
                    }
                }

                results.Add(player.ConnectionId, new
                {
                    IsCorrect = isCorrect,
                    PointsEarned = pointsEarned,
                    TotalScore = player.Score
                });
            }

            await Clients.Group(roomId).QuestionResults(new
            {
                CorrectOptionIndex = question.CorrectOptionIndex,
                PlayerResults = results
            });

            room.CurrentQuestionIndex++;
        }
    }

    private async Task EndRound(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (!string.IsNullOrWhiteSpace(room.SelectedTopic) && !room.PlayedTopics.Contains(room.SelectedTopic))
            {
                room.PlayedTopics.Add(room.SelectedTopic);
            }

            var leaderboard = room.Players.Values
                .OrderByDescending(p => p.Score)
                .Select(p => new
                {
                    ConnectionId = p.ConnectionId,
                    Name = p.Name,
                    AvatarUrl = p.AvatarUrl,
                    Score = p.Score
                })
                .ToList();

            if (room.PlayedTopics.Count >= room.NumberOfTopics)
            {
                room.Status = RoomStatus.Finished;
                await BroadcastRoomsList();
                await Clients.Group(roomId).GameOver(leaderboard);
            }
            else
            {
                await Clients.Group(roomId).RoundEnded(new
                {
                    Leaderboard = leaderboard,
                    CurrentRound = room.PlayedTopics.Count,
                    TotalRounds = room.NumberOfTopics,
                    JustPlayedTopic = room.SelectedTopic
                });
            }
        }
    }

    public async Task StartNextRoundVoting(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room) && room.HostConnectionId == Context.ConnectionId)
        {
            if (room.PlayedTopics.Count < room.NumberOfTopics)
            {
                await StartVotingRound(roomId);
            }
        }
    }

    private Player CreatePlayer(string playerName, string avatarUrl)
    {
        return new Player
        {
            ConnectionId = Context.ConnectionId,
            Name = string.IsNullOrWhiteSpace(playerName) ? "Anonim" : playerName,
            AvatarUrl = avatarUrl
        };
    }
}
