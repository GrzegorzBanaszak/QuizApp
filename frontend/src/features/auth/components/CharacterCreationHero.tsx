interface CharacterCreationHeroProps {
  title: string;
  description: string;
}

export const CharacterCreationHero = ({
  title,
  description,
}: CharacterCreationHeroProps) => {
  return (
    <header className="mx-auto w-full max-w-3xl text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#8ff5ff]">
        Auth / Character Setup
      </p>
      <h1 className="bg-gradient-to-r from-[#e08dff] via-[#d978ff] to-[#ff68a7] bg-clip-text font-headline text-4xl font-black tracking-[-0.04em] text-transparent sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#aaa8c4] sm:text-lg">
        {description}
      </p>
    </header>
  );
};

