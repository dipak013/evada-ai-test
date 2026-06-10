import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";
import MarketingScrollOptimizer from "@/components/marketing/MarketingScrollOptimizer";

type IconCard = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

type ComplianceCard = {
  label: string;
  title: string;
  text: string;
  Icon: LucideIcon;
};

type SecurityHeroBadge = {
  label: string;
  Icon: LucideIcon;
  className: string;
  delayMs?: number;
  showDot?: boolean;
  variant?: "default" | "status";
};

const heroChips: IconCard[] = [
  { title: "Secure by Design", text: "", Icon: marketingIconMap["secure-platform"] },
  { title: "Data Protection", text: "", Icon: marketingIconMap["data-protection"] },
  { title: "Audit and Logging", text: "", Icon: marketingIconMap["audit-logs"] },
  { title: "RBAC Controls", text: "", Icon: marketingIconMap["admin-rbac"] },
];

const pillars: IconCard[] = [
  {
    title: "Secure Platform",
    text: "Hardened infrastructure, secure configuration and continuous vulnerability management.",
    Icon: marketingIconMap["secure-platform"],
  },
  {
    title: "Data Protection",
    text: "Encryption in transit and at rest with strict data isolation.",
    Icon: marketingIconMap["data-protection"],
  },
  {
    title: "Identity and Access",
    text: "RBAC, SSO and least-privilege access for every user and tenant.",
    Icon: marketingIconMap["identity-access"],
  },
  {
    title: "Monitoring and Audit",
    text: "Real-time monitoring, detailed audit logs and tamper-proof records.",
    Icon: marketingIconMap["monitoring-audit"],
  },
  {
    title: "Compliance",
    text: "Aligned with SOC 2, ISO 27001, GDPR and industry standards.",
    Icon: marketingIconMap.compliance,
  },
];

const complianceChecklist = [
  "SOC 2 Type II aligned",
  "ISO 27001 aligned",
  "GDPR aligned",
  "CCPA ready",
  "Regular security assessments",
  "Third-party penetration testing",
];

const complianceCards: ComplianceCard[] = [
  {
    label: "SOC 2",
    title: "SOC 2 Type II Aligned",
    text: "Security, availability and confidentiality.",
    Icon: marketingIconMap.compliance,
  },
  {
    label: "ISO 27001",
    title: "ISO 27001 Aligned",
    text: "Information security management.",
    Icon: marketingIconMap.compliance,
  },
  {
    label: "GDPR",
    title: "GDPR Aligned",
    text: "EU General Data Protection Regulation.",
    Icon: marketingIconMap["data-protection"],
  },
  {
    label: "CCPA",
    title: "CCPA Ready",
    text: "California Consumer Privacy Act.",
    Icon: marketingIconMap.compliance,
  },
];

const platformSecurityCards: IconCard[] = [
  {
    title: "Secure Development",
    text: "Secure SDLC, code reviews, SAST, DAST and dependency scanning.",
    Icon: marketingIconMap["secure-development"],
  },
  {
    title: "Infrastructure Security",
    text: "Cloud-native architecture with network isolation and firewall controls.",
    Icon: marketingIconMap["infrastructure-security"],
  },
  {
    title: "Data Security",
    text: "Encrypted databases, backups and strict access controls.",
    Icon: marketingIconMap["data-security"],
  },
  {
    title: "Application Security",
    text: "Input validation, CSRF protection, rate limiting and secure APIs.",
    Icon: marketingIconMap["application-security"],
  },
  {
    title: "AI Validation Safety",
    text: "Safe sandbox environment, human approval and controlled execution.",
    Icon: marketingIconMap["ai-validation-safety"],
  },
  {
    title: "Tenant Isolation",
    text: "Multi-tenant isolation helps keep customer data private and secure.",
    Icon: marketingIconMap["tenant-isolation"],
  },
];

const transparencyFeatures: IconCard[] = [
  {
    title: "Public Security Documentation",
    text: "Clear documentation for platform security practices.",
    Icon: marketingIconMap.documentation,
  },
  {
    title: "Regular Compliance Reports",
    text: "Ongoing reviews and reporting for enterprise assurance.",
    Icon: marketingIconMap.compliance,
  },
  {
    title: "Vulnerability Disclosure Programme",
    text: "A responsible disclosure process for security researchers.",
    Icon: marketingIconMap["vulnerability-disclosure"],
  },
  {
    title: "Customer Data Ownership",
    text: "Your data remains yours, with clear access and privacy controls.",
    Icon: marketingIconMap["customer-data-ownership"],
  },
];

