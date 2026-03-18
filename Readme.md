# 🎮 QuizApp Multiplayer

Aplikacja do quizów wieloosobowych w czasie rzeczywistym. Gracze mogą dołączać do pokoi, wybierać kategorie i rywalizować ze sobą, odpowiadając na generowane pytania.

## 🛠️ Stos Technologiczny

- **Frontend:** React, Vite, TypeScript, Zustand, React Router
- **Backend:** .NET 9 Web API, SignalR (Real-time komunikacja)
- **Baza Danych / Cache:** Redis (Backplane dla SignalR, stan gry)
- **Infrastruktura:** Proxmox (Ubuntu Server), Docker, Terraform
- **AI:** OpenAI API / Lokalny LLM (Ollama) do generowania pytań

## 📁 Struktura Projektu

- `/backend` - Kod źródłowy API w .NET oraz Huby SignalR.
- `/frontend` - Aplikacja kliencka w React/Vite.
- `/infrastructure` - Skrypty Terraform do wdrażania na serwer Proxmox.

## Diagram rozgrywki

```mermaid
flowchart TD
    Start([Start Aplikacji]) --> Lobby[Wyświetlenie listy pokoi]
    Lobby --> WyborPokoju[Wybór pokoju z listy lub stworzenie nowego]
    WyborPokoju --> TworzeniePostaci[Tworzenie postaci: wpisanie nicku i wybór zdjęcia]
    TworzeniePostaci --> Poczekalnia[Poczekalnia / Pokój gry]

    Poczekalnia --> HostAkcja{Host wybiera liczbę tematów}
    HostAkcja --> WszyscyGotowi{Czy wszyscy kliknęli START?}

    WszyscyGotowi -- Nie --> Oczekiwanie[Oczekiwanie na graczy]
    Oczekiwanie --> WszyscyGotowi

    WszyscyGotowi -- Tak --> GlosowanieNaTemat[Ekran głosowania na pierwszą/kolejną tematykę]

    GlosowanieNaTemat --> GlosowanieAkcja[Gracze oddają głosy]
    GlosowanieAkcja --> WyborTematu[Wyłonienie zwycięskiego tematu]

    WyborTematu --> GeneracjaAI[AI generuje 6-8 pytań z 4 wariantami odpowiedzi]

    GeneracjaAI --> PokazPytanie[Wyświetlenie pytania]
    PokazPytanie --> Odpowiedzi[Gracze odpowiadają na czas]
    Odpowiedzi --> PrzyznaniePunktow[Przyznanie punktów: najszybsza poprawna = najwięcej pkt]

    PrzyznaniePunktow --> CzyWiecejPytan{Czy są jeszcze pytania w tym temacie?}
    CzyWiecejPytan -- Tak --> PokazPytanie

    CzyWiecejPytan -- Nie --> PodsumowanieKategorii[Plansza podsumowująca wyniki z danej kategorii]

    PodsumowanieKategorii --> CzyKoniecGry{Czy to była ostatnia kategoria/runda?}

    CzyKoniecGry -- Nie --> UsunTemat[Usunięcie wykorzystanego tematu z puli]
    UsunTemat --> GlosowanieNaTemat

    CzyKoniecGry -- Tak --> TabelaKoncowa[Wyświetlenie końcowej tabeli wyników]
    TabelaKoncowa --> PowrotLobby([Powrót do Lobby])
```
