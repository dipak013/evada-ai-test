import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type IconCard = {
  title: string;
  text: string;
  Icon: LucideIcon;
};

type Metric = {
  value: string;
  label: string;
  Icon: LucideIcon;
};

type TimelineItem = {
  year: string;
  title: string;
  text: string;
};

const heroCards: IconCard[] = [
  {
    title: "AI-Driven Validation",
    text: "Smarter validation with AI that learns, adapts and accelerates security outcomes.",
    Icon: marketingIconMap["ai-supported"],
  },
  {
    title: "Built With Security Teams",
    text: "Designed for teams that need validation with confidence, control and trust.",
    Icon: marketingIconMap["human-expertise"],
  },
  {
    title: "Human Expertise",
    text: "Deep security expertise ensures context, judgement and real-world impact.",
    Icon: marketingIconMap["human-expertise"],
  },
  {
    title: "Built for the Future",
    text: "Continuously evolving to help teams validate real risk as environments change.",
    Icon: marketingIconMap["company-future"],
  },
];

const heroChips: IconCard[] = [
  {
    title: "Mission-led",
    text: "",
    Icon: marketingIconMap["company-mission"],
  },
  {
    title: "Human expertise",
    text: "",
    Icon: marketingIconMap["human-expertise"],
  },
  {
    title: "Security-first culture",
    text: "",
    Icon: marketingIconMap["security-culture"],
  },
  {
    title: "Trusted platform",
    text: "",
    Icon: marketingIconMap["trusted-platform"],
  },
];

const missionColumns: IconCard[] = [
  {
    title: "Our Mission",
    text: "Empower security teams with AI-supported validation and actionable insight to stay ahead of threats and reduce risk with confidence.",
    Icon: marketingIconMap["company-mission"],
  },
  {
    title: "Our Vision",
    text: "A world where every organisation can validate risk continuously and make security decisions with clarity and trust.",
    Icon: marketingIconMap.vision,
  },
  {
    title: "Our Values",
    text: "Security First|Customer Success|Innovation with Integrity|Transparency and Trust",
    Icon: marketingIconMap.values,
  },
];

const metrics: Metric[] = [
  { value: "8+", label: "Platform Modules", Icon: marketingIconMap["platform-modules"] },
  { value: "4", label: "Core Security Workflows", Icon: marketingIconMap["security-workflow"] },
  { value: "3", label: "Admin Access Layers", Icon: marketingIconMap["admin-access-layers"] },
  { value: "8", label: "AI Pipeline Stages", Icon: marketingIconMap["ai-supported"] },
  { value: "10+", label: "Integration Categories", Icon: marketingIconMap["integration-categories"] },
  { value: "24/7", label: "Validation Visibility", Icon: marketingIconMap["validation-visibility"] },
];

const teamRoles: IconCard[] = [
  {
    title: "Chief Executive Officer",
    text: "Guides EVADA's mission, strategy and customer-focused growth.",
    Icon: marketingIconMap.partners,
  },
  {
    title: "Chief Product Officer",
    text: "Leads product direction across validation workflows, reporting and user experience.",
    Icon: Lightbulb,
  },
  {
    title: "Chief Technology Officer",
    text: "Oversees platform architecture, backend integrations and scalable systems.",
    Icon: marketingIconMap["infrastructure-security"],
  },
  {
    title: "Chief Security Officer",
    text: "Drives secure design, governance, privacy and enterprise trust.",
    Icon: marketingIconMap["secure-platform"],
  },
  {
    title: "VP of Customer Success",
    text: "Helps customers adopt continuous validation and operationalise remediation.",
    Icon: marketingIconMap["trusted-platform"],
  },
];

const timeline: TimelineItem[] = [
  {
    year: "2021",
    title: "The Beginning",
    text: "EVADA began with a vision to make security validation continuous, evidence-backed and easier to operationalise.",
  },
  {
    year: "2022",
    title: "Platform Foundation",
    text: "Core platform concepts formed around application configuration, scanning workflows and dashboard visibility.",
  },
  {
    year: "2023",
    title: "AI-Supported Pentest",
    text: "AI-supported pentest workflows introduced pipeline stages, sandbox validation and evidence-backed reporting.",
  },
  {
    year: "2024",
    title: "Enterprise Controls",
    text: "Agent management, RBAC, tenant administration, audit visibility and integrations became central to the platform.",
  },
  {
    year: "2025+",
    title: "The Future",
    text: "Continuing to advance governed AI validation, remediation workflows and continuous security assurance.",
  },
];