const governanceCards: IconCard[] = [
  {
    title: "RBAC Permissions",
    text: "Control access to AI Scanner, Knowledge Hub, SaaS Admin, Client Admin and Superadmin areas.",
    Icon: marketingIconMap["admin-rbac"],
  },
  {
    title: "Session and CSRF Protection",
    text: "Support session-cookie authentication and CSRF-aware backend APIs.",
    Icon: marketingIconMap["session-csrf"],
  },
  {
    title: "Audit and Logs",
    text: "Review audit logs, APM logs, security events and operational activity.",
    Icon: marketingIconMap["audit-logs"],
  },
  {
    title: "Human Approval",
    text: "Require analyst approval before sensitive AI validation and sandbox execution steps.",
    Icon: marketingIconMap.approval,
  },
];

const securityHeroBadges: SecurityHeroBadge[] = [
  {
    label: "Security Operations",
    Icon: marketingIconMap["security-signals"],
    className: "left-[356px] top-[58px]",
    delayMs: 20,
    showDot: true,
    variant: "status",
  },
  {
    label: "Secure Validation",
    Icon: marketingIconMap.validate,
    className: "left-[56px] top-[118px]",
    delayMs: 60,
    showDot: true,
  },
  {
    label: "Data Protection",
    Icon: marketingIconMap["data-protection"],
    className: "right-[72px] top-[118px]",
    delayMs: 160,
    showDot: true,
  },
  {
    label: "RBAC Access",
    Icon: marketingIconMap["admin-rbac"],
    className: "left-[8px] top-[302px]",
    delayMs: 260,
    showDot: true,
  },
  {
    label: "Audit Trails",
    Icon: marketingIconMap["audit-logs"],
    className: "right-[14px] top-[302px]",
    delayMs: 340,
    showDot: true,
  },
  {
    label: "Session and CSRF",
    Icon: marketingIconMap["session-csrf"],
    className: "left-[54px] bottom-[112px]",
    delayMs: 430,
    showDot: true,
  },
  {
    label: "Human Approval",
    Icon: marketingIconMap.approval,
    className: "right-[52px] bottom-[112px]",
    delayMs: 520,
    showDot: true,
  },
  {
    label: "All Systems Secure",
    Icon: marketingIconMap["secure-platform"],
    className: "left-[356px] bottom-[26px]",
    delayMs: 610,
    showDot: true,
    variant: "status",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
      {children}
    </p>
  );
}


function SecurityCommandCoreIcon({
  className = "",
  idPrefix = "security-command",
}: {
  className?: string;
  idPrefix?: string;
}) {
  const shieldFillId = `${idPrefix}-shield-fill`;
  const shieldStrokeId = `${idPrefix}-shield-stroke`;
  const lineId = `${idPrefix}-line`;
  const glowId = `${idPrefix}-glow`;

  return (
    <svg
      aria-hidden="true"
      className={`security-command-icon ${className}`}
      viewBox="0 0 190 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={shieldFillId} x1="28" y1="18" x2="162" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22D3EE" />
          <stop offset="0.46" stopColor="#2563EB" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id={shieldStrokeId} x1="40" y1="18" x2="150" y2="188" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.98)" />
          <stop offset="0.5" stopColor="rgba(191,239,255,0.94)" />
          <stop offset="1" stopColor="rgba(237,233,254,0.94)" />
        </linearGradient>

        <linearGradient id={lineId} x1="54" y1="66" x2="136" y2="146" gradientUnits="userSpaceOnUse">
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

      <path
        className="security-command-shield-body"
        d="M95 10.5L148 32.5V83.5C148 128.5 127.2 164.1 95 186.5C62.8 164.1 42 128.5 42 83.5V32.5L95 10.5Z"
        fill={`url(#${shieldFillId})`}
        stroke={`url(#${shieldStrokeId})`}
        strokeWidth="4.4"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      <path
        className="security-command-shield-inner"
        d="M95 28L130 42.8V83.6C130 115.5 116.4 141.5 95 158.8C73.6 141.5 60 115.5 60 83.6V42.8L95 28Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        className="security-command-radar-arc security-command-radar-arc-a"
        d="M67 89C72.5 74.5 83 66.5 95 66.5C107 66.5 117.5 74.5 123 89"
        stroke={`url(#${lineId})`}
        strokeWidth="3.3"
        strokeLinecap="round"
      />

      <path
        className="security-command-radar-arc security-command-radar-arc-b"
        d="M76 92C80.2 83.4 86.8 78.8 95 78.8C103.2 78.8 109.8 83.4 114 92"
        stroke={`url(#${lineId})`}
        strokeWidth="3.3"
        strokeLinecap="round"
      />

      <path
        className="security-command-lock-shackle"
        d="M78 105V94C78 84.6 85.2 78 95 78C104.8 78 112 84.6 112 94V105"
        stroke="white"
        strokeWidth="4.4"
        strokeLinecap="round"
      />

      <rect
        className="security-command-lock-body"
        x="70"
        y="101"
        width="50"
        height="42"
        rx="13"
        fill="rgba(255,255,255,0.18)"
        stroke="white"
        strokeWidth="4.2"
      />

      <path
        className="security-command-check"
        d="M82.5 122.5L91.5 131.5L108.5 112.5"
        stroke="white"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      <path
        className="security-command-circuit-line"
        d="M64 151H48M126 151H142M95 154V174M58 72H44M146 72H132"
        stroke="rgba(191,239,255,0.96)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle className="security-command-svg-node security-command-svg-node-a" cx="44" cy="72" r="4" fill="#A7F3FF" />
      <circle className="security-command-svg-node security-command-svg-node-b" cx="146" cy="72" r="4" fill="#DDD6FE" />
      <circle className="security-command-svg-node security-command-svg-node-c" cx="95" cy="174" r="4.2" fill="#BFDBFE" />
    </svg>
  );
}

