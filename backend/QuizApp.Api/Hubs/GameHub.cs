using Microsoft.AspNetCore.SignalR;
using QuizApp.Api.Models;
using QuizApp.Api.Services;

namespace QuizApp.Api.Hubs;

public class GameHub : Hub
{
    private readonly GameManager _gameManager;



    // Wstrzykiwanie zależności (Dependency Injection)
    public GameHub(GameManager gameManager)
    {
        _gameManager = gameManager;
    }

    // 1. Tworzenie nowego pokoju
    public async Task CreateRoom()
    {
        var roomId = _gameManager.CreateRoom(Context.ConnectionId);

        // Zwracamy Hostowi informację, jaki ma kod pokoju
        await Clients.Caller.SendAsync("RoomCreated", roomId);

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
            await Clients.Group(roomId).SendAsync("PlayerJoined", player);
            await Clients.Group(roomId).SendAsync("UpdatePlayersList", room.Players.Values);
        }
        else
        {
            // Informujemy klienta, że pokój nie istnieje
            await Clients.Caller.SendAsync("Error", "Nie znaleziono takiego pokoju.");
        }
    }

    // 3. Pobieranie listy pokoi (np. gdy ktoś wchodzi do głównego Lobby)
    public async Task GetAvailableRooms()
    {
        await Clients.Caller.SendAsync("ReceiveRoomsList", _gameManager.Rooms.Values);
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
                await Clients.Group(roomId).SendAsync("NumberOfTopicsChanged", room.NumberOfTopics);
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
                await Clients.Group(roomId).SendAsync("PlayerReadyStatusChanged", Context.ConnectionId, isReady);

                // Sprawdzamy, czy gra może wystartować (wymagamy np. min. 2 graczy i wszyscy muszą być gotowi)
                bool canStart = room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);

                // Jeśli wszyscy są gotowi, możemy odblokować przycisk "Start" u Hosta
                await Clients.Group(roomId).SendAsync("CanStartGame", canStart);
            }
        }
    }

    // 6. Host klika "Start" i rozpoczyna grę
    public async Task StartGame(string roomId)
    {
        if (_gameManager.Rooms.TryGetValue(roomId, out var room))
        {
            // Tylko host może wystartować grę
            if (room.HostConnectionId == Context.ConnectionId)
            {
                // Upewniamy się jeszcze raz, że wszyscy są gotowi
                bool canStart = room.Players.Count >= 2 && room.Players.Values.All(p => p.IsReady);

                if (canStart)
                {
                    room.Status = RoomStatus.Playing; // Zmieniamy status pokoju

                    // Odświeżamy listę pokoi w głównym lobby (żeby inni widzieli, że w tym pokoju gra już trwa)
                    await BroadcastRoomsList();

                    // EMITUJEMY START GRY DO WSZYSTKICH W POKOJU
                    await Clients.Group(roomId).SendAsync("GameStarted");
                }
            }
        }
    }
    // Pomocnicza metoda do rozsyłania listy pokoi do wszystkich
    private async Task BroadcastRoomsList()
    {
        await Clients.All.SendAsync("ReceiveRoomsList", _gameManager.Rooms.Values);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Jeśli gracz się odłączy (zamknie kartę itp.), usuwamy go ze stanu gry
        if (_gameManager.RemovePlayerFromAnyRoom(Context.ConnectionId, out var roomId) && roomId != null)
        {
            // Powiadamiamy resztę graczy w pokoju, że ktoś wyszedł
            if (_gameManager.Rooms.TryGetValue(roomId, out var room))
            {
                await Clients.Group(roomId).SendAsync("PlayerLeft", Context.ConnectionId);
                await Clients.Group(roomId).SendAsync("UpdatePlayersList", room.Players.Values);
            }

            // Odświeżamy listę pokoi (bo mógł zniknąć pokój, jeśli był pusty)
            await BroadcastRoomsList();
        }

        await base.OnDisconnectedAsync(exception);
    }
}