import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cpu,
  Rocket,
  ShieldCheck,
  ShieldUser,
  UserCheck,
} from "lucide-react";

type CompanyVisualCard = {
  title: string;
  text: string;
  Icon: LucideIcon;
  accent: string;
};

type CompanyVisualPill = {
  label: string;
  Icon: LucideIcon;
  className: string;
  delay: string;
};

const heroCards: CompanyVisualCard[] = [
  {
    title: "AI-Driven Validation",
    text: "Smarter validation with AI that learns, adapts and accelerates security outcomes.",
    Icon: BrainCircuit,
    accent: "from-violet-500 via-blue-500 to-cyan-400",
  },
  {
    title: "Built With Security Teams",
    text: "Designed for teams that need validation with confidence, control and trust.",
    Icon: ShieldUser,
    accent: "from-blue-500 via-cyan-400 to-violet-500",
  },
  {
    title: "Human Expertise",
    text: "Deep security expertise ensures context, judgement and real-world impact.",
    Icon: UserCheck,
    accent: "from-blue-500 via-violet-500 to-cyan-400",
  },
  {
    title: "Built for the Future",
    text: "Continuously evolving to help teams validate real risk as environments change.",
    Icon: Rocket,
    accent: "from-cyan-400 via-blue-500 to-violet-500",
  },
];

const desktopCardPositions = [
  "left-[4%] top-[20%]",
  "right-[4%] top-[20%]",
  "left-[4%] top-[58%]",
  "right-[4%] top-[58%]",
];

const pills: CompanyVisualPill[] = [
  { label: "AI-Powered", Icon: Cpu, className: "left-[1%] top-[2%]", delay: "-0.8s" },
  { label: "Secure & Trusted", Icon: ShieldCheck, className: "right-[2%] top-[4%]", delay: "-1.7s" },
];

const particles = [
  ["8%", "18%", "3px", "rgba(37,99,235,0.42)", "-1s"],
  ["20%", "72%", "5px", "rgba(34,211,238,0.52)", "-4s"],
  ["32%", "10%", "4px", "rgba(255,255,255,0.88)", "-7s"],
  ["45%", "24%", "6px", "rgba(255,255,255,0.92)", "-2s"],
  ["55%", "85%", "4px", "rgba(124,58,237,0.48)", "-5s"],
  ["68%", "16%", "3px", "rgba(34,211,238,0.5)", "-8s"],
  ["78%", "69%", "5px", "rgba(255,255,255,0.9)", "-3s"],
  ["91%", "29%", "4px", "rgba(124,58,237,0.46)", "-6s"],
] as const;

function CompanyHeroCard({ card, index }: { card: CompanyVisualCard; index: number }) {
  const Icon = card.Icon;

  return (
    <div
      className="company-ai-card rounded-[20px] border border-blue-100/80 bg-white/92 p-3.5 shadow-[0_20px_58px_rgba(37,99,235,0.11)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_72px_rgba(37,99,235,0.15)]"
      style={{ "--delay": `${index * -0.7}s`, "--duration": `${7.2 + index * 0.45}s` } as CSSProperties}
    >
      <div className="flex items-start gap-3">
        <span className="company-ai-icon-bubble grid h-9 w-9 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50/80 text-[#2563EB] shadow-inner">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-tight text-slate-950">{card.title}</h3>
          <span className={`mt-2 block h-1 w-10 rounded-full bg-gradient-to-r ${card.accent}`} />
        </div>
      </div>
      <p className="mt-2.5 text-[11.5px] font-medium leading-[1.58] text-slate-600">{card.text}</p>
    </div>
  );
}

function CompanyHeroPill({ pill }: { pill: CompanyVisualPill }) {
  const Icon = pill.Icon;

  return (
    <div className={`absolute z-40 ${pill.className}`}>
      <div
        className="company-ai-pill inline-flex items-center gap-2 rounded-full border border-blue-100/80 bg-white/88 px-3.5 py-2 text-[12px] font-bold text-slate-800 shadow-[0_12px_34px_rgba(37,99,235,0.10)] backdrop-blur-xl"
        style={{ "--delay": pill.delay, "--duration": "7s" } as CSSProperties}
      >
        <Icon className="h-4 w-4 text-[#2563EB]" strokeWidth={2.2} />
        {pill.label}
      </div>
    </div>
  );
}

