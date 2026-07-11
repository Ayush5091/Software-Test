"use client";

// Small, stylized line-figure illustrations for each exercise. Kept as
// inline SVG (not hotlinked photos) so the Workout Planner always renders
// correctly with zero external dependencies.

const stroke = "#7C8CFF";
const accent = "#FF6B4A";

function Frame({ children }) {
  return (
    <svg viewBox="0 0 120 100" className="w-full h-28">
      <rect x="0" y="0" width="120" height="100" rx="12" fill="#151B23" />
      <g stroke={stroke} strokeWidth="3" strokeLinecap="round" fill="none">
        {children}
      </g>
    </svg>
  );
}

const POSES = {
  squat: (
    <Frame>
      <circle cx="60" cy="30" r="7" fill={stroke} stroke="none" />
      <path d="M60 37 L60 58" />
      <path d="M60 45 L42 55 M60 45 L78 55" />
      <path d="M60 58 L46 80 M60 58 L74 80" />
      <path d="M46 80 L40 90 M74 80 L80 90" stroke={accent} />
    </Frame>
  ),
  pushup: (
    <Frame>
      <circle cx="30" cy="55" r="7" fill={stroke} stroke="none" />
      <path d="M37 55 L95 40" />
      <path d="M50 58 L45 75 M75 48 L80 75" stroke={accent} />
      <path d="M60 52 L60 30" />
    </Frame>
  ),
  plank: (
    <Frame>
      <circle cx="25" cy="45" r="7" fill={stroke} stroke="none" />
      <path d="M32 45 L95 40" />
      <path d="M35 48 L35 65" stroke={accent} />
      <path d="M90 40 L90 62" stroke={accent} />
    </Frame>
  ),
  lunge: (
    <Frame>
      <circle cx="55" cy="28" r="7" fill={stroke} stroke="none" />
      <path d="M55 35 L58 55" />
      <path d="M58 55 L40 62 L34 88" stroke={accent} />
      <path d="M58 55 L78 60 L86 40" />
      <path d="M55 40 L40 50 M55 40 L72 45" />
    </Frame>
  ),
  deadlift: (
    <Frame>
      <circle cx="55" cy="26" r="7" fill={stroke} stroke="none" />
      <path d="M55 33 L48 60" />
      <path d="M48 60 L36 90 M48 60 L64 90" stroke={accent} />
      <path d="M55 42 L30 55 M55 42 L30 65" />
      <line x1="24" y1="52" x2="24" y2="68" stroke={accent} strokeWidth="5" />
    </Frame>
  ),
  shoulder_press: (
    <Frame>
      <circle cx="60" cy="30" r="7" fill={stroke} stroke="none" />
      <path d="M60 37 L60 65" />
      <path d="M60 45 L38 20 M60 45 L82 20" stroke={accent} />
      <path d="M60 65 L48 90 M60 65 L72 90" />
    </Frame>
  ),
  mountain_climber: (
    <Frame>
      <circle cx="30" cy="45" r="7" fill={stroke} stroke="none" />
      <path d="M37 45 L95 38" />
      <path d="M45 48 L60 30" stroke={accent} />
      <path d="M80 42 L70 65" stroke={accent} />
    </Frame>
  ),
  jump_rope: (
    <Frame>
      <circle cx="60" cy="26" r="7" fill={stroke} stroke="none" />
      <path d="M60 33 L60 58" />
      <path d="M60 40 L44 30 M60 40 L76 30" stroke={accent} />
      <path d="M60 58 L50 85 M60 58 L70 85" />
      <path d="M44 30 Q60 10 76 30" strokeDasharray="3 3" />
    </Frame>
  ),
  row: (
    <Frame>
      <circle cx="55" cy="28" r="7" fill={stroke} stroke="none" />
      <path d="M55 35 L48 58" />
      <path d="M48 58 L38 88 M48 58 L60 88" />
      <path d="M50 45 L28 55" stroke={accent} />
    </Frame>
  ),
  run: (
    <Frame>
      <circle cx="45" cy="26" r="7" fill={stroke} stroke="none" />
      <path d="M45 33 L52 55" />
      <path d="M52 55 L36 70 M52 55 L74 80" stroke={accent} />
      <path d="M48 42 L28 35 M48 42 L64 50" />
    </Frame>
  )
};

export default function ExerciseIllustration({ name }) {
  return POSES[name] || POSES.squat;
}
