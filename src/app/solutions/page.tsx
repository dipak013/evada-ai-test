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
import MarketingScrollOptimizer from "@/components/marketing/MarketingScrollOptimizer";

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

function AIValidationShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`solutions-ai-core-icon ${className}`}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="solutionsAiShieldFill" x1="22" y1="12" x2="106" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.48" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id="solutionsAiShieldStroke" x1="30" y1="10" x2="98" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.48" stopColor="rgba(191,239,255,0.96)" />
          <stop offset="1" stopColor="rgba(237,233,254,0.94)" />
        </linearGradient>

        <filter id="solutionsAiIconGlow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        className="solutions-ai-shield-body"
        d="M64 10.5L98.5 24.8V54.6C98.5 80.8 85.1 101.3 64 113.5C42.9 101.3 29.5 80.8 29.5 54.6V24.8L64 10.5Z"
        fill="url(#solutionsAiShieldFill)"
        stroke="url(#solutionsAiShieldStroke)"
        strokeWidth="4"
        strokeLinejoin="round"
        filter="url(#solutionsAiIconGlow)"
      />

      <path
        className="solutions-ai-shield-inner"
        d="M64 21L88.5 31.2V55.2C88.5 75.2 79.5 91.4 64 101.2C48.5 91.4 39.5 75.2 39.5 55.2V31.2L64 21Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        className="solutions-ai-neural-line"
        d="M50.5 52.5C45.3 52.5 41.5 56.2 41.5 61.2C41.5 65.1 43.8 68.3 47.1 69.7C45.7 75.8 50.1 81 56.4 81"
        stroke="white"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="solutions-ai-neural-line solutions-ai-neural-line-delay-a"
        d="M77.5 52.5C82.7 52.5 86.5 56.2 86.5 61.2C86.5 65.1 84.2 68.3 80.9 69.7C82.3 75.8 77.9 81 71.6 81"
        stroke="white"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="solutions-ai-neural-line solutions-ai-neural-line-delay-b"
        d="M50.5 52.5C50.5 43.9 56.2 38.5 64 38.5C71.8 38.5 77.5 43.9 77.5 52.5M64 38.5V88M55 62H46.5M81.5 62H73M56.4 81C61.2 81 64 77.5 64 72.5M71.6 81C66.8 81 64 77.5 64 72.5"
        stroke="white"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        className="solutions-ai-check-mark"
        d="M52.8 69.2L60.8 77.2L76.8 58.8"
        stroke="white"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#solutionsAiIconGlow)"
      />

      <path
        className="solutions-ai-circuit-line"
        d="M44 88H55M73 88H84M64 88V100M44 72H35.5M92.5 72H84"
        stroke="rgba(191,239,255,0.96)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle className="solutions-ai-node solutions-ai-node-a" cx="35.5" cy="72" r="3.7" fill="#A7F3FF" />
      <circle className="solutions-ai-node solutions-ai-node-b" cx="92.5" cy="72" r="3.7" fill="#DDD6FE" />
      <circle className="solutions-ai-node solutions-ai-node-c" cx="64" cy="100" r="3.9" fill="#BFDBFE" />
    </svg>
  );
}

