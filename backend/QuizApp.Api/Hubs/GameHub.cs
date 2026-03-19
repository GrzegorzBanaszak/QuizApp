using Microsoft.AspNetCore.SignalR;
using QuizApp.Api.Models;
using QuizApp.Api.Services;

namespace QuizApp.Api.Hubs;

public class GameHub : Hub<IGameClient>
{
    private readonly GameManager _gameManager;
    private readonly IAiQuestionGenerator _aiService;

    // Wstrzykiwanie zależności (Dependency Injection)
    public GameHub(GameManager gameManager, IAiQuestionGenerator aiService)
    {
        _gameManager = gameManager;
        _aiService = aiService;
    }

    // 1. Tworzenie nowego pokoju
    public async Task CreateRoom()
    {
        var roomId = _gameManager.CreateRoom(Context.ConnectionId);

        // Zwracamy Hostowi informację, jaki ma kod pokoju
        await Clients.Caller.RoomCreated(roomId);

        // Aktualizujemy wszystkim klientom listę dostępnych pokoi
        await BroadcastRoomsList();
    }

    // 2. Dołączanie do pokoju wraz z tworzeniem postaci (nick, avatar)
    public async Task JoinRoom(string roomId, string playerName, string avatarUrl)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            var player = new Player
            {
                ConnectionId = Context.ConnectionId,
                Name = string.IsNullOrWhiteSpace(playerName) ? "Anonim" : playerName,
                AvatarUrl = avatarUrl
            };

            room.Players.TryAdd(Context.ConnectionId, player);

