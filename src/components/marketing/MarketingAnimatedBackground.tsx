import type { CSSProperties } from "react";

export type MarketingBackgroundVariant =
  | "platform"
  | "solutions"
  | "security"
  | "pricing"
  | "resources"
  | "company"
  | "demo";

type VariantTheme = {
  primary: string;
  secondary: string;
  accent: string;
  soft: string;
};

const themes: Record<MarketingBackgroundVariant, VariantTheme> = {
  platform: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#06B6D4",
    soft: "rgba(37,99,235,0.16)",
  },
  solutions: {
    primary: "#2563EB",
    secondary: "#8B5CF6",
    accent: "#22D3EE",
    soft: "rgba(34,211,238,0.16)",
  },
  security: {
    primary: "#1D4ED8",
    secondary: "#7C3AED",
    accent: "#06B6D4",
    soft: "rgba(124,58,237,0.14)",
  },
  pricing: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#06B6D4",
    soft: "rgba(37,99,235,0.14)",
  },
  resources: {
    primary: "#2563EB",
    secondary: "#A78BFA",
    accent: "#06B6D4",
    soft: "rgba(6,182,212,0.15)",
  },
  company: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#22D3EE",
    soft: "rgba(167,139,250,0.16)",
  },
  demo: {
    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#06B6D4",
    soft: "rgba(6,182,212,0.16)",
  },
};

const networkNodes = [
  [28, 38, "#2563EB"],
  [84, 58, "#FFFFFF"],
  [142, 30, "#22D3EE"],
  [218, 78, "#A78BFA"],
  [288, 44, "#FFFFFF"],
  [352, 94, "#7C3AED"],
  [418, 58, "#38BDF8"],
  [498, 108, "#FFFFFF"],
  [458, 194, "#2563EB"],
  [354, 168, "#FFFFFF"],
  [270, 222, "#22D3EE"],
  [172, 186, "#A78BFA"],
  [78, 232, "#FFFFFF"],
  [38, 156, "#06B6D4"],
  [512, 224, "#A78BFA"],
  [124, 276, "#38BDF8"],
] as const;

const networkLinks = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 0],
  [1, 11],
  [3, 9],
  [4, 10],
  [6, 9],
  [7, 14],
  [14, 8],
  [12, 15],
  [15, 10],
] as const;

const particlePositions = [
  ["5%", "15%", 4, "#2563EB", "-2s"],
  ["11%", "62%", 5, "#22D3EE", "-8s"],
  ["19%", "31%", 3, "#A78BFA", "-5s"],
  ["27%", "84%", 4, "#FFFFFF", "-11s"],
  ["39%", "18%", 5, "#06B6D4", "-6s"],
  ["48%", "72%", 3, "#FFFFFF", "-3s"],
  ["58%", "25%", 4, "#7C3AED", "-10s"],
  ["70%", "15%", 5, "#FFFFFF", "-4s"],
  ["82%", "42%", 4, "#22D3EE", "-9s"],
  ["91%", "20%", 5, "#7C3AED", "-7s"],
  ["96%", "69%", 3, "#2563EB", "-12s"],
  ["75%", "88%", 4, "#FFFFFF", "-1s"],
  ["16%", "48%", 3, "#38BDF8", "-6s"],
  ["88%", "78%", 4, "#A78BFA", "-9s"],
] as const;

function NetworkField({ className = "", theme }: { className?: string; theme: VariantTheme }) {
  return (
    <svg className={`evada-network-field absolute h-[320px] w-[560px] ${className}`} viewBox="0 0 540 300" fill="none" aria-hidden="true">
      <g strokeLinecap="round">
        {networkLinks.map(([from, to], index) => {
          const start = networkNodes[from];
          const end = networkNodes[to];

          return (
            <path
              key={`${from}-${to}`}
              className="evada-dash-flow"
              d={`M${start[0]} ${start[1]}L${end[0]} ${end[1]}`}
              stroke={index % 3 === 0 ? theme.accent : index % 3 === 1 ? theme.primary : theme.secondary}
              strokeDasharray="6 12"
              strokeWidth="1.12"
              opacity={index % 4 === 0 ? "0.5" : "0.34"}
            />
          );
        })}
      </g>
      {networkNodes.map(([cx, cy, fill], index) => (
        <circle
          key={`${cx}-${cy}`}
          className="evada-network-node"
          cx={cx}
          cy={cy}
          r={fill === "#FFFFFF" ? "3.2" : "2.6"}
          fill={fill}
          opacity="0.94"
          style={{ animationDelay: `${index * 0.16}s` }}
        />
      ))}
    </svg>
  );
}

