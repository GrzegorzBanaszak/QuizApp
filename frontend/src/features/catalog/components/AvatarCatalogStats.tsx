interface AvatarCatalogStatsProps {
  total: number;
  unlocked: number;
  selected: number;
  locked: number;
}

export const AvatarCatalogStats = ({
  total,
  unlocked,
  selected,
  locked,
}: AvatarCatalogStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <CatalogStat
        label="Wszystkie"
        value={total}
        tone="from-[#e08dff] to-[#d978ff]"
      />
      <CatalogStat
        label="Odblokowane"
        value={unlocked}
        tone="from-[#8ff5ff] to-[#0d8f97]"
      />
      <CatalogStat
        label="Wybrane"
        value={selected}
        tone="from-[#ffcf7d] to-[#ff9f4d]"
      />
      <CatalogStat
        label="Zablokowane"
        value={locked}
        tone="from-[#ff68a7] to-[#c94d84]"
      />
    </div>
  );
};

const CatalogStat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) => (
  <div className="rounded-[1.5rem] bg-black/15 p-4">
    <div
      className={`inline-flex rounded-full bg-gradient-to-r ${tone} px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#0c0c21]`}
    >
      {label}
    </div>
    <div className="font-headline mt-3 text-3xl font-black text-[#e5e3ff]">
      {value}
    </div>
  </div>
);
