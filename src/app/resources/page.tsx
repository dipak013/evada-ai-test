import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Code2,
  FileText,
  Library,
  Mail,
  Newspaper,
  PlayCircle,
  Rocket,
  Search,
  ShieldCheck,
  Video,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

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
  { title: "Documentation", text: "Technical docs", Icon: FileText },
  { title: "Guides", text: "Step-by-step", Icon: ClipboardList },
  { title: "API Reference", text: "Integrate & build", Icon: Code2 },
  { title: "Knowledge Hub", text: "Security insights", Icon: ShieldCheck },
];

const floatingCards: IconItem[] = [
  { title: "Documentation", text: "Technical guides and references", Icon: Library },
  { title: "Knowledge Hub", text: "Vulnerability insights and research", Icon: ShieldCheck },
  { title: "Guides", text: "Tutorials and best practices", Icon: ClipboardList },
  { title: "Webinars", text: "Learn from experts and practitioners", Icon: Video },
];

const featuredResources: FeaturedResource[] = [
  {
    badge: "GUIDE",
    title: "Getting Started with EVADA Platform",
    text: "A complete walkthrough to set up your environment and run your first scan.",
    cta: "Read Guide",
    Icon: Rocket,
  },
  {
    badge: "DOCUMENTATION",
    title: "EVADA Platform Documentation",
    text: "Comprehensive technical documentation for all platform features and APIs.",
    cta: "View Documentation",
    Icon: BookOpen,
  },
  {
    badge: "WHITEPAPER",
    title: "AI-Assisted Security Validation Framework",
    text: "Understand our approach to AI-supported pentesting, governed validation, and risk analysis.",
    cta: "Download Whitepaper",
    Icon: ShieldCheck,
  },
  {
    badge: "WEBINAR",
    title: "Building a Modern Security Program",
    text: "Watch our on-demand webinar with industry experts and practitioners.",
    cta: "Watch Now",
    Icon: PlayCircle,
  },
];

