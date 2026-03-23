export function SingleplayerCta() {
  return (
    <section className="section-shell mb-24 px-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-primary-container to-secondary p-px">
        <div className="flex flex-col items-center rounded-[2rem] bg-surface px-10 py-16 text-center">
          <h2 className="font-headline text-4xl font-black text-on-surface">
            Gotowy na wyzwanie zycia?
          </h2>
          <p className="mt-6 max-w-xl text-on-surface-variant">
            Zagraj w trybie jednoosobowym i udowodnij swoja wiedze. Ranking
            resetuje sie w kazdy poniedzialek o 00:00.
          </p>
          <a
            href="http://localhost:5173"
            className="mt-10 rounded-full bg-primary px-12 py-5 text-xl font-black text-on-primary shadow-[0_15px_40px_-10px_rgba(224,141,255,0.6)] hover:scale-105"
          >
            ZAGRAJ TERAZ ZA DARMO
          </a>
        </div>
      </div>
    </section>
  );
}
