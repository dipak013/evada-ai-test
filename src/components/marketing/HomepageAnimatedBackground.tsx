import type { CSSProperties } from "react";

type Orb = {
  className: string;
  style: CSSProperties;
};

type Particle = {
  left: string;
  top: string;
  size: number;
  color: string;
  shadow: string;
  delay: string;
  duration: string;
  className?: string;
};

const orbs: Orb[] = [
  {
    className: "left-[-10%] top-[-8%] h-[34rem] w-[34rem] bg-cyan-200/35",
    style: { animationDuration: "11s" },
  },
  {
    className: "right-[-12%] top-[-6%] h-[38rem] w-[38rem] bg-violet-200/35 evada-float-reverse",
    style: { animationDuration: "14s" },
  },
  {
    className: "right-[4%] top-[28%] h-[28rem] w-[28rem] bg-sky-200/25",
    style: { animationDuration: "12s", animationDelay: "-6s" },
  },
  {
    className: "left-[-12%] top-[50%] h-[32rem] w-[32rem] bg-violet-200/30 evada-float-reverse",
    style: { animationDuration: "15s", animationDelay: "-10s" },
  },
  {
    className: "bottom-[-12%] right-[-8%] h-[30rem] w-[30rem] bg-blue-200/25",
    style: { animationDuration: "13s", animationDelay: "-3s" },
  },
  {
    className: "left-[38%] top-[18%] h-[26rem] w-[26rem] bg-white/80 evada-pulse-glow",
    style: { animationDuration: "10s" },
  },
];

