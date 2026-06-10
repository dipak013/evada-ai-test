import Link from "next/link";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";
import MarketingScrollOptimizer from "@/components/marketing/MarketingScrollOptimizer";

type IconTextItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

type ArchitectureColumn = {
  title: string;
  items: IconTextItem[];
  tone: "blue" | "violet" | "cyan";
};

type PlatformHeroStep = {
  number: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  iconClassName: string;
  progressClassName: string;
};

type PlatformHeroNode = {
  label: string;
  Icon: LucideIcon;
  x: number;
  y: number;
  iconClassName: string;
};

const heroChips: Array<{ label: string; Icon: LucideIcon }> = [
  { label: "AI-Supported Validation", Icon: marketingIconMap["ai-supported"] },
  { label: "Human in the Loop", Icon: marketingIconMap.approval },
  { label: "Evidence-Backed Results", Icon: marketingIconMap.evidence },
  { label: "Enterprise Ready", Icon: marketingIconMap["enterprise-governance"] },
];

const platformHeroSteps: PlatformHeroStep[] = [
  {
    number: "1",
    label: "Ingest",
    description: "Collect data from scans, logs, apps and tools.",
    Icon: marketingIconMap.ingest,
    x: 50,
    y: 11,
    iconClassName: "text-[#2563EB]",
    progressClassName: "from-[#06B6D4] to-[#2563EB]",
  },
  {
    number: "2",
    label: "Analyse",
    description: "AI correlates, enriches and identifies real risks.",
    Icon: marketingIconMap.analyse,
    x: 82,
    y: 30,
    iconClassName: "text-[#7C3AED]",
    progressClassName: "from-[#7C3AED] to-[#A855F7]",
  },
  {
    number: "3",
    label: "Validate",
    description: "Human experts validate and confirm exploitability.",
    Icon: marketingIconMap.validate,
    x: 83,
    y: 65,
    iconClassName: "text-[#06B6D4]",
    progressClassName: "from-[#06B6D4] to-[#2563EB]",
  },
  {
    number: "4",
    label: "Evidence",
    description: "Capture proof, PoC and business impact.",
    Icon: marketingIconMap.evidence,
    x: 50,
    y: 89,
    iconClassName: "text-[#2563EB]",
    progressClassName: "from-[#2563EB] to-[#7C3AED]",
  },
  {
    number: "5",
    label: "Approval",
    description: "Security leads review and approve the risk.",
    Icon: marketingIconMap.approval,
    x: 18,
    y: 65,
    iconClassName: "text-[#7C3AED]",
    progressClassName: "from-[#7C3AED] to-[#A855F7]",
  },
  {
    number: "6",
    label: "Sync",
    description: "Sync to tools, tickets and stakeholders.",
    Icon: marketingIconMap.sync,
    x: 17,
    y: 30,
    iconClassName: "text-[#06B6D4]",
    progressClassName: "from-[#06B6D4] to-[#2563EB]",
  },
];

const platformHeroNodes: PlatformHeroNode[] = [
  { label: "Secure and compliant", Icon: marketingIconMap["secure-compliant"], x: 8, y: 9, iconClassName: "text-[#2563EB]" },
  { label: "AI-supported", Icon: marketingIconMap["ai-supported"], x: 92, y: 9, iconClassName: "text-[#7C3AED]" },
  { label: "Actionable Insights", Icon: marketingIconMap["actionable-insights"], x: 8, y: 90, iconClassName: "text-[#2563EB]" },
  { label: "Trusted by Experts", Icon: marketingIconMap["human-expertise"], x: 92, y: 90, iconClassName: "text-[#7C3AED]" },
];

