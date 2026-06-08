import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

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

type HeroVisualCard = {
  title: string;
  text: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  accent: string;
  iconClassName: string;
};

type HeroSupportCard = {
  title: string;
  text: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  accent: string;
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
  { label: "Continuous Validation", Icon: marketingIconMap["continuous-validation"] },
  { label: "AI + Human Collaboration", Icon: marketingIconMap["ai-supported"] },
  { label: "Evidence-Backed Results", Icon: marketingIconMap.evidence },
  { label: "Enterprise-grade security", Icon: marketingIconMap["enterprise-governance"] },
];

const heroCards: HeroVisualCard[] = [
  {
    title: "Discover",
    text: "Surface all exposures across your attack surface.",
    Icon: marketingIconMap.discover,
    x: 17,
    y: 28,
    accent: "from-[#2563EB] via-[#22D3EE] to-[#60A5FA]",
    iconClassName: "text-[#2563EB]",
  },
  {
    title: "Prioritise",
    text: "Focus on what matters most with context and risk.",
    Icon: marketingIconMap.prioritise,
    x: 83,
    y: 28,
    accent: "from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]",
    iconClassName: "text-[#7C3AED]",
  },
  {
    title: "Validate",
    text: "Confirm exploitability with controlled, AI-supported tests.",
    Icon: marketingIconMap.validate,
    x: 17,
    y: 61,
    accent: "from-[#06B6D4] via-[#22D3EE] to-[#2563EB]",
    iconClassName: "text-[#06B6D4]",
  },
  {
    title: "Remediate",
    text: "Fix with confidence and verify risk reduction.",
    Icon: marketingIconMap.remediate,
    x: 83,
    y: 61,
    accent: "from-[#7C3AED] via-[#8B5CF6] to-[#2563EB]",
    iconClassName: "text-[#7C3AED]",
  },
];

const heroSupportCards: HeroSupportCard[] = [
  {
    title: "Security Signals",
    text: "Continuous monitoring for emerging threats",
    Icon: marketingIconMap["security-signals"],
    x: 50,
    y: 7,
    accent: "text-[#2563EB]",
  },
  {
    title: "Business Context",
    text: "Align risk with what matters to your business",
    Icon: marketingIconMap["business-context"],
    x: 33,
    y: 80,
    accent: "text-[#2563EB]",
  },
  {
    title: "Security Team",
    text: "Collaborate and act across your teams",
    Icon: marketingIconMap["human-expertise"],
    x: 67,
    y: 80,
    accent: "text-[#7C3AED]",
  },
];

const heroCapabilities: Array<{ title: string; text: string; Icon: LucideIcon; iconClassName: string }> = [
  {
    title: "AI-supported",
    text: "Intelligent analysis and controlled validation",
    Icon: marketingIconMap["ai-supported"],
    iconClassName: "text-[#2563EB]",
  },
  {
    title: "Real-time",
    text: "Continuous discovery and monitoring",
    Icon: marketingIconMap["real-time"],
    iconClassName: "text-[#7C3AED]",
  },
  {
    title: "Risk-based",
    text: "Contextual prioritisation that matters",
    Icon: marketingIconMap.prioritise,
    iconClassName: "text-[#2563EB]",
  },
  {
    title: "Actionable",
    text: "Clear guidance and remediation steps",
    Icon: marketingIconMap["next-steps"],
    iconClassName: "text-[#7C3AED]",
  },
  {
    title: "Integrated",
    text: "Seamless workflow across your security stack",
    Icon: marketingIconMap["integration-categories"],
    iconClassName: "text-[#7C3AED]",
  },
];

