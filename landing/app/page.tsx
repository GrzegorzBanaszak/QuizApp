import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
        QuizApp
      </h1>
      <p className="text-xl text-slate-300 mb-8 text-center max-w-2xl">
        Najlepsza platforma do quizów generowanych przez AI. Zmierz się ze
        znajomymi i sprawdź swoją wiedzę!
      </p>

      <div className="flex gap-4">
        {/* Tu w przyszłości podepniesz link do właściwej gry, np. app.quizapp.pl */}
        <a
          href="http://localhost:5173"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Graj teraz
        </a>
      </div>

      {/* Wykorzystanie Twojego obrazka hero.png */}
      <div className="mt-16 w-full max-w-4xl opacity-80 hover:opacity-100 transition-opacity"></div>
    </main>
  );
}
