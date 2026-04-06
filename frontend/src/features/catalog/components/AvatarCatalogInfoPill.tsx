interface AvatarCatalogInfoPillProps {
  label: string;
  value: string;
  compact?: boolean;
}

export const AvatarCatalogInfoPill = ({
  label,
  value,
  compact = false,
}: AvatarCatalogInfoPillProps) => {
  return (
    <div
      className={`rounded-full bg-black/15 px-3 py-2 ${compact ? "text-[10px]" : "text-xs"}`}
    >
      <span className="font-black uppercase tracking-[0.2em] text-[#8ff5ff]">
        {label}:
      </span>{" "}
      <span className="font-semibold text-[#e5e3ff]">{value}</span>
    </div>
  );
};
