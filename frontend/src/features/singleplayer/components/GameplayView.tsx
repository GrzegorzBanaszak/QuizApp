import { singleplayerMockData, useSingleplayerStore } from "../store/singleplayerStore";

export const GameplayView = () => {
  const selectedAnswerIndex = useSingleplayerStore(
    (state) => state.selectedAnswerIndex,
  );
  const selectAnswer = useSingleplayerStore((state) => state.selectAnswer);
  const finishQuestion = useSingleplayerStore((state) => state.finishQuestion);
  const surrender = useSingleplayerStore((state) => state.surrender);
  const question = singleplayerMockData.question;

  return (
    <div className="flex min-h-screen flex-col bg-[#0c0c21] text-[#e5e3ff]">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-[#0c0c21]/80 px-6 py-4 shadow-[0_0_20px_rgba(224,141,255,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#e08dff]">timer</span>
          <span className="font-headline text-xl font-bold tracking-tight">
            00:24
          </span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#e08dff] to-[#ff68a7] bg-clip-text text-2xl font-black tracking-tight text-transparent">
          QuizVolt
        </div>
        <div className="flex items-center gap-6">
          <span className="font-headline hidden font-bold tracking-tight text-[#aaa8c4] md:block">
            Pytanie 5 z 15
          </span>
          <div className="rounded-full border border-[#e08dff]/20 bg-[#29294a] px-4 py-1.5">
            <span className="font-headline font-bold tracking-tight text-[#e08dff]">
              1,240 pkt
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#e08dff]/20 to-transparent" />
      </header>

      <main className="relative mb-24 mt-16 flex flex-grow flex-col items-center justify-center overflow-hidden p-6">
        <div className="absolute left-[-8rem] top-1/4 h-96 w-96 rounded-full bg-[#e08dff]/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-[-8rem] h-96 w-96 rounded-full bg-[#ff68a7]/5 blur-[120px]" />

        <div className="w-full max-w-4xl space-y-12">
          <div className="glass-panel group relative overflow-hidden rounded-[2rem] p-10 md:p-16">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e08dff]/10 blur-[80px]" />
            <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#e08dff] to-[#ff68a7]" />
            <div className="absolute right-6 top-6 flex items-center gap-2 rounded-[1rem] border border-white/10 bg-[#232341] px-3 py-1">
              <span className="material-symbols-outlined text-sm text-[#8ff5ff]">
                auto_awesome
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#aaa8c4]">
                {question.aiLabel}
              </span>
            </div>
            <h1 className="font-headline text-center text-3xl font-extrabold leading-tight tracking-tight text-[#e5e3ff] md:text-5xl">
              {question.prompt}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {question.answers.map((answer, index) => {
              const isSelected = selectedAnswerIndex === index;

              return (
                <button
                  key={answer}
                  type="button"
                  onClick={() => selectAnswer(index)}
                  className={`group relative flex items-center gap-6 rounded-[2rem] border p-6 text-left transition-all active:scale-95 ${
                    isSelected
                      ? "border-[#e08dff]/60 bg-[#29294a] shadow-[0_0_20px_rgba(224,141,255,0.3)]"
                      : "border-white/10 bg-[#171730] hover:border-[#e08dff]/60 hover:bg-[#29294a]"
                  }`}
                >
                  <span
                    className={`font-headline flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border text-xl font-black transition-colors ${
                      isSelected
                        ? "border-[#e08dff] bg-[#e08dff] text-[#4f006c]"
                        : "border-[#e08dff]/30 bg-[#232341] text-[#e08dff] group-hover:bg-[#e08dff] group-hover:text-[#4f006c]"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={`text-lg font-medium md:text-xl ${
                      isSelected ? "text-[#e5e3ff]" : "text-[#aaa8c4]"
                    }`}
                  >
                    {answer}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAnswerIndex !== null ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={finishQuestion}
                className="rounded-full bg-gradient-to-r from-[#e08dff] to-[#d978ff] px-10 py-4 font-headline text-sm font-black tracking-[0.2em] text-[#4f006c] shadow-[0_0_30px_rgba(224,141,255,0.35)] transition-all hover:scale-[1.02]"
              >
                POKAŻ WYNIK
              </button>
            </div>
          ) : null}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-center bg-transparent pb-10">
        <button
          type="button"
          onClick={surrender}
          className="flex items-center justify-center rounded-full px-8 py-3 text-[#aaa8c4] opacity-70 transition-all duration-200 hover:bg-[#ff68a7]/10 hover:text-[#ff68a7] hover:opacity-100 active:scale-95"
        >
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined mb-1 text-2xl">
              logout
            </span>
            <span className="font-headline text-xs font-medium uppercase tracking-widest">
              Poddaj się
            </span>
          </div>
        </button>
      </nav>
    </div>
  );
};