function SolutionsHeroVisual() {
  return (
    <div
      className="solutions-hero-visual relative mx-auto aspect-[1.35/1] min-h-[535px] w-full max-w-[820px] overflow-visible pb-20 sm:min-h-[560px] lg:min-h-[585px] lg:-mt-3 xl:-mt-5"
      aria-hidden="true"
    >
      <div className="solutions-hero-stage absolute left-1/2 top-1/2 h-[600px] w-[820px] -translate-x-1/2 -translate-y-1/2 scale-[0.38] sm:scale-[0.62] md:scale-[0.72] lg:scale-[0.78] xl:scale-[0.84] 2xl:scale-[0.88]">
        <div className="solutions-hex-backdrop absolute inset-0" />
        <div className="solutions-hex-dot-field absolute right-[-3%] top-[-10%] h-[260px] w-[320px]" />
        <div className="solutions-hex-dot-field absolute bottom-[-8%] right-[8%] h-[260px] w-[320px] rotate-180 opacity-70" />

        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          viewBox="0 0 820 600"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="solutions-hero-line" x1="90" y1="120" x2="730" y2="500" gradientUnits="userSpaceOnUse">
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

          <ellipse cx="410" cy="286" rx="230" ry="158" stroke="rgba(255,255,255,0.54)" strokeWidth="1.2" />
          <ellipse
            className="solutions-flow-orbit"
            cx="410"
            cy="286"
            rx="178"
            ry="114"
            stroke="#60A5FA"
            strokeWidth="1.4"
            strokeDasharray="4 10"
          />
          <ellipse
            className="solutions-flow-orbit solutions-flow-orbit-slow"
            cx="410"
            cy="286"
            rx="278"
            ry="198"
            stroke="url(#solutions-hero-line)"
            strokeWidth="1.8"
            strokeDasharray="8 12"
          />

          <path className="solutions-flow-connector" d="M410 88C410 122 410 150 410 184" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-a" d="M252 170C302 178 335 218 357 256" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-b" d="M568 170C518 178 485 218 463 256" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-c" d="M252 366C302 358 334 330 357 306" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-d" d="M568 366C518 358 486 330 463 306" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-e" d="M314 474C350 426 378 376 394 338" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector solutions-flow-connector-delay-f" d="M506 474C470 426 442 376 426 338" stroke="url(#solutions-hero-line)" />

          <path className="solutions-flow-connector-soft" d="M174 300C260 160 560 160 646 300" stroke="url(#solutions-hero-line)" />
          <path className="solutions-flow-connector-soft solutions-flow-connector-delay-c" d="M172 404C270 520 550 520 648 404" stroke="url(#solutions-hero-line)" />

          {([
            [410, 184, "#2563EB"],
            [357, 256, "#2563EB"],
            [463, 256, "#7C3AED"],
            [357, 306, "#06B6D4"],
            [463, 306, "#7C3AED"],
            [314, 474, "#06B6D4"],
            [506, 474, "#7C3AED"],
          ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
            <g
              key={`${cx}-${cy}`}
              className="solutions-flow-node"
              style={{ "--delay": `${index * 0.15}s` } as CSSProperties}
            >
              <circle cx={cx} cy={cy} r="13" fill={fill} opacity="0.13" />
              <circle cx={cx} cy={cy} r="5.5" fill={fill} filter="url(#solutions-node-glow)" />
            </g>
          ))}
        </svg>

        {heroCards.map((card, index) => {
          const Icon = card.Icon;

          return (
            <div
              key={card.title}
              className="absolute z-40"
              style={{
                left: `${card.x}%`,
                top: `${card.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="evada-float-card"
                style={
                  {
                    "--delay": `${index * 0.2}s`,
                    "--duration": `${7.2 + index * 0.35}s`,
                  } as CSSProperties
                }
              >
                <div className="solutions-hero-card group relative min-h-[124px] w-[228px] rounded-[24px] border border-blue-100/80 p-4 shadow-[0_18px_48px_rgba(37,99,235,0.10)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(37,99,235,0.16)]">
                  <div className="flex gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-blue-100 bg-white shadow-[inset_0_0_16px_rgba(37,99,235,0.08),0_10px_22px_rgba(37,99,235,0.10)] transition group-hover:shadow-[inset_0_0_20px_rgba(34,211,238,0.18),0_14px_28px_rgba(37,99,235,0.16)]">
                      <Icon className={`h-[22px] w-[22px] ${card.iconClassName}`} strokeWidth={2.1} />
                    </span>

                    <span className="min-w-0 pr-7">
                      <span className="block text-[17px] font-bold leading-tight tracking-[-0.02em] text-slate-950">{card.title}</span>
                      <span className={`mt-1.5 block h-[3px] w-10 rounded-full bg-gradient-to-r ${card.accent}`} />
                      <span className="mt-1.5 block text-[13.2px] leading-[1.45] text-slate-600">{card.text}</span>
                    </span>
                  </div>

                  <span className={`absolute bottom-3 right-3 grid h-6 w-6 place-items-center rounded-full border border-blue-100 bg-white ${card.iconClassName} shadow-sm transition group-hover:translate-x-1`}>
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.15} />
                  </span>

                  <span className={`absolute inset-x-4 bottom-0 h-[2px] rounded-full bg-gradient-to-r ${card.accent}`} />
                </div>
              </div>
            </div>
          );
        })}

        {heroSupportCards.map((tag, index) => {
          const Icon = tag.Icon;

          return (
            <div
              key={tag.title}
              className="absolute z-40"
              style={{
                left: `${tag.x}%`,
                top: `${tag.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="evada-float-small"
                style={
                  {
                    "--delay": `${index * 0.25}s`,
                    "--duration": `${6.2 + index * 0.3}s`,
                  } as CSSProperties
                }
              >
                <div className="solutions-support-card flex w-[156px] items-center gap-2 rounded-[14px] border border-blue-100/70 p-2.5 shadow-[0_14px_38px_rgba(37,99,235,0.085)] backdrop-blur-xl">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] ring-1 ring-blue-100">
                    <Icon className={`h-4 w-4 ${tag.accent}`} strokeWidth={2.1} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[11.2px] font-bold leading-tight text-slate-950">{tag.title}</span>
                    <span className="mt-0.5 block text-[9.5px] leading-[1.32] text-slate-600">{tag.text}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="solutions-core-system absolute left-1/2 top-[292px] z-30 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2">
          <div className="solutions-core-float relative h-full w-full">
            <div className="solutions-core-aurora" />
            <div className="solutions-core-orbit solutions-core-orbit-a" />
            <div className="solutions-core-orbit solutions-core-orbit-b" />
            <div className="solutions-core-orbit solutions-core-orbit-c" />

            <div className="solutions-core-beam solutions-core-beam-a" />
            <div className="solutions-core-beam solutions-core-beam-b" />

            <div className="solutions-core-platform solutions-core-platform-shadow" />
            <div className="solutions-core-platform solutions-core-platform-back" />
            <div className="solutions-core-platform solutions-core-platform-mid" />
            <div className="solutions-core-platform solutions-core-platform-front" />

            <div className="solutions-core-shell">
              <span className="solutions-core-scan-ring" />
              <span className="solutions-core-scan-ring solutions-core-scan-ring-b" />
              <span className="solutions-core-orbit-dot solutions-core-orbit-dot-a" />
              <span className="solutions-core-orbit-dot solutions-core-orbit-dot-b" />
              <span className="solutions-core-orbit-dot solutions-core-orbit-dot-c" />

              <div className="solutions-core-icon-shell">
                <AIValidationShieldIcon className="h-[132px] w-[132px]" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-56px] left-1/2 z-40 w-[92%] -translate-x-1/2">
          <div className="grid grid-cols-5 rounded-[16px] border border-blue-100/80 bg-white/90 px-2.5 py-2 shadow-[0_15px_44px_rgba(37,99,235,0.10)] backdrop-blur-xl">
            {heroCapabilities.map((capability) => {
              const Icon = capability.Icon;

              return (
                <div
                  key={capability.title}
                  className="flex items-center gap-1.5 border-slate-200/80 px-1 first:pl-0 last:pr-0 [&:not(:first-child)]:border-l"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white shadow-[0_8px_18px_rgba(37,99,235,0.08)] ring-1 ring-blue-100">
                    <Icon className={`h-[15px] w-[15px] ${capability.iconClassName}`} strokeWidth={2.1} />
                  </span>

                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[9.5px] font-bold leading-tight text-slate-950">
                      {capability.title}
                    </span>
                    <span className="mt-0.5 block text-[8.1px] leading-[1.22] text-slate-600">{capability.text}</span>
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

      <div className="relative mx-auto grid w-full max-w-[calc(100vw-2.5rem)] min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[560px]">
            <Eyebrow>SOLUTIONS</Eyebrow>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
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
        <div className="company-work-card problem-edge-card relative isolate mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] border border-white/10 px-6 py-7 text-white shadow-[0_24px_70px_rgba(15,13,40,0.28)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
          <div aria-hidden="true" className="company-work-card-glow absolute inset-0" />
          <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/12 text-white shadow-[0_0_40px_rgba(255,255,255,0.16)] ring-1 ring-white/20">
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

          <div className="relative z-10 grid gap-3 sm:flex sm:items-center">
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
    <main className="evada-homepage evada-solutions-page evada-marketing-strict-lazy evada-marketing-scroll-optimized relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950" data-marketing-ready="false">
      <MarketingAnimatedBackground variant="solutions" />
      <MarketingScrollOptimizer
        scrollLerp={0.22}
        settleDelayMs={100}
        strictActiveSectionAnimations
        wheelMultiplier={1.62}
      />
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