const moduleCards: IconTextItem[] = [
  {
    title: "Application Configuration",
    description: "Configure applications, scan targets, schedules and monitored assets with ease.",
    Icon: marketingIconMap["application-configuration"],
  },
  {
    title: "Classic Scans",
    description: "Run traditional scans, upload scan data, review history and inspect latest results.",
    Icon: marketingIconMap["classic-scans"],
  },
  {
    title: "Network Scans",
    description: "Discover network assets and map validated exposure with graph-style outputs.",
    Icon: marketingIconMap["network-scans"],
  },
  {
    title: "AI-Supported Pentest",
    description: "Launch AI-supported pentest jobs, monitor pipeline stages and review validated findings.",
    Icon: marketingIconMap["ai-pentester"],
  },
  {
    title: "WebApp Scanner (ZAP)",
    description: "Start OWASP ZAP scans, stream live output, identify issues and download reports.",
    Icon: marketingIconMap["webapp-scanner"],
  },
  {
    title: "Knowledge Hub",
    description: "Search vulnerability intelligence, exploit context, remediation guidance and AI scanner intelligence.",
    Icon: marketingIconMap["knowledge-hub"],
  },
  {
    title: "Clients and Agents",
    description: "Manage clients, agents, licences, agent health, downloads, uploads and heartbeat status.",
    Icon: marketingIconMap["clients-agents"],
  },
  {
    title: "Admin and RBAC",
    description: "Support SaaS Admin, Client Admin and Superadmin workflows with permission-gated access.",
    Icon: marketingIconMap["admin-rbac"],
  },
];

const pipelineStages: IconTextItem[] = [
  {
    title: "Ingestion",
    description: "Upload JSON logs or scanner output",
    Icon: marketingIconMap["manual-uploads"],
  },
  {
    title: "Parser",
    description: "Extract and normalise data",
    Icon: marketingIconMap.parser,
  },
  {
    title: "Weakness Identifier",
    description: "Identify technical weaknesses",
    Icon: marketingIconMap["weakness-identifier"],
  },
  {
    title: "Knowledge Base Lookup",
    description: "Enrich with internal knowledge base",
    Icon: marketingIconMap["knowledge-lookup"],
  },
  {
    title: "LLM Script Generator",
    description: "Generate safe test scripts",
    Icon: marketingIconMap["script-generator"],
  },
  {
    title: "Sandbox Executor",
    description: "Execute in isolated sandbox",
    Icon: marketingIconMap["sandbox-executor"],
  },
  {
    title: "Report Generator",
    description: "Create findings, evidence and impact",
    Icon: marketingIconMap["report-generator"],
  },
  {
    title: "Script Validator",
    description: "Validate results with human approval",
    Icon: marketingIconMap["script-validator"],
  },
];

const architectureColumns: ArchitectureColumn[] = [
  {
    title: "Input Sources",
    tone: "blue",
    items: [
      { title: "Vulnerability Scanners", description: "", Icon: marketingIconMap["classic-scans"] },
      { title: "Cloud Findings", description: "", Icon: marketingIconMap["infrastructure-security"] },
      { title: "AppSec Tools", description: "", Icon: marketingIconMap["api-reference"] },
      { title: "Security Signals", description: "", Icon: marketingIconMap["security-signals"] },
      { title: "Manual Uploads", description: "", Icon: marketingIconMap["manual-uploads"] },
    ],
  },
  {
    title: "EVADA Platform",
    tone: "violet",
    items: [
      { title: "Sanitisation Layer", description: "", Icon: marketingIconMap.sanitisation },
      { title: "AI Analysis and Prioritisation", description: "", Icon: marketingIconMap["ai-supported"] },
      { title: "Controlled Validation Safe Sandbox", description: "", Icon: marketingIconMap["safe-sandbox"] },
      { title: "Human Approval", description: "", Icon: marketingIconMap.approval },
      { title: "Evidence and Audit Logging", description: "", Icon: marketingIconMap["audit-logs"] },
    ],
  },
  {
    title: "Outputs and Integrations",
    tone: "cyan",
    items: [
      { title: "Jira / ITSM", description: "", Icon: marketingIconMap["jira-itsm"] },
      { title: "SIEM", description: "", Icon: marketingIconMap.siem },
      { title: "Slack / Teams", description: "", Icon: marketingIconMap["team-chat"] },
      { title: "Reports", description: "", Icon: marketingIconMap.documentation },
      { title: "Dashboards", description: "", Icon: marketingIconMap.dashboards },
    ],
  },
];

const architectureBullets = [
  "Session & CSRF-ready APIs",
  "Role-based access control",
  "Multi-tenant architecture",
  "Audit logging and observability",
  "Secure sandbox validation",
];

