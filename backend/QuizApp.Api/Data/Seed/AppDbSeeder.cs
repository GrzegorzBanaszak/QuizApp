using Microsoft.EntityFrameworkCore;
using QuizApp.Api.Models;

namespace QuizApp.Api.Data.Seed;

public static class AppDbSeeder
{
    private const string CategoryName = "Geografia Polski";

    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        await context.Database.MigrateAsync(cancellationToken);

        var categoryExists = await context.Categories
            .AsNoTracking()
            .AnyAsync(category => category.Name == CategoryName, cancellationToken);

        if (categoryExists)
        {
            return;
        }

        var category = new Category
        {
            Name = CategoryName,
            Description = "Zestaw pytań singleplayer o geografii Polski z trzema poziomami trudności."
        };

        foreach (var level in BuildLevels())
        {
            category.Levels.Add(level);
        }

        foreach (var question in BuildQuestions())
        {
            category.Questions.Add(question);
        }

        context.Categories.Add(category);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static IEnumerable<Level> BuildLevels()
    {
        return
        [
            new Level
            {
                Name = "Poziom 1",
                Order = 1,
                QuestionDistributions =
                [
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.Easy, Count = 4 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.EasyMedium, Count = 4 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.Medium, Count = 2 }
                ]
            },
            new Level
            {
                Name = "Poziom 2",
                Order = 2,
                QuestionDistributions =
                [
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.EasyMedium, Count = 2 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.Medium, Count = 4 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.MediumHard, Count = 4 }
                ]
            },
            new Level
            {
                Name = "Poziom 3",
                Order = 3,
                QuestionDistributions =
                [
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.Medium, Count = 2 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.MediumHard, Count = 4 },
                    new LevelQuestionDistribution { Difficulty = QuestionDifficulty.Hard, Count = 4 }
                ]
            }
        ];
    }

    private static IEnumerable<SingleplayerQuestion> BuildQuestions()
    {
        return BuildDefinitions()
            .Select((definition, index) => CreateQuestion(index + 1, definition))
            .ToList();
    }

    private static SingleplayerQuestion CreateQuestion(int questionNumber, QuestionSeedDefinition definition)
    {
        var question = new SingleplayerQuestion
        {
            Difficulty = definition.Difficulty,
            Text = definition.Text,
            CorrectAnswerId = BuildAnswerId(questionNumber, definition.CorrectAnswerIndex)
        };

        for (var answerIndex = 0; answerIndex < definition.Answers.Length; answerIndex++)
        {
            question.Answers.Add(new SingleplayerAnswer
            {
                Id = BuildAnswerId(questionNumber, answerIndex),
                Text = definition.Answers[answerIndex]
            });
        }

        return question;
    }

    private static string BuildAnswerId(int questionNumber, int answerIndex)
    {
        return $"geo-pl-q{questionNumber:D2}-{(char)('a' + answerIndex)}";
    }

    private static QuestionSeedDefinition[] BuildDefinitions()
    {
        return
        [
            new(QuestionDifficulty.Easy, "Stolicą Polski jest:", 0, "Warszawa", "Kraków", "Gdańsk", "Poznań"),
            new(QuestionDifficulty.Easy, "Najdłuższa rzeka w Polsce to:", 0, "Wisła", "Odra", "Bug", "San"),
            new(QuestionDifficulty.Easy, "Jakie morze leży na północy Polski?", 0, "Morze Bałtyckie", "Morze Czarne", "Morze Adriatyckie", "Morze Północne"),
            new(QuestionDifficulty.Easy, "W jakich górach leży Zakopane?", 0, "Tatry", "Bieszczady", "Sudety", "Beskidy"),
            new(QuestionDifficulty.Easy, "W którym mieście znajduje się Wawel?", 0, "Kraków", "Lublin", "Toruń", "Szczecin"),
            new(QuestionDifficulty.Easy, "Z którym krajem Polska graniczy na zachodzie?", 0, "Niemcy", "Litwa", "Ukraina", "Słowacja"),
            new(QuestionDifficulty.Easy, "Największe jezioro w Polsce to:", 0, "Śniardwy", "Mamry", "Hańcza", "Jeziorak"),
            new(QuestionDifficulty.Easy, "Przez które miasto przepływa Wisła?", 0, "Warszawa", "Legnica", "Wałbrzych", "Gdynia"),
            new(QuestionDifficulty.Easy, "Ile województw ma Polska?", 0, "16", "12", "14", "18"),
            new(QuestionDifficulty.Easy, "Stolicą województwa małopolskiego jest:", 0, "Kraków", "Kielce", "Rzeszów", "Katowice"),

            new(QuestionDifficulty.EasyMedium, "Najwyższy szczyt Polski to:", 0, "Rysy", "Giewont", "Śnieżka", "Kasprowy Wierch"),
            new(QuestionDifficulty.EasyMedium, "Przez które miasto przepływa Odra?", 0, "Wrocław", "Olsztyn", "Zakopane", "Siedlce"),
            new(QuestionDifficulty.EasyMedium, "Na jakim półwyspie leży Hel?", 0, "Półwysep Helski", "Półwysep Sambijski", "Półwysep Jutlandzki", "Półwysep Apeniński"),
            new(QuestionDifficulty.EasyMedium, "Stolicą województwa dolnośląskiego jest:", 0, "Wrocław", "Opole", "Zielona Góra", "Białystok"),
            new(QuestionDifficulty.EasyMedium, "W którym województwie leży Białystok?", 0, "Podlaskie", "Lubelskie", "Mazowieckie", "Warmińsko-mazurskie"),
            new(QuestionDifficulty.EasyMedium, "Który park narodowy słynie z ruchomych wydm?", 0, "Słowiński Park Narodowy", "Biebrzański Park Narodowy", "Kampinoski Park Narodowy", "Ojcowski Park Narodowy"),
            new(QuestionDifficulty.EasyMedium, "Które miasto nazywane jest stolicą Podhala?", 0, "Zakopane", "Nowy Sącz", "Sanok", "Krosno"),
            new(QuestionDifficulty.EasyMedium, "Najgłębsze jezioro w Polsce to:", 0, "Hańcza", "Śniardwy", "Niegocin", "Roś"),
            new(QuestionDifficulty.EasyMedium, "W którym mieście znajduje się fontanna Neptuna?", 0, "Gdańsk", "Szczecin", "Elbląg", "Toruń"),
            new(QuestionDifficulty.EasyMedium, "W jakim województwie leżą Mazury?", 0, "Warmińsko-mazurskie", "Pomorskie", "Podlaskie", "Kujawsko-pomorskie"),

            new(QuestionDifficulty.Medium, "W jakim paśmie górskim leży Śnieżka?", 0, "Karkonosze", "Tatry", "Pieniny", "Bieszczady"),
            new(QuestionDifficulty.Medium, "Jak nazywa się pustynia położona w południowej Polsce?", 0, "Pustynia Błędowska", "Pustynia Siedlecka", "Pustynia Notecka", "Pustynia Karpacka"),
            new(QuestionDifficulty.Medium, "W którym parku narodowym żyją słynne żubry?", 0, "Białowieski Park Narodowy", "Tatrzański Park Narodowy", "Drawieński Park Narodowy", "Wigierski Park Narodowy"),
            new(QuestionDifficulty.Medium, "Przez które miasto przepływa rzeka Brda?", 0, "Bydgoszcz", "Radom", "Zamość", "Przemyśl"),
            new(QuestionDifficulty.Medium, "Która rzeka przepływa przez Poznań?", 0, "Warta", "Wisła", "San", "Bóbr"),
            new(QuestionDifficulty.Medium, "Na jakich wyspach leży Świnoujście?", 0, "Uznam i Wolin", "Wolin i Sobieszewo", "Uznam i Rugia", "Uznam i Bornholm"),
            new(QuestionDifficulty.Medium, "Jakie miasto jest stolicą województwa warmińsko-mazurskiego?", 0, "Olsztyn", "Ełk", "Elbląg", "Suwałki"),
            new(QuestionDifficulty.Medium, "Przez które miasto przepływa rzeka San?", 0, "Przemyśl", "Płock", "Konin", "Kalisz"),
            new(QuestionDifficulty.Medium, "W jakim paśmie leży Tarnica?", 0, "Bieszczady", "Sudety", "Beskid Śląski", "Góry Świętokrzyskie"),
            new(QuestionDifficulty.Medium, "Które miasto leży nad Wisłą?", 0, "Toruń", "Jelenia Góra", "Leszno", "Bielsko-Biała"),

            new(QuestionDifficulty.MediumHard, "Najniżej położony punkt w Polsce znajduje się w:", 0, "Raczkach Elbląskich", "Suwałkach", "Ustce", "Zakopanem"),
            new(QuestionDifficulty.MediumHard, "Źródła Wisły znajdują się na stokach:", 0, "Baraniej Góry", "Łysej Góry", "Tarnicy", "Śnieżnika"),
            new(QuestionDifficulty.MediumHard, "W jakim paśmie leży Babia Góra?", 0, "Beskid Żywiecki", "Góry Izerskie", "Pieniny", "Tatry Wysokie"),
            new(QuestionDifficulty.MediumHard, "Która rzeka uchodzi do Zalewu Szczecińskiego?", 0, "Odra", "Wisła", "San", "Pilica"),
            new(QuestionDifficulty.MediumHard, "Jak nazywa się kraina obejmująca okolice Elbląga i Malborka?", 0, "Żuławy Wiślane", "Pojezierze Lubuskie", "Kotlina Sandomierska", "Polesie Lubelskie"),
            new(QuestionDifficulty.MediumHard, "W jakim województwie leży Bieszczadzki Park Narodowy?", 0, "Podkarpackie", "Małopolskie", "Lubelskie", "Śląskie"),
            new(QuestionDifficulty.MediumHard, "Jakie miasto jest znane z położenia nad jeziorem Niegocin?", 0, "Giżycko", "Augustów", "Chojnice", "Włocławek"),
            new(QuestionDifficulty.MediumHard, "Który szczyt jest najwyższy w Sudetach?", 0, "Śnieżka", "Szrenica", "Łysica", "Turbacz"),
            new(QuestionDifficulty.MediumHard, "W którym województwie leży Park Narodowy Ujście Warty?", 0, "Lubuskie", "Wielkopolskie", "Zachodniopomorskie", "Opolskie"),
            new(QuestionDifficulty.MediumHard, "Które miasto leży u ujścia Motławy do Wisły?", 0, "Gdańsk", "Gdynia", "Kołobrzeg", "Darłowo"),

            new(QuestionDifficulty.Hard, "Jak nazywa się przełom Dunajca będący atrakcją Pienin?", 0, "Przełom Dunajca", "Przełom Sanu", "Przełom Popradu", "Przełom Warty"),
            new(QuestionDifficulty.Hard, "Łysica jest najwyższym szczytem których gór?", 0, "Gór Świętokrzyskich", "Gór Izerskich", "Bieszczadów", "Pienin"),
            new(QuestionDifficulty.Hard, "Stolicą województwa zachodniopomorskiego jest:", 0, "Szczecin", "Koszalin", "Świnoujście", "Kołobrzeg"),
            new(QuestionDifficulty.Hard, "W którym parku narodowym znajduje się Trzy Korony?", 0, "Pieniński Park Narodowy", "Gorczański Park Narodowy", "Karkonoski Park Narodowy", "Roztoczański Park Narodowy"),
            new(QuestionDifficulty.Hard, "Która rzeka przepływa przez Szczecin?", 0, "Odra", "Bug", "Narew", "Dunajec"),
            new(QuestionDifficulty.Hard, "Półwysep Helski oddziela Bałtyk od:", 0, "Zatoki Puckiej", "Zalewu Wiślanego", "Jeziora Łebsko", "Zalewu Szczecińskiego"),
            new(QuestionDifficulty.Hard, "Jak nazywa się najwyższy szczyt Beskidów?", 0, "Babia Góra", "Skrzyczne", "Radziejowa", "Luboń Wielki"),
            new(QuestionDifficulty.Hard, "W jakim województwie leży Puszcza Białowieska?", 0, "Podlaskie", "Lubuskie", "Pomorskie", "Śląskie"),
            new(QuestionDifficulty.Hard, "Które miasto leży nad rzeką Noteć?", 0, "Piła", "Zakopane", "Sopot", "Jelenia Góra"),
            new(QuestionDifficulty.Hard, "Jak nazywa się mierzeja oddzielająca Zalew Wiślany od Zatoki Gdańskiej?", 0, "Mierzeja Wiślana", "Mierzeja Helska", "Mierzeja Łebska", "Mierzeja Wolińska")
        ];
    }

    private sealed record QuestionSeedDefinition(
        QuestionDifficulty Difficulty,
        string Text,
        int CorrectAnswerIndex,
        params string[] Answers);
}