const particles: Particle[] = [
  { left: "3%", top: "11%", size: 4, color: "#2563EB", shadow: "rgba(37,99,235,.38)", delay: "0s", duration: "8s" },
  { left: "9%", top: "36%", size: 5, color: "#7C3AED", shadow: "rgba(124,58,237,.34)", delay: "-2s", duration: "10s" },
  { left: "16%", top: "8%", size: 3, color: "#22D3EE", shadow: "rgba(34,211,238,.42)", delay: "-5s", duration: "8s" },
  { left: "22%", top: "23%", size: 4, color: "#93C5FD", shadow: "rgba(147,197,253,.36)", delay: "-7s", duration: "9s", className: "hidden sm:block" },
  { left: "31%", top: "12%", size: 5, color: "#38BDF8", shadow: "rgba(56,189,248,.38)", delay: "-3s", duration: "11s", className: "hidden md:block" },
  { left: "43%", top: "18%", size: 3, color: "#FFFFFF", shadow: "rgba(255,255,255,.75)", delay: "-8s", duration: "8s", className: "hidden sm:block" },
  { left: "52%", top: "48%", size: 4, color: "#FFFFFF", shadow: "rgba(255,255,255,.75)", delay: "-1s", duration: "11s", className: "hidden md:block" },
  { left: "63%", top: "16%", size: 3, color: "#A78BFA", shadow: "rgba(167,139,250,.38)", delay: "-11s", duration: "9s", className: "hidden sm:block" },
  { left: "74%", top: "26%", size: 5, color: "#FFFFFF", shadow: "rgba(255,255,255,.78)", delay: "-4s", duration: "12s" },
  { left: "81%", top: "11%", size: 4, color: "#7C3AED", shadow: "rgba(124,58,237,.38)", delay: "-9s", duration: "10s" },
  { left: "92%", top: "22%", size: 5, color: "#FFFFFF", shadow: "rgba(255,255,255,.82)", delay: "-6s", duration: "8s" },
  { left: "96%", top: "47%", size: 4, color: "#2563EB", shadow: "rgba(37,99,235,.36)", delay: "-12s", duration: "11s" },
  { left: "86%", top: "56%", size: 6, color: "#22D3EE", shadow: "rgba(34,211,238,.42)", delay: "-10s", duration: "13s", className: "hidden sm:block" },
  { left: "78%", top: "72%", size: 4, color: "#FFFFFF", shadow: "rgba(255,255,255,.8)", delay: "-7s", duration: "10s" },
  { left: "68%", top: "82%", size: 3, color: "#93C5FD", shadow: "rgba(147,197,253,.38)", delay: "-2s", duration: "8s", className: "hidden md:block" },
  { left: "55%", top: "74%", size: 4, color: "#FFFFFF", shadow: "rgba(255,255,255,.78)", delay: "-13s", duration: "11s", className: "hidden sm:block" },
  { left: "41%", top: "86%", size: 3, color: "#22D3EE", shadow: "rgba(34,211,238,.4)", delay: "-4s", duration: "8s", className: "hidden lg:block" },
  { left: "29%", top: "78%", size: 4, color: "#A78BFA", shadow: "rgba(167,139,250,.38)", delay: "-9s", duration: "12s", className: "hidden md:block" },
  { left: "18%", top: "91%", size: 5, color: "#7C3AED", shadow: "rgba(124,58,237,.34)", delay: "-5s", duration: "11s" },
  { left: "8%", top: "76%", size: 4, color: "#2563EB", shadow: "rgba(37,99,235,.36)", delay: "-12s", duration: "9s" },
  { left: "2%", top: "63%", size: 5, color: "#FFFFFF", shadow: "rgba(255,255,255,.82)", delay: "-6s", duration: "10s" },
  { left: "14%", top: "52%", size: 3, color: "#22D3EE", shadow: "rgba(34,211,238,.38)", delay: "-1s", duration: "8s", className: "hidden sm:block" },
  { left: "36%", top: "58%", size: 3, color: "#FFFFFF", shadow: "rgba(255,255,255,.76)", delay: "-8s", duration: "9s", className: "hidden lg:block" },
  { left: "58%", top: "36%", size: 4, color: "#FFFFFF", shadow: "rgba(255,255,255,.76)", delay: "-3s", duration: "10s", className: "hidden md:block" },
  { left: "24%", top: "44%", size: 4, color: "#38BDF8", shadow: "rgba(56,189,248,.42)", delay: "-6s", duration: "9s" },
  { left: "34%", top: "34%", size: 3, color: "#A78BFA", shadow: "rgba(167,139,250,.4)", delay: "-10s", duration: "8s", className: "hidden sm:block" },
  { left: "47%", top: "9%", size: 4, color: "#22D3EE", shadow: "rgba(34,211,238,.42)", delay: "-4s", duration: "10s", className: "hidden md:block" },
  { left: "67%", top: "42%", size: 5, color: "#2563EB", shadow: "rgba(37,99,235,.38)", delay: "-7s", duration: "11s", className: "hidden sm:block" },
  { left: "88%", top: "83%", size: 4, color: "#7C3AED", shadow: "rgba(124,58,237,.38)", delay: "-11s", duration: "9s" },
  { left: "94%", top: "71%", size: 3, color: "#22D3EE", shadow: "rgba(34,211,238,.4)", delay: "-5s", duration: "8s", className: "hidden sm:block" },
  { left: "6%", top: "24%", size: 3, color: "#FFFFFF", shadow: "rgba(255,255,255,.82)", delay: "-9s", duration: "10s" },
  { left: "73%", top: "6%", size: 4, color: "#FFFFFF", shadow: "rgba(255,255,255,.82)", delay: "-2s", duration: "9s", className: "hidden md:block" },
  { left: "12%", top: "18%", size: 3, color: "#38BDF8", shadow: "rgba(56,189,248,.44)", delay: "-3s", duration: "9s", className: "hidden sm:block" },
  { left: "83%", top: "64%", size: 4, color: "#A78BFA", shadow: "rgba(167,139,250,.4)", delay: "-8s", duration: "10s", className: "hidden md:block" },
  { left: "49%", top: "92%", size: 3, color: "#2563EB", shadow: "rgba(37,99,235,.38)", delay: "-6s", duration: "8s", className: "hidden lg:block" },
];

function MeshCluster({ className = "" }: { className?: string }) {
  return (
    <svg className={`evada-mesh-drift absolute h-[260px] w-[320px] ${className}`} viewBox="0 0 320 260" fill="none" aria-hidden="true">
      <g opacity="0.66" strokeLinecap="round">
        <path d="M22 32L78 62L130 28L198 58L278 34" stroke="#93C5FD" strokeWidth="1.08" opacity="0.66" />
        <path d="M78 62L108 124L178 112L198 58" stroke="#22D3EE" strokeWidth="1.08" opacity="0.48" />
        <path d="M108 124L52 172L128 218L178 112L248 164L278 34" stroke="#7C3AED" strokeWidth="1.08" opacity="0.34" />
        <path d="M178 112L236 222L248 164" stroke="#2563EB" strokeWidth="1.08" opacity="0.46" />
        <path d="M52 172L22 32" stroke="#93C5FD" strokeWidth="1.08" opacity="0.34" />
      </g>
      {[["22", "32", "#2563EB"], ["78", "62", "#22D3EE"], ["130", "28", "#FFFFFF"], ["198", "58", "#A78BFA"], ["278", "34", "#7C3AED"], ["108", "124", "#FFFFFF"], ["178", "112", "#38BDF8"], ["52", "172", "#7C3AED"], ["128", "218", "#FFFFFF"], ["248", "164", "#2563EB"], ["236", "222", "#22D3EE"]].map(([cx, cy, fill]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={fill === "#FFFFFF" ? "3.2" : "2.6"} fill={fill} opacity="0.86" />
      ))}
    </svg>
  );
}

