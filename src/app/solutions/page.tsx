import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  Bug,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Code2,
  Factory,
  FileCheck2,
  FileText,
  HeartPulse,
  Landmark,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  ShoppingCart,
  Target,
  UploadCloud,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

type Feature = {
  label: string;
  Icon: LucideIcon;
};

type SolutionCard = {
  title: string;
  description: string;
  bullets: string[];
  Icon: LucideIcon;
};

type WorkflowStep = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

type Metric = {
  value: string;
  title: string;
  text: string;
  Icon: LucideIcon;
};

type Industry = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

const heroFeatures: Feature[] = [
  { label: "Continuous Validation", Icon: ShieldCheck },
  { label: "AI + Human Collaboration", Icon: BrainCircuit },
  { label: "Evidence-Backed Results", Icon: FileCheck2 },
  { label: "Enterprise-Grade Security", Icon: LockKeyhole },
];

const heroCards: Array<{ title: string; text: string; Icon: LucideIcon }> = [
  { title: "Discover", text: "Surface all exposures across your attack surface.", Icon: Compass },
  { title: "Prioritize", text: "Focus on what matters most with context and risk.", Icon: Target },
  { title: "Validate", text: "Confirm exploitability with controlled, AI-assisted tests.", Icon: CheckCircle2 },
  { title: "Remediate", text: "Fix with confidence and verify risk reduction.", Icon: Wrench },
];

const heroContextTags: Array<{ title: string; Icon: LucideIcon; className: string }> = [
  { title: "Security Signals", Icon: Bug, className: "left-[420px] top-[42px]" },
  { title: "Asset Inventory", Icon: UploadCloud, className: "right-[26px] top-[292px]" },
  { title: "Business Context", Icon: BarChart3, className: "left-[248px] bottom-[44px]" },
  { title: "Security Team", Icon: Users, className: "right-[134px] bottom-[18px]" },
];

const solutions: SolutionCard[] = [
  {
    title: "Application Security",
    description: "Continuously scan and validate web applications for vulnerabilities.",
    bullets: ["OWASP Top 10 Coverage", "Dynamic & Static Analysis", "False Positive Reduction"],
    Icon: Target,
  },
  {
    title: "Network Security",
    description: "Discover, map, and validate exposure across your network infrastructure.",
    bullets: ["Network Discovery", "Exposure Visualization", "Infrastructure Assessment"],
    Icon: Network,
  },
  {
    title: "AI-Supported Pentest",
    description: "AI-supported pentest workflows with controlled validation and sandboxing.",
    bullets: ["AI-Supported Pentest", "Sandbox Validation", "Evidence Generation"],
    Icon: BrainCircuit,
  },
  {
    title: "WebApp Scanner (ZAP)",
    description: "OWASP ZAP-powered scanning with real-time insights and reporting.",
    bullets: ["ZAP Integration", "Real-Time Scan Streaming", "Detailed Reports"],
    Icon: Zap,
  },
  {
    title: "Knowledge Hub",
    description: "Centralized vulnerability knowledge with AI-enriched insights.",
    bullets: ["Vulnerability Knowledge", "Exploit & Remediation Guidance", "AI Context & Patterns"],
    Icon: BookOpen,
  },
  {
    title: "Clients & Agents",
    description: "Manage clients, agents, licenses, and monitor agent health.",
    bullets: ["Agent Health Monitoring", "License Management", "Downloads & Uploads"],
    Icon: Users,
  },
  {
    title: "Reporting & Analytics",
    description: "Actionable reports and dashboards for data-driven decisions.",
    bullets: ["Executive Dashboards", "Custom Reports", "Risk Reduction Trends"],
    Icon: BarChart3,
  },
  {
    title: "Administration & RBAC",
    description: "Role-based access and multi-tenant administration at scale.",
    bullets: ["SaaS & Client Admin", "Permission Controls", "Audit-Ready Controls"],
    Icon: LockKeyhole,
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: "Ingest",
    description: "Collect findings from scanners, tools, and manual uploads.",
    Icon: UploadCloud,
  },
  {
    title: "Analyze",
    description: "AI-supported analysis deduplicates findings and prioritizes real risk.",
    Icon: Search,
  },
  {
    title: "Validate",
    description: "Controlled validation in a safe sandbox with human approval.",
    Icon: ShieldCheck,
  },
  {
    title: "Evidence",
    description: "Capture proof, impact, and system-level evidence.",
    Icon: FileCheck2,
  },
  {
    title: "Report",
    description: "Generate reports with impact, severity and remediation.",
    Icon: FileText,
  },
  {
    title: "Remediate",
    description: "Sync to your tools and close the remediation loop.",
    Icon: CheckCircle2,
  },
];

