using System.Collections.Concurrent;
using QuizApp.Api.Models;

namespace QuizApp.Api.Services;

public class GameManager
{
    // Słownik przechowujący aktywne pokoje. Kluczem jest RoomId.
    public ConcurrentDictionary<string, Room> Rooms { get; } = new();

    public string CreateRoom(string hostConnectionId)
    {
        // Generujemy krótki, losowy kod pokoju (np. 4-literowy)
        var roomId = Guid.NewGuid().ToString("N").Substring(0, 4).ToUpper();

        var room = new Room
        {
            RoomId = roomId,
            HostConnectionId = hostConnectionId
        };

        Rooms.TryAdd(roomId, room);
        return roomId;
    }

    public bool RemovePlayerFromAnyRoom(string connectionId, out string? leftRoomId)
    {
        leftRoomId = null;
        foreach (var room in Rooms.Values)
        {
            if (room.Players.TryRemove(connectionId, out _))
            {
                leftRoomId = room.RoomId;

                // Jeśli pokój jest pusty, usuniemy go całkowicie
                if (room.Players.IsEmpty)
                {
                    Rooms.TryRemove(room.RoomId, out _);
                }
                // (Opcjonalnie) Jeśli Host wyszedł, można przepisać hosta na kogoś innego
                return true;
            }
        }
        return false;
    }
}