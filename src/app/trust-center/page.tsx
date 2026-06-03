import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Eye,
  FileText,
  Gauge,
  KeyRound,
  Landmark,
  LockKeyhole,
  Radar,
  ScrollText,
  ServerCog,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

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

const heroChips: IconCard[] = [
  { title: "Secure by Design", text: "", Icon: ShieldCheck },
  { title: "Data Protection", text: "", Icon: LockKeyhole },
  { title: "Audit & Logging", text: "", Icon: ScrollText },
  { title: "RBAC Controls", text: "", Icon: Users },
];

const pillars: IconCard[] = [
  {
    title: "Secure Platform",
    text: "Hardened infrastructure, secure configuration, and continuous vulnerability management.",
    Icon: ShieldCheck,
  },
  {
    title: "Data Protection",
    text: "Encryption in transit and at rest with strict data isolation.",
    Icon: LockKeyhole,
  },
  {
    title: "Identity & Access",
    text: "RBAC, SSO, and least-privilege access for every user and tenant.",
    Icon: Users,
  },
  {
    title: "Monitoring & Audit",
    text: "Real-time monitoring, detailed audit logs, and tamper-proof records.",
    Icon: Eye,
  },
  {
    title: "Compliance",
    text: "Aligned with SOC 2, ISO 27001, GDPR, and industry standards.",
    Icon: BadgeCheck,
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
    text: "Security, Availability, Confidentiality",
    Icon: ShieldCheck,
  },
  {
    label: "ISO 27001",
    title: "ISO 27001 Aligned",
    text: "Information Security Management",
    Icon: Landmark,
  },
  {
    label: "GDPR",
    title: "GDPR Aligned",
    text: "EU General Data Protection Regulation",
    Icon: LockKeyhole,
  },
  {
    label: "CCPA",
    title: "CCPA Ready",
    text: "California Consumer Privacy Act",
    Icon: BadgeCheck,
  },
];

const platformSecurityCards: IconCard[] = [
  {
    title: "Secure Development",
    text: "Secure SDLC, code reviews, SAST, DAST, and dependency scanning.",
    Icon: Code2,
  },
  {
    title: "Infrastructure Security",
    text: "Cloud-native architecture with network isolation and firewall controls.",
    Icon: Cloud,
  },
  {
    title: "Data Security",
    text: "Encrypted databases, backups, and strict access controls.",
    Icon: Database,
  },
  {
    title: "Application Security",
    text: "Input validation, CSRF protection, rate limiting, and secure APIs.",
    Icon: ServerCog,
  },
  {
    title: "AI Validation Safety",
    text: "Safe sandbox environment, human approval, and controlled execution.",
    Icon: ShieldCheck,
  },
  {
    title: "Tenant Isolation",
    text: "Multi-tenant isolation ensures your data stays private and secure.",
    Icon: Users,
  },
];

const transparencyFeatures: IconCard[] = [
  {
    title: "Public Security Documentation",
    text: "Clear documentation for platform security practices.",
    Icon: FileText,
  },
  {
    title: "Regular Compliance Reports",
    text: "Ongoing reviews and reporting for enterprise assurance.",
    Icon: Gauge,
  },
  {
    title: "Vulnerability Disclosure Program",
    text: "Responsible disclosure process for security researchers.",
    Icon: Radar,
  },
  {
    title: "Customer Data Ownership",
    text: "Your data remains yours with clear access and privacy controls.",
    Icon: Users,
  },
];

const governanceCards: IconCard[] = [
  {
    title: "RBAC Permissions",
    text: "Control access to AI Scanner, Knowledge Hub, SaaS Admin, Client Admin, and Superadmin areas.",
    Icon: KeyRound,
  },
  {
    title: "Session & CSRF Protection",
    text: "Support session-cookie authentication and CSRF-aware backend APIs.",
    Icon: LockKeyhole,
  },
  {
    title: "Audit & Logs",
    text: "Review audit logs, APM logs, security events, and operational activity.",
    Icon: ScrollText,
  },
  {
    title: "Human Approval",
    text: "Require analyst approval before sensitive AI validation and sandbox execution steps.",
    Icon: UserCheck,
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
      {children}
    </p>
  );
}

