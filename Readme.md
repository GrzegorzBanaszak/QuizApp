# QuizVolt

QuizVolt to aplikacja quizowa rozwijana jako zestaw trzech warstw:

- `frontend/` - główna aplikacja gracza w React i Vite
- `backend/` - API w .NET 9 z logiką postępu, katalogami i singleplayerem
- `landing/` - osobny serwis marketingowy w Next.js

Adres aplikacji: [app.quiz-volt.pl](https://app.quiz-volt.pl)

Obecny stan projektu skupia się na rozgrywce singleplayer oraz systemie profilu gracza. Tryby `multiplayer` i `party` są już widoczne w interfejsie, ale nadal pełnią rolę ekranów zapowiadających kolejne etapy prac.

## Zakres funkcjonalny

### Dostępne teraz

- logowanie jako gość oraz przez Google i Facebook
- profil gracza z edycją nazwy, avatara, monet i doświadczenia
- singleplayer oparty o kategorie, poziomy i pytania zdefiniowane w danych seedujących
- zapisywanie wyników, naliczanie XP i awansów poziomów
- system osiągnięć z postępem, nagrodami i automatyczną ewaluacją po ukończeniu gry
- katalog avatarów z podziałem na domyślne, kupowane za monety i odblokowywane osiągnięciami
- katalog osiągnięć z filtrowaniem i podglądem warunków odblokowania
- automatyczne migracje bazy i seedowanie danych przy starcie API

### W przygotowaniu

- tryb `multiplayer` z pokojami i synchronizacją graczy w czasie rzeczywistym
- tryb `party` z osobnym widokiem wspólnego ekranu i urządzeń graczy

## Architektura

### Frontend

Główna aplikacja gracza jest zbudowana w `React 19`, `TypeScript`, `Vite`, `React Router` i `Zustand`. Interfejs obejmuje:

- ekran główny z wyborem trybu
- logowanie i tworzenie postaci
- profil gracza oraz edycję profilu
- katalog avatarów
- katalog osiągnięć
- pełny przepływ singleplayer: wybór kategorii, wybór poziomu, rozgrywka i ekran wyniku

W kodzie nadal znajduje się zależność `@microsoft/signalr`, ale bieżąca wersja produktu nie używa jeszcze aktywnej rozgrywki realtime w warstwie UI.

### Backend

API jest zbudowane w `ASP.NET Core 9`, korzysta z `Entity Framework Core`, `PostgreSQL`, `AutoMapper` i uwierzytelniania JWT w cookie lub nagłówku `Bearer`.

Najważniejsze obszary backendu:

- `AuthController` - logowanie gościa i weryfikacja dostawców społecznościowych
- `UserController` - odczyt i edycja profilu aktualnego użytkownika
- `SingleplayerController` - kategorie, poziomy, sesje gry i wysyłka wyników
- `AchievementsController` - katalog osiągnięć wraz z postępem gracza
- `AvatarController` - katalog avatarów, wybór aktywnego avatara i zakup

API automatycznie:

- uruchamia migracje bazy danych
- seeduje kategorie, poziomy, pytania singleplayer, osiągnięcia i avatary
- wystawia endpoint zdrowia pod `/health`
- serwuje statyczne assety avatarów pod `/images/avatars`, jeśli wskazano ścieżkę fizyczną

### Landing

`landing/` to oddzielna aplikacja w `Next.js 16`, przygotowana jako publiczna warstwa prezentacyjna dla produktu. Repo zawiera osobne strony opisujące landing główny oraz podstrony dla trybów `singleplayer`, `multiplayer` i `party`.

## Dane i domena

Model domenowy obecnie obejmuje przede wszystkim:

- użytkowników z providerem logowania, monetami, XP i wybranym avatarem
- katalog avatarów z typami odblokowania: domyślne, zakup i osiągnięcie
- katalog osiągnięć z warunkami opartymi o ukończenie poziomów i kategorii
- kategorie singleplayer, poziomy i rozkład trudności pytań
- sesje gry singleplayer oraz historię wyników

Dane startowe znajdują się w `backend/QuizApp.Api/SeedData/` i są ładowane do bazy przy starcie aplikacji.

## Struktura repozytorium

- `backend/QuizApp.Api/` - główne API, modele, kontrolery, serwisy, migracje i dane seedujące
- `backend/QuizApp.Tests/` - testy backendowe dla logiki progresji i odblokowania avatarów
- `frontend/` - aplikacja użytkownika
- `landing/` - strona marketingowa
- `infrastructure/local/` - lokalna infrastruktura Docker/Terraform w starszym wariancie roboczym
- `infrastructure/azure/` - aktualna infrastruktura Terraform dla wdrożenia z PostgreSQL, reverse proxy i uploadem assetów avatarów
- `assets/avatars/` - pliki avatarów wykorzystywane przy wdrożeniu

## Stack

- frontend aplikacji: React 19, Vite, TypeScript, Zustand, React Router, Framer Motion
- landing: Next.js 16, React 19, TypeScript
- backend: ASP.NET Core 9, Entity Framework Core, PostgreSQL, AutoMapper
- uwierzytelnianie: JWT, Google OAuth, Facebook auth
- testy: Vitest po stronie frontendu, xUnit po stronie backendu
- infrastruktura: Docker i Terraform

## Status projektu

Repozytorium nie jest już zgodne ze starszym opisem aplikacji multiplayer opartej głównie o SignalR i generowanie pytań przez AI. Aktualny rdzeń produktu to konto gracza, kolekcje i singleplayer z trwałym postępem, a funkcje wieloosobowe są na razie przygotowane na poziomie nawigacji, projektu interfejsu i infrastruktury pod dalszy rozwój.