function NetworkField({ className = "" }: { className?: string }) {
  const nodes = [
    { x: 42, y: 52, fill: "#2563EB", r: 2.6 },
    { x: 108, y: 36, fill: "#FFFFFF", r: 3.2 },
    { x: 172, y: 74, fill: "#22D3EE", r: 2.6 },
    { x: 254, y: 42, fill: "#A78BFA", r: 2.6 },
    { x: 338, y: 86, fill: "#FFFFFF", r: 3.2 },
    { x: 448, y: 58, fill: "#7C3AED", r: 2.6 },
    { x: 498, y: 146, fill: "#38BDF8", r: 2.6 },
    { x: 382, y: 178, fill: "#FFFFFF", r: 3.2 },
    { x: 286, y: 150, fill: "#2563EB", r: 2.6 },
    { x: 194, y: 184, fill: "#FFFFFF", r: 3.2 },
    { x: 96, y: 156, fill: "#7C3AED", r: 2.6 },
    { x: 58, y: 250, fill: "#22D3EE", r: 2.6 },
    { x: 156, y: 292, fill: "#FFFFFF", r: 3.2 },
    { x: 268, y: 260, fill: "#A78BFA", r: 2.6 },
    { x: 386, y: 300, fill: "#38BDF8", r: 2.6 },
    { x: 486, y: 268, fill: "#FFFFFF", r: 3.2 },
    { x: 526, y: 214, fill: "#A78BFA", r: 2.6 },
    { x: 26, y: 308, fill: "#FFFFFF", r: 3.2 },
  ];
  const links = [
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
    [10, 0],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 6],
    [6, 16],
    [16, 15],
    [2, 8],
    [4, 8],
    [7, 14],
    [11, 17],
    [17, 12],
  ] as const;

  return (
    <svg className={`evada-network-field absolute h-[360px] w-[560px] ${className}`} viewBox="0 0 560 360" fill="none" aria-hidden="true">
      <g strokeLinecap="round">
        {links.map(([from, to], index) => {
          const start = nodes[from];
          const end = nodes[to];
          return (
            <path
              key={`${from}-${to}`}
              className="evada-dash-flow"
              d={`M${start.x} ${start.y}L${end.x} ${end.y}`}
              stroke={index % 3 === 0 ? "#22D3EE" : index % 3 === 1 ? "#93C5FD" : "#A78BFA"}
              strokeDasharray="6 12"
              strokeWidth="1.12"
              opacity={index % 4 === 0 ? "0.5" : "0.34"}
            />
          );
        })}
      </g>
      {nodes.map((node, index) => (
        <circle
          key={`${node.x}-${node.y}`}
          className="evada-network-node"
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill={node.fill}
          opacity="0.94"
          style={{ animationDelay: `${index * 0.18}s` }}
        />
      ))}
    </svg>
  );
}