const trustCards: IconTextItem[] = [
  {
    title: "Enterprise Security",
    description: "Security by design with secure APIs, data isolation and protection.",
    Icon: marketingIconMap["secure-platform"],
  },
  {
    title: "Human Approval",
    description: "High-risk validations require analyst approval before execution.",
    Icon: marketingIconMap.approval,
  },
  {
    title: "Audit Everything",
    description: "Full audit trail for every action, validation and user activity.",
    Icon: marketingIconMap["audit-logs"],
  },
  {
    title: "Connected Workflows",
    description: "Connect with Jira, SIEM, Slack, cloud providers and more.",
    Icon: marketingIconMap["security-workflow"],
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
      {children}
    </p>
  );
}

function PlatformClearEngineIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`platform-clear-engine-icon ${className}`}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="platformClearBoardFill" x1="34" y1="34" x2="148" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.46" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id="platformClearLine" x1="48" y1="58" x2="132" y2="132" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.52" stopColor="#BFDBFE" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>

        <filter id="platformClearGlow" x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="4.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect
        className="platform-clear-board"
        x="34"
        y="38"
        width="112"
        height="104"
        rx="28"
        fill="url(#platformClearBoardFill)"
        stroke="rgba(255,255,255,0.94)"
        strokeWidth="4"
        filter="url(#platformClearGlow)"
      />

      <rect
        className="platform-clear-board-inner"
        x="48"
        y="52"
        width="84"
        height="76"
        rx="21"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.6"
      />

      <rect
        className="platform-clear-module platform-clear-module-a"
        x="58"
        y="64"
        width="28"
        height="24"
        rx="8"
        fill="rgba(255,255,255,0.18)"
        stroke="white"
        strokeWidth="2.7"
      />

      <rect
        className="platform-clear-module platform-clear-module-b"
        x="94"
        y="64"
        width="28"
        height="24"
        rx="8"
        fill="rgba(255,255,255,0.18)"
        stroke="white"
        strokeWidth="2.7"
      />

      <rect
        className="platform-clear-module platform-clear-module-c"
        x="76"
        y="104"
        width="28"
        height="24"
        rx="8"
        fill="rgba(255,255,255,0.18)"
        stroke="white"
        strokeWidth="2.7"
      />

      <circle
        className="platform-clear-hub"
        cx="90"
        cy="96"
        r="17"
        fill="rgba(255,255,255,0.2)"
        stroke="white"
        strokeWidth="3"
      />

      <path
        className="platform-clear-route platform-clear-route-a"
        d="M72 88V94C72 98 76 100 80 100H90"
        stroke="url(#platformClearLine)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        className="platform-clear-route platform-clear-route-b"
        d="M108 88V94C108 98 104 100 100 100H90"
        stroke="url(#platformClearLine)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        className="platform-clear-route platform-clear-route-c"
        d="M90 113V104"
        stroke="url(#platformClearLine)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        className="platform-clear-check"
        d="M79.5 96L87.2 103.7L101.5 87.4"
        stroke="white"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#platformClearGlow)"
      />

      <path
        className="platform-clear-circuit-line"
        d="M58 118H48M122 118H132M90 132V146M48 76H38M142 76H132"
        stroke="rgba(191,239,255,0.96)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle className="platform-clear-svg-node platform-clear-svg-node-a" cx="38" cy="76" r="3.8" fill="#A7F3FF" />
      <circle className="platform-clear-svg-node platform-clear-svg-node-b" cx="142" cy="76" r="3.8" fill="#DDD6FE" />
      <circle className="platform-clear-svg-node platform-clear-svg-node-c" cx="90" cy="146" r="4" fill="#BFDBFE" />
    </svg>
  );
}