const solutions: SolutionCard[] = [
  {
    title: "Application Security",
    description: "Continuously scan and validate web applications for exploitable risk.",
    bullets: ["OWASP Top 10 coverage", "Dynamic and static analysis", "False positive reduction"],
    Icon: marketingIconMap["application-security"],
  },
  {
    title: "Network Security",
    description: "Discover, map and validate risk across your network infrastructure.",
    bullets: ["Network discovery", "Risk visualisation", "Infrastructure assessment"],
    Icon: marketingIconMap["network-scans"],
  },
  {
    title: "AI-Supported Pentest",
    description: "AI-supported pentest workflows with controlled validation and sandboxing.",
    bullets: ["AI-supported pentest workflows", "Sandbox validation", "Exploit evidence generation"],
    Icon: marketingIconMap["ai-pentester"],
  },
  {
    title: "WebApp Scanner (ZAP)",
    description: "OWASP ZAP-powered scanning with real-time insights and reporting.",
    bullets: ["ZAP integration", "Real-time scan streaming", "Detailed reports"],
    Icon: marketingIconMap["webapp-scanner"],
  },
  {
    title: "Knowledge Hub",
    description: "Centralised vulnerability knowledge with AI-enriched insight.",
    bullets: ["Vulnerability intelligence", "Exploit and remediation guidance", "AI context and patterns"],
    Icon: marketingIconMap["knowledge-hub"],
  },
  {
    title: "Clients & Agents",
    description: "Manage clients, agents, licences and agent health.",
    bullets: ["Agent health monitoring", "Licence management", "Downloads and uploads"],
    Icon: marketingIconMap["clients-agents"],
  },
  {
    title: "Reporting and Analytics",
    description: "Actionable reports and dashboards for data-led decisions.",
    bullets: ["Executive dashboards", "Custom reports", "Trend and risk analytics"],
    Icon: marketingIconMap["reports-analytics"],
  },
  {
    title: "Administration and RBAC",
    description: "Role-based access and multi-tenant administration at scale.",
    bullets: ["SaaS & Client Admin", "Permission Controls", "Audit-Ready Controls"],
    Icon: marketingIconMap["admin-rbac"],
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: "Ingest",
    description: "Collect findings from scanners, tools, and manual uploads.",
    Icon: marketingIconMap["manual-uploads"],
  },
  {
    title: "Analyse",
    description: "AI models analyse, deduplicate and prioritise risks.",
    Icon: marketingIconMap.analyse,
  },
  {
    title: "Validate",
    description: "Controlled validation in a safe sandbox with human approval.",
    Icon: marketingIconMap.validate,
  },
  {
    title: "Evidence",
    description: "Capture proof, impact, and system-level evidence.",
    Icon: marketingIconMap.evidence,
  },
  {
    title: "Report",
    description: "Generate reports with impact, severity and remediation.",
    Icon: marketingIconMap["report-generator"],
  },
  {
    title: "Remediate",
    description: "Sync to your tools and close the remediation loop.",
    Icon: marketingIconMap.remediate,
  },
];

const metrics: Metric[] = [
  {
    value: "Proof",
    title: "Evidence-Backed Validation",
    text: "Focus on findings backed by controlled validation.",
    Icon: marketingIconMap.evidence,
  },
  {
    value: "Focus",
    title: "Clearer Risk Priorities",
    text: "Prioritise what attackers can realistically exploit.",
    Icon: marketingIconMap.prioritise,
  },
  {
    value: "Flow",
    title: "Connected Remediation",
    text: "Integrated workflows help teams move from evidence to action.",
    Icon: marketingIconMap["security-workflow"],
  },
  {
    value: "Trace",
    title: "Evidence-Backed Results",
    text: "Validation activity keeps proof, context, and audit history together.",
    Icon: marketingIconMap["audit-logs"],
  },
];