function CompanyConnectorSvg({ idPrefix }: { idPrefix: string }) {
  const nodes = [
    [250, 180, "#22D3EE"],
    [540, 195, "#22D3EE"],
    [245, 430, "#06B6D4"],
    [545, 430, "#06B6D4"],
    [390, 122, "#FFFFFF"],
    [390, 528, "#FFFFFF"],
    [188, 298, "#7C3AED"],
    [592, 298, "#7C3AED"],
  ] as const;

  return (
    <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible" viewBox="0 0 780 620" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${idPrefix}-connector`} x1="0" y1="0" x2="780" y2="620" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id={`${idPrefix}-node-glow`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(390 322) rotate(90) scale(290 360)">
          <stop stopColor="white" stopOpacity="0.8" />
          <stop offset="0.45" stopColor="#22D3EE" stopOpacity="0.22" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="32" y="24" width="716" height="560" rx="70" fill={`url(#${idPrefix}-node-glow)`} opacity="0.5" />
      <path d="M94 126L168 92L244 132L338 86L430 138L544 92L674 146" stroke="#93C5FD" strokeWidth="1" strokeDasharray="8 18" opacity="0.28" />
      <path d="M70 482L162 430L272 492L374 446L498 512L690 456" stroke="#22D3EE" strokeWidth="1" strokeDasharray="8 18" opacity="0.26" />
      <path d="M660 86L702 164L678 278L726 370L690 530" stroke="#A78BFA" strokeWidth="1" strokeDasharray="7 16" opacity="0.25" />

      <ellipse className="company-ai-orbit-line" cx="390" cy="322" rx="270" ry="198" stroke="white" strokeWidth="1.1" opacity="0.58" />
      <ellipse className="company-ai-orbit-line company-ai-orbit-line-b" cx="390" cy="322" rx="224" ry="158" stroke="#22D3EE" strokeWidth="1.1" strokeDasharray="8 14" opacity="0.32" />
      <ellipse className="company-ai-orbit-line company-ai-orbit-line-c" cx="390" cy="322" rx="170" ry="110" stroke="#7C3AED" strokeWidth="1" opacity="0.2" />

      <path className="company-ai-connector" d="M250 180C315 205 355 245 390 300" stroke={`url(#${idPrefix}-connector)`} />
      <path className="company-ai-connector company-ai-connector-delay-a" d="M540 195C500 225 465 260 425 305" stroke={`url(#${idPrefix}-connector)`} />
      <path className="company-ai-connector company-ai-connector-delay-b" d="M245 430C315 405 360 375 392 340" stroke={`url(#${idPrefix}-connector)`} />
      <path className="company-ai-connector company-ai-connector-delay-c" d="M545 430C500 405 465 375 428 340" stroke={`url(#${idPrefix}-connector)`} />
      <path className="company-ai-connector company-ai-connector-delay-d" d="M180 300C260 165 520 165 600 300" stroke={`url(#${idPrefix}-connector)`} opacity="0.45" />
      <path className="company-ai-connector company-ai-connector-delay-e" d="M170 405C270 535 520 535 620 405" stroke={`url(#${idPrefix}-connector)`} opacity="0.45" />

      {nodes.map(([cx, cy, fill], index) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="15" fill={fill} opacity="0.14" />
          <circle
            className="company-ai-node"
            cx={cx}
            cy={cy}
            r={fill === "#FFFFFF" ? "5" : "6"}
            fill={fill}
            style={{ "--delay": `${index * -0.35}s` } as CSSProperties}
          />
        </g>
      ))}
    </svg>
  );
}