const metrics: Metric[] = [
  {
    value: "Proof",
    title: "Evidence-Backed Validation",
    text: "Focus on findings backed by controlled validation.",
    Icon: BadgeCheck,
  },
  {
    value: "Focus",
    title: "Clearer Risk Priorities",
    text: "Prioritize what attackers can realistically exploit.",
    Icon: Clock3,
  },
  {
    value: "Flow",
    title: "Connected Remediation",
    text: "Integrated workflows help teams move from evidence to action.",
    Icon: Target,
  },
  {
    value: "Trace",
    title: "Evidence-Backed Results",
    text: "Validation activity keeps proof, context, and audit history together.",
    Icon: BarChart3,
  },
];

const industries: Industry[] = [
  {
    title: "Technology",
    text: "Secure your applications, APIs, and cloud-native infrastructure.",
    Icon: Code2,
  },
  {
    title: "Financial Services",
    text: "Protect sensitive financial data and support audit-ready security programs.",
    Icon: Landmark,
  },
  {
    title: "Healthcare",
    text: "Secure patient data and critical healthcare infrastructure.",
    Icon: HeartPulse,
  },
  {
    title: "Retail & E-Commerce",
    text: "Protect customer data and ensure secure digital experiences.",
    Icon: ShoppingCart,
  },
  {
    title: "Manufacturing",
    text: "Secure OT, IT, and connected industrial environments.",
    Icon: Factory,
  },
  {
    title: "Government",
    text: "Strengthen cybersecurity with evidence-backed validation and clear reporting.",
    Icon: Building2,
  },
];

const integrations = [
  "Nessus",
  "Burp Suite",
  "Snyk",
  "Qualys",
  "Microsoft Sentinel",
  "AWS",
  "Palo Alto",
  "Slack",
  "Jira",
  "Okta",
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
      {children}
    </p>
  );
}

