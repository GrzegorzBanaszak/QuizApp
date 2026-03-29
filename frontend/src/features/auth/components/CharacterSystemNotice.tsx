interface CharacterSystemNoticeProps {
  error: string | null;
}

export const CharacterSystemNotice = ({ error }: CharacterSystemNoticeProps) => {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8ff5ff]">
        System
      </p>
      <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-[#f4d5ff]">
        Edycja profilu
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#aaa8c4]">
        Zmiany zapiszemy wyłącznie dla aktualnie zalogowanego użytkownika.
      </p>
      {error ? (
        <div className="mt-4 rounded-[1.5rem] bg-[#ff6e84]/10 p-4 text-sm text-[#ffb2b9]">
          {error}
        </div>
      ) : null}
    </section>
  );
};
