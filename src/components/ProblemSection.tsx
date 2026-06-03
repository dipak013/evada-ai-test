import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

const problemItems = [
  "Continuously validates across your attack surface",
  "Verify exploitability, not just presence",
  "Prioritize what matters - reduce noise",
];

const timeline = [
  { day: "Pentest", label: "Day 1", active: true },
  { day: "Report", label: "Day 7-14" },
  { day: "Drift", label: "Weeks 2-12" },
  { day: "Exploit", label: "Anytime" },
  { day: "Next Pentest", label: "Quarterly" },
];

export default function ProblemSection() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div className="mx-auto grid max-w-[1360px] min-w-0 grid-cols-1 items-center gap-10 xl:grid-cols-[0.42fr_0.58fr] xl:gap-16">
        <Reveal className="min-w-0">
          <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">The Problem</p>
          <h2 className="mt-5 max-w-[570px] text-[clamp(1.75rem,6vw,2.75rem)] font-black leading-[1.06] tracking-[-0.025em] text-slate-950">
            Periodic Pentests Leave
            <br />
            Months of Unvalidated Risk
          </h2>
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
            Attackers do not wait for your next pentest. EVADA AI continuously validates findings, verifies exploitability, and closes the gap.
          </p>

          <div className="mt-7 space-y-4">
            {problemItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
                <p className="min-w-0 break-words text-[14px] font-semibold leading-relaxed text-slate-700 sm:text-[15px]">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="min-w-0" delayMs={120}>
          <div className="w-full rounded-[24px] border border-blue-100/80 bg-white/95 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.08)] backdrop-blur sm:p-8">
            <h3 className="max-w-[560px] text-[20px] font-black leading-tight tracking-[-0.01em] text-slate-950 sm:text-[24px]">
              Typical Risk Lifecycle Without Continuous Validation
            </h3>

            <div className="mt-8">
              <div className="relative">
                <div className="risk-timeline-track absolute left-[7%] right-[7%] top-[18px] hidden h-px sm:block" aria-hidden="true">
                  <span className="risk-timeline-base" />
                  <span className="risk-timeline-progress" />
                  <span className="risk-timeline-pulse">
                    <span />
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-2">
                  {timeline.map((step, index) => (
                    <div key={step.day} className="relative min-w-0 rounded-2xl border border-blue-50 bg-[#FBFDFF] p-3 text-center sm:border-0 sm:bg-transparent sm:p-0">
                      <span
                        data-step={index}
                        className={`risk-timeline-node relative z-10 mx-auto grid h-9 w-9 place-items-center rounded-full border-[5px] bg-white ${
                          step.active ? "border-[#04A9C7]" : "border-slate-300"
                        }`}
                        style={{ animationDelay: `${index * 1.55}s` }}
                        aria-hidden="true"
                      >
                        <span className={`risk-timeline-node-inner h-2.5 w-2.5 rounded-full ${step.active ? "bg-[#04A9C7]" : "bg-slate-100"}`} />
                      </span>
                      <p className="mt-4 text-[12px] font-black leading-tight text-slate-950 sm:text-[14px]">{step.day}</p>
                      <p className="mt-1 break-words text-[10px] font-semibold leading-tight text-slate-500 sm:text-[12px]">{step.label}</p>
                      <span className="risk-risk-dot mx-auto mt-4 hidden h-2 w-2 rounded-full bg-[#EF4444] sm:block" style={{ animationDelay: `${index * 1.45 + 0.35}s` }} aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="risk-warning-band mt-7 flex items-center justify-center gap-2 rounded-[14px] bg-red-50 px-3 py-4 text-center text-[12px] font-black text-red-600 ring-1 ring-red-100 sm:text-[15px]">
                <AlertTriangle aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={2.2} />
                <span>Risk remains unvalidated and exploitable.</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
