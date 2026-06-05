import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type Phase = {
  phase: string;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  checks: string[];
};

const phases: Phase[] = [
  {
    phase: "Phase 1",
    title: "Continuous Validation",
    subtitle: "(always-on assurance)",
    Icon: marketingIconMap["continuous-validation"],
    checks: ["Always-on validation", "Reduce risk exposure windows", "Continuous assurance"],
  },
  {
    phase: "Phase 2",
    title: "CI/CD Integration",
    subtitle: "(shift-left validation)",
    Icon: marketingIconMap["security-workflow"],
    checks: ["Shift-left security validation", "Validate in pipelines", "Block risky deployments"],
  },
  {
    phase: "Phase 3",
    title: "Detection Engineering",
    subtitle: "(signal quality)",
    Icon: marketingIconMap["security-signals"],
    checks: ["Feed detections with validated context", "Improve signal-to-noise", "Strengthen alert quality"],
  },
  {
    phase: "Phase 4",
    title: "Guardrailed Security Automation",
    subtitle: "(human-approved)",
    Icon: marketingIconMap["policy-restrictions"],
    checks: ["Human-approved automation", "Generate evidence", "Accelerate response at scale"],
  },
];

function PhaseCard({ phase, index }: { phase: Phase; index: number }) {
  const { Icon } = phase;

  return (
    <article
      className="evolution-phase-card group relative flex h-full min-h-[380px] min-w-0 flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:min-h-[400px] xl:min-h-[410px]"
      style={{ animationDelay: `${index * 0.7}s` }}
    >
      <span className="absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-[#04A9C7] text-[12px] font-black text-white xl:hidden">
        {index + 1}
      </span>
      <div
        className="evolution-icon-orb mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#E0F2FE] shadow-[0_0_38px_rgba(4,169,199,0.18)] transition-transform duration-300 group-hover:scale-105"
        style={{ animationDelay: `${index * 0.7}s` }}
      >
        <Icon aria-hidden="true" className="h-11 w-11 text-[#04A9C7]" strokeWidth={1.8} />
      </div>

      <div className="mt-7 text-center">
        <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04A9C7]">{phase.phase}</p>
        <h3 className="mt-2 text-[22px] font-black leading-tight tracking-[-0.01em] text-slate-950">{phase.title}</h3>
        <p className="mt-1 text-[13px] font-bold text-slate-500">{phase.subtitle}</p>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-5">
        <ul className="grid gap-3">
          {phase.checks.map((check) => (
            <li key={check} className="flex items-start gap-3">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
              <span className="text-[14px] font-semibold leading-relaxed text-slate-700">{check}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function PlatformEvolutionSection() {
  return (
    <section id="platform-evolution" className="relative bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">The future of continuous security validation</p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
              <span className="block">From periodic testing to</span>
              <span className="block">continuous validation</span>
            </h2>
            <span className="mx-auto mt-5 block h-1.5 w-16 rounded-full bg-[#04A9C7]" />
          </div>
        </Reveal>

        <div className="relative mt-10 xl:pt-8">
          <div className="evolution-timeline-line pointer-events-none absolute left-[12%] right-[12%] top-4 hidden h-0.5 xl:block" aria-hidden="true">
            <span className="evolution-timeline-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
            {phases.map((phase, index) => (
              <Reveal key={phase.title} delayMs={index * 80} className="min-w-0">
                <div className="relative">
                  <span
                    className="evolution-timeline-node absolute left-1/2 -top-[31px] z-10 hidden h-6 w-6 -translate-x-1/2 rounded-full border-[6px] border-white bg-[#04A9C7] shadow-[0_0_0_7px_rgba(4,169,199,0.12)] xl:block"
                    style={{ animationDelay: `${index * 2}s` }}
                    aria-hidden="true"
                  />
                  <PhaseCard phase={phase} index={index} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delayMs={180}>
          <div className="mt-10 flex flex-col gap-4 rounded-[20px] border border-violet-100 bg-[#EEF2FF] px-5 py-5 text-center shadow-[0_16px_45px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:text-left">
            <span className="mx-auto grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#04A9C7] text-white sm:mx-0">
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" strokeWidth={2.1} />
            </span>
            <p className="text-[14px] font-black leading-relaxed text-slate-900 sm:text-[16px]">
              Continuous validation.{" "}
              <span className="text-[#5F3FEA]">Less risk. More confidence.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
