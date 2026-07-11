"use client";

export default function ProgressChart({ logs }) {
  if (!logs || logs.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-ink-faint">
        Log at least two weigh-ins to see your trend.
      </div>
    );
  }

  const sorted = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const weights = sorted.map((l) => l.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const width = 560;
  const height = 200;
  const padX = 20;
  const padY = 20;

  const points = sorted.map((l, i) => {
    const x = padX + (i / (sorted.length - 1)) * (width - padX * 2);
    const y = padY + (1 - (l.weightKg - min) / range) * (height - padY * 2);
    return [x, y];
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52">
      <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#26303C" strokeWidth="1" />
      <path d={path} fill="none" stroke="#3D5AFE" strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#7C8CFF" />
      ))}
      <text x={padX} y={14} fill="#8B94A3" fontSize="10" fontFamily="monospace">
        {max.toFixed(1)} kg
      </text>
      <text x={padX} y={height - 6} fill="#8B94A3" fontSize="10" fontFamily="monospace">
        {min.toFixed(1)} kg
      </text>
    </svg>
  );
}
