const categories = [
  {
    title: "Popkultura",
    description:
      "Najnowsze trendy, filmy i muzyka, ktora ksztaltuje wspolczesna scene.",
    badge: "Sredni",
    badgeClass: "bg-primary/20 text-primary border-primary/30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfkCPs_txh7k_sK6CAtNYFGwLm3aPs5HUdS2zvczxCJwGXmC5YSKuLFNW9GfypZNPFUJP8UcB3PSr_wUUzfB2D020UvXMu8xK04CtRB_MepAXwQKFp-v0HnO5rrAYZ6N786VwAlijQVbBe4VfYADrc9h3oH0qiY-eV8gDLbJy3kluJneszCpiI6K7AWQztEeO37gU6dh6A9nV_r53hL3weN3xZdNubMx6_7iXwGyHV7I-43Xg-SUy8BBNgjt4VypLrqZzg_FqyGbOU",
    shellClass: "md:col-span-2 md:row-span-2 p-8",
    titleClass: "text-4xl",
    descriptionClass: "max-w-md text-sm",
  },
  {
    title: "Nauka",
    description: "Eksperymenty, odkrycia i fakty, ktore testuja precyzje myslenia.",
    badge: "Trudny",
    badgeClass: "bg-tertiary/20 text-tertiary border-tertiary/30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCnkpGtKupDLVug2GPvu06unJ7tAQEGOHlwpKZBZC2_oNHF-bspE3wLJ5l6i_fUCP1AmamWRSBq92QqwmhhF2644T4yx2vst_riBn42mIMwazXihX5lMdTgiryrT1_a3DkZYj0BGOEpAKQkhITJqo29Q4gJwwXNZWN76vRzfNN9I4gvt9xfw-pwzDSVwv2nSETZ9qXYmGD2Ap9ITReZzu78a7vdzZOGaJ-R1T6cMz-xjQ2NcULK1dT9q88Kw6pGyKrRPlj4KUBaLAaS",
    shellClass: "p-6",
    titleClass: "text-xl",
    descriptionClass: "text-xs",
  },
  {
    title: "Gry",
    description: "Od klasykow po nowosci, dla graczy ktorzy sa zawsze o level wyzej.",
    badge: "Latwy",
    badgeClass: "bg-secondary/20 text-secondary border-secondary/30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBonCS6X-WLJfhqa5s6zzatnl6lo2Q7PKAMNBuSL1zugH2XKZMjKqw5lKgHNTET2rrti2ee7Py22clsJKUbHXc0dQlehXcQl7zy_RPRrdM15FKnIU7-Lb4I2fUojWjZShXr12ZMdtC4ewjwdrEyNN2ISrZHBorS4q8nnfnyjzD0L8-buQ_djhty51mODzSxdyUpf0_Gns67Vy9PoY6C_RQiKryRDEXeq0KS5cW7V4y-e0jgMUdJwCZEdrzD7jD9KHYXDvMJw5kK3VdI",
    shellClass: "p-6",
    titleClass: "text-xl",
    descriptionClass: "text-xs",
  },
  {
    title: "Historia",
    description:
      "Podrozuj w czasie i sprawdz swoja wiedze o wydarzeniach, ludziach i epokach.",
    badge: "Sredni",
    badgeClass: "bg-primary/20 text-primary border-primary/30",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvy6SY8YeV7WJYWsPMtEIXamLk9Hcy_dYNFVIUwVKZEXLtfJfnSyCJXr2kYu0lbDxFEn-8KVRDS5Onvrp7YGZ2N9A2E7uA6Ul96X5nzo7zSIHh4WDIp9vEBYs80FEprptbL2sih1LR9hG0QeYqtftnb6mdAnCBsGuLrInNNuYJc4TDYsU-hJgFSFaAicj0CdGtaE8fpDntOFGpUAOUu-4qovlRHK2INj7nsFhMmFl_xyWxvTqFQNE84nITQm7FMFWUR0lIOlnZceKC",
    shellClass: "md:col-span-2 p-8",
    titleClass: "text-2xl",
    descriptionClass: "text-xs",
  },
];

export function SingleplayerCategories() {
  return (
    <section id="kategorie" className="section-shell px-6 py-20">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-headline text-3xl font-black text-on-surface">
            Kategorie Quizow
          </h2>
          <p className="mt-2 text-on-surface-variant">
            Wybierz specjalizacje i zbieraj punkty doswiadczenia.
          </p>
        </div>

        <div className="rounded-full bg-surface-container-high p-3 text-on-surface-variant">
          18+
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:h-[600px] md:grid-cols-4 md:grid-rows-2">
        {categories.map((category) => (
          <article
            key={category.title}
            className={`group relative overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container ${category.shellClass}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
            <img
              alt={category.title}
              src={category.image}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="relative z-10 flex h-full flex-col justify-end">
              <span
                className={`w-fit rounded-md border px-3 py-1 text-[10px] font-bold ${category.badgeClass}`}
              >
                {category.badge}
              </span>
              <h3
                className={`mt-4 font-headline font-black text-on-surface ${category.titleClass}`}
              >
                {category.title}
              </h3>
              <p
                className={`mt-2 leading-relaxed text-on-surface-variant ${category.descriptionClass}`}
              >
                {category.description}
              </p>
              <a
                href="http://localhost:5173"
                className="mt-6 inline-flex items-center gap-2 font-bold text-primary group-hover:gap-4"
              >
                Graj Teraz <span aria-hidden="true">-&gt;</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