function PlatformClearCore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`platform-clear-core-float relative ${compact ? "h-[255px] w-[300px]" : "h-[300px] w-[330px]"}`}>
      <div className="platform-clear-core-aurora" />

      <div className="platform-clear-core-ring platform-clear-core-ring-a" />
      <div className="platform-clear-core-ring platform-clear-core-ring-b" />
      <div className="platform-clear-core-ring platform-clear-core-ring-c" />

      <div className="platform-clear-core-beam platform-clear-core-beam-a" />
      <div className="platform-clear-core-beam platform-clear-core-beam-b" />

      <div className="platform-clear-core-base platform-clear-core-base-shadow" />
      <div className="platform-clear-core-base platform-clear-core-base-back" />
      <div className="platform-clear-core-base platform-clear-core-base-mid" />
      <div className="platform-clear-core-base platform-clear-core-base-front" />

      <div className={`platform-clear-core-shell ${compact ? "platform-clear-core-shell-compact" : ""}`}>
        <span className="platform-clear-scan-ring" />
        <span className="platform-clear-scan-ring platform-clear-scan-ring-b" />
        <span className="platform-clear-orbit-dot platform-clear-orbit-dot-a" />
        <span className="platform-clear-orbit-dot platform-clear-orbit-dot-b" />
        <span className="platform-clear-orbit-dot platform-clear-orbit-dot-c" />

        <PlatformClearEngineIcon className={compact ? "h-[136px] w-[136px]" : "h-[154px] w-[154px]"} />
      </div>

      <div className={`absolute left-1/2 z-40 -translate-x-1/2 text-center ${compact ? "bottom-[4px] w-[190px]" : "bottom-[8px] w-[220px]"}`}>
        <p className={`${compact ? "text-[16px]" : "text-[18px]"} font-bold leading-none tracking-[-0.02em] text-[#071633]`}>
          Platform Core
        </p>
        <p className={`${compact ? "mt-1 text-[11px]" : "mt-1.5 text-[12px]"} font-semibold text-slate-600`}>
          Orchestration Engine
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]" />
      </div>
    </div>
  );
}

function PlatformClearStepCard({
  step,
  index,
  compact = false,
}: {
  step: PlatformHeroStep;
  index: number;
  compact?: boolean;
}) {
  const Icon = step.Icon;

  return (
    <div
      className="platform-clear-card-float"
      style={
        {
          "--delay": `${index * 0.18}s`,
          "--duration": `${7.2 + index * 0.28}s`,
        } as CSSProperties
      }
    >
      <div
        className={`platform-clear-step-card group relative overflow-hidden border border-blue-100/80 shadow-[0_18px_48px_rgba(37,99,235,0.105)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(37,99,235,0.16)] ${
          compact
            ? "min-h-[116px] rounded-[18px] p-3"
            : "flex min-h-[104px] w-[192px] items-start gap-3 rounded-[20px] p-3.5"
        }`}
      >
        <div className={compact ? "flex items-start gap-3" : "contents"}>
          <span className={`${compact ? "h-9 w-9" : "h-10 w-10"} grid shrink-0 place-items-center rounded-full bg-white shadow-[0_12px_26px_rgba(37,99,235,0.12)] ring-1 ring-blue-100 transition group-hover:shadow-[0_0_0_7px_rgba(34,211,238,0.08),0_14px_30px_rgba(37,99,235,0.16)]`}>
            <span className={`${compact ? "h-7 w-7" : "h-8 w-8"} grid place-items-center rounded-full bg-[linear-gradient(135deg,#F8FBFF,#F5F3FF)]`}>
              <Icon className={`${compact ? "h-[15px] w-[15px]" : "h-[18px] w-[18px]"} ${step.iconClassName}`} strokeWidth={2.1} />
            </span>
          </span>

          <span className="min-w-0">
            <span className="flex items-center gap-2.5">
              <span className={`${compact ? "text-[15px]" : "text-[16px]"} block font-bold leading-none text-[#1E3A8A]`}>
                {step.number}
              </span>
              <span className={`block h-[3px] ${compact ? "w-7" : "w-8"} rounded-full bg-gradient-to-r ${step.progressClassName}`} />
            </span>

            <span className={`${compact ? "mt-1 text-[13px]" : "mt-1 text-[14px]"} block font-bold leading-tight text-[#071633]`}>
              {step.label}
            </span>

            <span className={`${compact ? "mt-1 text-[10.7px]" : "mt-1 text-[11.1px]"} block font-medium leading-[1.45] text-slate-600`}>
              {step.description}
            </span>
          </span>
        </div>

        {!compact && (
          <span className={`absolute bottom-2.5 right-2.5 grid h-5 w-5 place-items-center rounded-full bg-white ${step.iconClassName} opacity-0 shadow-sm ring-1 ring-blue-100 transition group-hover:translate-x-0.5 group-hover:opacity-100`}>
            <ArrowRight aria-hidden="true" className="h-3 w-3" strokeWidth={2.15} />
          </span>
        )}
      </div>
    </div>
  );
}

