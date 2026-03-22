type IconName =
  | "bolt"
  | "brain"
  | "trend"
  | "sliders"
  | "crown"
  | "group"
  | "globe"
  | "check"
  | "play";

const iconMap: Record<IconName, string> = {
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  brain:
    "M9 3a3 3 0 0 0-3 3v.3A4.5 4.5 0 0 0 4 10a4 4 0 0 0 2 3.47V14a3 3 0 0 0 5 2.24A3 3 0 0 0 16 14v-.53A4 4 0 0 0 18 10a4.5 4.5 0 0 0-2-3.7V6a3 3 0 0 0-5-2.24A2.98 2.98 0 0 0 9 3Zm0 4v10m6-8h-3m-3 4H7m5-3a2 2 0 0 0-2 2",
  trend: "m5 15 4-4 3 3 7-7M19 7h-5v5",
  sliders: "M4 7h8m4 0h4M10 7v10M4 17h4m4 0h8M14 17V7",
  crown:
    "m3 9 4 3 5-7 5 7 4-3-2 10H5L3 9Zm2 10h14",
  group:
    "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  globe:
    "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 0c2.5 2.7 4 6.2 4 10s-1.5 7.3-4 10m0-20C9.5 4.7 8 8.2 8 12s1.5 7.3 4 10m-9-10h18M4.9 7h14.2M4.9 17h14.2",
  check: "M20 6 9 17l-5-5",
  play: "m10 8 6 4-6 4V8Z",
};

export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={iconMap[name]} />
    </svg>
  );
}