export default function MarketingAnimatedBackground({ variant }: { variant: MarketingBackgroundVariant }) {
  const theme = themes[variant];
  const style = {
    "--page-primary": theme.primary,
    "--page-secondary": theme.secondary,
    "--page-accent": theme.accent,
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className="evada-animated-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5fbff_32%,#edf8ff_62%,#f3edff_100%)]"
      style={style}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_30%,rgba(255,255,255,0.78),transparent_32%),radial-gradient(circle_at_12%_20%,rgba(34,211,238,0.34),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(124,58,237,0.3),transparent_30%),radial-gradient(circle_at_74%_76%,rgba(6,182,212,0.28),transparent_28%),radial-gradient(circle_at_12%_82%,rgba(167,139,250,0.26),transparent_30%)]" />

      <span className="evada-float-soft absolute -left-24 top-[-5rem] h-[30rem] w-[30rem] rounded-full bg-cyan-200/30 blur-3xl" />
      <span className="evada-float-reverse absolute -right-28 top-[-4rem] h-[34rem] w-[34rem] rounded-full bg-violet-200/30 blur-3xl" />
      <span className="evada-float-soft absolute bottom-[-8rem] left-[24%] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{ backgroundColor: theme.soft, animationDelay: "-7s" }} />
      <span className="evada-pulse-glow absolute left-[40%] top-[20%] h-[26rem] w-[26rem] rounded-full bg-white/75 blur-3xl" />

      <div className="evada-dot-drift absolute -left-20 bottom-[-5rem] h-[32rem] w-[32rem] rounded-full opacity-[0.54] [background-image:radial-gradient(circle,rgba(255,255,255,0.94)_1.1px,transparent_1.7px)] [background-size:10px_10px] [mask-image:radial-gradient(circle,#000_0%,transparent_68%)]" />
      <div className="evada-dot-drift absolute right-[-8rem] top-[20%] h-[28rem] w-[28rem] rounded-full opacity-[0.42] [animation-delay:-12s] [background-image:radial-gradient(circle,rgba(34,211,238,0.78)_1px,transparent_1.8px)] [background-size:12px_12px] [mask-image:radial-gradient(circle,#000_0%,transparent_70%)]" />

      <NetworkField className="left-[-7rem] top-[2rem] opacity-[0.72]" theme={theme} />
      <NetworkField className="right-[-9rem] top-[8rem] hidden rotate-12 opacity-[0.72] lg:block" theme={theme} />
      <NetworkField className="bottom-[-2rem] right-[-10rem] hidden rotate-6 opacity-[0.68] xl:block" theme={theme} />

      <svg className="evada-wave-drift absolute left-[-12%] top-[40%] h-[24rem] w-[130vw] opacity-[0.46] [animation-delay:-10s]" viewBox="0 0 1460 360" fill="none" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <path
            key={index}
            className="evada-dash-flow"
            d={`M0 ${198 + index * 6}C220 ${136 + index * 5} 356 ${108 + index * 5} 570 ${170 + index * 4}C836 ${246 + index * 4} 1040 ${272 + index * 3} 1460 ${118 + index * 6}`}
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.9"
            strokeDasharray="10 22"
            opacity={0.22}
          />
        ))}
      </svg>

      {particlePositions.map(([left, top, size, color, delay], index) => {
        const dotSize = Math.max(2, Math.round(size * 0.68));

        return (
          <span
            key={`${left}-${top}`}
            className="evada-particle-float absolute rounded-full"
            style={
              {
                left,
                top,
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: color,
                boxShadow: `0 0 ${dotSize * 5}px ${color === "#FFFFFF" ? "rgba(255,255,255,0.78)" : color}`,
                "--delay": delay,
                "--duration": `${8 + (index % 5)}s`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
