const tournaments = [
  {
    title: "Wielka Bitwa Historyczna",
    subtitle: "Nagroda: 5000 XP + Unikalny Avatar",
    status: "Start za 12:45",
    meta: "142 Graczy zapisanych",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABUccmL9qKaaBK6SChA3WnvXR-cd-xi7iWfKBP8HOSUnBxQYvb8IKJvPuSfqLSkIXI6vCnrzJqL1DSAY3MmXPy5mdDEzENJ54QK5zIs4LM4E19u4h7-IiaBQt96RTOdXyrfBDyViHghmppgAFhQBHF_XS3lLElkOL3CvH_q5Ny7kP76oYyBNcEjxwd3ilXkxvwlIaN6Wu6WNC2ydSVNHXPGPZAFe7RrS6PGW1dQcGfE-HA_kq-2uu_XcZX8TRWzXQ1yQRI7Hp72xHL",
    border: "border-primary/40",
    hover: "group-hover:text-primary",
  },
  {
    title: "Sprint Naukowy: Biologia",
    subtitle: 'Nagroda: Tytul "Geniusza Natury"',
    status: "W trakcie (Runda 2/5)",
    meta: "45 Graczy zostalo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbwGrGoo_70uxMtC_Bszev9jqt6cXBz1vDgyet7_h6vVwG5-g3OzFCxmrx7Xbmzpm7dvZmSAZ_ZaRE5Rlx81NIYTei51HZYRStPa7QbXwBfm5YzJqcK3I_BUcpc879JRyU_kJgZmerL5dEz4ch1FvLcl0v48eGDnkN_TzDybxJvRajWbST8X-N8uJ4Ko-8QhSslQgN1aXBcRtjuOr__4aL5BryM5y64agCjr44gqUlJ4FLmb6gnCC_yfWmQIEWA5zLByUagQYazAhV",
    border: "border-secondary/40",
    hover: "group-hover:text-secondary",
  },
];

const friends = [
  {
    name: "PixelWiz",
    status: "W Menu",
    statusClass: "text-tertiary",
    action: "mail",
    active: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBg43W1nGnkpAc5JUGpt_MU42IbFHBLePxWqF0WXPVeb0TD9fzNYUT1KXpRrDbcyQywewrZ1GAZzFZJuTDUe6wTjbji9r-89v1XuBrvHZdE-mENhJ-CZNmgHMDtqWwbceDCH4VfbNnANMZ0A4GxyEAGGFC6ZHSBMHeqJlwACyYudRXq9IvqnXtI9V1J88AXwm91KOBI9ImSLYwiR16Ed1SyD0fIisFOLPOmfEGcw82eLIP2ZSedGbOJB-O208Dp146bRk2Yk5e62yd",
  },
  {
    name: "QuantumQueen",
    status: "W Grze (Klasyczny)",
    statusClass: "text-secondary",
    action: "login",
    active: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMxrSGZVabB36Gzf0DZAXoT495og20F2WXWF32sb-279qhAKjAObqVdZSpsyaj2MrJL0SX7TYd8DeNGak7ekbCWZAMj-5lcurnQg_w_AWlFvmiDCQvvwU91_k1gNiQAs6EoMl0NvFEs0wbTx3z2rqEul2scHrojlEwh0OaHipDfD3HAdSHPUKX6ZCC8FMD99faWkvOKzYie4XHYwRROrKIIjASAM7KsSoHfFECkJUl_qlXbzOl6RyMrKfAja59gT_Hr_XtaWi9cL0f",
  },
  {
    name: "NeonNinja",
    status: "Wolny",
    statusClass: "text-tertiary",
    action: "add",
    active: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCj597AOXpQDJEcXJ38z6AomW3WHbrfv-e7OS_JyIvaRhGQQ2cT5TlSGXQYMLG-lUDlZPtbbZ7SdKPyBY7kRpa-FRmN2PhtxH0t9wK_EO_FUE7IkivBrtZedQ6-WBNwdJjKUiJTmpZqEI3Ai18Fw3FDzvh-hUueOoFh0a_rRwbKg6h4OJvlK7bQuJ55PwouoJk3l9qtd8tkq-win1NK2Z_RHsanQYPj69tGICrp936E1iE6fEms-n40DBKMTzIff-pueEfrRK-qI-Uu",
  },
];

export function MultiplayerSocial() {
  return (
    <section className="section-shell grid gap-8 px-6 md:grid-cols-3">
      <article className="glass-panel space-y-6 rounded-[2rem] border border-outline-variant/10 p-8 md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-headline text-xl font-bold">
            <span className="text-tertiary">#</span>
            Aktywne Turnieje
          </h2>
          <span className="rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1 text-xs font-bold text-tertiary">
            LIVE
          </span>
        </div>

        <div className="space-y-3">
          {tournaments.map((tournament) => (
            <article
              key={tournament.title}
              className="group flex items-center justify-between rounded-[1.5rem] bg-surface-container-high p-4 transition-all hover:bg-surface-bright"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 overflow-hidden rounded-full border-2 bg-black ${tournament.border}`}
                >
                  <img
                    alt={tournament.title}
                    src={tournament.image}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p
                    className={`font-bold text-on-surface transition-colors ${tournament.hover}`}
                  >
                    {tournament.title}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                    {tournament.subtitle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-mono text-tertiary">
                  {tournament.status}
                </p>
                <p className="text-[10px] text-on-surface-variant">
                  {tournament.meta}
                </p>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="glass-panel space-y-6 rounded-[2rem] border border-outline-variant/10 p-8">
        <h2 className="font-headline text-xl font-bold text-on-surface">
          Online (4)
        </h2>

        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center gap-3">
              <div className="relative">
                <img
                  alt={friend.name}
                  src={friend.image}
                  className="h-10 w-10 rounded-full border border-outline-variant/30 object-cover"
                />
                {friend.active ? (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container bg-green-500" />
                ) : null}
              </div>

              <div className="flex-grow">
                <p className="text-sm font-bold text-on-surface">{friend.name}</p>
                <p className={`text-[10px] font-medium uppercase ${friend.statusClass}`}>
                  {friend.status}
                </p>
              </div>

              <button
                className={`rounded-md p-1.5 transition-all ${friend.active ? "text-primary hover:bg-primary/10" : "cursor-not-allowed text-on-surface-variant/50"}`}
              >
                {friend.action === "mail"
                  ? "@"
                  : friend.action === "login"
                    ? ">"
                    : "+"}
              </button>
            </div>
          ))}
        </div>

        <button className="w-full border-t border-outline-variant/10 pt-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface">
          Zobacz Cala Liste
        </button>
      </article>
    </section>
  );
}