function SecurityCommandCore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`security-command-core-float relative ${compact ? "h-[255px] w-[300px]" : "h-[300px] w-[330px]"}`}>
      <div className="security-command-core-aurora" />

      <div className="security-command-core-ring security-command-core-ring-a" />
      <div className="security-command-core-ring security-command-core-ring-b" />
      <div className="security-command-core-ring security-command-core-ring-c" />

      <div className="security-command-beam security-command-beam-a" />
      <div className="security-command-beam security-command-beam-b" />

      <div className="security-command-base security-command-base-shadow" />
      <div className="security-command-base security-command-base-back" />
      <div className="security-command-base security-command-base-mid" />
      <div className="security-command-base security-command-base-front" />

      <div className={`security-command-core-shell ${compact ? "security-command-core-shell-compact" : ""}`}>
        <span className="security-command-scan-ring" />
        <span className="security-command-scan-ring security-command-scan-ring-b" />
        <span className="security-command-orbit-dot security-command-orbit-dot-a" />
        <span className="security-command-orbit-dot security-command-orbit-dot-b" />
        <span className="security-command-orbit-dot security-command-orbit-dot-c" />

        <SecurityCommandCoreIcon
          idPrefix={compact ? "security-command-mobile" : "security-command-desktop"}
          className={compact ? "h-[136px] w-[136px]" : "h-[154px] w-[154px]"}
        />
      </div>

      <div className={`absolute left-1/2 z-40 -translate-x-1/2 text-center ${compact ? "bottom-[4px] w-[190px]" : "bottom-[8px] w-[220px]"}`}>
        <p className={`${compact ? "text-[16px]" : "text-[18px]"} font-bold leading-none tracking-[-0.02em] text-[#071633]`}>
          Security Core
        </p>
        <p className={`${compact ? "mt-1 text-[11px]" : "mt-1.5 text-[12px]"} font-semibold text-slate-600`}>
          Trust, access and audit control
        </p>
        <span className="mx-auto mt-2.5 block h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]" />
      </div>
    </div>
  );
}

