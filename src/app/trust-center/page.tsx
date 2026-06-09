import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  LockKeyhole,
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

function SecurityOpsBadge({ badge }: { badge: SecurityHeroBadge }) {
  const Icon = badge.Icon;
  const isStatus = badge.variant === "status";

  return (
    <div
      className={`security-ops-card absolute z-30 inline-flex min-h-12 items-center gap-3 whitespace-nowrap rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-[14px] font-bold text-[#0A1A3A] shadow-[0_18px_44px_rgba(37,99,235,0.16)] ring-1 ring-blue-100/60 backdrop-blur-xl ${isStatus ? "min-w-[224px] justify-center text-[15px] text-[#2563EB]" : ""} ${badge.className}`}
      style={{ animationDelay: `${badge.delayMs ?? 0}ms` }}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#2563EB]" strokeWidth={2.2} />
      {badge.showDot && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />}
      <span>{badge.label}</span>
    </div>
  );
}

function SecurityHeroVisual() {
  return (
    <div className="security-hero-visual relative mx-auto h-[540px] w-full max-w-full sm:h-[610px] sm:max-w-[800px] lg:-mt-1 xl:-mt-3" aria-hidden="true">
      <div className="security-ops-aurora absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 h-[620px] w-[900px] -translate-x-1/2 -translate-y-1/2 scale-[0.48] sm:scale-[0.66] md:scale-[0.72] lg:scale-[0.76] xl:scale-[0.84] 2xl:scale-[0.9]">
        <svg className="security-ops-orbits absolute inset-0 z-0 h-full w-full" viewBox="0 0 900 620" fill="none">
          <defs>
            <linearGradient id="security-ops-orbit-gradient" x1="118" y1="86" x2="742" y2="536" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.46" stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <radialGradient id="security-ops-core-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(380 282) rotate(90) scale(214)">
              <stop stopColor="#FFFFFF" stopOpacity="0.65" />
              <stop offset="0.34" stopColor="#2563EB" stopOpacity="0.78" />
              <stop offset="0.74" stopColor="#7C3AED" stopOpacity="0.58" />
              <stop offset="1" stopColor="#06B6D4" stopOpacity="0.22" />
            </radialGradient>
            <radialGradient id="security-ops-glow-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(470 306) rotate(90) scale(255)">
              <stop stopColor="#FFFFFF" stopOpacity="0.82" />
              <stop offset="0.24" stopColor="#38BDF8" stopOpacity="0.72" />
              <stop offset="0.57" stopColor="#2563EB" stopOpacity="0.5" />
              <stop offset="0.84" stopColor="#7C3AED" stopOpacity="0.38" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="470" cy="306" r="264" fill="url(#security-ops-glow-gradient)" opacity="0.9" />
          <circle cx="470" cy="306" r="314" stroke="rgba(255,255,255,0.58)" strokeWidth="1.1" />
          <circle cx="470" cy="306" r="282" stroke="rgba(255,255,255,0.42)" strokeDasharray="4 9" strokeWidth="1.1" />
          <circle className="security-ops-dash-ring" cx="470" cy="306" r="238" stroke="url(#security-ops-orbit-gradient)" strokeDasharray="7 12" strokeWidth="1.8" opacity="0.85" />
          <circle cx="470" cy="306" r="204" stroke="rgba(255,255,255,0.68)" strokeWidth="1.25" />
          <circle className="security-ops-dash-ring security-ops-dash-ring-slow" cx="470" cy="306" r="166" stroke="rgba(255,255,255,0.7)" strokeDasharray="2 9" strokeWidth="1.1" />
          <circle cx="470" cy="306" r="126" stroke="rgba(255,255,255,0.52)" strokeWidth="1.1" />
          <circle cx="470" cy="306" r="82" stroke="rgba(255,255,255,0.42)" strokeWidth="1" />

          <path className="security-ops-signal security-ops-signal-c" d="M230 430C342 366 612 366 740 430" stroke="url(#security-ops-orbit-gradient)" strokeDasharray="5 13" strokeWidth="1.3" />

          <path className="security-ops-badge-wire" d="M470 108V176" />
          <path className="security-ops-badge-wire" d="M158 148V222C158 238 172 252 188 252H360" />
          <path className="security-ops-badge-wire" d="M724 148V222C724 238 710 252 694 252H582" />
          <path className="security-ops-badge-wire" d="M118 330H362" />
          <path className="security-ops-badge-wire" d="M636 330H828" />
          <path className="security-ops-badge-wire" d="M158 478V408C158 392 172 378 188 378H384" />
          <path className="security-ops-badge-wire" d="M724 478V408C724 392 710 378 694 378H582" />
          <path className="security-ops-badge-wire" d="M470 448V542" />

          <path id="security-ops-text-top" d="M324 198A180 180 0 0 1 616 198" />
          <text className="security-ops-ring-text" fill="#4F46E5" fontSize="14" fontWeight="800" letterSpacing="4.2">
            <textPath href="#security-ops-text-top" startOffset="50%" textAnchor="middle">EVADA SECURITY OPERATIONS</textPath>
          </text>
          <path id="security-ops-text-bottom" d="M320 472A188 188 0 0 0 620 472" />
          <text className="security-ops-ring-text" fill="#2563EB" fontSize="15" fontWeight="800" letterSpacing="4.4">
            <textPath href="#security-ops-text-bottom" startOffset="50%" textAnchor="middle">TRUST - PROTECT - VALIDATE</textPath>
          </text>
        </svg>

        <div className="security-ops-core absolute left-[470px] top-[306px] z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="security-ops-core-pulse" />
          <div className="security-ops-lock-shield">
            <LockKeyhole className="h-24 w-24" strokeWidth={1.7} />
          </div>
        </div>

        {securityHeroBadges.map((badge) => (
          <SecurityOpsBadge key={badge.label} badge={badge} />
        ))}

      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.78),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(124,58,237,0.18),transparent_36%),radial-gradient(circle_at_78%_74%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(248,251,255,0.58)_45%,rgba(124,58,237,0.22)_100%)]" />
      <div aria-hidden="true" className="security-grid-bg absolute inset-0 opacity-[0.24]" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
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
