const STATS = [
  { label: "SESSIONS BOOKED TODAY", value: "128" },
  { label: "ACTIVE MEMBERS", value: "2,340" },
  { label: "TRAINERS ONLINE", value: "14" },
  { label: "AVG. CHECK-IN TIME", value: "6:52 AM" },
  { label: "CLASSES THIS WEEK", value: "46" },
  { label: "LOYALTY PTS EARNED", value: "18,204" }
];

export default function StatTicker() {
  const row = [...STATS, ...STATS];
  return (
    <div className="w-full overflow-hidden border-y border-base-line bg-base-surface">
      <div className="flex w-max animate-ticker">
        {row.map((s, i) => (
          <div
            key={i}
            className="flex items-baseline gap-3 px-8 py-3 border-r border-base-line whitespace-nowrap"
          >
            <span className="font-mono text-signal-bright text-lg font-medium">{s.value}</span>
            <span className="text-[11px] tracking-widest text-ink-faint">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
