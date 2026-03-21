# 🎮 QuizApp Multiplayer

QuizApp to multiplayerowa aplikacja do quizow w czasie rzeczywistym. Gracze moga tworzyc lub dolaczac do pokoi, wybierac avatary, glosowac na temat rundy i odpowiadac na pytania generowane przez AI.

## ✨ Co jest w projekcie

- 🏠 lobby z lista dostepnych pokoi
- 🔑 tworzenie i dolaczanie do pokoju po kodzie
- 🧑‍🚀 wybor avatara i nazwy gracza
- ✅ status gotowosci graczy i start gry przez hosta
- 🗳️ glosowanie na temat rundy
- 🤖 generowanie pytan przez Gemini
- ⏱️ pytania na czas z punktacja zalezna od szybkosci odpowiedzi
- 📊 podsumowanie rundy i koncowa tabela wynikow
- 🎉 ekran koncowy z rankingiem i konfetti

## 🛠️ Stack

- Frontend: React 19, Vite, TypeScript, Zustand, React Router, SignalR, Framer Motion, Tailwind CSS 4
- Backend: .NET 9 Web API, SignalR
- AI: Gemini API przez `GeminiAiService`
- Testy frontendowe: Vitest
- Testy backendowe: xUnit
- Infrastruktura: Docker i Terraform

## 📁 Struktura repozytorium

- `backend/` - API w .NET, hub SignalR, modele i serwisy
- `frontend/` - aplikacja kliencka w React/Vite
- `infrastructure/` - konfiguracja Terraform dla kontenerow Docker

## 🧭 Jak to dziala

1. Gracz wchodzi do menu i tworzy pokoj albo dolacza do istniejacego kodem.
2. Host ustawia liczbe tematow rundy, a gracze oznaczaja sie jako gotowi.
3. Po starcie gry pokoj przechodzi do glosowania na temat.
4. Po wygranym glosowaniu backend pobiera 6 pytan z Gemini.
5. Pytania sa wysylane po kolei przez SignalR, a punkty sa przyznawane za poprawna i szybka odpowiedz.
6. Po zakonczeniu puli pytan pokazywane jest podsumowanie rundy.
7. Po rozegraniu wszystkich tematow aplikacja pokazuje finalny ranking.

## ⚙️ Backend

- 📡 Hub SignalR jest pod `POST/WS` na `/gameHub`
- ❤️ Endpoint zdrowia jest dostepny pod `/health`
- 🖼️ Statyczne avatary sa serwowane z `backend/QuizApp.Api/wwwroot/avatars`
- 🧠 Stan gry jest aktualnie trzymany w pamieci przez `GameManager`
- 🔌 W projekcie jest dodana integracja z `Microsoft.AspNetCore.SignalR.StackExchangeRedis`, ale obecna konfiguracja `Program.cs` nie podpina Redis jako backplane
- 🛟 AI ma fallback, wiec przy braku odpowiedzi z Gemini backend moze zwrocic awaryjne pytania

## 🎨 Frontend

- Domyslny adres huba to `http://localhost:5211/gameHub`
- Mozna go nadpisac przez `VITE_SIGNALR_URL`
- Widoki w aplikacji:
  - `Menu`
  - `Lobby`
  - `Voting`
  - `Game`
  - `RoundSummary`
  - `GameOver`

## 🚀 Uruchomienie lokalne

### 🧩 Backend

```powershell
dotnet run --project backend/QuizApp.Api
```

Domyslny profil HTTP nasluchuje na `http://localhost:5211`, a HTTPS na `https://localhost:7183`.

### 🌐 Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend domyslnie startuje na `http://localhost:5173`.

## 🤖 Konfiguracja AI

W pliku `backend/QuizApp.Api/appsettings.json` lub przez user secrets ustaw:

```json
{
  "Gemini": {
    "ApiKey": "twoj-klucz",
    "Model": "gemini-2.5-flash"
  }
}
```

## 🏗️ Infrastruktura

Folder `infrastructure/` zawiera konfiguracje Terraform dla kontenerow Docker. W obecnym stanie obejmuje m.in. Redis, Nginx Proxy Manager i Pi-hole oraz placeholdery dla kontenerow aplikacji.

## 🧪 Testy

- Backend: `dotnet test backend/QuizApp.sln`
- Frontend: `cd frontend && npm test`

## 🖼️ Avatary

- wrzucaj pliki do `backend/QuizApp.Api/wwwroot/avatars`
- frontend pobiera je pod adresem `http(s)://<adres-backendu>/avatars/nazwa-pliku.png`

## Do zrobienia

- Integracja z redis
- Strona głowna przedstawiająca zasady gry i rozgrywkę
