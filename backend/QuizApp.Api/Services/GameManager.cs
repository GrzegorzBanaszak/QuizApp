using System.Collections.Concurrent;
using QuizApp.Api.Models;

namespace QuizApp.Api.Services;

public class GameManager
{
    private const int MaxPointsPerQuestion = 400;
    private const int MinPointsPerQuestion = 100;
    private const int SpeedPenaltyDivisorMs = 25;

    private static readonly string[] TopicPool =
    {
        "Historia",
        "Geografia",
        "Programowanie",
        "Kino",
        "Gry Komputerowe",
        "Zwierzeta",
        "Kosmos",
        "Sport",
        "Muzyka",
        "Jedzenie"
    };

    public ConcurrentDictionary<string, Room> Rooms { get; } = new();

    public IEnumerable<Room> GetRooms() =>
        Rooms.Values.Where(room => room.Status == RoomStatus.WaitingForPlayers);

    public bool TryGetRoom(string roomId, out Room room)
    {
        return Rooms.TryGetValue(roomId, out room!);
    }

    public Room CreateRoom(string hostConnectionId, string playerName, string avatarUrl)
    {
        while (true)
        {
            var roomId = GenerateRoomId();
            var room = new Room
            {
                RoomId = roomId,
                HostConnectionId = hostConnectionId
            };

            room.Players.TryAdd(hostConnectionId, CreatePlayer(hostConnectionId, playerName, avatarUrl));

            if (Rooms.TryAdd(roomId, room))
            {
                return room;
            }
        }
    }

    public bool TryJoinRoom(string roomId, string connectionId, string playerName, string avatarUrl, out Room? room, out Player? player)
    {
        room = null;
        player = null;

        if (!Rooms.TryGetValue(roomId, out var foundRoom))
        {
            return false;
        }

        player = CreatePlayer(connectionId, playerName, avatarUrl);
        if (!foundRoom.Players.TryAdd(connectionId, player))
        {
            player = null;
            return false;
        }

        room = foundRoom;
        return true;
    }

    public bool TrySetNumberOfTopics(string roomId, string connectionId, int numberOfTopics, out Room? room, out int clampedNumberOfTopics)
    {
        room = null;
        clampedNumberOfTopics = 0;

        if (!Rooms.TryGetValue(roomId, out var foundRoom) || foundRoom.HostConnectionId != connectionId)
        {
            return false;
        }

        clampedNumberOfTopics = Math.Clamp(numberOfTopics, 1, 10);
        foundRoom.NumberOfTopics = clampedNumberOfTopics;
        room = foundRoom;
        return true;
    }

    public bool TrySetReadyStatus(string roomId, string connectionId, bool isReady, out Room? room, out bool canStart)
    {
        room = null;
        canStart = false;

        if (!Rooms.TryGetValue(roomId, out var foundRoom))
        {
            return false;
        }

        if (!foundRoom.Players.TryGetValue(connectionId, out var player))
        {
            return false;
        }

        player.IsReady = isReady;
        canStart = CanStartGame(foundRoom);
        room = foundRoom;
        return true;
    }

    public bool TryStartGame(string roomId, string connectionId, out Room? room)
    {
        room = null;

        if (!Rooms.TryGetValue(roomId, out var foundRoom) || foundRoom.HostConnectionId != connectionId)
        {
            return false;
        }

        if (!CanStartGame(foundRoom))
        {
            return false;
        }

        foundRoom.Status = RoomStatus.Playing;
        room = foundRoom;
        return true;
    }

