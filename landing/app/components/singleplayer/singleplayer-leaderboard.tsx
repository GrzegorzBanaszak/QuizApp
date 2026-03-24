const leaders = [
  {
    rank: "01",
    name: "Volt_Master_99",
    score: "12,450",
    time: "03:14s",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSVY0vfmZ9dIQNppie5SU8ujYaQB5cg2Fx8cVoU_iKZomNbzFAtVMqvvOuYjfBJ_650iKhB5Kdu5OeNqnfFlKPSNHo4-7JijhNVUUQ3_rJ0RXUaFM98jgZOXpEettwTX3ixWylWHDs3_lhlSPkAf7FpoydhFNtEHQW49OEqt8QpC-kQ3oyWhSjQFaWJ0BP_dfSEPnyZQa2TVar-mK7bzpsRb5RcDa_6wXgL2GZeg1xoSbFU_lUmUWZoZOpJbgs8HBY9tuWSffCZcmx",
    featured: true,
  },
  {
    rank: "02",
    name: "NeonNinja",
    score: "11,920",
    time: "03:45s",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkWOhYzyTkih9falkKymTRmk8zoK7GjhK2Gs6TaBAafDFPCGSL7SGG4iQoGYvtLWNwBn_XHJ6i0bkk7dtSf9aD3N1ZXOMXR30MFpC4UTdqwGgFhz8UgKLXenFKEVS0QlTLef4l9Xoly3YR6Dpl4XLg-5f1SskIfmuXFPIoucfWg32FRt6DHN5JLMf4c383bQhELRl391YdRCDj-DMqjwEdF9-2L_0TV9IdwyjYMezMo7D0KxZ4u7rX99TBwBtX4bKlN3v50E1HrThy",
  },
  {
    rank: "03",
    name: "CyberQueen_X",
    score: "11,400",
    time: "03:52s",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3IhBqVj8uQWH3HFIvq6GiZ71u-sz2Z0Km8LdD3roQQj7jFlxatiKLiZmuc_sUasoVCOTIqgKg_a7JE2va9Yd8Qfwn8U5EnpyHe-yjR4E9EX0y6dJRSsPJGLhxy-xqpP44kvFadkW-7Tp5DdrCiHDJrvVVJt6LZNwx4760-d5LijJ-4jOM0PvB-BcwdiDgGI7cWnXGA8kg2LxCoLeWrcgHQqAQ8Hve6UlFqlbJn--3neL-803WNnzlFge7FN9NhA9E9W1ErNTgKD8z",
  },
];

export function SingleplayerLeaderboard() {
  return (
    <section className="section-shell px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="font-headline text-4xl font-black text-on-surface md:text-5xl">
          Top 10 - Tryb Legendarny
        </h2>
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-secondary" />
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-high shadow-2xl">
        <div className="grid grid-cols-12 gap-4 bg-surface-container-highest/50 px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Gracz</div>
          <div className="col-span-3 text-right">Wynik</div>
          <div className="col-span-2 text-right">Czas</div>
        </div>

        <div className="divide-y divide-outline-variant/10">
          {leaders.map((leader) => (
            <article
              key={leader.rank}
              className={[
                "grid grid-cols-12 items-center gap-4 px-8 py-6",
                leader.featured
                  ? "border-l-4 border-primary bg-primary/5"
                  : "hover:bg-surface-bright",
              ].join(" ")}
            >
              <div
                className={`col-span-1 text-xl font-black ${leader.featured ? "text-primary italic" : "text-on-surface-variant"}`}
              >
                {leader.rank}
              </div>

              <div className="col-span-6 flex items-center gap-4">
                <img
                  alt={leader.name}
                  src={leader.image}
                  className={`h-12 w-12 rounded-full object-cover ${leader.featured ? "border-2 border-primary" : "border border-outline-variant"}`}
                />
                <span className="font-bold text-on-surface">{leader.name}</span>
              </div>

              <div
                className={`col-span-3 text-right font-black ${leader.featured ? "text-primary text-xl" : ""}`}
              >
                {leader.score}
              </div>
              <div className="col-span-2 text-right font-mono text-on-surface-variant">
                {leader.time}
              </div>
            </article>
          ))}

          <div className="bg-surface-container-lowest/20 px-8 py-4 text-center text-sm italic text-on-surface-variant">
            ... and 7 other legends
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="http://localhost:5173"
          className="inline-flex items-center gap-2 font-bold text-tertiary hover:underline"
        >
          Zobacz Pelny Ranking
          <span className="material-symbols-outlined" aria-hidden="true">
            open_in_new
          </span>
        </a>
      </div>
    </section>
  );
}