function SecurityOpsBadge({ badge, index = 0, compact = false }: { badge: SecurityHeroBadge; index?: number; compact?: boolean }) {
  const Icon = badge.Icon;
  const isStatus = badge.variant === "status";

  return (
    <div
      className="security-command-badge-float"
      style={{
        animationDelay: `${badge.delayMs ?? index * 90}ms`,
        animationDuration: `${6.8 + index * 0.24}s`,
      }}
    >
      <div
        className={`security-command-badge group relative flex items-center gap-2.5 overflow-hidden border border-blue-100/80 bg-white/92 shadow-[0_16px_44px_rgba(37,99,235,0.105)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_62px_rgba(37,99,235,0.16)] ${
          compact
            ? "min-h-[58px] rounded-[18px] px-3 py-2.5"
            : isStatus
              ? "min-h-[56px] w-[206px] justify-center rounded-full px-3.5 py-2.5"
              : "min-h-[64px] w-[192px] rounded-[20px] px-3.5 py-3"
        }`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.10)] ring-1 ring-blue-100 transition group-hover:shadow-[0_0_0_7px_rgba(34,211,238,0.08),0_14px_30px_rgba(37,99,235,0.15)]">
          <Icon aria-hidden="true" className={`${compact ? "h-[17px] w-[17px]" : "h-[18px] w-[18px]"}`} strokeWidth={2.15} />
        </span>

        <span className="min-w-0">
          <span className={`${compact ? "text-[12.5px]" : isStatus ? "text-[13px]" : "text-[12.5px]"} block font-bold leading-tight text-[#071633]`}>
            {badge.label}
          </span>

          {!compact && !isStatus && (
            <span className="mt-1 flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
              Active control
            </span>
          )}

          {!compact && isStatus && (
            <span className="mt-1 flex items-center justify-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
              Live
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

function SecurityHeroVisual() {
  const badgeSlots: Array<{ left?: string; right?: string; top?: string; bottom?: string; transform?: string }> = [
    { left: "50%", top: "5%", transform: "translateX(-50%)" },
    { left: "4%", top: "22%" },
    { right: "4%", top: "22%" },
    { left: "0%", top: "49%" },
    { right: "0%", top: "49%" },
    { left: "7%", bottom: "12%" },
    { right: "7%", bottom: "12%" },
    { left: "50%", bottom: "1%", transform: "translateX(-50%)" },
  ];

  return (
    <div
      className="security-hero-visual security-command-visual relative mx-auto w-full max-w-[800px] overflow-visible lg:mt-1 xl:mt-2"
      aria-hidden="true"
    >
      <div className="hidden md:block">
        <div className="security-command-shell relative h-[548px] w-full overflow-visible">
          <div className="security-command-ambient absolute inset-[-6%] rounded-full" />
          <div className="security-command-mesh absolute right-[2%] top-[3%] h-[235px] w-[310px]" />
          <div className="security-command-mesh absolute bottom-[3%] left-[4%] h-[190px] w-[270px] rotate-180 opacity-55" />

          <svg
            className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
            viewBox="0 0 820 565"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="securityCommandConnector" x1="92" y1="80" x2="728" y2="520" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.48" stopColor="#2563EB" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>

              <filter id="securityCommandNodeGlow" x="-90%" y="-90%" width="280%" height="280%">
                <feGaussianBlur stdDeviation="4.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="410" cy="294" rx="252" ry="188" fill="rgba(255,255,255,0.13)" />
            <ellipse
              className="security-command-orbit-path"
              cx="410"
              cy="294"
              rx="260"
              ry="192"
              stroke="url(#securityCommandConnector)"
              strokeWidth="1.8"
              strokeDasharray="8 13"
            />
            <ellipse
              className="security-command-orbit-path security-command-orbit-path-slow"
              cx="410"
              cy="294"
              rx="184"
              ry="134"
              stroke="#60A5FA"
              strokeWidth="1.25"
              strokeDasharray="4 11"
            />
            <ellipse cx="410" cy="294" rx="130" ry="96" stroke="rgba(255,255,255,0.56)" strokeWidth="1.1" />

            <path className="security-command-connector" d="M410 102C410 144 410 180 410 226" stroke="url(#securityCommandConnector)" />
            <path className="security-command-connector" d="M214 168C288 184 342 226 378 270" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-0.8s" }} />
            <path className="security-command-connector" d="M606 168C532 184 478 226 442 270" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-1.6s" }} />
            <path className="security-command-connector" d="M202 316C278 312 335 303 370 296" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-2.4s" }} />
            <path className="security-command-connector" d="M618 316C542 312 485 303 450 296" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-3.2s" }} />
            <path className="security-command-connector" d="M240 440C302 404 350 362 380 326" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-4s" }} />
            <path className="security-command-connector" d="M580 440C518 404 470 362 440 326" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-4.8s" }} />
            <path className="security-command-connector" d="M410 520C410 452 410 392 410 352" stroke="url(#securityCommandConnector)" style={{ animationDelay: "-5.6s" }} />

            <path
              className="security-command-connector security-command-connector-soft"
              d="M142 286C232 136 588 136 678 286"
              stroke="url(#securityCommandConnector)"
              style={{ animationDelay: "-2s" }}
            />
            <path
              className="security-command-connector security-command-connector-soft"
              d="M138 356C236 492 584 492 682 356"
              stroke="url(#securityCommandConnector)"
              style={{ animationDelay: "-5s" }}
            />

            {([
              [410, 102, "#2563EB"],
              [214, 168, "#06B6D4"],
              [606, 168, "#7C3AED"],
              [202, 316, "#2563EB"],
              [618, 316, "#7C3AED"],
              [240, 440, "#06B6D4"],
              [580, 440, "#7C3AED"],
              [410, 520, "#2563EB"],
              [410, 226, "#22D3EE"],
              [378, 270, "#06B6D4"],
              [442, 270, "#7C3AED"],
              [410, 352, "#22D3EE"],
            ] as Array<[number, number, string]>).map(([cx, cy, fill], index) => (
              <g
                key={`${cx}-${cy}`}
                className="security-command-signal-node"
                style={{ animationDelay: `${index * 0.14}s` }}
              >
                <circle cx={cx} cy={cy} r="12" fill={fill} opacity="0.14" />
                <circle cx={cx} cy={cy} r="5" fill={fill} filter="url(#securityCommandNodeGlow)" />
              </g>
            ))}
          </svg>

          <span className="security-command-particle security-command-particle-a" />
          <span className="security-command-particle security-command-particle-b" />
          <span className="security-command-particle security-command-particle-c" />
          <span className="security-command-particle security-command-particle-d" />
          <span className="security-command-particle security-command-particle-e" />
          <span className="security-command-particle security-command-particle-f" />

          <div className="absolute left-1/2 top-[52%] z-30 -translate-x-1/2 -translate-y-1/2">
            <SecurityCommandCore />
          </div>

          {securityHeroBadges.map((badge, index) => {
            const slot = badgeSlots[index] ?? badgeSlots[0];

            return (
              <div
                key={badge.label}
                className="absolute z-40"
                style={{
                  left: slot.left,
                  right: slot.right,
                  top: slot.top,
                  bottom: slot.bottom,
                  transform: slot.transform,
                }}
              >
                <SecurityOpsBadge badge={badge} index={index} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-100/80 bg-white/72 p-4 shadow-[0_18px_48px_rgba(37,99,235,0.10)] backdrop-blur-xl">
          <div className="security-command-ambient absolute inset-0 rounded-[28px]" />
          <div className="relative mx-auto h-[255px] max-w-[320px]">
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <SecurityCommandCore compact />
            </div>
          </div>

          <div className="relative z-20 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {securityHeroBadges.map((badge, index) => (
              <SecurityOpsBadge key={badge.label} badge={badge} index={index} compact />
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
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.78),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(124,58,237,0.18),transparent_36%),radial-gradient(circle_at_78%_74%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(248,251,255,0.58)_45%,rgba(124,58,237,0.22)_100%)]" />
      <div aria-hidden="true" className="security-grid-bg absolute inset-0 opacity-[0.24]" />

      <div className="relative mx-auto grid w-full max-w-[calc(100vw-2.5rem)] min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Security and trust
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Enterprise security</span>
              <span className="block">governance</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">built for</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">trust</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA protects AI-supported workflows with secure validation, data controls, audit trails and role-based access, helping teams move faster without losing governance.
            </p>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="#trust-center"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                <ShieldCheck aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                View Trust Centre
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="/book-demo"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[150px] sm:w-auto"
              >
                <BadgeCheck aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                Book a Demo
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-full grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[560px] sm:grid-cols-4">
              {heroChips.map((chip) => {
                const Icon = chip.Icon;

                return (
                  <div key={chip.title} className="group flex min-w-0 flex-col items-center border-slate-200/80 text-center sm:border-l sm:first:border-l-0">
                    <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#2563EB] shadow-[0_10px_22px_rgba(37,99,235,0.10)] ring-1 ring-blue-100">
                      <Icon className="h-5 w-5" strokeWidth={2.1} />
                    </span>
                    <span className="mt-3 max-w-[118px] text-[11px] font-semibold leading-snug text-slate-950 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">{chip.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0 max-w-full" delayMs={120}>
          <SecurityHeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

function SecurityPillarsSection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-16" id="trust-center">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>OUR SECURITY COMMITMENTS</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              Five pillars of security
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              Our platform is built on strong security principles that protect your data and your business.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.Icon;

            return (
              <Reveal key={pillar.title} delayMs={index * 60}>
                <article className="group flex h-full flex-col rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_58px_rgba(37,99,235,0.14)]">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#7C3AED] shadow-[0_14px_34px_rgba(124,58,237,0.14)] ring-1 ring-blue-100 transition group-hover:text-[#2563EB]">
                    <Icon className="h-8 w-8" strokeWidth={2.05} />
                  </span>
                  <h3 className="mt-6 text-[17px] font-black text-[#071633]">{pillar.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-600">{pillar.text}</p>
                  <Link href="#platform-security" className="mt-auto inline-flex w-fit items-center gap-2 pt-5 text-[13px] font-black text-[#2563EB] transition group-hover:translate-x-1">
                    Learn more
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

function ComplianceSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-12 sm:px-8 lg:px-10 lg:py-14" id="compliance">
      <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.32fr_0.68fr] lg:items-center">
        <Reveal>
          <div>
            <Eyebrow>COMPLIANCE AND CERTIFICATIONS</Eyebrow>
            <h2 className="mt-3 max-w-[460px] text-[clamp(1.55rem,4.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Built for enterprise</span>
              <span className="block">compliance</span>
            </h2>
            <p className="mt-5 max-w-[430px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              EVADA aligns with global security standards so teams can meet regulatory and compliance requirements with confidence.
            </p>
            <ul className="mt-6 grid gap-3">
              {complianceChecklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] font-bold text-slate-700">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#EEF5FF] text-[#2563EB]">
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/resources" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[12px] border border-blue-200 bg-white px-5 py-2.5 text-[14px] font-black text-[#2563EB] transition hover:-translate-y-0.5 hover:border-blue-300">
              View compliance details
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {complianceCards.map((card, index) => {
            const Icon = card.Icon;

            return (
              <Reveal key={card.label} delayMs={index * 70}>
                <article className="h-full rounded-[18px] border border-blue-100 bg-white p-6 text-center shadow-[0_18px_44px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(37,99,235,0.14)]">
                  <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#06B6D4,#7C3AED)] text-white shadow-[0_16px_40px_rgba(37,99,235,0.22)] ring-8 ring-blue-50">
                    <Icon className="h-11 w-11" strokeWidth={1.9} />
                  </span>
                  <p className="mt-5 text-[22px] font-black text-[#071633]">{card.label}</p>
                  <h3 className="mt-1 text-[17px] font-black leading-tight text-[#071633]">{card.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-600">{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlatformSecuritySection() {
  return (
    <section className="bg-white px-5 py-12 sm:px-8 lg:px-10 lg:py-14" id="platform-security">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>SECURITY ACROSS THE PLATFORM</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Security built into</span>
              <span className="block">every layer</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              From code to cloud, EVADA follows industry practices to keep data, workflows and applications secure.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {platformSecurityCards.map((card, index) => {
            const Icon = card.Icon;

            return (
              <Reveal key={card.title} delayMs={index * 55}>
                <article className="group h-full rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.07)] transition duration-300 hover:-translate-y-1 hover:border-blue-200">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#7C3AED] ring-1 ring-blue-100 transition group-hover:text-[#2563EB]">
                    <Icon className="h-7 w-7" strokeWidth={2.05} />
                  </span>
                  <h3 className="mt-5 text-[16px] font-black text-[#071633]">{card.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-600">{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TransparencySection() {
  return (
    <section className="bg-white px-5 py-4 sm:px-8 lg:px-10" id="transparency">
      <Reveal>
        <div className="company-work-card relative isolate mx-auto max-w-[1360px] overflow-hidden rounded-[24px] border border-white/10 px-6 py-8 text-white shadow-[0_24px_70px_rgba(15,13,40,0.28)] sm:px-8 lg:px-10">
          <div aria-hidden="true" className="company-work-card-glow absolute inset-0" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.82fr_1.78fr] lg:items-center">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#C4B5FD]">TRANSPARENCY YOU CAN TRUST</p>
              <h2 className="mt-4 max-w-[460px] text-[clamp(1.55rem,4.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em]">
                Transparency and accountability
              </h2>
              <p className="mt-4 max-w-[420px] text-[15px] font-normal leading-relaxed text-slate-200 sm:text-[16px]">
                We believe in being open about how we protect your data and operate our platform.
              </p>
            </div>

            <div className="grid gap-4 rounded-[22px] border border-white/10 bg-[#071633]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_22px_58px_rgba(2,11,31,0.24)] sm:grid-cols-2 xl:grid-cols-4">
              {transparencyFeatures.map((feature) => {
                const Icon = feature.Icon;

                return (
                  <article key={feature.title} className="group h-full rounded-[18px] border !border-blue-100 !bg-white/92 p-5 shadow-[0_16px_40px_rgba(2,11,31,0.18)] transition hover:-translate-y-1 hover:!border-blue-200 hover:!bg-white">
                    <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#EEF5FF] text-[#2563EB] shadow-[0_12px_26px_rgba(37,99,235,0.14)] ring-1 ring-blue-100 transition group-hover:bg-blue-50 group-hover:text-[#7C3AED]">
                      <Icon className="h-8 w-8" strokeWidth={2.05} />
                    </span>
                    <h3 className="mt-5 text-[16px] font-bold leading-tight text-slate-950">{feature.title}</h3>
                    <p className="mt-2 text-[13px] font-normal leading-relaxed text-slate-600">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-12 sm:px-8 lg:px-10 lg:py-14" id="governance">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>GOVERNED SECURITY OPERATIONS</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">
              <span className="block">Controlled access,</span>
              <span className="block">auditable actions and</span>
              <span className="block">safer validation</span>
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">
              EVADA combines permission-gated access, audit visibility and human-approved validation workflows to keep operations controlled and accountable.
            </p>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {governanceCards.map((card, index) => {
            const Icon = card.Icon;

            return (
              <Reveal key={card.title} delayMs={index * 60}>
                <article className="h-full rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-1 hover:border-blue-200">
                  <span className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#EEF5FF] text-[#2563EB] ring-1 ring-blue-100">
                    <Icon className="h-7 w-7" strokeWidth={2.05} />
                  </span>
                  <h3 className="mt-5 text-[17px] font-black text-[#071633]">{card.title}</h3>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-slate-600">{card.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SecurityCTASection() {
  return (
    <section className="bg-white px-5 pb-12 pt-4 sm:px-8 lg:px-10">
      <Reveal>
        <div className="company-work-card problem-edge-card relative isolate mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] border border-white/10 px-6 py-6 shadow-[0_24px_70px_rgba(15,13,40,0.28)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
          <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
          <div aria-hidden="true" className="company-work-card-glow absolute inset-0" />
          <div className="relative z-10 flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/12 text-white shadow-[0_0_44px_rgba(124,58,237,0.22)] ring-1 ring-white/18">
              <ShieldCheck aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.55rem,4.2vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.025em] text-white">
                Security is our foundation. Your trust is our priority.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-200/86 sm:text-[17px]">
                Learn more about our security practices or talk to our team.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-3 sm:flex sm:items-center">
            <Link href="/contact" className="problem-edge-card problem-edge-card-compact evada-gradient-cta relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden rounded-[14px] px-7 py-3 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
              Talk to Security
            </Link>
            <Link href="/book-demo" className="problem-edge-card problem-edge-card-compact relative isolate inline-flex min-h-12 items-center justify-center overflow-hidden whitespace-nowrap rounded-[14px] border border-blue-200 bg-white px-7 py-3 text-[15px] font-extrabold text-[#2563EB] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 sm:min-w-[190px]">
              <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
              <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
              Book a Demo
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function TrustCenterPage() {
  return (
    <main className="evada-homepage evada-security-page evada-marketing-strict-lazy evada-marketing-scroll-optimized relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950" data-marketing-ready="false">
      <MarketingAnimatedBackground variant="security" />
      <MarketingScrollOptimizer
        scrollLerp={0.22}
        settleDelayMs={100}
        strictActiveSectionAnimations
        wheelMultiplier={1.62}
      />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <SecurityPillarsSection />
        <ComplianceSection />
        <PlatformSecuritySection />
        <TransparencySection />
        <GovernanceSection />
        <SecurityCTASection />
        <FooterSection showCta={false} trustBadgeVariant="aligned" />
      </div>
    </main>
  );
}