const cultureValues: IconCard[] = [
  {
    title: "Security First",
    text: "We design every workflow around safety, control and trust.",
    Icon: marketingIconMap["security-culture"],
  },
  {
    title: "Human and AI Collaboration",
    text: "We believe AI should assist experts, not replace judgement.",
    Icon: marketingIconMap["ai-supported"],
  },
  {
    title: "Evidence Over Noise",
    text: "We focus on validated risk, proof and actionable remediation.",
    Icon: marketingIconMap.evidence,
  },
  {
    title: "Built for Operators",
    text: "We create workflows that fit real security teams and enterprise environments.",
    Icon: marketingIconMap["security-workflow"],
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#2563EB]">
      {children}
    </p>
  );
}

function SectionIntro({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-[760px] text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mx-auto mt-3 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
          {title}
        </h2>
        {text && <p className="mx-auto mt-4 max-w-[700px] text-[15px] font-normal leading-relaxed text-slate-600 sm:text-[16px]">{text}</p>}
      </div>
    </Reveal>
  );
}

function CompanyHeroVisual() {
  return (
    <div className="company-hero-visual relative mx-auto h-[480px] w-full max-w-full sm:h-[540px] sm:max-w-[720px] lg:-mt-2 xl:-mt-4" aria-hidden="true">
      <div className="company-hero-aurora absolute inset-0" />
      <div className="company-visual-stage absolute left-1/2 top-1/2 h-[650px] w-[900px] -translate-x-1/2 -translate-y-1/2 scale-[0.5] sm:scale-[0.62] md:scale-[0.68] lg:scale-[0.72] xl:scale-[0.78] 2xl:scale-[0.82]">
        <svg className="company-connector-svg absolute inset-0 z-[3]" viewBox="0 0 820 620" fill="none" aria-hidden="true">
          <path className="company-signal-path" d="M178 214C260 118 460 86 640 174C764 235 792 386 678 476C540 584 242 548 122 400C36 294 76 230 178 214Z" stroke="url(#companyPathA)" strokeWidth="2" strokeDasharray="10 12" />
          <path className="company-signal-path company-signal-path-b" d="M118 356C224 254 386 230 528 286C690 348 746 432 686 496C612 574 360 560 186 486C70 438 38 392 118 356Z" stroke="url(#companyPathB)" strokeWidth="2" strokeDasharray="8 14" />
          <path className="company-signal-path company-signal-path-c" d="M224 155C334 96 538 116 666 228C768 318 750 448 602 520C438 598 190 544 100 406C30 298 80 208 224 155Z" stroke="rgba(37,99,235,0.22)" strokeWidth="1.5" strokeDasharray="12 18" />
          {[
            [118, 356],
            [208, 214],
            [302, 142],
            [466, 126],
            [640, 174],
            [720, 340],
            [604, 520],
            [402, 548],
            [186, 486],
          ].map(([cx, cy], index) => (
            <circle key={`${cx}-${cy}`} className="company-signal-node" cx={cx} cy={cy} r={index % 2 === 0 ? 7 : 5} fill={index % 3 === 0 ? "#22D3EE" : index % 3 === 1 ? "#7C3AED" : "#FFFFFF"} />
          ))}
          <defs>
            <linearGradient id="companyPathA" x1="98" y1="132" x2="746" y2="540" gradientUnits="userSpaceOnUse">
              <stop stopColor="#22D3EE" />
              <stop offset="0.5" stopColor="#2563EB" />
              <stop offset="1" stopColor="#7C3AED" />
            </linearGradient>
            <linearGradient id="companyPathB" x1="86" y1="296" x2="716" y2="536" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7C3AED" />
              <stop offset="0.55" stopColor="#22D3EE" />
              <stop offset="1" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>

        <div className="company-orbit company-orbit-a" />
        <div className="company-orbit company-orbit-b" />
        <div className="company-orbit company-orbit-c" />

        {heroCards.map((card, index) => {
          const Icon = card.Icon;
          const positions = [
            "left-[70px] top-[84px]",
            "right-[70px] top-[98px]",
            "left-[48px] top-[344px]",
            "right-[48px] top-[348px]",
          ];

          return (
            <div
              key={card.title}
              className={`company-floating-card absolute z-30 rounded-[22px] border border-blue-100 bg-white/92 p-4 shadow-[0_22px_60px_rgba(37,99,235,0.16)] backdrop-blur ${positions[index]}`}
              style={{ animationDelay: `${index * 360}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#EAF7FF,#F4F0FF)] text-[#2563EB] ring-1 ring-blue-100">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[17px] font-extrabold leading-tight text-slate-950">{card.title}</span>
                  <span className="mt-3 block h-1 w-14 rounded-full bg-[linear-gradient(90deg,#2563EB,#7C3AED)]" />
                  <span className="mt-3 block text-[13px] font-medium leading-[1.58] text-slate-600">{card.text}</span>
                </span>
              </div>
            </div>
          );
        })}

        <div className="company-crystal-system absolute left-1/2 top-[358px] z-20 h-[450px] w-[560px] -translate-x-1/2 -translate-y-1/2">
          <div className="company-base company-base-back" />
          <div className="company-base company-base-mid" />
          <div className="company-base company-base-front" />
          <div className="company-glow-disc company-glow-disc-a" />
          <div className="company-glow-disc company-glow-disc-b" />
          <div className="company-crystal-beam" />
          <div className="company-crystal">
            <span className="company-crystal-face company-crystal-face-a" />
            <span className="company-crystal-face company-crystal-face-b" />
            <span className="company-crystal-face company-crystal-face-c" />
            <span className="company-crystal-face company-crystal-face-d" />
            <span className="company-crystal-core" />
          </div>
        </div>

        <div className="company-people absolute inset-x-0 bottom-[74px] z-30">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span key={item} className={`company-person company-person-${item + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Company
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Building secure</span>
              <span className="block">validation</span>
              <span className="block">with</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">human expertise</span>
            </h1>
            <p className="mt-5 w-full max-w-[540px] text-[15px] font-normal leading-[1.7] text-slate-600 sm:text-[16px]">
              At EVADA, we help modern security teams validate smarter, operate with trust and turn findings into controlled action through AI-supported workflows and human expertise.
            </p>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="#mission"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:w-auto"
              >
                Our Story
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="#careers"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                Work With Us
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
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
                    <span className="mt-3 max-w-[118px] text-center">
                      <span className="block text-[11px] font-semibold leading-snug text-slate-950 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">{chip.title}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="w-full min-w-0">
          <CompanyHeroVisual />
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section id="mission" className="bg-white px-5 pb-12 pt-2 sm:px-8 lg:px-10 lg:pb-14">
      <Reveal>
        <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.10)] lg:grid-cols-3">
          {missionColumns.map((column, index) => {
            const Icon = column.Icon;
            const values = column.title === "Our Values" ? column.text.split("|") : [];

            return (
              <article key={column.title} className={`flex gap-5 p-7 sm:p-9 ${index > 0 ? "border-t border-blue-100 lg:border-l lg:border-t-0" : ""}`}>
                <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#F1F6FF,#F5F0FF)] text-[#7C3AED] ring-1 ring-blue-100">
                  <Icon className="h-10 w-10" strokeWidth={1.9} />
                </span>
                <div>
                  <h2 className="text-[22px] font-bold tracking-[-0.015em] text-slate-950">{column.title}</h2>
                  {values.length > 0 ? (
                    <ul className="mt-4 grid gap-2">
                      {values.map((value) => (
                        <li key={value} className="flex items-center gap-2 text-[14px] font-semibold text-slate-700">
                          <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-[#2563EB]" strokeWidth={2.2} />
                          {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-600">{column.text}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function MetricsSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-11 sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro eyebrow="EVADA BY THE NUMBERS" title="EVADA by the numbers" />

        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map((metric, index) => {
            const Icon = metric.Icon;

            return (
              <Reveal key={metric.label} delayMs={index * 55}>
                <article className="group rounded-[18px] border border-blue-100 bg-white p-5 text-center shadow-[0_18px_48px_rgba(37,99,235,0.08)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_62px_rgba(37,99,235,0.13)]">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[#7C3AED] ring-1 ring-blue-100 transition group-hover:scale-105">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </span>
                  <strong className="mt-4 block bg-[linear-gradient(100deg,#2563EB,#06B6D4,#7C3AED)] bg-clip-text text-[clamp(1.75rem,3vw,2.35rem)] font-black leading-none text-transparent">
                    {metric.value}
                  </strong>
                  <span className="mt-2 block text-[13px] font-black text-slate-700">{metric.label}</span>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro
          title="Leadership Team"
          text="Experienced security and product leaders building the future of AI-supported security validation."
        />

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {teamRoles.map((member, index) => {
            const Icon = member.Icon;

            return (
              <Reveal key={member.title} delayMs={index * 70}>
                <article className="group flex min-h-[300px] flex-col items-center rounded-[20px] border border-blue-100 bg-white p-6 text-center shadow-[0_20px_55px_rgba(37,99,235,0.08)] transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_28px_70px_rgba(37,99,235,0.13)]">
                  <span aria-hidden="true" className="grid h-24 w-24 place-items-center rounded-full bg-[linear-gradient(135deg,#EAF2FF,#F4EDFF)] text-[#2563EB] shadow-[0_18px_42px_rgba(124,58,237,0.18)] ring-1 ring-blue-100 transition group-hover:scale-105">
                    <Icon className="h-11 w-11" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-5 text-[18px] font-black leading-tight text-slate-950">{member.title}</h3>
                  <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-600">{member.text}</p>
                  <div className="mt-auto flex items-center gap-3 pt-5 text-[13px] font-black text-slate-950">
                    <span aria-hidden="true">in</span>
                    <span aria-hidden="true">x</span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="bg-[#FBFDFF] px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro title="Our Journey" text="Key milestones in our mission to modernise security validation." />

        <Reveal>
          <div className="problem-edge-card relative isolate mt-10 overflow-hidden rounded-[22px] border border-blue-100 bg-white px-5 py-8 shadow-[0_20px_55px_rgba(37,99,235,0.08)] lg:px-8">
            <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
            <div aria-hidden="true" className="absolute left-10 right-10 top-[82px] hidden border-t-2 border-dotted border-blue-300 lg:block" />
            <div className="grid gap-6 lg:grid-cols-5">
              {timeline.map((item, index) => (
                <article key={item.year} className="relative z-10 text-center lg:text-left">
                  <div className="flex items-center gap-4 lg:block lg:text-center">
                    <span className="company-timeline-node grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-[14px] font-black text-white shadow-[0_16px_34px_rgba(37,99,235,0.22)]">
                      {item.year}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-black text-slate-950 lg:mt-5">{item.title}</h3>
                      <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-600">{item.text}</p>
                    </div>
                  </div>
                  {index < timeline.length - 1 && <div className="ml-8 mt-4 h-6 border-l-2 border-dotted border-blue-200 lg:hidden" />}
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CultureValuesSection() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1360px]">
        <SectionIntro
          eyebrow="HOW WE WORK"
          title="Built by people who care about safer security"
          text="We build responsible security workflows for teams that need clarity, control and trust."
        />

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cultureValues.map((value, index) => {
            const Icon = value.Icon;

            return (
              <Reveal key={value.title} delayMs={index * 70}>
                <article className="group rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_48px_rgba(37,99,235,0.08)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_62px_rgba(37,99,235,0.12)]">
                  <span className="grid h-[52px] w-[52px] place-items-center rounded-[16px] bg-[linear-gradient(135deg,#EAF2FF,#F5F3FF)] text-[#2563EB] ring-1 ring-blue-100 transition group-hover:scale-105">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-[19px] font-black text-slate-950">{value.title}</h3>
                  <p className="mt-3 text-[14px] font-medium leading-relaxed text-slate-600">{value.text}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WorkWithUsSection() {
  return (
    <section id="careers" className="bg-white px-5 pb-12 pt-2 sm:px-8 lg:px-10">
      <Reveal>
        <div className="relative mx-auto grid max-w-[1360px] overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#4F46E5_0%,#2563EB_45%,#7C3AED_100%)] shadow-[0_26px_72px_rgba(37,99,235,0.20)] lg:grid-cols-[0.38fr_0.62fr]">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_25%,rgba(34,211,238,0.26),transparent_32%),radial-gradient(circle_at_88%_40%,rgba(255,255,255,0.18),transparent_34%)]" />
          <div className="company-collab-panel relative min-h-[260px] overflow-hidden lg:min-h-[300px]">
            <div className="company-collab-wave company-collab-wave-a" />
            <div className="company-collab-wave company-collab-wave-b" />
            {[0, 1, 2, 3, 4].map((item) => (
              <span key={item} className={`company-collab-person company-collab-person-${item + 1}`} />
            ))}
            <div className="company-collab-laptop" />
          </div>

          <div className="relative p-7 text-white sm:p-10 lg:p-12">
            <Eyebrow>CAREERS</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.025em]">
              Work With Us
            </h2>
            <p className="mt-4 max-w-[670px] text-[15px] font-normal leading-relaxed text-white/86 sm:text-[16px]">
              Join our mission to build a safer digital future. Explore careers and be part of a passionate team solving real-world security challenges.
            </p>
            <div className="mt-8 grid gap-3 sm:flex">
              <Link href="#careers" className="inline-flex min-h-12 items-center justify-center rounded-[14px] bg-white px-7 py-3 text-[15px] font-extrabold text-[#2563EB] shadow-[0_18px_36px_rgba(2,11,31,0.16)] transition hover:-translate-y-0.5">
                View Open Positions
              </Link>
              <Link href="#culture" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-white/45 bg-white/10 px-7 py-3 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/15">
                Our Culture
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function AboutPage() {
  return (
    <main className="evada-homepage relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="company" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <MissionSection />
        <MetricsSection />
        <LeadershipSection />
        <TimelineSection />
        <div id="culture">
          <CultureValuesSection />
        </div>
        <WorkWithUsSection />
        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
