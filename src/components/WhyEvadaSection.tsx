import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

const beforeItems = [
  "Large scanner backlog",
  "Duplicate findings",
  "False positives",
  "No exploit evidence",
];

const engineSteps = [
  "Ingest",
  "Analyse",
  "Validate",
  "Evidence",
  "Approval",
  "Sync",
];

const afterItems = [
  "Prioritised validated risk",
  "Exploit evidence",
  "Fewer false positives",
  "Clear remediation ownership",
];

const summaryChips = [
  {
    title: "Reduce noise and backlog",
    body: "Focus on what matters",
    Icon: marketingIconMap["scanner-noise"],
  },
  {
    title: "Validated risk at a glance",
    body: "See real risk with evidence",
    Icon: marketingIconMap.evidence,
  },
  {
    title: "Operationalised remediation",
    body: "Sync to tools and drive action",
    Icon: marketingIconMap.sync,
  },
];

export default function WhyEvadaSection() {
  return (
    <section id="why-evada" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="why-evada-glow pointer-events-none absolute left-1/2 top-[52%] h-[520px] w-[min(920px,82vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(4,169,199,0.16),transparent_62%)] blur-2xl" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">From security noise to validated risk</p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
              <span className="block">Turn scanner backlog into</span>
              <span className="block">evidence-backed decisions</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
              EVADA transforms scattered scanner findings, false positives and stale reports into validated, auditable and actionable security workflows.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <Reveal className="min-w-0" delayMs={120}>
            <article className="h-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[16px] font-black text-slate-950">Before EVADA</h3>
                <span className="rounded-full bg-red-50 px-3 py-1 text-[12px] font-black text-red-600 ring-1 ring-red-100">
                  Noise
                </span>
              </div>
              <ul className="mt-5 grid gap-3">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                    <span className="text-[14px] font-semibold leading-relaxed text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>

          <div className="relative">
            <Reveal className="min-w-0" delayMs={200}>
              <article className="h-full overflow-hidden rounded-[24px] border border-violet-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
                <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-200/30 blur-3xl" />
                <div aria-hidden="true" className="absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-cyan-200/25 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <h3 className="text-[16px] font-black text-slate-950">EVADA Validation Engine</h3>
                  <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[12px] font-black text-[#5F3FEA] ring-1 ring-violet-100">
                    Governed
                  </span>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-2.5">
                  {engineSteps.map((step, index) => (
                    <div key={step} className="flex min-w-0 items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[14px] bg-[#EEF2FF] text-[#04A9C7] ring-1 ring-violet-100">
                        <span className="text-[12px] font-black">{index + 1}</span>
                      </span>
                      <span className="truncate text-[13px] font-extrabold text-slate-900">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-5 rounded-[18px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-[12px] font-bold text-slate-700">
                  Evidence captured. Approval enforced. Actions audited.
                </div>
              </article>
            </Reveal>

            <div className="pointer-events-none absolute -left-5 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true">
              <ArrowRight className="h-7 w-7 text-[#04A9C7]" strokeWidth={2.2} />
            </div>
            <div className="pointer-events-none absolute -right-5 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true">
              <ArrowRight className="h-7 w-7 text-[#04A9C7]" strokeWidth={2.2} />
            </div>
          </div>

          <Reveal className="min-w-0" delayMs={280}>
            <article className="h-full rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[16px] font-black text-slate-950">After EVADA</h3>
                <span className="rounded-full bg-violet-50 px-3 py-1 text-[12px] font-black text-[#5F3FEA] ring-1 ring-violet-100">
                  Validated
                </span>
              </div>
              <ul className="mt-5 grid gap-3">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
                    <span className="text-[14px] font-semibold leading-relaxed text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>

        <div className="mx-auto mt-6 grid max-w-[1080px] grid-cols-1 gap-4 md:grid-cols-3">
          {summaryChips.map((chip: { title: string; body: string; Icon: LucideIcon }, index) => {
            const Icon = chip.Icon;

            return (
            <Reveal key={chip.title} delayMs={320 + index * 80} className="min-w-0">
              <div className="h-full rounded-[20px] border border-violet-100 bg-white px-5 py-5 shadow-[0_16px_45px_rgba(15,23,42,0.06)]">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#EEF2FF] text-[#04A9C7] shadow-[0_0_24px_rgba(4,169,199,0.18)]">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-black leading-tight text-slate-950">{chip.title}</h3>
                    <p className="mt-1 text-[13px] font-semibold leading-relaxed text-slate-600">{chip.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>

        <Reveal delayMs={240}>
          <div className="mx-auto mt-6 flex max-w-[760px] items-center justify-center gap-2 rounded-full border border-violet-100 bg-[#EEF2FF] px-5 py-3 text-center text-[13px] font-black text-[#5F3FEA] shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
            <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={2.1} />
            <span>From noise to action. From risk to resilience.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
