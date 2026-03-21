## 🧩 Plan tworzenia backendu (C# / ASP.NET Core + SignalR)

### 1️⃣ Etap 1: Fundamenty i komunikacja w czasie rzeczywistym

- 📡 Konfiguracja SignalR: Dodanie i konfiguracja SignalR w Program.cs. Utworzenie głównego huba (np. GameHub), przez który aplikacja będzie komunikować się z klientami.

- 🧠 Zarządzanie stanem (Game State): Aplikacje multiplayer wymagają trzymania stanu gry. Na początek wystarczy struktura w pamięci (np. ConcurrentDictionary przechowujący aktywne pokoje, graczy w pokojach, ich punkty i statusy). W przyszłości można to przenieść np. do Redis.

- 🧱 Modele domenowe: Utworzenie klas dla obiektów: Player (ConnectionId, Nick, AvatarUrl, Score, IsReady), Room (RoomId, HostId, NumberOfTopics, Players list, GameState), Question, Topic.

### 2️⃣ Etap 2: Lobby i system pokoi (Pre-game)

- 🏠 Zarządzanie pokojami: Metody huba do tworzenia pokoju, dołączania do pokoju i pobierania listy dostępnych pokoi.

- 🎭 Tworzenie postaci: Połączenie ConnectionId z wpisanym nickiem i wybranym awatarem.

- ⏳ Logika poczekalni (Waiting Room): Zabezpieczenie, aby tylko twórca pokoju (Host) mógł ustawić liczbę tematów.

- ✅ Obsługa przycisku "Gotowy" (Ready). Backend nasłuchuje statusów graczy.

- 🚀 Gdy wszyscy klikną "Start/Ready", backend emituje zdarzenie GameStarted do wszystkich w pokoju.

### 3️⃣ Etap 3: Pętla gry i integracja z AI (Core Loop)

- 🗳️ System głosowania: Backend rozsyła listę dostępnych tematów. Odbiera głosy od graczy, zlicza je i po upływie czasu wyłania zwycięski temat (lub losuje przy remisach).

- 🤖 Integracja z AI: Zbudowanie serwisu (np. IAiQuestionGeneratorService), który po wybraniu tematu uderza do API (np. OpenAI / Gemini) z precyzyjnym promptem (zwróć 6-8 pytań, w formacie JSON, 4 odpowiedzi, 1 poprawna).

#### 🎮 Rozgrywka i punktacja

- 📨 Backend emituje kolejne pytania z puli wygenerowanej przez AI.

- ✍️ Odbieranie odpowiedzi od graczy.

- 🏆 Obliczanie punktów: Logika przyznająca najwięcej punktów pierwszej osobie, która odpowiedziała poprawnie (np. wykorzystanie stempli czasowych od momentu wysłania pytania).

### 4️⃣ Etap 4: Zarządzanie rundami i kończenie gry

- 📊 Podsumowanie rundy: Po wyczerpaniu pytań w danej kategorii, backend podlicza i emituje ranking rundy do frontend'u.

- 🗂️ Zarządzanie pulą tematów: Usunięcie rozegranego tematu z puli. Sprawdzenie, czy rozegrano zaplanowaną liczbę tematów.

#### 🔁 Jeśli NIE

Powrót do ekranu głosowania.

#### 🏁 Jeśli TAK

Emisja zdarzenia GameOver i wysłanie ostatecznej tabeli wyników.

- 🧹 Czyszczenie po grze: Rozwiązanie (zresetowanie) pokoju lub wyrzucenie graczy do głównego lobby i zwolnienie pamięci na backendzie.