function SecurityHeroVisual() {
  return (
    <div className="security-hero-visual relative mx-auto h-[520px] w-full max-w-full sm:h-[580px] sm:max-w-[760px] lg:mt-0 xl:-mt-2" aria-hidden="true">
      <div className="security-ops-aurora absolute inset-0" />
      <div className="absolute left-1/2 top-[45%] h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 scale-[0.54] sm:scale-[0.76] md:scale-[0.82] lg:scale-[0.84] xl:scale-[0.9] 2xl:scale-[0.94]">
        <svg className="security-ops-orbits absolute inset-0 z-0 h-full w-full" viewBox="0 0 760 560" fill="none">
          <defs>
            <linearGradient id="security-ops-orbit-gradient" x1="96" y1="70" x2="674" y2="508" gradientUnits="userSpaceOnUse">
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
          </defs>
          <circle cx="380" cy="282" r="286" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
          <circle className="security-ops-dash-ring" cx="380" cy="282" r="248" stroke="url(#security-ops-orbit-gradient)" strokeDasharray="6 14" strokeWidth="1.5" opacity="0.58" />
          <circle cx="380" cy="282" r="214" fill="url(#security-ops-core-gradient)" opacity="0.85" />
          <circle cx="380" cy="282" r="188" stroke="rgba(255,255,255,0.72)" strokeWidth="1.4" />
          <circle className="security-ops-dash-ring security-ops-dash-ring-slow" cx="380" cy="282" r="152" stroke="rgba(255,255,255,0.72)" strokeDasharray="2 9" strokeWidth="1.1" />
          <circle cx="380" cy="282" r="112" stroke="rgba(255,255,255,0.58)" strokeWidth="1.2" />
          <path className="security-ops-signal" d="M156 282H604" stroke="url(#security-ops-orbit-gradient)" strokeDasharray="5 12" strokeWidth="1.4" />
          <path className="security-ops-signal security-ops-signal-b" d="M380 36V530" stroke="rgba(255,255,255,0.62)" strokeDasharray="6 14" strokeWidth="1.1" />
          <path className="security-ops-signal security-ops-signal-c" d="M128 408C246 334 494 332 636 404" stroke="url(#security-ops-orbit-gradient)" strokeDasharray="5 13" strokeWidth="1.3" />
          {[134, 222, 380, 538, 670].map((x, index) => (
            <circle key={x} className="security-ops-node" cx={x} cy={index % 2 ? 132 : 282} r={index === 2 ? 10 : 6} fill={index === 2 ? "#A78BFA" : "#FFFFFF"} />
          ))}
          {[164, 278, 498, 618].map((x, index) => (
            <circle key={`bottom-${x}`} className="security-ops-node" cx={x} cy={index % 2 ? 476 : 424} r="5.5" fill={index % 2 ? "#22D3EE" : "#FFFFFF"} />
          ))}
          <path id="security-ops-text-path" d="M226 172A200 200 0 0 1 534 172" />
          <text className="security-ops-ring-text" fill="rgba(255,255,255,0.88)" fontSize="14" fontWeight="700" letterSpacing="3.4">
            <textPath href="#security-ops-text-path" startOffset="50%" textAnchor="middle">EVADA SECURITY OPERATIONS</textPath>
          </text>
          <text className="security-ops-ring-text" x="380" y="426" fill="rgba(255,255,255,0.9)" fontSize="15" fontWeight="700" letterSpacing="4" textAnchor="middle">
            TRUST - PROTECT - VALIDATE
          </text>
        </svg>

        <div className="security-ops-core absolute left-1/2 top-[282px] z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="security-ops-core-pulse" />
          <div className="security-ops-lock-shield">
            <LockKeyhole className="h-24 w-24" strokeWidth={1.7} />
          </div>
        </div>

      </div>

      <div className="security-ops-status absolute bottom-[50px] left-1/2 z-40 inline-flex min-w-[206px] -translate-x-1/2 items-center justify-center gap-3 rounded-[18px] border border-white/70 bg-[#2563EB]/76 px-7 py-3 text-[15px] font-semibold text-white shadow-[0_18px_42px_rgba(37,99,235,0.2)] backdrop-blur-xl">
        <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
        <span className="whitespace-nowrap">All Systems Secure</span>
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
              Security & Trust
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Enterprise</span>
              <span className="block">Security and</span>
              <span className="block">Governance</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">Built for Trust</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA protects AI-assisted workflows with secure validation, data controls, audit trails, and role-based access, helping teams move faster without losing governance.
            </p>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="#trust-center"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                <ShieldCheck aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                View Trust Center
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
          <div className="mx-auto max-w-[780px] text-center">
            <Eyebrow>OUR SECURITY COMMITMENTS</Eyebrow>
            <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.02em] text-[#071633] sm:text-[38px]">
              Five Pillars of Security
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-600 sm:text-[16px]">
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
            <Eyebrow>COMPLIANCE & CERTIFICATIONS</Eyebrow>
            <h2 className="mt-3 text-[30px] font-black leading-tight tracking-[-0.02em] text-[#071633] sm:text-[40px]">
              Built for Enterprise Compliance
            </h2>
            <p className="mt-5 max-w-[430px] text-[15px] font-medium leading-relaxed text-slate-600">
              EVADA aligns with global security standards so you can meet regulatory and compliance requirements with confidence.
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
              View Compliance Details
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
          <div className="mx-auto max-w-[780px] text-center">
            <Eyebrow>SECURITY ACROSS THE PLATFORM</Eyebrow>
            <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.02em] text-[#071633] sm:text-[38px]">
              Security Built Into Every Layer
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-600 sm:text-[16px]">
              From code to cloud, we follow industry best practices to keep your data and applications secure.
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
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[24px] bg-[#020B1F] px-6 py-8 text-white shadow-[0_24px_70px_rgba(2,11,31,0.22)] sm:px-8 lg:px-10">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(124,58,237,0.30),transparent_32%),radial-gradient(circle_at_70%_32%,rgba(37,99,235,0.20),transparent_34%),linear-gradient(180deg,#06142E,#020B1F)]" />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.8fr] lg:items-center">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#A78BFA]">TRANSPARENCY YOU CAN TRUST</p>
              <h2 className="mt-4 text-[28px] font-black leading-tight tracking-[-0.02em] sm:text-[38px]">
                Transparency and Accountability
              </h2>
              <p className="mt-4 max-w-[420px] text-[15px] font-medium leading-relaxed text-slate-300">
                We believe in being open about how we protect your data and operate our platform.
              </p>
            </div>

            <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-4">
              {transparencyFeatures.map((feature) => {
                const Icon = feature.Icon;

                return (
                  <article key={feature.title} className="group border-white/10 py-5 sm:border-l sm:px-6 first:sm:border-l-0">
                    <span className="grid h-16 w-16 place-items-center rounded-[18px] bg-violet-500/15 text-[#A78BFA] shadow-[0_0_32px_rgba(124,58,237,0.20)] ring-1 ring-violet-300/20 transition group-hover:bg-violet-500/22">
                      <Icon className="h-8 w-8" strokeWidth={2.05} />
                    </span>
                    <h3 className="mt-5 text-[16px] font-black leading-tight text-white">{feature.title}</h3>
                    <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-300">{feature.text}</p>
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
          <div className="mx-auto max-w-[850px] text-center">
            <Eyebrow>GOVERNED SECURITY OPERATIONS</Eyebrow>
            <h2 className="mt-3 text-[28px] font-black leading-tight tracking-[-0.02em] text-[#071633] sm:text-[38px]">
              Controlled Access, Auditable Actions, Safer Validation
            </h2>
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-slate-600 sm:text-[16px]">
              EVADA combines permission-gated access, audit visibility, and human-approved validation workflows to keep security operations controlled and accountable.
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
        <div className="relative mx-auto flex max-w-[1360px] flex-col gap-6 overflow-hidden rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#EEF5FF_0%,#FFFFFF_45%,#F3E8FF_100%)] px-6 py-6 shadow-[0_24px_70px_rgba(37,99,235,0.12)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(34,211,238,0.24),transparent_32%),radial-gradient(circle_at_78%_30%,rgba(124,58,237,0.18),transparent_34%)]" />
          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white text-[#2563EB] shadow-[0_0_44px_rgba(124,58,237,0.20)] ring-1 ring-blue-100">
              <ShieldCheck aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.65rem,4.4vw,2.35rem)] font-black leading-tight tracking-[-0.025em] text-slate-950">
                Security is our foundation. Your trust is our priority.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 sm:text-[17px]">
                Learn more about our security practices or talk to our team.
              </p>
            </div>
          </div>

          <div className="relative grid gap-3 sm:flex sm:items-center">
            <Link href="/contact" className="evada-gradient-cta inline-flex min-h-12 items-center justify-center rounded-[14px] px-7 py-3 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5">
              Talk to Security Team
            </Link>
            <Link href="/book-demo" className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-[14px] border border-blue-200 bg-white px-7 py-3 text-[15px] font-extrabold text-[#2563EB] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 sm:min-w-[190px]">
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
    <main className="evada-homepage evada-security-page relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="security" />
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
