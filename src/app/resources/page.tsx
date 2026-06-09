import Link from "next/link";
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

function ResourcesHeroVisual() {
  const cardPositions = [
    "left-[22px] top-[46px]",
    "right-[22px] top-[58px]",
    "left-[0px] top-[478px]",
    "right-[0px] top-[478px]",
  ];

  return (
    <div className="resources-hero-visual relative mx-auto aspect-[1.28/1] min-h-[500px] w-full max-w-[820px] overflow-visible pb-10 sm:min-h-[540px] lg:min-h-[590px] lg:-mt-2 xl:-mt-4" aria-hidden="true">
      <div className="resources-hero-aurora absolute inset-[-8%]" />

      <div className="resources-hero-stage absolute left-1/2 top-[52.5%] h-[640px] w-[820px] -translate-x-1/2 -translate-y-1/2 scale-[0.34] sm:scale-[0.58] md:scale-[0.72] lg:top-[55%] lg:scale-[0.78] xl:scale-[0.84] 2xl:scale-[0.9]">
        <div className="resources-orbit resources-orbit-a" />
        <div className="resources-orbit resources-orbit-b" />
        <div className="resources-orbit resources-orbit-c" />

        <svg className="resources-connector-svg absolute inset-0 z-[4] h-full w-full overflow-visible" viewBox="0 0 820 640" fill="none">
          <defs>
            <linearGradient id="resources-connector-gradient" x1="78" y1="96" x2="724" y2="514" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.45" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="resources-white-orbit" x1="102" y1="126" x2="760" y2="548" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.86" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.16" />
            </linearGradient>
            <filter id="resources-node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="410" cy="340" rx="322" ry="208" stroke="url(#resources-white-orbit)" strokeWidth="1.2" />
          <ellipse className="resources-signal-path resources-signal-delay-a opacity-40" cx="410" cy="342" rx="264" ry="164" stroke="url(#resources-connector-gradient)" strokeDasharray="8 14" />
          <ellipse className="resources-signal-path resources-signal-delay-b opacity-50" cx="410" cy="342" rx="204" ry="126" stroke="url(#resources-white-orbit)" strokeDasharray="10 18" />

          <path className="resources-signal-path resources-signal-drop" d="M164 142C172 166 206 184 250 188" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-drop resources-signal-delay-a" d="M656 154C640 176 606 192 570 196" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path" d="M250 188C300 194 334 222 360 258" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-a" d="M570 196C524 202 490 226 460 258" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-b" d="M248 490C300 438 330 400 360 372" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-c" d="M574 490C526 438 492 400 460 372" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-d" d="M188 196C188 250 216 286 270 290H326" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-e" d="M638 206C638 262 610 298 556 300H496" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-c opacity-70" d="M128 512C226 548 318 534 410 496C516 452 612 476 736 522" stroke="url(#resources-white-orbit)" />

          {([
            [250, 188, "#22D3EE", 8],
            [570, 196, "#06B6D4", 8],
            [248, 490, "#22D3EE", 7],
            [574, 490, "#7C3AED", 7],
            [188, 196, "#FFFFFF", 5],
            [638, 206, "#FFFFFF", 5],
            [360, 368, "#FFFFFF", 5],
            [460, 368, "#FFFFFF", 5],
            [410, 214, "#22D3EE", 6],
            [410, 496, "#FFFFFF", 6],
          ] as Array<[number, number, string, number]>).map(([cx, cy, fill, r], index) => (
            <g key={`${cx}-${cy}`} className="resources-signal-node" style={{ animationDelay: `${index * 180}ms` }}>
              <circle cx={cx} cy={cy} r={r + 7} fill={fill} opacity="0.16" />
              <circle cx={cx} cy={cy} r={r} fill={fill} filter="url(#resources-node-glow)" />
            </g>
          ))}
        </svg>

        {([
          [14, 26, 7, 0],
          [24, 56, 10, 520],
          [41, 17, 6, 900],
          [72, 28, 8, 340],
          [84, 58, 11, 720],
          [62, 76, 7, 1120],
          [48, 54, 5, 1500],
        ] as Array<[number, number, number, number]>).map(([left, top, size, delay]) => (
          <span
            key={`${left}-${top}`}
            className="resources-particle absolute z-[3]"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}ms`,
            }}
          />
        ))}

        <span className="resources-cube absolute left-[16%] top-[32%]" />
        <span className="resources-cube absolute left-[30%] top-[19%]" style={{ animationDelay: "850ms" }} />
        <span className="resources-cube absolute right-[17%] top-[31%]" style={{ animationDelay: "1.3s" }} />
        <span className="resources-cube absolute bottom-[20%] right-[28%]" style={{ animationDelay: "1.9s" }} />
        <span className="resources-cube absolute bottom-[34%] left-[24%]" style={{ animationDelay: "2.2s" }} />

        {floatingCards.map((card, index) => {
          const Icon = card.Icon;

          return (
            <div
              key={card.title}
              className={`resources-floating-card group absolute z-40 rounded-[22px] border border-blue-100/90 bg-white/88 p-4 shadow-[0_20px_54px_rgba(37,99,235,0.12)] backdrop-blur-xl ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_72px_rgba(37,99,235,0.16)] ${cardPositions[index]}`}
              style={{ animationDelay: `${index * 420}ms` }}
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#F8FBFF,#EEF5FF_48%,#F5F3FF)] text-[#2563EB] shadow-[inset_0_0_18px_rgba(37,99,235,0.08),0_10px_24px_rgba(37,99,235,0.1)] ring-1 ring-blue-100 transition group-hover:shadow-[inset_0_0_22px_rgba(34,211,238,0.14),0_13px_30px_rgba(37,99,235,0.14)]">
                  <Icon className="h-6 w-6" strokeWidth={2.05} />
                </span>
                <span className="min-w-0">
                  <span className="block whitespace-nowrap text-[18px] font-bold leading-tight tracking-[-0.02em] text-slate-950">{card.title}</span>
                  <span className="mt-2 block text-[12.5px] font-normal leading-[1.45] text-slate-600">{card.text}</span>
                </span>
              </div>
            </div>
          );
        })}

        <div className="resources-knowledge-core absolute left-1/2 top-[55%] z-10 h-[430px] w-[560px] -translate-x-1/2 -translate-y-1/2">
          <div className="resources-knowledge-halo" />
          <div className="resources-base resources-base-back" />
          <div className="resources-base resources-base-mid" />
          <div className="resources-base resources-base-front" />
          <div className="resources-glow-disc resources-glow-disc-a" />
          <div className="resources-glow-disc resources-glow-disc-b" />

          <div className="resources-book">
            <div className="resources-page resources-page-left">
              <div className="resources-page-copy resources-page-copy-left">
                <em>About EVADA</em>
                <small>Platform docs</small>
              </div>
              <span />
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="resources-page resources-page-right">
              <div className="resources-page-copy resources-page-copy-right">
                <strong>Security Guides</strong>
                <small>Best practices</small>
              </div>
              <span />
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="resources-book-spine" />
          </div>

          <div className="resources-shield">
            <BookOpen className="h-16 w-16" strokeWidth={1.9} />
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

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Resources
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.02] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Knowledge.</span>
              <span className="block">Guidance.</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">Security confidence.</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] font-normal leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
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
