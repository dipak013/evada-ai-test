import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";
import MarketingScrollOptimizer from "@/components/marketing/MarketingScrollOptimizer";

type IconItem = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

type FeaturedResource = IconItem & {
  badge: string;
  cta: string;
};

type LearningPath = {
  badge: string;
  title: string;
  description: string;
  checklist: string[];
  meta: string;
  tone: "cyan" | "blue" | "purple";
};

const heroChips: IconItem[] = [
  { title: "Documentation", text: "Technical docs", Icon: marketingIconMap.documentation },
  { title: "Guides", text: "Step-by-step guidance", Icon: marketingIconMap.guides },
  { title: "API Reference", text: "Integrate and build", Icon: marketingIconMap["api-reference"] },
  { title: "Knowledge Hub", text: "Security insight", Icon: marketingIconMap["knowledge-hub"] },
];

const floatingCards: IconItem[] = [
  { title: "Documentation", text: "Technical guides and references", Icon: marketingIconMap.documentation },
  { title: "Knowledge Hub", text: "Vulnerability insights and research", Icon: marketingIconMap["knowledge-hub"] },
  { title: "Guides", text: "Tutorials and best practices", Icon: marketingIconMap.guides },
  { title: "Webinars", text: "Learn from experts and practitioners", Icon: marketingIconMap.webinars },
];

const featuredResources: FeaturedResource[] = [
  {
    badge: "GUIDE",
    title: "Getting Started with EVADA",
    text: "A practical walkthrough to configure your environment and run your first validation workflow.",
    cta: "Read Guide",
    Icon: marketingIconMap.launch,
  },
  {
    badge: "DOCUMENTATION",
    title: "EVADA Platform Documentation",
    text: "Technical documentation for platform features, integrations and APIs.",
    cta: "View Documentation",
    Icon: marketingIconMap.documentation,
  },
  {
    badge: "WHITEPAPER",
    title: "AI-Supported Security Validation Framework",
    text: "Understand EVADA's approach to controlled AI validation, risk context and evidence.",
    cta: "Download Whitepaper",
    Icon: marketingIconMap.whitepaper,
  },
  {
    badge: "WEBINAR",
    title: "Building a Modern Security Programme",
    text: "Watch our on-demand session on continuous validation and operational security.",
    cta: "Watch Now",
    Icon: marketingIconMap["webinar-recording"],
  },
];

const resourceTypes: IconItem[] = [
  { title: "Documentation", text: "Technical docs", Icon: marketingIconMap.documentation },
  { title: "Guides and Tutorials", text: "Practical guides", Icon: marketingIconMap.guides },
  { title: "API Reference", text: "Integration endpoints", Icon: marketingIconMap["api-reference"] },
  { title: "Blog and Insights", text: "Security articles", Icon: marketingIconMap["blog-insights"] },
  { title: "Webinars", text: "Expert sessions", Icon: marketingIconMap.webinars },
  { title: "Release Notes", text: "Product updates", Icon: marketingIconMap["release-notes"] },
];

const learningPaths: LearningPath[] = [
  {
    badge: "BEGINNER",
    title: "Platform Fundamentals",
    description: "Learn the basics of EVADA platform and core features.",
    checklist: ["Platform Overview", "User Management", "Running Your First Scan", "Understanding Results"],
    meta: "4 modules \u00B7 30 min",
    tone: "cyan",
  },
  {
    badge: "INTERMEDIATE",
    title: "Security Operations",
    description: "Deep dive into security operations and validation workflows.",
    checklist: ["Advanced Scanning", "AI Pentester Workflows", "Pipeline Management", "Reporting and Analytics"],
    meta: "6 modules \u00B7 2.5 hrs",
    tone: "blue",
  },
  {
    badge: "ADVANCED",
    title: "Enterprise Administration",
    description: "Master enterprise features and administration.",
    checklist: ["Multi-tenant Management", "RBAC and Permissions", "Agent Management", "Compliance and Audit"],
    meta: "5 modules \u00B7 3 hrs",
    tone: "purple",
  },
];