function SolutionsHeroVisual() {
  return (
    <div className="solutions-hero-visual relative mx-auto h-[500px] w-full max-w-full sm:h-[560px] sm:max-w-[760px] lg:-mt-4 xl:-mt-6" aria-hidden="true">
      <div className="solutions-hero-stage absolute left-1/2 top-1/2 h-[610px] w-[820px] -translate-x-1/2 -translate-y-1/2 scale-[0.56] sm:scale-[0.72] md:scale-[0.78] lg:scale-[0.82] xl:scale-[0.88] 2xl:scale-[0.92]">
        <div className="solutions-hex-backdrop absolute inset-0" />
        <div className="solutions-hex-dot-field absolute right-[-3%] top-[-10%] h-[260px] w-[320px]" />
        <div className="solutions-hex-dot-field absolute bottom-[-8%] right-[8%] h-[260px] w-[320px] rotate-180 opacity-70" />

      <svg className="absolute inset-0 z-0 h-full w-full" viewBox="0 0 820 610" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="solutions-hero-line" x1="154" y1="178" x2="704" y2="456" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="0.48" stopColor="#2563EB" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path className="solutions-hero-network-line" d="M410 300C320 246 260 188 172 166" stroke="url(#solutions-hero-line)" />
        <path className="solutions-hero-network-line solutions-hero-network-delay-a" d="M410 300C524 226 584 178 694 174" stroke="url(#solutions-hero-line)" />
        <path className="solutions-hero-network-line solutions-hero-network-delay-b" d="M410 300C314 346 238 378 144 392" stroke="url(#solutions-hero-line)" />
        <path className="solutions-hero-network-line solutions-hero-network-delay-c" d="M410 300C528 368 612 420 712 438" stroke="url(#solutions-hero-line)" />
        <path className="solutions-hero-network-line solutions-hero-network-delay-d" d="M410 300C426 174 456 86 548 68" stroke="url(#solutions-hero-line)" opacity="0.34" />
        <path className="solutions-hero-network-line solutions-hero-network-delay-e" d="M410 300C446 430 376 514 294 536" stroke="url(#solutions-hero-line)" opacity="0.34" />
        {[132, 208, 298, 410, 528, 636, 734].map((x, index) => (
          <circle key={x} className="solutions-hero-network-node" cx={x} cy={index % 2 ? 218 : 392} r="4" fill={index % 3 === 0 ? "#06B6D4" : index % 3 === 1 ? "#2563EB" : "#A78BFA"} />
        ))}
      </svg>

      {heroCards.map((card, index) => {
        const Icon = card.Icon;
        const positions = [
          "left-[30px] top-[120px] border-b-[#2563EB]",
          "right-[26px] top-[124px] border-b-[#7C3AED]",
          "left-[14px] top-[354px] border-b-[#06B6D4]",
          "right-[16px] top-[374px] border-b-[#7C3AED]",
        ];
        const iconTones = [
          "text-[#2563EB]",
          "text-[#7C3AED]",
          "text-[#06B6D4]",
          "text-[#7C3AED]",
        ];

        return (
          <div
            key={card.title}
            className={`solutions-challenge-card absolute z-30 min-h-[138px] w-[248px] rounded-[22px] border border-blue-100/80 bg-white/90 p-5 shadow-[0_24px_58px_rgba(37,99,235,0.14)] backdrop-blur-xl ${positions[index]}`}
            style={{ animationDelay: `${index * 170}ms` }}
          >
            <div className="flex gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-blue-100 bg-[linear-gradient(135deg,#F8FBFF,#F5F3FF)] shadow-[0_14px_34px_rgba(37,99,235,0.13)]">
                <Icon className={`h-8 w-8 ${iconTones[index]}`} strokeWidth={2.05} />
              </span>
              <span className="min-w-0">
                <span className="block text-[20px] font-semibold tracking-[-0.02em] text-slate-950">{card.title}</span>
                <span className="mt-2 block text-[13px] font-normal leading-relaxed text-slate-600">{card.text}</span>
              </span>
            </div>
            <ArrowRight aria-hidden="true" className={`absolute bottom-5 right-5 h-5 w-5 ${iconTones[index]}`} strokeWidth={2.1} />
          </div>
        );
      })}

      {heroContextTags.map((tag, index) => {
        const Icon = tag.Icon;

        return (
          <div
            key={tag.title}
            className={`solutions-context-pill absolute z-20 flex items-center gap-3 rounded-[14px] border border-blue-100/80 bg-white/78 px-4 py-3 shadow-[0_16px_38px_rgba(37,99,235,0.11)] backdrop-blur-xl ${tag.className}`}
            style={{ animationDelay: `${index * 210}ms` }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] ring-1 ring-blue-100">
              <Icon className="h-5 w-5" strokeWidth={2.1} />
            </span>
            <span className="max-w-[92px] text-[12px] font-semibold leading-snug text-slate-700">{tag.title}</span>
          </div>
        );
      })}

        <div className="solutions-hex-system absolute left-1/2 top-[308px] z-10 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2">
          <div className="solutions-hex-light" />
          <div className="solutions-hex-column solutions-hex-column-a" />
          <div className="solutions-hex-column solutions-hex-column-b" />
          <div className="solutions-hex-platform solutions-hex-platform-back" />
          <div className="solutions-hex-platform solutions-hex-platform-mid" />
          <div className="solutions-hex-platform solutions-hex-platform-front" />
          <div className="solutions-hex-core">
            <div className="solutions-hex-core-ring solutions-hex-core-ring-a" />
            <div className="solutions-hex-core-ring solutions-hex-core-ring-b" />
            <div className="solutions-hex-core-ring solutions-hex-core-ring-c" />
            <div className="solutions-hex-check" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_80%_14%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_84%_70%,rgba(34,211,238,0.13),transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_58%,#FFFFFF_100%)]" />
      <div aria-hidden="true" className="solutions-grid-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <Eyebrow>SOLUTIONS</Eyebrow>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Security</span>
              <span className="block">Validation for</span>
              <span className="block">Every</span>
              <span className="block bg-[linear-gradient(100deg,#2563EB_0%,#06B6D4_42%,#7C3AED_100%)] bg-clip-text text-transparent">Security Team</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA helps security, AppSec, and governance teams validate real risk, reduce noise, and prioritize fixes with evidence.
            </p>

            <div className="mt-8 grid w-full max-w-full grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[560px] sm:grid-cols-4">
              {heroFeatures.map((feature) => {
                const Icon = feature.Icon;

                return (
                  <div key={feature.label} className="group flex min-w-0 flex-col items-center border-slate-200/80 text-center sm:border-l sm:first:border-l-0">
                    <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-white text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.10)] ring-1 ring-blue-100">
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <span className="mt-3 max-w-[118px] text-[11px] font-semibold leading-snug text-slate-950 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="/book-demo"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[150px] sm:w-auto"
              >
                Book a Demo
              </Link>
              <Link
                href="/platform#architecture"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                Explore Platform Architecture
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0 max-w-full" delayMs={120}>
          <SolutionsHeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

function SolutionCardItem({ solution, index }: { solution: SolutionCard; index: number }) {
  const Icon = solution.Icon;

  return (
    <Reveal delayMs={index * 55}>
      <article className="group flex h-full flex-col rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_58px_rgba(37,99,235,0.14)]">
        <div className="flex items-start gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#7C3AED] shadow-[0_14px_34px_rgba(124,58,237,0.15)] ring-1 ring-blue-100 transition group-hover:text-[#2563EB] group-hover:shadow-[0_18px_42px_rgba(37,99,235,0.20)]">
            <Icon className="h-8 w-8" strokeWidth={2.05} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-tight text-[#071633]">{solution.title}</h3>
            <p className="mt-2 text-[13px] font-normal leading-relaxed text-slate-600">{solution.description}</p>
          </div>
        </div>

        <ul className="mt-5 grid gap-2.5">
          {solution.bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2.5 text-[12px] font-medium text-slate-700">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" strokeWidth={2.3} />
              {bullet}
            </li>
          ))}
        </ul>

        <Link
          href="/platform#modules"
          className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-[13px] font-semibold text-[#2563EB] transition group-hover:translate-x-1"
        >
          Learn more
          <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </article>
    </Reveal>
  );
}

function SolutionsGridSection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-16" id="solutions-grid">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>OUR SOLUTIONS</Eyebrow>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#071633] sm:text-[38px]">
              Complete Coverage. Continuous Confidence.
            </h2>
            <p className="mt-4 text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              From discovery to remediation, EVADA helps you validate what matters most.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {solutions.map((solution, index) => (
            <SolutionCardItem key={solution.title} solution={solution} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValidationWorkflowSection() {
  return (
    <section className="bg-white px-5 pb-12 pt-2 sm:px-8 lg:px-10 lg:pb-16" id="workflow">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[780px] text-center">
            <Eyebrow>HOW IT WORKS</Eyebrow>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#071633] sm:text-[36px]">
              The EVADA Validation Workflow
            </h2>
            <p className="mt-4 text-[15px] font-normal leading-relaxed text-slate-600">
              A continuous cycle that turns findings into actionable, evidence-backed risk insights.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="mt-8 rounded-[24px] border border-blue-100 bg-white px-5 py-6 shadow-[0_18px_52px_rgba(37,99,235,0.08)] lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-3">
              {workflowSteps.map((step, index) => {
                const Icon = step.Icon;

                return (
                  <article key={step.title} className="solutions-workflow-step relative grid justify-items-center gap-3 text-center">
                    <span className="solutions-workflow-node grid h-16 w-16 place-items-center rounded-full border border-blue-100 bg-white text-[#2563EB] shadow-[0_12px_32px_rgba(37,99,235,0.12)]">
                      <Icon className="h-8 w-8" strokeWidth={2.05} />
                    </span>
                    <h3 className="text-[14px] font-semibold text-[#071633]">{step.title}</h3>
                    <p className="max-w-[150px] text-[12px] font-medium leading-relaxed text-slate-600">{step.description}</p>
                    {index < workflowSteps.length - 1 && (
                      <span className="solutions-workflow-arrow hidden lg:block" aria-hidden="true" />
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ImpactSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-12 sm:px-8 lg:px-10 lg:py-14" id="impact">
      <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.28fr_0.72fr] lg:items-center">
        <Reveal>
          <div>
            <Eyebrow>REAL IMPACT</Eyebrow>
            <h2 className="mt-3 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#071633] sm:text-[36px]">
              Validate What Matters. Reduce What Does Not.
            </h2>
            <p className="mt-5 max-w-[420px] text-[15px] font-normal leading-relaxed text-slate-600">
              EVADA helps security teams focus on what attackers can exploit, reduce noise, and move remediation forward with confidence.
            </p>
            <Link href="/resources" className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[#2563EB] transition hover:translate-x-1">
              Learn more about our impact
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.Icon;

            return (
              <Reveal key={metric.title} delayMs={index * 65}>
                <article className="h-full rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.08)]">
                  <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-[linear-gradient(135deg,#7C3AED,#06B6D4)] text-white shadow-[0_12px_28px_rgba(124,58,237,0.24)]">
                    <Icon className="h-6 w-6" strokeWidth={2.1} />
                  </span>
                  <p className="mt-5 bg-[linear-gradient(100deg,#2563EB,#7C3AED)] bg-clip-text text-[40px] font-bold leading-none tracking-[-0.04em] text-transparent">
                    {metric.value}
                  </p>
                  <h3 className="mt-4 text-[15px] font-semibold leading-tight text-[#071633]">{metric.title}</h3>
                  <p className="mt-2 text-[13px] font-normal leading-relaxed text-slate-600">{metric.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IndustryStripSection() {
  return (
    <section className="bg-white px-5 py-8 sm:px-8 lg:px-10" id="industries">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mb-5 text-center">
            <Eyebrow>SOLUTIONS FOR EVERY INDUSTRY</Eyebrow>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="relative">
            <button type="button" aria-label="Previous industries" className="absolute -left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-[#2563EB] shadow-[0_12px_28px_rgba(37,99,235,0.12)] lg:grid">
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <div className="solutions-industry-scroll grid gap-0 overflow-x-auto rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_44px_rgba(37,99,235,0.08)] sm:grid-cols-2 lg:grid-cols-6">
              {industries.map((industry) => {
                const Icon = industry.Icon;

                return (
                  <article key={industry.title} className="flex min-w-[240px] gap-4 border-b border-blue-100 p-5 sm:min-w-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[#EEF5FF] text-[#2563EB] ring-1 ring-blue-100">
                      <Icon className="h-6 w-6" strokeWidth={2.05} />
                    </span>
                    <span className="min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#071633]">{industry.title}</h3>
                      <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">{industry.text}</p>
                    </span>
                  </article>
                );
              })}
            </div>
            <button type="button" aria-label="Next industries" className="absolute -right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-blue-100 bg-white text-[#2563EB] shadow-[0_12px_28px_rgba(37,99,235,0.12)] lg:grid">
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IntegrationsStripSection() {
  return (
    <section className="bg-white px-5 py-8 sm:px-8 lg:px-10" id="integrations">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mb-5 text-center">
            <Eyebrow>BUILT TO INTEGRATE</Eyebrow>
          </div>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 rounded-[22px] border border-blue-100 bg-white px-6 py-5 shadow-[0_18px_44px_rgba(37,99,235,0.08)]">
            {integrations.map((integration, index) => (
              <span key={integration} className="inline-flex items-center gap-2.5 text-[14px] font-semibold text-slate-800">
                <span className="grid h-8 w-8 place-items-center rounded-[12px] bg-[#EEF5FF] text-[#2563EB] ring-1 ring-blue-100">
                  <span className="text-[10px] font-semibold">{integration.slice(0, 2).toUpperCase()}</span>
                </span>
                {integration}
                {index < integrations.length - 1 && <span className="hidden h-5 w-px bg-blue-100 lg:block" aria-hidden="true" />}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SolutionsCTASection() {
  return (
    <section className="bg-white px-5 pb-12 pt-4 sm:px-8 lg:px-10">
      <Reveal>
        <div className="relative mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] bg-[linear-gradient(100deg,#2563EB_0%,#06B6D4_48%,#8B5CF6_100%)] px-6 py-7 text-white shadow-[0_24px_70px_rgba(37,99,235,0.22)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_90%_40%,rgba(255,255,255,0.16),transparent_34%)]" />
          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/16 text-white shadow-[0_0_40px_rgba(255,255,255,0.18)] ring-1 ring-white/25">
              <ShieldCheck aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.6rem,4.2vw,2.35rem)] font-bold leading-tight tracking-[-0.025em]">
                Ready to transform your security validation?
              </h2>
              <p className="mt-2 text-[15px] font-normal leading-relaxed text-white/88 sm:text-[16px]">
                See how EVADA helps security teams move faster with confidence.
              </p>
            </div>
          </div>

          <div className="relative grid gap-3 sm:flex sm:items-center">
            <Link href="/book-demo" className="inline-flex min-h-11 min-w-[150px] items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#2563EB] shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5">
              Book a Demo
            </Link>
            <Link href="/platform#architecture" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/16 sm:min-w-[282px]">
              Explore Platform Architecture
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function SolutionsPage() {
  return (
    <main className="evada-homepage evada-solutions-page relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="solutions" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <SolutionsGridSection />
        <ValidationWorkflowSection />
        <ImpactSection />
        <IndustryStripSection />
        <IntegrationsStripSection />
        <SolutionsCTASection />
        <FooterSection showCta={false} />
      </div>
    </main>
  );
}
