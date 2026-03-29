interface CharacterNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const CharacterNameField = ({
  value,
  onChange,
}: CharacterNameFieldProps) => {
  return (
    <div className="grid gap-4">
      <label
        htmlFor="nickname"
        className="px-1 text-sm font-bold uppercase tracking-[0.25em] text-[#e08dff]"
      >
        Nazwa użytkownika
      </label>
      <div className="neon-border-focus flex items-stretch rounded-[1.5rem] bg-[#0a0a18] ring-1 ring-[#46465e]/30 transition-shadow">
        <input
          id="nickname"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={20}
          placeholder="Wpisz swój pseudonim..."
          className="h-14 w-full rounded-[1.5rem] border-0 bg-transparent px-5 text-base font-semibold text-[#e5e3ff] outline-none placeholder:text-[#74738d]"
        />
        <div className="flex items-center justify-center px-4 text-[#e08dff]">
          <span className="material-symbols-outlined">edit</span>
        </div>
      </div>
    </div>
  );
};