function CompanyAiCore({ compact = false, idPrefix }: { compact?: boolean; idPrefix: string }) {
  const coreSizeClass = compact ? "h-[350px] w-[350px]" : "h-[318px] w-[318px]";
  const glowSizeClass = compact ? "h-[360px] w-[360px]" : "h-[324px] w-[324px]";
  const baseSizeClass = compact ? "h-[178px] w-[310px]" : "h-[154px] w-[270px]";
  const shieldSizeClass = compact ? "top-[34px] h-[224px] w-[208px]" : "top-[32px] h-[196px] w-[182px]";

  return (
    <div className={`absolute left-1/2 top-[52%] z-30 ${compact ? "company-ai-core-wrap-compact" : "-translate-x-1/2 -translate-y-1/2"}`}>
      <div className={`company-ai-core relative ${coreSizeClass}`}>
        <div className={`company-ai-core-glow absolute left-1/2 top-1/2 ${glowSizeClass} -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl`} />
        <div className="company-ai-ring company-ai-ring-a" />
        <div className="company-ai-ring company-ai-ring-b" />

        <svg className={`absolute left-1/2 top-[55%] z-10 ${baseSizeClass} -translate-x-1/2`} viewBox="0 0 330 190" fill="none" aria-hidden="true">
          <ellipse cx="165" cy="138" rx="132" ry="32" fill="rgba(37,99,235,0.20)" />
          <ellipse cx="165" cy="108" rx="122" ry="34" fill={`url(#${idPrefix}-base-top)`} stroke="rgba(255,255,255,0.78)" strokeWidth="2" />
          <ellipse cx="165" cy="122" rx="150" ry="42" fill={`url(#${idPrefix}-base-mid)`} opacity="0.92" />
          <ellipse cx="165" cy="94" rx="96" ry="25" fill="rgba(255,255,255,0.86)" stroke="rgba(34,211,238,0.42)" strokeWidth="2" />
          <path d="M54 126C92 156 240 156 276 126" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" opacity="0.82" />
          <path d="M86 137C124 155 210 156 244 137" stroke="white" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          <defs>
            <linearGradient id={`${idPrefix}-base-top`} x1="61" y1="83" x2="254" y2="139" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.46" stopColor="#DFFBFF" />
              <stop offset="1" stopColor="#EDE9FE" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-base-mid`} x1="36" y1="92" x2="294" y2="164" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" stopOpacity="0.3" />
              <stop offset="0.54" stopColor="#2563EB" stopOpacity="0.56" />
              <stop offset="1" stopColor="#7C3AED" stopOpacity="0.52" />
            </linearGradient>
          </defs>
        </svg>

        <svg className={`company-ai-shield absolute left-1/2 z-20 ${shieldSizeClass} -translate-x-1/2`} viewBox="0 0 240 260" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${idPrefix}-shield-fill`} x1="36" y1="32" x2="214" y2="226" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="0.48" stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id={`${idPrefix}-shield-edge`} x1="36" y1="36" x2="214" y2="220" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" />
              <stop offset="0.5" stopColor="#A5F3FC" />
              <stop offset="1" stopColor="#DDD6FE" />
            </linearGradient>
          </defs>
          <path d="M120 12L214 50V118C214 184 178 224 120 248C62 224 26 184 26 118V50L120 12Z" fill={`url(#${idPrefix}-shield-fill)`} />
          <path d="M120 12L214 50V118C214 184 178 224 120 248C62 224 26 184 26 118V50L120 12Z" stroke={`url(#${idPrefix}-shield-edge)`} strokeWidth="5" />
          <path d="M120 32L194 62V118C194 170 166 202 120 224C74 202 46 170 46 118V62L120 32Z" stroke="rgba(255,255,255,0.34)" strokeWidth="2" />

          <g stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6">
            <path d="M91 86C78 86 67 97 67 111C55 115 47 126 47 140C47 157 61 171 78 171H88" />
            <path d="M149 86C162 86 173 97 173 111C185 115 193 126 193 140C193 157 179 171 162 171H152" />
            <path d="M91 86C91 70 104 58 120 58C136 58 149 70 149 86V184" />
            <path d="M91 86V184" />
            <path d="M91 119H76" />
            <path d="M149 119H164" />
            <path d="M91 148H73" />
            <path d="M149 148H167" />
            <path d="M108 140L119 151L142 124" />
          </g>
          <g fill="white">
            <circle cx="73" cy="119" r="4" />
            <circle cx="167" cy="119" r="4" />
            <circle cx="73" cy="148" r="4" />
            <circle cx="167" cy="148" r="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function MobileCompanyVisual() {
  return (
    <div className="lg:hidden">
      <div className="relative mx-auto h-[290px] w-full max-w-[390px] overflow-visible">
        <CompanyConnectorSvg idPrefix="company-ai-mobile" />
        <CompanyAiCore compact idPrefix="company-ai-mobile" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {heroCards.map((card) => {
          const Icon = card.Icon;

          return (
            <article key={card.title} className="rounded-[22px] border border-blue-100 bg-white/92 p-5 shadow-[0_18px_50px_rgba(37,99,235,0.10)]">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-[#2563EB]">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-tight text-slate-950">{card.title}</h3>
                  <span className={`mt-3 block h-1 w-12 rounded-full bg-gradient-to-r ${card.accent}`} />
                </div>
              </div>
              <p className="mt-4 text-[14px] font-medium leading-6 text-slate-600">{card.text}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function CompanyHeroVisual() {
  return (
    <div className="company-ai-hero-visual relative mx-auto w-full max-w-[820px] overflow-visible">
      <div className="hidden lg:block">
        <div className="company-ai-stage relative mx-auto aspect-[1.25/1] w-full max-w-[820px] overflow-visible">
          <div className="company-ai-ambient absolute inset-[-7%]" />
          <div className="company-ai-mesh absolute right-[-5%] top-[4%] h-[82%] w-[48%]" />
          <CompanyConnectorSvg idPrefix="company-ai-desktop" />
          {particles.map(([left, top, size, color, delay]) => (
            <span
              key={`${left}-${top}`}
              className="company-ai-particle absolute z-20 rounded-full"
              style={{ left, top, width: size, height: size, backgroundColor: color, "--delay": delay } as CSSProperties}
            />
          ))}
          <CompanyAiCore idPrefix="company-ai-desktop" />
          {heroCards.map((card, index) => (
            <div key={card.title} className={`absolute z-40 ${desktopCardPositions[index]}`}>
              <CompanyHeroCard card={card} index={index} />
            </div>
          ))}
          {pills.map((pill) => (
            <CompanyHeroPill key={pill.label} pill={pill} />
          ))}
        </div>
      </div>

      <MobileCompanyVisual />
    </div>
  );
}