const popularTopics = [
  "How to run an AI-supported pentest",
  "Understanding vulnerability results",
  "Setting up agents and monitoring",
  "Integrating with external tools",
  "Managing users and permissions",
  "Best practices for security validation",
];

const learningToneClasses: Record<LearningPath["tone"], string> = {
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
};

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
      {children}
    </p>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-[760px] text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
          {text}
        </p>
      </div>
    </Reveal>
  );
}

function MiniArrowButton({ label, direction }: { label: string; direction: "left" | "right" }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-blue-100 bg-white text-[#2563EB] shadow-[0_12px_32px_rgba(37,99,235,0.10)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-blue-500/20"
    >
      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
    </button>
  );
}

function ResourcesKnowledgeHubIcon({
  className = "",
  idPrefix = "resources-knowledge-hub",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const boardFillId = `${idPrefix}-board-fill`;
  const boardStrokeId = `${idPrefix}-board-stroke`;
  const lineId = `${idPrefix}-line`;
  const glowId = `${idPrefix}-glow`;

  return (
    <svg
      aria-hidden="true"
      className={`resources-nexus-core-icon ${className}`}
      viewBox="0 0 190 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={boardFillId} x1="34" y1="34" x2="154" y2="154" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.48" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id={boardStrokeId} x1="34" y1="34" x2="154" y2="154" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.5" stopColor="rgba(191,239,255,0.94)" />
          <stop offset="1" stopColor="rgba(237,233,254,0.94)" />
        </linearGradient>

        <linearGradient id={lineId} x1="50" y1="58" x2="140" y2="138" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#BFDBFE" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>

        <filter id={glowId} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="4.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        className="resources-nexus-board"
        x="34"
        y="38"
        width="122"
        height="112"
        rx="30"
        fill={`url(#${boardFillId})`}
        stroke={`url(#${boardStrokeId})`}
        strokeWidth="4"
        filter={`url(#${glowId})`}
      />

      <rect
        className="resources-nexus-board-inner"
        x="48"
        y="52"
        width="94"
        height="84"
        rx="23"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.6"
      />

      <path
        className="resources-nexus-page resources-nexus-page-a"
        d="M63 68H91C97 68 101 72 101 78V124C101 128 98 131 94 131H68C62 131 58 127 58 121V73C58 70.2 60.2 68 63 68Z"
        fill="rgba(255,255,255,0.18)"
        stroke="white"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      <path
        className="resources-nexus-page resources-nexus-page-b"
        d="M99 68H127C129.8 68 132 70.2 132 73V121C132 127 128 131 122 131H96C92 131 89 128 89 124V78C89 72 93 68 99 68Z"
        fill="rgba(255,255,255,0.13)"
        stroke="white"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      <path
        className="resources-nexus-page-spine"
        d="M95 75V128"
        stroke={`url(#${lineId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        className="resources-nexus-copy-line resources-nexus-copy-line-a"
        d="M69 84H86M69 97H86M69 110H82"
        stroke={`url(#${lineId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        className="resources-nexus-copy-line resources-nexus-copy-line-b"
        d="M106 84H123M106 97H123M106 110H118"
        stroke={`url(#${lineId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        className="resources-nexus-search-lens"
        cx="119"
        cy="116"
        r="19"
        fill="rgba(255,255,255,0.16)"
        stroke="white"
        strokeWidth="4"
        filter={`url(#${glowId})`}
      />

      <path
        className="resources-nexus-search-handle"
        d="M132 129L145 142"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />

      <path
        className="resources-nexus-check"
        d="M110.5 116.5L117 123L129 109"
        stroke="white"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="resources-nexus-circuit"
        d="M58 144H45M132 144H145M95 146V162M50 86H37M153 86H140"
        stroke="rgba(191,239,255,0.96)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle className="resources-nexus-svg-node resources-nexus-svg-node-a" cx="37" cy="86" r="3.9" fill="#A7F3FF" />
      <circle className="resources-nexus-svg-node resources-nexus-svg-node-b" cx="153" cy="86" r="3.9" fill="#DDD6FE" />
      <circle className="resources-nexus-svg-node resources-nexus-svg-node-c" cx="95" cy="162" r="4.1" fill="#BFDBFE" />
    </svg>
  );
}

function ResourcesNexusCard({
  card,
  index,
  compact = false,
}: {
  card: IconItem;
  index: number;
  compact?: boolean;
}) {
  const Icon = card.Icon;

  return (
    <div
      className="resources-nexus-card-float"
      style={
        {
          "--delay": `${index * 0.2}s`,
          "--duration": `${7.2 + index * 0.28}s`,
        } as CSSProperties
      }
    >
      <div
        className={`resources-nexus-card group relative overflow-hidden border border-blue-100/80 shadow-[0_18px_48px_rgba(37,99,235,0.105)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(37,99,235,0.16)] ${
          compact
            ? "min-h-[116px] rounded-[18px] p-3"
            : "flex min-h-[104px] w-[192px] items-start gap-3 rounded-[20px] p-3.5"
        }`}
      >
        <div className={compact ? "flex items-start gap-3" : "contents"}>
          <span
            className={`${compact ? "h-9 w-9" : "h-10 w-10"} grid shrink-0 place-items-center rounded-full bg-white text-[#2563EB] shadow-[0_12px_26px_rgba(37,99,235,0.12)] ring-1 ring-blue-100 transition group-hover:shadow-[0_0_0_7px_rgba(34,211,238,0.08),0_14px_30px_rgba(37,99,235,0.16)]`}
          >
            <span className={`${compact ? "h-7 w-7" : "h-8 w-8"} grid place-items-center rounded-full bg-[linear-gradient(135deg,#F8FBFF,#F5F3FF)]`}>
              <Icon className={`${compact ? "h-[15px] w-[15px]" : "h-[18px] w-[18px]"}`} strokeWidth={2.1} />
            </span>
          </span>

          <span className="min-w-0">
            <span className={`${compact ? "text-[13px]" : "text-[14px]"} block font-bold leading-tight text-[#071633]`}>
              {card.title}
            </span>
            <span className="mt-1 block h-[3px] w-8 rounded-full bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]" />
            <span className={`${compact ? "mt-1 text-[10.7px]" : "mt-1 text-[11.1px]"} block font-medium leading-[1.45] text-slate-600`}>
              {card.text}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ResourcesNexusPill({
  label,
  Icon,
  index,
}: {
  label: string;
  Icon: LucideIcon;
  index: number;
}) {
  return (
    <div
      className="resources-nexus-pill-float"
      style={
        {
          "--delay": `${index * 0.24}s`,
          "--duration": `${6.2 + index * 0.3}s`,
        } as CSSProperties
      }
    >
      <div className="resources-nexus-pill flex items-center gap-2 rounded-full border border-blue-100/80 bg-white/90 px-3 py-2 shadow-[0_14px_40px_rgba(37,99,235,0.09)] backdrop-blur-xl">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] ring-1 ring-blue-100">
          <Icon className="h-[15px] w-[15px]" strokeWidth={2.15} />
        </span>
        <span className="whitespace-nowrap text-[11px] font-bold leading-tight text-slate-800">{label}</span>
      </div>
    </div>
  );
}

function ResourcesNexusCore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`resources-nexus-core-float relative ${compact ? "h-[255px] w-[300px]" : "h-[300px] w-[330px]"}`}>
      <div className="resources-nexus-core-aurora" />

      <div className="resources-nexus-core-ring resources-nexus-core-ring-a" />
      <div className="resources-nexus-core-ring resources-nexus-core-ring-b" />
      <div className="resources-nexus-core-ring resources-nexus-core-ring-c" />

      <div className="resources-nexus-core-beam resources-nexus-core-beam-a" />
      <div className="resources-nexus-core-beam resources-nexus-core-beam-b" />

      <div className="resources-nexus-core-base resources-nexus-core-base-shadow" />
      <div className="resources-nexus-core-base resources-nexus-core-base-back" />
      <div className="resources-nexus-core-base resources-nexus-core-base-mid" />
      <div className="resources-nexus-core-base resources-nexus-core-base-front" />

      <div className={`resources-nexus-core-shell ${compact ? "resources-nexus-core-shell-compact" : ""}`}>
        <span className="resources-nexus-scan-ring" />
        <span className="resources-nexus-scan-ring resources-nexus-scan-ring-b" />
        <span className="resources-nexus-orbit-dot resources-nexus-orbit-dot-a" />
        <span className="resources-nexus-orbit-dot resources-nexus-orbit-dot-b" />
        <span className="resources-nexus-orbit-dot resources-nexus-orbit-dot-c" />

        <ResourcesKnowledgeHubIcon
          idPrefix={compact ? "resources-mobile-core" : "resources-desktop-core"}
          className={compact ? "h-[136px] w-[136px]" : "h-[154px] w-[154px]"}
        />
      </div>

      <div className={`absolute left-1/2 z-40 -translate-x-1/2 text-center ${compact ? "bottom-[4px] w-[190px]" : "bottom-[8px] w-[220px]"}`}>
        <p className={`${compact ? "text-[16px]" : "text-[18px]"} font-bold leading-none tracking-[-0.02em] text-[#071633]`}>
          Knowledge Hub
        </p>
        <p className={`${compact ? "mt-1 text-[11px]" : "mt-1.5 text-[12px]"} font-semibold text-slate-600`}>
          Docs, guides and research
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]" />
      </div>
    </div>
  );
}

function ResourcesHeroVisual() {
  const cardSlots: Array<{ left?: string; right?: string; top: string }> = [
    { left: "2%", top: "14%" },
    { right: "2%", top: "14%" },
    { left: "2%", top: "63%" },
    { right: "2%", top: "63%" },
  ];

  const particles: Array<[number, number, number, number, number]> = [
    [18, 20, 7, 0, 8.4],
    [36, 12, 5, 320, 9.2],
    [67, 18, 6, 680, 7.8],
    [82, 34, 9, 980, 8.8],
    [24, 52, 5, 1240, 9.4],
    [76, 58, 6, 1540, 8.2],
    [42, 78, 7, 1840, 9.6],
    [60, 82, 5, 2140, 8.6],
  ];

  return (
    <div
      className="resources-nexus-visual relative mx-auto w-full max-w-[800px] overflow-visible lg:-mt-2 xl:-mt-4"
      aria-hidden="true"
    >
      <div className="hidden lg:block">
        <div className="resources-nexus-shell relative h-[548px] w-full overflow-visible">
          <div className="resources-nexus-ambient absolute inset-[-6%] rounded-full" />
          <div className="resources-nexus-mesh absolute right-[2%] top-[4%] h-[230px] w-[310px]" />
          <div className="resources-nexus-mesh absolute bottom-[6%] left-[4%] h-[190px] w-[260px] rotate-180 opacity-55" />

          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            viewBox="0 0 820 560"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="resourcesNexusConnector" x1="90" y1="90" x2="730" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.48" stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>

              <filter id="resourcesNexusNodeGlow" x="-90%" y="-90%" width="280%" height="280%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="410" cy="282" rx="248" ry="184" fill="rgba(255,255,255,0.13)" />
            <ellipse
              className="resources-nexus-orbit-path"
              cx="410"
              cy="282"
              rx="258"
              ry="190"
              stroke="url(#resourcesNexusConnector)"
              strokeWidth="1.8"
              strokeDasharray="8 13"
            />
            <ellipse
              className="resources-nexus-orbit-path resources-nexus-orbit-path-slow"
              cx="410"
              cy="282"
              rx="182"
              ry="132"
              stroke="#60A5FA"
              strokeWidth="1.25"
              strokeDasharray="4 11"
            />
            <ellipse cx="410" cy="282" rx="130" ry="94" stroke="rgba(255,255,255,0.56)" strokeWidth="1.1" />

            <path className="resources-nexus-connector" d="M234 168C304 176 346 218 378 258" stroke="url(#resourcesNexusConnector)" />
            <path className="resources-nexus-connector" d="M586 168C516 176 474 218 442 258" stroke="url(#resourcesNexusConnector)" style={{ "--delay": "-0.8s" } as CSSProperties} />
            <path className="resources-nexus-connector" d="M234 396C306 370 346 334 378 304" stroke="url(#resourcesNexusConnector)" style={{ "--delay": "-1.6s" } as CSSProperties} />
            <path className="resources-nexus-connector" d="M586 396C514 370 474 334 442 304" stroke="url(#resourcesNexusConnector)" style={{ "--delay": "-2.4s" } as CSSProperties} />

            <path
              className="resources-nexus-connector resources-nexus-connector-soft"
              d="M136 280C226 132 594 132 684 280"
              stroke="url(#resourcesNexusConnector)"
              style={{ "--delay": "-3.2s" } as CSSProperties}
            />
            <path
              className="resources-nexus-connector resources-nexus-connector-soft"
              d="M132 346C236 482 584 482 688 346"
              stroke="url(#resourcesNexusConnector)"
              style={{ "--delay": "-4.4s" } as CSSProperties}
            />

            {([
              [234, 168, "#06B6D4"],
              [586, 168, "#7C3AED"],
              [234, 396, "#22D3EE"],
              [586, 396, "#7C3AED"],
              [378, 258, "#2563EB"],
              [442, 258, "#7C3AED"],
              [378, 304, "#22D3EE"],
              [442, 304, "#2563EB"],
              [410, 150, "#FFFFFF"],
              [410, 452, "#FFFFFF"],
            ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
              <g
                key={`${cx}-${cy}`}
                className="resources-nexus-signal-node"
                style={{ "--delay": `${index * 0.14}s` } as CSSProperties}
              >
                <circle cx={cx} cy={cy} r="12" fill={fill} opacity="0.14" />
                <circle cx={cx} cy={cy} r="5" fill={fill} filter="url(#resourcesNexusNodeGlow)" />
              </g>
            ))}
          </svg>

          {particles.map(([left, top, size, delay, duration]) => (
            <span
              key={`${left}-${top}`}
              className="resources-nexus-particle absolute z-20 rounded-full"
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  "--delay": `${delay}ms`,
                  "--duration": `${duration}s`,
                } as CSSProperties
              }
            />
          ))}

          <div className="absolute left-1/2 top-[51%] z-30 -translate-x-1/2 -translate-y-1/2">
            <ResourcesNexusCore />
          </div>

          {floatingCards.map((card, index) => {
            const slot = cardSlots[index] ?? cardSlots[0];

            return (
              <div
                key={card.title}
                className="absolute z-40"
                style={{
                  left: slot.left,
                  right: slot.right,
                  top: slot.top,
                }}
              >
                <ResourcesNexusCard card={card} index={index} />
              </div>
            );
          })}

          <div className="absolute left-[6%] top-[3%] z-40">
            <ResourcesNexusPill label="Technical docs" Icon={BookOpen} index={0} />
          </div>

          <div className="absolute right-[6%] top-[3%] z-40">
            <ResourcesNexusPill label="Searchable hub" Icon={Search} index={1} />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-100/80 bg-white/72 p-4 shadow-[0_18px_48px_rgba(37,99,235,0.10)] backdrop-blur-xl">
          <div className="resources-nexus-ambient absolute inset-0 rounded-[28px]" />
          <div className="resources-nexus-mesh absolute right-[-18%] top-[-8%] h-[210px] w-[250px]" />

          <div className="relative mx-auto h-[255px] max-w-[320px]">
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <ResourcesNexusCore compact />
            </div>
          </div>

          <div className="relative z-20 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {floatingCards.map((card, index) => (
              <ResourcesNexusCard key={card.title} card={card} index={index} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function HeroSection() {
  return (
    <section className="evada-home-hero evada-resources-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_36%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_58%,#FFFFFF_100%)]" />
      <div aria-hidden="true" className="resources-grid-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-[calc(100vw-2.5rem)] min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Resources
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Knowledge.</span>
              <span className="block">Guidance.</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">Security confidence.</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              Explore documentation, guides, webinars and expert resources to help your team get more value from EVADA&apos;s AI-supported security validation platform.
            </p>

            <div role="search" className="mt-8 flex w-full max-w-full flex-col gap-3 rounded-[18px] border border-blue-100 bg-white p-2 shadow-[0_18px_44px_rgba(37,99,235,0.12)] sm:max-w-[520px] sm:flex-row sm:items-center">
              <label htmlFor="resources-search" className="sr-only">
                Search resources
              </label>
              <div className="flex min-h-12 flex-1 items-center gap-3 px-4">
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-500" strokeWidth={2.2} />
                <input
                  id="resources-search"
                  type="search"
                  placeholder="Search documentation, guides, research and webinars..."
                  className="h-12 min-w-0 flex-1 bg-transparent text-[14px] font-normal text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="button"
                className="evada-gradient-cta inline-flex min-h-11 items-center justify-center rounded-full px-6 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[104px]"
              >
                Search
              </button>
            </div>

            <div className="mt-8 grid w-full max-w-full grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[560px] sm:grid-cols-4">
              {heroChips.map((chip) => {
                const Icon = chip.Icon;

                return (
                  <div key={chip.title} className="group flex min-w-0 flex-col items-center border-slate-200/80 text-center sm:border-l sm:first:border-l-0">
                    <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.10)] ring-1 ring-blue-100">
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <span className="mt-3 max-w-[118px] text-center">
                      <span className="block text-[11px] font-semibold leading-snug text-slate-950 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">{chip.title}</span>
                      <span className="mt-1 block text-[11px] font-normal leading-tight text-slate-600">{chip.text}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="w-full min-w-0">
          <ResourcesHeroVisual />
        </div>
      </div>
    </section>
  );
}

function FeaturedResourcesSection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-[1360px]">
        <div className="relative">
          <SectionIntro
            eyebrow="FEATURED RESOURCES"
            title="Handpicked resources to help you succeed"
            text="Essential content from our experts and community."
          />
          <div className="absolute right-0 top-3 hidden gap-3 lg:flex">
            <MiniArrowButton label="Previous featured resources" direction="left" />
            <MiniArrowButton label="Next featured resources" direction="right" />
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredResources.map((resource, index) => {
            const Icon = resource.Icon;

            return (
              <Reveal key={resource.title} delayMs={index * 80}>
                <article className="group flex min-h-[240px] flex-col rounded-[20px] border border-blue-100 bg-white p-6 shadow-[0_20px_55px_rgba(37,99,235,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(37,99,235,0.13)]">
                  <div className="flex items-start gap-5">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white shadow-[0_16px_34px_rgba(37,99,235,0.20)] transition group-hover:scale-105">
                      <Icon className="h-8 w-8" strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#2563EB] ring-1 ring-blue-100">
                        {resource.badge}
                      </span>
                      <h3 className="mt-3 text-[19px] font-black leading-snug tracking-[-0.01em] text-slate-950">
                        {resource.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 flex-1 text-[14px] font-medium leading-relaxed text-slate-600">{resource.text}</p>
                  <Link href="#" className="mt-5 inline-flex items-center gap-2 text-[14px] font-black text-[#2563EB] transition group-hover:translate-x-1">
                    {resource.cta}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ResourceLibrarySection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="RESOURCE LIBRARY" title="Explore by content type" text="Find the right resources for your needs." />

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {resourceTypes.map((resource, index) => {
            const Icon = resource.Icon;

            return (
              <Reveal key={resource.title} delayMs={index * 60}>
                <Link href="#" className="group block rounded-[18px] border border-blue-100 bg-white p-6 text-center shadow-[0_18px_48px_rgba(37,99,235,0.07)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_62px_rgba(37,99,235,0.12)]">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] bg-[linear-gradient(135deg,#EAF2FF,#F5F3FF)] text-[#2563EB] ring-1 ring-blue-100 transition group-hover:scale-105 group-hover:text-[#7C3AED]">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </span>
                  <span className="mt-4 block text-[15px] font-black leading-tight text-slate-950">{resource.title}</span>
                  <span className="mt-1 block text-[13px] font-semibold text-slate-600">{resource.text}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LearningPathsSection() {
  return (
    <section className="relative bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro
          eyebrow="LEARNING PATHS"
          title="Grow your security expertise"
          text="Curated learning paths for every role and skill level."
        />

        <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 lg:block">
          <MiniArrowButton label="Previous learning paths" direction="left" />
        </div>
        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 lg:block">
          <MiniArrowButton label="Next learning paths" direction="right" />
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {learningPaths.map((path, index) => (
            <Reveal key={path.title} delayMs={index * 90}>
              <article className="group flex min-h-[330px] flex-col rounded-[22px] border border-blue-100 bg-white p-7 shadow-[0_22px_60px_rgba(37,99,235,0.08)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_72px_rgba(37,99,235,0.12)]">
                <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ring-1 ${learningToneClasses[path.tone]}`}>
                  {path.badge}
                </span>
                <h3 className="mt-4 text-[22px] font-black tracking-[-0.015em] text-slate-950">{path.title}</h3>
                <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-600">{path.description}</p>
                <ul className="mt-5 grid gap-2.5">
                  {path.checklist.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#2563EB]" strokeWidth={2.2} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <div className="mb-2 flex items-center justify-between text-[13px] font-black text-slate-700">
                    <span>{path.meta}</span>
                    <span>0%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 ring-1 ring-blue-100">
                    <div className="h-full w-0 rounded-full bg-[linear-gradient(90deg,#2563EB,#7C3AED)]" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PopularTopicsSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro
          eyebrow="POPULAR TOPICS"
          title="Quick answers to common questions"
          text="Get help with frequently asked questions and practical guidance."
        />

        <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {popularTopics.map((topic, index) => (
            <Reveal key={topic} delayMs={index * 45}>
              <Link href="#" className="group flex min-h-14 items-center justify-between gap-4 rounded-[14px] border border-blue-100 bg-white px-5 py-4 text-[14px] font-black text-[#2563EB] shadow-[0_16px_42px_rgba(37,99,235,0.07)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/50">
                <span>{topic}</span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" strokeWidth={2.2} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="bg-white px-5 pb-12 pt-4 sm:px-8 lg:px-10">
      <Reveal>
        <div className="company-work-card problem-edge-card relative isolate mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] border border-white/10 px-6 py-7 shadow-[0_24px_70px_rgba(15,13,40,0.28)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
          <div aria-hidden="true" className="company-work-card-glow absolute inset-0" />
          <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] bg-white/12 text-white shadow-[0_0_44px_rgba(124,58,237,0.22)] ring-1 ring-white/18">
              <Mail aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.55rem,4.2vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
                Stay updated with the latest resources
              </h2>
              <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-slate-200/86 sm:text-[17px]">
                Get new guides, security insight and platform updates delivered to your inbox.
              </p>
            </div>
          </div>

          <div role="form" aria-label="Subscribe to resource updates" className="relative z-10 flex w-full flex-col gap-3 sm:flex-row lg:max-w-[520px]">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="min-h-[52px] min-w-0 flex-1 rounded-[14px] border border-blue-100 bg-white px-5 text-[15px] font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
            <button type="button" className="problem-edge-card problem-edge-card-compact evada-gradient-cta relative isolate inline-flex min-h-[52px] items-center justify-center overflow-hidden rounded-[14px] px-8 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
              Subscribe
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function ResourcesPage() {
  return (
    <main className="evada-homepage evada-resources-page evada-marketing-strict-lazy evada-marketing-scroll-optimized relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950" data-marketing-ready="false">
      <MarketingAnimatedBackground variant="resources" />
      <MarketingScrollOptimizer
        scrollLerp={0.22}
        settleDelayMs={100}
        strictActiveSectionAnimations
        wheelMultiplier={1.62}
      />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <FeaturedResourcesSection />
        <ResourceLibrarySection />
        <LearningPathsSection />
        <PopularTopicsSection />
        <NewsletterSection />
        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