    public bool CanStartGame(Room room)
    {
        return room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);
    }

    public List<string> StartVotingRound(Room room, int topicsToOffer = 3)
    {
        room.AvailableTopics = TopicPool
            .Except(room.PlayedTopics)
            .OrderBy(_ => Random.Shared.Next())
            .Take(topicsToOffer)
            .ToList();

        room.PlayerVotes.Clear();
        return room.AvailableTopics;
    }

    public bool TrySubmitVote(Room room, string connectionId, string topic, out bool allVotesCast)
    {
        if (!room.Players.ContainsKey(connectionId))
        {
            allVotesCast = false;
            return false;
        }

        room.PlayerVotes.TryAdd(connectionId, topic);
        allVotesCast = room.PlayerVotes.Count == room.Players.Count;
        return true;
    }

    public string ResolveVoting(Room room)
    {
        if (room.PlayerVotes.IsEmpty)
        {
            room.SelectedTopic = string.Empty;
            return string.Empty;
        }

        var winningTopic = room.PlayerVotes.Values
            .GroupBy(v => v)
            .OrderByDescending(g => g.Count())
            .First()
            .Key;

        room.SelectedTopic = winningTopic;
        return winningTopic;
    }

    public bool TryPrepareNextQuestion(Room room, out QuestionDto? questionDto)
    {
        questionDto = null;

        if (room.IsQuestionActive)
        {
            return false;
        }

        if (room.CurrentQuestionIndex >= room.CurrentQuestions.Count)
        {
            return false;
        }

        var question = room.CurrentQuestions[room.CurrentQuestionIndex];

        room.CurrentAnswers.Clear();
        room.IsQuestionActive = true;
        room.CurrentQuestionStartTime = DateTime.UtcNow;
        room.CurrentQuestionEndTime = room.CurrentQuestionStartTime.AddSeconds(30);

        questionDto = new QuestionDto
        {
            Text = question.Text,
            Options = question.Options,
            QuestionNumber = room.CurrentQuestionIndex + 1,
            TotalQuestions = room.CurrentQuestions.Count,
            TimeLimitSeconds = 30,
            StartedAtUtc = room.CurrentQuestionStartTime,
            EndsAtUtc = room.CurrentQuestionEndTime,
            ServerNowUtc = DateTime.UtcNow
        };

        return true;
    }

    public bool TrySubmitAnswer(Room room, string connectionId, int answerIndex, DateTime utcNow)
    {
        if (!room.IsQuestionActive)
        {
            return false;
        }

        if (!room.Players.ContainsKey(connectionId))
        {
            return false;
        }

        if (room.CurrentAnswers.ContainsKey(connectionId))
        {
            return false;
        }

        var timeTaken = (long)(utcNow - room.CurrentQuestionStartTime).TotalMilliseconds;
        return room.CurrentAnswers.TryAdd(connectionId, (timeTaken, answerIndex));
    }

    public bool TryFinalizeQuestion(Room room, out QuestionResultsDto? results)
    {
        results = null;

        lock (room)
        {
            if (!room.IsQuestionActive)
            {
                return false;
            }

            room.IsQuestionActive = false;
        }

        if (room.CurrentQuestionIndex >= room.CurrentQuestions.Count)
        {
            return false;
        }

        var question = room.CurrentQuestions[room.CurrentQuestionIndex];
        var playerResults = new Dictionary<string, QuestionPlayerResultDto>();

        foreach (var player in room.Players.Values)
        {
            var pointsEarned = 0;
            var isCorrect = false;

            if (room.CurrentAnswers.TryGetValue(player.ConnectionId, out var answer))
            {
                isCorrect = answer.AnswerIndex == question.CorrectOptionIndex;

                if (isCorrect)
                {
                    var speedPenalty = (int)(answer.ResponseTimeMs / SpeedPenaltyDivisorMs);
                    pointsEarned = Math.Max(MinPointsPerQuestion, MaxPointsPerQuestion - speedPenalty);
                    player.Score += pointsEarned;
                }
            }

            playerResults[player.ConnectionId] = new QuestionPlayerResultDto
            {
                IsCorrect = isCorrect,
                PointsEarned = pointsEarned,
                TotalScore = player.Score
            };
        }

        room.CurrentQuestionIndex++;
        results = new QuestionResultsDto
        {
            CorrectOptionIndex = question.CorrectOptionIndex,
            PlayerResults = playerResults
        };

        return true;
    }

    public RoundSummaryDto FinalizeRound(Room room)
    {
        if (!string.IsNullOrWhiteSpace(room.SelectedTopic) && !room.PlayedTopics.Contains(room.SelectedTopic))
        {
            room.PlayedTopics.Add(room.SelectedTopic);
        }

        var leaderboard = room.Players.Values
            .OrderByDescending(p => p.Score)
            .Select(p => new LeaderboardEntryDto
            {
                ConnectionId = p.ConnectionId,
                Name = p.Name,
                AvatarUrl = p.AvatarUrl,
                Score = p.Score
            })
            .ToList();

        var isFinished = room.PlayedTopics.Count >= room.NumberOfTopics;
        if (isFinished)
        {
            room.Status = RoomStatus.Finished;
        }

        return new RoundSummaryDto
        {
            Leaderboard = leaderboard,
            CurrentRound = room.PlayedTopics.Count,
            TotalRounds = room.NumberOfTopics,
            JustPlayedTopic = room.SelectedTopic,
            IsFinished = isFinished
        };
    }

    public bool TryRemovePlayerFromAnyRoom(string connectionId, out string? leftRoomId, out Room? leftRoom)
    {
        leftRoomId = null;
        leftRoom = null;

        foreach (var room in Rooms.Values)
        {
            if (!room.Players.TryRemove(connectionId, out _))
            {
                continue;
            }

            leftRoomId = room.RoomId;
            leftRoom = room;

            if (room.Players.IsEmpty)
            {
                Rooms.TryRemove(room.RoomId, out _);
            }

            return true;
        }

        return false;
    }

    private static Player CreatePlayer(string connectionId, string playerName, string avatarUrl)
    {
        return new Player
        {
            ConnectionId = connectionId,
            Name = string.IsNullOrWhiteSpace(playerName) ? "Anonim" : playerName,
            AvatarUrl = avatarUrl
        };
    }

    private static string GenerateRoomId()
    {
        return Guid.NewGuid().ToString("N")[..4].ToUpperInvariant();
    }
}