export default function HomepageAnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="evada-animated-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f2fbff_34%,#eaf7ff_64%,#efe9ff_100%)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.8),transparent_34%),radial-gradient(circle_at_18%_20%,rgba(223,251,255,0.78),transparent_34%),radial-gradient(circle_at_86%_20%,rgba(167,139,250,0.4),transparent_28%),radial-gradient(circle_at_78%_68%,rgba(34,211,238,0.36),transparent_30%),radial-gradient(circle_at_8%_78%,rgba(124,58,237,0.32),transparent_28%)]" />

      {orbs.map((orb) => (
        <span key={orb.className} className={`evada-float-soft absolute rounded-full blur-3xl ${orb.className}`} style={orb.style} />
      ))}

      <div className="evada-dot-drift absolute -left-20 bottom-[-4rem] h-[34rem] w-[34rem] rounded-full opacity-[0.54] [background-image:radial-gradient(circle,rgba(255,255,255,0.95)_1.1px,transparent_1.7px)] [background-size:10px_10px] [mask-image:radial-gradient(circle,#000_0%,transparent_68%)]" />
      <div className="evada-dot-drift absolute right-[-7rem] top-[22%] h-[28rem] w-[28rem] rounded-full opacity-[0.44] [animation-delay:-14s] [background-image:radial-gradient(circle,rgba(34,211,238,0.78)_1px,transparent_1.8px)] [background-size:12px_12px] [mask-image:radial-gradient(circle,#000_0%,transparent_70%)]" />
      <div className="evada-dot-drift absolute right-[-5rem] top-[-5rem] hidden h-[24rem] w-[24rem] rounded-full opacity-[0.38] [animation-delay:-22s] [background-image:radial-gradient(circle,rgba(167,139,250,0.78)_1px,transparent_1.8px)] [background-size:11px_11px] [mask-image:radial-gradient(circle,#000_0%,transparent_68%)] md:block" />

      <NetworkField className="left-[-5rem] top-[1rem] opacity-[0.72]" />
      <NetworkField className="right-[-8rem] top-[5rem] hidden rotate-12 opacity-[0.72] lg:block" />
      <NetworkField className="left-[-8rem] top-[40%] hidden -rotate-6 opacity-[0.64] xl:block" />
      <NetworkField className="bottom-[-1rem] right-[-9rem] hidden rotate-6 opacity-70 lg:block" />

      <MeshCluster className="left-[-2rem] top-[-1rem] opacity-[0.74]" />
      <MeshCluster className="right-[-3rem] top-[-2rem] hidden rotate-12 opacity-70 lg:block" />
      <MeshCluster className="right-[-5rem] top-[44%] hidden -rotate-6 opacity-[0.62] 2xl:block" />
      <MeshCluster className="bottom-[-1rem] left-[-4rem] hidden -rotate-12 opacity-70 xl:block" />
      <MeshCluster className="bottom-[2rem] right-[-4rem] hidden rotate-6 opacity-[0.66] xl:block" />

      <svg className="evada-wave-drift absolute left-[-10%] top-[4%] hidden h-[24rem] w-[78rem] opacity-55 md:block" viewBox="0 0 1240 380" fill="none" aria-hidden="true">
        {Array.from({ length: 11 }).map((_, index) => (
          <path
            key={index}
            className="evada-dash-flow"
            d={`M0 ${118 + index * 10}C180 ${34 + index * 8} 320 ${20 + index * 5} 520 ${92 + index * 8}C756 ${178 + index * 7} 920 ${176 + index * 6} 1240 ${62 + index * 9}`}
            stroke="url(#home-wave-a)"
            strokeWidth="1"
            strokeDasharray="12 18"
            opacity={0.2 + index * 0.018}
          />
        ))}
        <defs>
          <linearGradient id="home-wave-a" x1="0" y1="0" x2="1240" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="evada-wave-drift absolute left-[-12%] top-[43%] h-[24rem] w-[130vw] opacity-50 [animation-delay:-10s]" viewBox="0 0 1460 360" fill="none" aria-hidden="true">
        {Array.from({ length: 13 }).map((_, index) => (
          <path
            key={index}
            className="evada-dash-flow"
            d={`M0 ${210 + index * 6}C220 ${150 + index * 5} 356 ${112 + index * 5} 570 ${174 + index * 4}C836 ${250 + index * 4} 1040 ${272 + index * 3} 1460 ${124 + index * 6}`}
            stroke="rgba(255,255,255,0.72)"
            strokeWidth="0.9"
            strokeDasharray="10 22"
            opacity={0.22}
          />
        ))}
      </svg>

      <svg className="evada-wave-drift absolute bottom-[-2rem] left-[-8%] hidden h-[28rem] w-[126vw] opacity-60 [animation-delay:-18s] md:block" viewBox="0 0 1500 420" fill="none" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, index) => (
          <path
            key={index}
            d={`M0 ${122 + index * 8}C250 ${38 + index * 9} 430 ${54 + index * 7} 680 ${154 + index * 6}C960 ${266 + index * 4} 1180 ${294 + index * 5} 1500 ${178 + index * 6}`}
            stroke="url(#home-wave-b)"
            strokeWidth="0.8"
            opacity={0.15 + index * 0.012}
          />
        ))}
        <defs>
          <linearGradient id="home-wave-b" x1="0" y1="0" x2="1500" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="0.45" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="absolute right-[2%] top-[38%] hidden h-48 w-48 opacity-[0.12] lg:block" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path d="M60 10L94 24V52C94 78 80 96 60 108C40 96 26 78 26 52V24L60 10Z" stroke="#2563EB" strokeWidth="3" />
        <path d="M43 58L55 70L80 43" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {particles.map((particle, index) => {
        const dotSize = Math.max(2, Math.round(particle.size * 0.68));

        return (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className={`evada-particle-float absolute rounded-full ${particle.className ?? ""}`}
            style={
              {
                left: particle.left,
                top: particle.top,
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${dotSize * 5}px ${particle.shadow}`,
                "--delay": particle.delay,
                "--duration": particle.duration,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
