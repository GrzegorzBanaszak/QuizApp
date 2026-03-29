interface CharacterSystemNoticeProps {
  error: string | null;
  isGuestFlow: boolean;
}

export const CharacterSystemNotice = ({
  error,
  isGuestFlow,
}: CharacterSystemNoticeProps) => {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#8ff5ff]">
        System
      </p>
      <h2 className="mt-3 font-headline text-3xl font-black tracking-[-0.04em] text-[#f4d5ff]">
        {isGuestFlow ? "Konto gościa" : "Twój profil jest gotowy"}
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-[#aaa8c4]">
        {isGuestFlow
          ? "Tworzymy lokalne konto gościa. Wybierz nazwę i avatar, a dane z Google/Facebook nie zostaną użyte."
          : "Domyślnie używamy zdjęcia z Google lub Facebooka. Możesz je jednak zastąpić jednym z presetów, zanim zapiszesz postać."}
      </p>
      {error ? (
        <div className="mt-4 rounded-[1.5rem] bg-[#ff6e84]/10 p-4 text-sm text-[#ffb2b9]">
          {error}
        </div>
      ) : null}
    </section>
  );
};