const industries: Industry[] = [
  {
    title: "Technology",
    text: "Secure your applications, APIs, and cloud-native infrastructure.",
    Icon: marketingIconMap.technology,
  },
  {
    title: "Financial Services",
    text: "Protect sensitive financial data and support audit-ready security programmes.",
    Icon: marketingIconMap["financial-services"],
  },
  {
    title: "Healthcare",
    text: "Secure patient data and critical healthcare infrastructure.",
    Icon: marketingIconMap.healthcare,
  },
  {
    title: "Retail and E-Commerce",
    text: "Protect customer data and ensure secure digital experiences.",
    Icon: marketingIconMap.retail,
  },
  {
    title: "Manufacturing",
    text: "Secure OT, IT, and connected industrial environments.",
    Icon: marketingIconMap.manufacturing,
  },
  {
    title: "Government",
    text: "Strengthen cybersecurity with evidence-backed validation and clear reporting.",
    Icon: marketingIconMap.government,
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
    <div className="solutions-hero-visual relative mx-auto aspect-[1.35/1] min-h-[560px] w-full max-w-[820px] overflow-visible pb-24 sm:min-h-[590px] lg:min-h-[610px] lg:-mt-3 xl:-mt-5" aria-hidden="true">
      <div className="solutions-hero-stage absolute left-1/2 top-1/2 h-[620px] w-[820px] -translate-x-1/2 -translate-y-1/2 scale-[0.38] sm:scale-[0.62] md:scale-[0.72] lg:scale-[0.78] xl:scale-[0.84] 2xl:scale-[0.88]">
        <div className="solutions-hex-backdrop absolute inset-0" />
        <div className="solutions-hex-dot-field absolute right-[-3%] top-[-10%] h-[260px] w-[320px]" />
        <div className="solutions-hex-dot-field absolute bottom-[-8%] right-[8%] h-[260px] w-[320px] rotate-180 opacity-70" />

        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible" viewBox="0 0 820 620" fill="none" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="solutions-hero-line" x1="104" y1="132" x2="720" y2="494" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.46" stopColor="#2563EB" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="solutions-node-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="410" cy="282" rx="230" ry="162" stroke="rgba(255,255,255,0.56)" strokeWidth="1.2" />
          <ellipse className="evada-dash-flow opacity-40" cx="410" cy="282" rx="174" ry="116" stroke="#60A5FA" strokeWidth="1.4" strokeDasharray="4 10" />
          <ellipse className="evada-dash-flow opacity-55" cx="410" cy="282" rx="278" ry="202" stroke="url(#solutions-hero-line)" strokeWidth="1.8" strokeDasharray="8 12" />

          <path className="solutions-blue-connector" d="M410 108C410 126 410 142 410 162" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-a" d="M252 214C282 206 306 195 328 194" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-b" d="M492 194C520 196 538 206 566 214" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-c" d="M252 352C284 348 312 322 326 298" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-d" d="M494 298C508 322 536 348 568 352" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-e" d="M388 340C374 382 334 430 286 456" stroke="url(#solutions-hero-line)" />
          <path className="solutions-blue-connector solutions-blue-connector-delay-f" d="M432 340C448 382 494 430 546 456" stroke="url(#solutions-hero-line)" />

          {([
            [410, 162, "#2563EB"],
            [328, 194, "#2563EB"],
            [492, 194, "#7C3AED"],
            [326, 298, "#06B6D4"],
            [494, 298, "#7C3AED"],
            [286, 456, "#06B6D4"],
            [546, 456, "#7C3AED"],
          ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
            <g key={`${cx}-${cy}`} className="evada-node-pulse" style={{ "--delay": `${index * 0.16}s` } as CSSProperties}>
              <circle cx={cx} cy={cy} r="12" fill={fill as string} opacity="0.14" />
              <circle cx={cx} cy={cy} r="5.5" fill={fill as string} filter="url(#solutions-node-glow)" />
            </g>
          ))}
        </svg>

        {heroCards.map((card, index) => {
          const Icon = card.Icon;

          return (
            <div
              key={card.title}
              className="absolute z-30"
              style={{
                left: `${card.x}%`,
                top: `${card.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="evada-float-card group relative min-h-[150px] w-[240px] rounded-[24px] border border-blue-100/80 bg-white/90 p-4 shadow-[0_22px_62px_rgba(37,99,235,0.12)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_78px_rgba(37,99,235,0.16)]"
                style={
                  {
                    "--delay": `${index * 0.2}s`,
                    "--duration": `${7 + index * 0.35}s`,
                  } as CSSProperties
                }
              >
                <div className="flex gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-white shadow-[inset_0_0_18px_rgba(37,99,235,0.08),0_12px_26px_rgba(37,99,235,0.11)] transition group-hover:shadow-[inset_0_0_22px_rgba(34,211,238,0.16),0_15px_32px_rgba(37,99,235,0.16)]">
                    <Icon className={`h-6 w-6 ${card.iconClassName}`} strokeWidth={2.05} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[20px] font-bold tracking-[-0.02em] text-slate-950">{card.title}</span>
                    <span className={`mt-2.5 block h-[3px] w-11 rounded-full bg-gradient-to-r ${card.accent}`} />
                    <span className="mt-2.5 block text-[12.5px] leading-5 text-slate-600">{card.text}</span>
                  </span>
                </div>
                <span className={`absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full border border-blue-100 bg-white ${card.iconClassName} shadow-sm transition group-hover:translate-x-1`}>
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
                </span>
                <span className={`absolute inset-x-5 bottom-0 h-[2px] rounded-full bg-gradient-to-r ${card.accent}`} />
              </div>
            </div>
          );
        })}

        {heroSupportCards.map((tag, index) => {
          const Icon = tag.Icon;

          return (
            <div
              key={tag.title}
              className="absolute z-30"
              style={{
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="evada-float-small flex w-[192px] items-center gap-3 rounded-[18px] border border-blue-100/70 bg-white/85 p-3.5 shadow-[0_16px_44px_rgba(37,99,235,0.09)] backdrop-blur-xl"
                style={
                  {
                    "--delay": `${index * 0.25}s`,
                    "--duration": `${6.2 + index * 0.3}s`,
                  } as CSSProperties
                }
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] ring-1 ring-blue-100">
                  <Icon className={`h-5 w-5 ${tag.accent}`} strokeWidth={2.1} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold leading-tight text-slate-950">{tag.title}</span>
                  <span className="mt-1 block text-[11px] leading-4 text-slate-600">{tag.text}</span>
                </span>
              </div>
            </div>
          );
        })}

        <div className="solutions-hex-system absolute left-1/2 top-[288px] z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2">
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
            <div className="solutions-hex-icon">
              <ShieldCheck aria-hidden="true" className="h-20 w-20" strokeWidth={2.15} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-76px] left-1/2 z-40 w-[104%] -translate-x-1/2">
          <div className="grid grid-cols-5 rounded-[22px] border border-blue-100/80 bg-white/90 px-4 py-3.5 shadow-[0_18px_54px_rgba(37,99,235,0.11)] backdrop-blur-xl">
            {heroCapabilities.map((capability) => {
              const Icon = capability.Icon;

              return (
                <div key={capability.title} className="flex items-center gap-2.5 border-slate-200/80 px-2 first:pl-0 last:pr-0 [&:not(:first-child)]:border-l">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white shadow-[0_10px_20px_rgba(37,99,235,0.09)] ring-1 ring-blue-100">
                    <Icon className={`h-[18px] w-[18px] ${capability.iconClassName}`} strokeWidth={2.1} />
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[11px] font-bold leading-tight text-slate-950">{capability.title}</span>
                    <span className="mt-1 block text-[9.5px] leading-[1.3] text-slate-600">{capability.text}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-x-clip overflow-y-visible bg-white px-5 pb-16 pt-7 sm:px-8 sm:pb-20 sm:pt-9 lg:px-10 lg:pb-20 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_80%_14%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_84%_70%,rgba(34,211,238,0.13),transparent_32%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_58%,#FFFFFF_100%)]" />
      <div aria-hidden="true" className="solutions-grid-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.48fr_0.52fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[640px]">
            <Eyebrow>SOLUTIONS</Eyebrow>
            <h1 className="mt-5 max-w-full break-words text-[clamp(2rem,8.5vw,2.85rem)] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(2.85rem,4.1vw,3.45rem)]">
              <span className="block">Purpose-built</span>
              <span className="block whitespace-nowrap [overflow-wrap:normal] [word-break:normal]">
                validation <span className="text-[0.84em] sm:text-[0.88em] lg:text-[0.9em]">workflows</span>
              </span>
              <span className="block">for every</span>
              <span className="block whitespace-nowrap bg-[linear-gradient(100deg,#2563EB_0%,#06B6D4_42%,#7C3AED_100%)] bg-clip-text pb-1 leading-[1.16] text-transparent">security challenge</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA brings together AI-supported analysis, controlled validation and human expertise to deliver continuous, evidence-backed security outcomes across your attack surface.
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
                Explore platform architecture
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
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Complete coverage.</span>
              <span className="block">Continuous confidence.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
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
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>HOW IT WORKS</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              The EVADA validation workflow
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              A continuous cycle that turns findings into actionable, evidence-backed risk insight.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <div className="problem-edge-card relative isolate mt-8 overflow-hidden rounded-[24px] border border-blue-100 bg-white px-5 py-6 shadow-[0_18px_52px_rgba(37,99,235,0.08)] lg:px-8">
            <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
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
            <h2 className="mt-3 max-w-[460px] text-[clamp(1.55rem,4.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Validate what matters.</span>
              <span className="block">Reduce what does not.</span>
            </h2>
            <p className="mt-5 max-w-[420px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              EVADA helps teams focus on exploitable risk, reduce noise and accelerate remediation with confidence.
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
            <div className="problem-edge-card solutions-industry-scroll relative isolate grid gap-0 overflow-x-auto rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_44px_rgba(37,99,235,0.08)] sm:grid-cols-2 lg:grid-cols-6">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
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
          <div className="problem-edge-card relative isolate flex flex-wrap items-center justify-center gap-x-7 gap-y-4 overflow-hidden rounded-[22px] border border-blue-100 bg-white px-6 py-5 shadow-[0_18px_44px_rgba(37,99,235,0.08)]">
            <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
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
        <div className="problem-edge-card relative isolate mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] bg-[linear-gradient(100deg,#2563EB_0%,#06B6D4_48%,#8B5CF6_100%)] px-6 py-7 text-white shadow-[0_24px_70px_rgba(37,99,235,0.22)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
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
            <Link href="/book-demo" className="problem-edge-card problem-edge-card-compact relative isolate inline-flex min-h-11 min-w-[150px] items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#2563EB] shadow-[0_12px_28px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
              Book a Demo
            </Link>
            <Link href="/platform#architecture" className="problem-edge-card problem-edge-card-compact relative isolate inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/10 px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/16 sm:min-w-[282px]">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
              Explore platform architecture
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
