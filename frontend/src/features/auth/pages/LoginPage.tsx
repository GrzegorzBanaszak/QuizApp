import { Link } from "react-router";
import { AuthLoginSection } from "../components/AuthLoginSection";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const session = useAuthStore((state) => state.session);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c21] px-4 py-6 text-[#e5e3ff] sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#e08dff]/12 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] max-h-[28rem] max-w-[28rem] rounded-full bg-[#ff68a7]/12 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-8">
        <header className="text-center">
          <div className="mb-4 inline-block">
            <span className="bg-gradient-to-r from-[#e08dff] to-[#ff68a7] bg-clip-text font-headline text-3xl font-black italic tracking-tight text-transparent md:text-5xl">
              QuizVolt
            </span>
          </div>
          <h1 className="font-headline text-4xl font-black uppercase tracking-[-0.04em] text-[#f4d5ff] md:text-6xl">
            Logowanie
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-medium tracking-wide text-[#aaa8c4] md:text-lg">
            {session
              ? "Masz już aktywną sesję. Możesz wrócić do gry albo przejść do edycji profilu."
              : "Wybierz sposób logowania, aby zapisać postępy i odblokować katalogi gracza."}
          </p>
        </header>

        <div className="flex w-full justify-center">
          <AuthLoginSection />
        </div>

        <div className="flex justify-center">
          <Link
            to="/"
            className="rounded-full border border-[#46465e]/40 bg-[#111128]/80 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#aaa8c4] transition-colors hover:border-[#e08dff]/40 hover:text-[#e5e3ff]"
          >
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </div>
  );
};