function PlatformHeroVisual() {
  const stepSlots: Array<{ left: string; top: string }> = [
    { left: "50%", top: "12%" },
    { left: "82%", top: "32%" },
    { left: "82%", top: "66%" },
    { left: "50%", top: "88%" },
    { left: "18%", top: "66%" },
    { left: "18%", top: "32%" },
  ];

  const nodePositions: Array<CSSProperties> = [
    { left: "4%", top: "4%" },
    { right: "4%", top: "4%" },
    { left: "4%", bottom: "4%" },
    { right: "4%", bottom: "4%" },
  ];

  return (
    <div
      className="platform-hero-visual platform-clear-visual relative mx-auto w-full max-w-[800px] overflow-visible lg:mt-1 xl:mt-2"
      aria-hidden="true"
    >
      <div className="hidden md:block">
        <div className="platform-clear-shell relative h-[548px] w-full overflow-visible">
          <div className="platform-clear-ambient absolute inset-[-6%] rounded-full" />
          <div className="platform-clear-mesh absolute right-[2%] top-[3%] h-[235px] w-[300px]" />
          <div className="platform-clear-mesh absolute bottom-[4%] left-[4%] h-[190px] w-[260px] rotate-180 opacity-55" />

          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            viewBox="0 0 780 548"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="platformClearConnector" x1="80" y1="80" x2="700" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.48" stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>

              <filter id="platformClearNodeGlow" x="-90%" y="-90%" width="280%" height="280%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="390" cy="274" rx="238" ry="178" fill="rgba(255,255,255,0.12)" />
            <ellipse
              className="platform-clear-orbit-path"
              cx="390"
              cy="274"
              rx="250"
              ry="184"
              stroke="url(#platformClearConnector)"
              strokeWidth="1.8"
              strokeDasharray="8 13"
            />
            <ellipse
              className="platform-clear-orbit-path platform-clear-orbit-path-slow"
              cx="390"
              cy="274"
              rx="178"
              ry="128"
              stroke="#60A5FA"
              strokeWidth="1.25"
              strokeDasharray="4 11"
            />
            <ellipse cx="390" cy="274" rx="126" ry="92" stroke="rgba(255,255,255,0.56)" strokeWidth="1.1" />

            <path className="platform-clear-connector" d="M390 126C390 160 390 190 390 220" stroke="url(#platformClearConnector)" />
            <path className="platform-clear-connector" d="M534 175C492 190 462 224 430 256" stroke="url(#platformClearConnector)" style={{ "--delay": "-0.8s" } as CSSProperties} />
            <path className="platform-clear-connector" d="M534 362C494 350 462 324 430 294" stroke="url(#platformClearConnector)" style={{ "--delay": "-1.6s" } as CSSProperties} />
            <path className="platform-clear-connector" d="M390 422C390 390 390 358 390 326" stroke="url(#platformClearConnector)" style={{ "--delay": "-2.4s" } as CSSProperties} />
            <path className="platform-clear-connector" d="M246 362C286 350 318 324 350 294" stroke="url(#platformClearConnector)" style={{ "--delay": "-3.2s" } as CSSProperties} />
            <path className="platform-clear-connector" d="M246 175C288 190 318 224 350 256" stroke="url(#platformClearConnector)" style={{ "--delay": "-4s" } as CSSProperties} />

            <path
              className="platform-clear-connector platform-clear-connector-soft"
              d="M120 272C206 130 574 130 660 272"
              stroke="url(#platformClearConnector)"
              style={{ "--delay": "-2s" } as CSSProperties}
            />
            <path
              className="platform-clear-connector platform-clear-connector-soft"
              d="M118 338C218 470 562 470 662 338"
              stroke="url(#platformClearConnector)"
              style={{ "--delay": "-5s" } as CSSProperties}
            />

            {([
              [390, 126, "#2563EB"],
              [534, 175, "#7C3AED"],
              [534, 362, "#06B6D4"],
              [390, 422, "#2563EB"],
              [246, 362, "#7C3AED"],
              [246, 175, "#06B6D4"],
              [390, 220, "#22D3EE"],
              [430, 256, "#7C3AED"],
              [430, 294, "#22D3EE"],
              [390, 326, "#2563EB"],
              [350, 294, "#7C3AED"],
              [350, 256, "#06B6D4"],
            ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
              <g
                key={`${cx}-${cy}`}
                className="platform-clear-signal-node"
                style={{ "--delay": `${index * 0.14}s` } as CSSProperties}
              >
                <circle cx={cx} cy={cy} r="12" fill={fill} opacity="0.14" />
                <circle cx={cx} cy={cy} r="5" fill={fill} filter="url(#platformClearNodeGlow)" />
              </g>
            ))}
          </svg>

          <span className="platform-clear-particle platform-clear-particle-a" />
          <span className="platform-clear-particle platform-clear-particle-b" />
          <span className="platform-clear-particle platform-clear-particle-c" />
          <span className="platform-clear-particle platform-clear-particle-d" />
          <span className="platform-clear-particle platform-clear-particle-e" />

          <div className="absolute left-1/2 top-[51%] z-30 -translate-x-1/2 -translate-y-1/2">
            <PlatformClearCore />
          </div>

          {platformHeroSteps.map((step, index) => {
            const slot = stepSlots[index] ?? stepSlots[0];

            return (
              <div
                key={step.label}
                className="absolute z-40"
                style={{
                  left: slot.left,
                  top: slot.top,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <PlatformClearStepCard step={step} index={index} />
              </div>
            );
          })}

          {platformHeroNodes.map((node, index) => {
            const Icon = node.Icon;

            return (
              <div
                key={node.label}
                className="absolute z-40 hidden lg:block"
                style={nodePositions[index] ?? nodePositions[0]}
              >
                <div
                  className="platform-clear-pill-float"
                  style={
                    {
                      "--delay": `${index * 0.22}s`,
                      "--duration": `${6.4 + index * 0.28}s`,
                    } as CSSProperties
                  }
                >
                  <div className="platform-clear-node-pill flex items-center gap-2 rounded-full border border-blue-100/80 bg-white/90 px-3 py-2 shadow-[0_14px_40px_rgba(37,99,235,0.09)] backdrop-blur-xl">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] ring-1 ring-blue-100">
                      <Icon className={`h-[15px] w-[15px] ${node.iconClassName}`} strokeWidth={2.1} />
                    </span>
                    <span className="whitespace-nowrap text-[11px] font-bold leading-tight text-slate-800">{node.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-100/80 bg-white/70 p-4 shadow-[0_18px_48px_rgba(37,99,235,0.10)] backdrop-blur-xl">
          <div className="platform-clear-ambient absolute inset-0 rounded-[28px]" />
          <div className="relative mx-auto h-[255px] max-w-[320px]">
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <PlatformClearCore compact />
            </div>
          </div>

          <div className="relative z-20 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {platformHeroSteps.map((step, index) => (
              <PlatformClearStepCard key={step.label} step={step} index={index} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(255,255,255,0.86),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(124,58,237,0.09),transparent_34%),radial-gradient(circle_at_86%_72%,rgba(34,211,238,0.1),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(248,251,255,0.62)_58%,rgba(255,255,255,0.72)_100%)]" />
      <div aria-hidden="true" className="platform-grid-bg absolute inset-0 opacity-20" />

      <div className="relative mx-auto grid w-full max-w-[calc(100vw-2.5rem)] min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Platform
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">The complete</span>
              <span className="block">platform for</span>
              <span className="block">continuous</span>
              <span className="block bg-[linear-gradient(100deg,#2563EB_0%,#06B6D4_42%,#7C3AED_100%)] bg-clip-text pb-1 leading-[1.16] text-transparent">security validation</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA brings AI-supported analysis, controlled validation, human approval and evidence-backed workflows into one secure platform.
            </p>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="/book-demo"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[150px] sm:w-auto"
              >
                Book a Demo
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="#architecture"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                Explore platform architecture
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-full grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[560px] sm:grid-cols-4">
              {heroChips.map((chip) => {
                const Icon = chip.Icon;

                return (
                  <div key={chip.label} className="group flex min-w-0 flex-col items-center border-slate-200/80 text-center sm:border-l sm:first:border-l-0">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.10)] ring-1 ring-blue-100 transition group-hover:-translate-y-0.5 group-hover:text-[#04A9C7] motion-reduce:transform-none">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <span className="mt-3 max-w-[118px] text-[11px] font-semibold leading-snug text-slate-950 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">{chip.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0 max-w-full" delayMs={120}>
          <PlatformHeroVisual />
        </Reveal>
      </div>

    </section>
  );
}

function ModuleCard({ item, index }: { item: IconTextItem; index: number }) {
  const Icon = item.Icon;

  return (
    <Reveal delayMs={index * 55}>
      <article className="group flex h-full min-h-[172px] flex-col rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_56px_rgba(37,99,235,0.13)]">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[18px] border border-blue-100 bg-[linear-gradient(135deg,#F8FBFF,#F5F3FF)] text-[#2563EB] shadow-[0_12px_26px_rgba(37,99,235,0.12)]">
            <Icon className="h-8 w-8" strokeWidth={2.05} />
          </span>
          <span className="mt-auto text-[#2563EB] transition group-hover:translate-x-1">
            <ArrowRight aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
          </span>
        </div>
        <h3 className="mt-5 text-[17px] font-black leading-tight text-[#071633]">{item.title}</h3>
        <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-600">{item.description}</p>
      </article>
    </Reveal>
  );
}

function PlatformModulesSection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-16" id="modules">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>PLATFORM MODULES</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Everything you need in</span>
              <span className="block">one unified console</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              From asset configuration to AI-supported validation and reporting, EVADA is built for every security team.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {moduleCards.map((item, index) => (
            <ModuleCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AIPipelineSection() {
  return (
    <section className="bg-white px-5 pb-12 pt-2 sm:px-8 lg:px-10 lg:pb-16" id="ai-pipeline">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>AI-SUPPORTED PENTEST PIPELINE</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">AI-supported pentest</span>
              <span className="block">pipeline</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              Observe every stage of the validation workflow in real time.
            </p>
          </div>
        </Reveal>

        <div className="problem-edge-card relative isolate mt-10 grid gap-7 overflow-hidden rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_18px_52px_rgba(37,99,235,0.08)] lg:grid-cols-8 lg:gap-3">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
          {pipelineStages.map((stage, index) => {
            const Icon = stage.Icon;

            return (
              <Reveal key={stage.title} delayMs={index * 55}>
                <article className="platform-pipeline-step relative grid justify-items-center gap-3 rounded-[20px] border border-blue-100 bg-white px-4 py-5 text-center shadow-[0_16px_38px_rgba(37,99,235,0.06)] lg:border-transparent lg:bg-transparent lg:px-1 lg:py-0 lg:shadow-none">
                  <span className="platform-pipeline-node grid h-16 w-16 place-items-center rounded-full border border-blue-100 bg-white text-[#2563EB] shadow-[0_12px_32px_rgba(37,99,235,0.12)]">
                    <Icon className="h-8 w-8" strokeWidth={2.05} />
                  </span>
                  <h3 className="max-w-[120px] text-[13px] font-black leading-tight text-[#071633]">{stage.title}</h3>
                  <p className="max-w-[135px] text-[12px] font-medium leading-relaxed text-slate-600">{stage.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delayMs={160}>
          <div className="problem-edge-card relative isolate mt-9 flex flex-col gap-5 overflow-hidden rounded-[20px] border border-blue-100 bg-[linear-gradient(135deg,#F8FBFF,#FFFFFF)] px-5 py-5 shadow-[0_18px_46px_rgba(37,99,235,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
            <div className="flex min-w-0 gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[#EEF5FF] text-[#2563EB] ring-1 ring-blue-100">
                <ShieldCheck aria-hidden="true" className="h-6 w-6" strokeWidth={2.1} />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-black text-[#2563EB]">Live pipeline monitoring</h3>
                <p className="mt-1 text-[14px] font-medium leading-relaxed text-slate-600">
                  Track active jobs, live events and stage-by-stage progress in real time.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[14px] px-4 py-3 text-[15px] font-black text-[#2563EB] transition hover:bg-blue-50"
            >
              Go to AI-supported pentest
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="platform-architecture-diagram relative overflow-hidden rounded-[24px] border border-blue-100 bg-white p-5 shadow-[0_24px_64px_rgba(37,99,235,0.10)] sm:p-7">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox="0 0 900 420" preserveAspectRatio="none" aria-hidden="true">
        {[78, 142, 206, 270, 334].map((y, index) => (
          <path key={`left-${y}`} className="platform-arch-path" d={`M210 ${y} C 300 ${y}, 300 210, 390 210`} style={{ animationDelay: `${index * 100}ms` }} />
        ))}
        {[78, 142, 206, 270, 334].map((y, index) => (
          <path key={`right-${y}`} className="platform-arch-path" d={`M510 210 C 600 210, 600 ${y}, 690 ${y}`} style={{ animationDelay: `${500 + index * 100}ms` }} />
        ))}
      </svg>

      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_1.28fr_1fr]">
        {architectureColumns.map((column) => (
          <div key={column.title} className="rounded-[18px] border border-blue-100 bg-[#FBFDFF]/95 p-4 shadow-[0_12px_30px_rgba(37,99,235,0.06)]">
            <h3 className="text-center text-[13px] font-black text-[#2563EB]">{column.title}</h3>
            <div className="mt-4 grid gap-3">
              {column.items.map((item) => {
                const Icon = item.Icon;

                return (
                <div key={item.title} className="flex items-center gap-3 rounded-[12px] border border-blue-100 bg-white px-4 py-3 shadow-sm">
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-[10px] ${
                      column.tone === "violet"
                        ? "bg-violet-50 text-violet-600"
                        : column.tone === "cyan"
                          ? "bg-cyan-50 text-cyan-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
                  </span>
                  <span className="text-[13px] font-bold leading-snug text-slate-800">{item.title}</span>
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-12 sm:px-8 lg:px-10 lg:py-16" id="architecture">
      <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:items-center">
        <Reveal>
          <div>
            <Eyebrow>ARCHITECTURE</Eyebrow>
            <h2 className="mt-3 max-w-[460px] text-[clamp(1.55rem,4.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Built for security,</span>
              <span className="block">control and scale</span>
            </h2>
            <p className="mt-5 max-w-[420px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              EVADA is designed with security and governance at every layer.
            </p>
            <ul className="mt-6 grid gap-3">
              {architectureBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-[14px] font-bold text-slate-700">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF5FF] text-[#2563EB]">
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <ArchitectureDiagram />
        </Reveal>
      </div>
    </section>
  );
}

function TrustStripSection() {
  return (
    <section className="bg-white px-5 pb-4 pt-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1360px]">
        <div className="problem-edge-card relative isolate grid overflow-hidden rounded-[22px] border border-blue-100 bg-white shadow-[0_18px_48px_rgba(37,99,235,0.08)] sm:grid-cols-2 xl:grid-cols-4">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
          {trustCards.map((card, index) => {
            const Icon = card.Icon;

            return (
              <Reveal key={card.title} delayMs={index * 60}>
                <article className="flex h-full gap-4 border-b border-blue-100 p-6 sm:[&:nth-child(2n)]:border-l xl:border-b-0 xl:border-l xl:first:border-l-0">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] ring-1 ring-blue-100">
                    <Icon className="h-7 w-7" strokeWidth={2.05} />
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-[16px] font-black text-[#071633]">{card.title}</h3>
                    <p className="mt-1 text-[13px] font-medium leading-relaxed text-slate-600">{card.description}</p>
                  </span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function PlatformPage() {
  return (
    <main className="evada-homepage evada-platform-page evada-marketing-strict-lazy evada-marketing-scroll-optimized relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950" data-marketing-ready="false">
      <MarketingAnimatedBackground variant="platform" />
      <MarketingScrollOptimizer
        scrollLerp={0.22}
        settleDelayMs={100}
        strictActiveSectionAnimations
        wheelMultiplier={1.62}
      />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <PlatformModulesSection />
        <AIPipelineSection />
        <ArchitectureSection />
        <TrustStripSection />
        <FooterSection />
      </div>
    </main>
  );
}