const resourceTypes: IconItem[] = [
  { title: "Documentation", text: "Technical docs", Icon: FileText },
  { title: "Guides & Tutorials", text: "Practical guides", Icon: ClipboardList },
  { title: "API Reference", text: "Integration endpoints", Icon: Code2 },
  { title: "Blog & Insights", text: "Security articles", Icon: Newspaper },
  { title: "Webinars", text: "Expert sessions", Icon: Video },
  { title: "Release Notes", text: "Product updates", Icon: Bell },
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
    checklist: ["Advanced Scanning", "AI-Supported Pentest Workflows", "Pipeline Management", "Reporting & Analytics"],
    meta: "6 modules \u00B7 2.5 hrs",
    tone: "blue",
  },
  {
    badge: "ADVANCED",
    title: "Enterprise Administration",
    description: "Master enterprise features and administration.",
    checklist: ["Multi-tenant Management", "RBAC & Permissions", "Agent Management", "Audit-Ready Controls"],
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
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.55rem)] font-black leading-tight tracking-[-0.025em] text-slate-950">
          {title}
        </h2>
        <p className="mt-3 text-[15px] font-medium leading-relaxed text-slate-600 sm:text-[17px]">
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
  return (
    <div className="resources-hero-visual relative mx-auto h-[460px] w-full max-w-full sm:h-[520px] sm:max-w-[700px] lg:-mt-2 xl:-mt-4" aria-hidden="true">
      <div className="resources-hero-aurora absolute inset-0" />

      <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 scale-[0.54] sm:scale-[0.7] md:scale-[0.76] lg:scale-[0.8] xl:scale-[0.84] 2xl:scale-[0.88]">
        <div className="resources-orbit resources-orbit-a" />
        <div className="resources-orbit resources-orbit-b" />
        <div className="resources-orbit resources-orbit-c" />

        <svg className="resources-connector-svg absolute inset-0 z-[4] h-full w-full" viewBox="0 0 800 600" fill="none">
          <defs>
            <linearGradient id="resources-connector-gradient" x1="102" y1="116" x2="704" y2="488" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.45" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <path className="resources-signal-path" d="M184 152C248 178 282 196 338 190" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-a" d="M618 166C554 184 510 196 460 194" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-b" d="M164 424C238 394 276 386 346 410" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-c" d="M642 424C568 396 526 392 466 414" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-d" d="M218 170V238C218 260 236 278 258 278H318" stroke="url(#resources-connector-gradient)" />
          <path className="resources-signal-path resources-signal-delay-e" d="M680 188V260C680 282 662 300 640 300H558" stroke="url(#resources-connector-gradient)" />
          {[218, 318, 482, 680, 198, 344, 514, 640].map((x, index) => (
            <circle
              key={`${x}-${index}`}
              className="resources-signal-node"
              cx={x}
              cy={[238, 278, 194, 260, 424, 410, 414, 424][index]}
              r={index % 3 === 0 ? 7 : 5}
              fill={index % 2 ? "#22D3EE" : "#FFFFFF"}
            />
          ))}
        </svg>

        <span className="resources-cube absolute left-[16%] top-[32%]" />
        <span className="resources-cube absolute left-[30%] top-[19%]" style={{ animationDelay: "850ms" }} />
        <span className="resources-cube absolute right-[18%] top-[31%]" style={{ animationDelay: "1.3s" }} />
        <span className="resources-cube absolute bottom-[23%] right-[31%]" style={{ animationDelay: "1.9s" }} />
        <span className="resources-cube absolute bottom-[34%] left-[26%]" style={{ animationDelay: "2.2s" }} />

        {floatingCards.map((card, index) => {
          const Icon = card.Icon;
          const positions = [
            "left-[62px] top-[64px]",
            "right-[36px] top-[72px]",
            "left-[24px] bottom-[58px]",
            "right-[28px] bottom-[56px]",
          ];

          return (
            <div
              key={card.title}
              className={`resources-floating-card absolute z-30 rounded-[20px] border border-blue-100/90 bg-white/86 p-5 shadow-[0_20px_50px_rgba(37,99,235,0.14)] backdrop-blur-xl ring-1 ring-white/70 ${positions[index]}`}
              style={{ animationDelay: `${index * 420}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] shadow-[0_12px_30px_rgba(37,99,235,0.11)] ring-1 ring-blue-100">
                  <Icon className="h-8 w-8" strokeWidth={2.1} />
                </span>
                <span>
                  <span className="block text-[16px] font-semibold leading-tight text-slate-950">{card.title}</span>
                  <span className="mt-2 block text-[13px] font-normal leading-relaxed text-slate-600">{card.text}</span>
                </span>
              </div>
            </div>
          );
        })}

        <div className="absolute left-1/2 top-[51%] z-10 h-[390px] w-[520px] -translate-x-1/2 -translate-y-1/2">
          <div className="resources-base resources-base-back" />
          <div className="resources-base resources-base-mid" />
          <div className="resources-base resources-base-front" />
          <div className="resources-glow-disc resources-glow-disc-a" />
          <div className="resources-glow-disc resources-glow-disc-b" />

          <div className="resources-book">
            <div className="resources-page resources-page-left">
              <span />
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="resources-page resources-page-right">
              <span />
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="resources-book-spine" />
          </div>

          <div className="resources-shield">
            <BookOpen className="h-16 w-16" strokeWidth={1.95} />
          </div>
          <div className="resources-magnifier">
            <Search className="h-12 w-12" strokeWidth={2.1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_36%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_58%,#FFFFFF_100%)]" />
      <div aria-hidden="true" className="resources-grid-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Resources
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Security resources</span>
              <span className="block">for teams that</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">validate risk</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] font-normal leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              Explore EVADA documentation, guides, webinars, and practical security content for AI-assisted validation workflows.
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
                  placeholder="Search resources, docs, guides, blogs..."
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
          text="Get help with frequently asked questions and how-to guides."
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
        <div className="relative mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#EAF7FF_0%,#FFFFFF_45%,#F1E7FF_100%)] px-6 py-7 shadow-[0_24px_70px_rgba(37,99,235,0.12)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_78%_30%,rgba(124,58,237,0.18),transparent_34%)]" />
          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] bg-white text-[#2563EB] shadow-[0_0_44px_rgba(124,58,237,0.20)] ring-1 ring-blue-100">
              <Mail aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.65rem,4.4vw,2.35rem)] font-black leading-tight tracking-[-0.025em] text-slate-950">
                Stay updated with the latest resources
              </h2>
              <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-slate-600 sm:text-[17px]">
                Get new guides, security insights, and platform updates delivered to your inbox.
              </p>
            </div>
          </div>

          <div role="form" aria-label="Subscribe to resource updates" className="relative flex w-full flex-col gap-3 sm:flex-row lg:max-w-[520px]">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              className="min-h-[52px] min-w-0 flex-1 rounded-[14px] border border-blue-100 bg-white px-5 text-[15px] font-semibold text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
            <button type="button" className="evada-gradient-cta inline-flex min-h-[52px] items-center justify-center rounded-[14px] px-8 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5">
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
    <main className="evada-homepage evada-resources-page relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="resources" />
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