            // Dodajemy połączenie SignalR do "Grupy". Dzięki temu możemy wysyłać wiadomości 
            // tylko do osób w konkretnym pokoju!
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            // Informujemy wszystkich W TYM POKOJU, kto dołączył oraz wysyłamy aktualną listę graczy
            await Clients.Group(roomId).PlayerJoined(player);
            await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
        }
        else
        {
            // Informujemy klienta, że pokój nie istnieje
            await Clients.Caller.Error("Nie znaleziono takiego pokoju.");
        }
    }

    // 3. Pobieranie listy pokoi (np. gdy ktoś wchodzi do głównego Lobby)
    public async Task GetAvailableRooms()
    {
        await Clients.Caller.ReceiveRoomsList(_gameManager.Rooms.Values);
    }

    // 4. Host ustawia liczbę tematów
    public async Task SetNumberOfTopics(string roomId, int numberOfTopics)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // Zabezpieczenie: tylko Host może zmienić tę wartość
            if (room.HostConnectionId == Context.ConnectionId)
            {
                // Zabezpieczenie przed dziwnymi wartościami (np. min 1, max 10)
                room.NumberOfTopics = Math.Clamp(numberOfTopics, 1, 10);

                // Wysyłamy nową wartość do wszystkich w pokoju, by zaktualizował się interfejs
                await Clients.Group(roomId).NumberOfTopicsChanged(room.NumberOfTopics);
            }
        }
    }

    // 5. Gracz klika przycisk "Gotowy" / "Nie gotowy"
    public async Task SetReadyStatus(string roomId, bool isReady)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (room.Players.TryGetValue(Context.ConnectionId, out var player))
            {
                player.IsReady = isReady;

                // Informujemy wszystkich w pokoju, że ten konkretny gracz zmienił status
                await Clients.Group(roomId).PlayerReadyStatusChanged(Context.ConnectionId, isReady);

                // Sprawdzamy, czy gra może wystartować (wymagamy np. min. 2 graczy i wszyscy muszą być gotowi)
                bool canStart = room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);

                // Jeśli wszyscy są gotowi, możemy odblokować przycisk "Start" u Hosta
                await Clients.Group(roomId).CanStartGame(canStart);
            }
        }
    }

    // 6. Host klika "Start" i rozpoczyna grę
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

                // Od razu po starcie gry, inicjujemy pierwszą rundę głosowania
                await StartVotingRound(roomId);
            }
        }
    }

    // Pomocnicza metoda generująca tematy i wysyłająca je graczom
    private async Task StartVotingRound(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // Powiększyliśmy pulę, żeby na pewno starczyło tematów na kilka rund
            var allTopics = new List<string> {
                "Historia", "Geografia", "Programowanie", "Kino",
                "Gry Komputerowe", "Zwierzęta", "Kosmos", "Sport", "Muzyka", "Jedzenie"
            };

            var random = new Random();

            // KLUCZOWA ZMIANA: Wykluczamy tematy, które są już w PlayedTopics!
            room.AvailableTopics = allTopics
                .Except(room.PlayedTopics)
                .OrderBy(x => random.Next())
                .Take(3)
                .ToList();

            room.PlayerVotes.Clear();

            // Wysyłamy do graczy listę 3 nowych tematów do głosowania
            await Clients.Group(roomId).ReceiveVotingTopics(room.AvailableTopics);
        }
    }

    // Gracz przesyła swój głos na dany temat
    public async Task SubmitVote(string roomId, string topic)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // Rejestrujemy głos gracza
            room.PlayerVotes.TryAdd(Context.ConnectionId, topic);

            // Powiadamiamy (opcjonalnie), że ktoś oddał głos, żeby na frontendzie zaktualizować licznik oddanych głosów
            await Clients.Group(roomId).PlayerVoted(Context.ConnectionId);

            // Sprawdzamy, czy wszyscy już zagłosowali
            if (room.PlayerVotes.Count == room.Players.Count)
            {
                await ProcessVotingResults(roomId, room);
            }
        }
    }

    // Obliczanie wyników i generowanie pytań
    private async Task ProcessVotingResults(string roomId, Room room)
    {
        //TODO Trzeba dodać zabezpieczenie gdy kilka tematów będzie mieć ten sam wynik
        // Zliczamy głosy: Grupujemy po nazwie tematu, sortujemy malejąco po ilości i bierzemy pierwszy
        var winningTopic = room.PlayerVotes.Values
            .GroupBy(v => v)
            .OrderByDescending(g => g.Count())
            .First().Key;

        room.SelectedTopic = winningTopic;

        // Informujemy front-end: "Głosowanie zakończone, wygrał temat X! AI myśli..."
        await Clients.Group(roomId).VotingFinished(winningTopic);

        // Wywołujemy nasz serwis AI do wygenerowania 6 pytań!
        // Uwaga: To zajmie kilka sekund (w Mocku mamy 3 sekundy opóźnienia)
        room.CurrentQuestions = await _aiService.GenerateQuestionsAsync(winningTopic, 6);
        room.CurrentQuestionIndex = 0;

        // Pytania gotowe! Informujemy front-end, że za moment startujemy z pierwszym pytaniem.
        await Clients.Group(roomId).QuestionsGenerated();

        // (W następnym kroku zrobimy logikę wypychania pierwszego pytania)
    }
    // Pomocnicza metoda do rozsyłania listy pokoi do wszystkich
    private async Task BroadcastRoomsList()
    {
        await Clients.All.ReceiveRoomsList(_gameManager.Rooms.Values);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Jeśli gracz się odłączy (zamknie kartę itp.), usuwamy go ze stanu gry
        if (_gameManager.RemovePlayerFromAnyRoom(Context.ConnectionId, out var roomId) && roomId != null)
        {
            // Powiadamiamy resztę graczy w pokoju, że ktoś wyszedł
            if (_gameManager.Rooms.TryGetValue(roomId, out var room))
            {
                await Clients.Group(roomId).PlayerLeft(Context.ConnectionId);
                await Clients.Group(roomId).UpdatePlayersList(room.Players.Values);
            }

            // Odświeżamy listę pokoi (bo mógł zniknąć pokój, jeśli był pusty)
            await BroadcastRoomsList();
        }

        await base.OnDisconnectedAsync(exception);
    }

    // 1. Rozpoczęcie kolejnego pytania
    public async Task StartNextQuestion(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            if (room.CurrentQuestionIndex < room.CurrentQuestions.Count)
            {
                var question = room.CurrentQuestions[room.CurrentQuestionIndex];

                // Przygotowujemy bezpieczny obiekt dla frontendu
                var questionDto = new QuestionDto
                {
                    Text = question.Text,
                    Options = question.Options,
                    QuestionNumber = room.CurrentQuestionIndex + 1,
                    TotalQuestions = room.CurrentQuestions.Count,
                    TimeLimitSeconds = 30 // Dajemy graczom 30 sekund
                };

                // Resetujemy stan dla nowego pytania
                room.CurrentAnswers.Clear();
                room.IsQuestionActive = true;
                room.CurrentQuestionStartTime = DateTime.UtcNow;

                // Wysyłamy pytanie do graczy
                await Clients.Group(roomId).ReceiveQuestion(questionDto);

                // Opcjonalnie: Uruchamiamy "odliczanie" po stronie serwera
                // W tle czekamy 30 sekund (plus 1 sekunda zapasu na opóźnienia sieci)
                _ = Task.Run(async () =>
                {
                    await Task.Delay(TimeSpan.FromSeconds(31));
                    await EndQuestion(roomId);
                });
            }
            else
            {
                // Wyczerpano pytania w tym temacie - koniec rundy!
                await EndRound(roomId);
            }
        }
    }

    // 2. Gracz przesyła swoją odpowiedź
    public async Task SubmitAnswer(string roomId, int answerIndex)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room) && room.IsQuestionActive)
        {
            // Zabezpieczenie przed wielokrotnym odpowiadaniem
            if (room.CurrentAnswers.ContainsKey(Context.ConnectionId)) return;

            // Obliczamy ile milisekund minęło od wyświetlenia pytania
            var timeTaken = (long)(DateTime.UtcNow - room.CurrentQuestionStartTime).TotalMilliseconds;

            room.CurrentAnswers.TryAdd(Context.ConnectionId, (timeTaken, answerIndex));

            // Informujemy pokój, że ten gracz już odpowiedział (np. żeby wyszarzyć jego awatar)
            await Clients.Group(roomId).PlayerAnswered(Context.ConnectionId);

            // Jeśli wszyscy odpowiedzieli, od razu kończymy pytanie (nie czekamy na timer)
            if (room.CurrentAnswers.Count == room.Players.Count)
            {
                await EndQuestion(roomId);
            }
        }
    }

    // 3. Koniec czasu na pytanie lub wszyscy odpowiedzieli
    private async Task EndQuestion(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // Upewniamy się, że podliczamy pytanie tylko raz
            lock (room)
            {
                if (!room.IsQuestionActive) return;
                room.IsQuestionActive = false;
            }

            var question = room.CurrentQuestions[room.CurrentQuestionIndex];

            // Podliczamy punkty i przygotowujemy podsumowanie dla frontendu
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
                        // Prosty algorytm punktacji:
                        // Baza 1000 pkt. Tracisz 1 pkt za każde 10 milisekund (im wolniej, tym mniej).
                        // Minimalnie za dobrą odpowiedź dostaniesz 100 pkt.
                        int speedPenalty = (int)(answer.ResponseTimeMs / 10);
                        pointsEarned = Math.Max(100, 1000 - speedPenalty);

                        player.Score += pointsEarned; // Dodajemy punkty do globalnego wyniku gracza
                    }
                }

                results.Add(player.ConnectionId, new
                {
                    IsCorrect = isCorrect,
                    PointsEarned = pointsEarned,
                    TotalScore = player.Score
                });
            }

            // Wysyłamy do graczy prawidłową odpowiedź i to, ile punktów zdobyli
            await Clients.Group(roomId).QuestionResults(new
            {
                CorrectOptionIndex = question.CorrectOptionIndex,
                PlayerResults = results
            });

            // Przechodzimy do kolejnego pytania
            room.CurrentQuestionIndex++;
        }
    }

    private async Task EndRound(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // 1. Dodajemy obecny temat do puli rozegranych
            if (!string.IsNullOrWhiteSpace(room.SelectedTopic) && !room.PlayedTopics.Contains(room.SelectedTopic))
            {
                room.PlayedTopics.Add(room.SelectedTopic);
            }

            // 2. Generujemy ranking (sortujemy graczy po punktach malejąco)
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

            // 3. Sprawdzamy, czy osiągnęliśmy limit rund (tematów)
            if (room.PlayedTopics.Count >= room.NumberOfTopics)
            {
                // --- KONIEC GRY ---
                room.Status = RoomStatus.Finished;

                // Odświeżamy listę pokoi w lobby (żeby pokój zniknął lub miał status Zakończony)
                await BroadcastRoomsList();

                // Wysyłamy ostateczną tabelę wyników
                await Clients.Group(roomId).GameOver(leaderboard);
            }
            else
            {
                // --- KONIEC RUNDY (GRAMY DALEJ) ---

                // Wysyłamy częściowy ranking po danej kategorii
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
    // Wywoływane przez Hosta z ekranu podsumowania rundy
    public async Task StartNextRoundVoting(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room) && room.HostConnectionId == Context.ConnectionId)
        {
            // Opcjonalne zabezpieczenie stanu
            if (room.PlayedTopics.Count < room.NumberOfTopics)
            {
                await StartVotingRound(roomId);
            }
        }
    }
}