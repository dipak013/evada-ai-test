import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";

type WorkflowItem = {
  step: string;
  title: string;
  body: string;
  Icon: LucideIcon;
};

type SupportItem = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const workflow: WorkflowItem[] = [
  {
    step: "1",
    title: "Ingest",
    body: "Import scanner, cloud, AppSec and manual findings in real time.",
    Icon: marketingIconMap.ingest,
  },
  {
    step: "2",
    title: "Analyse",
    body: "AI models deduplicate, prioritise and enrich exploitability context.",
    Icon: marketingIconMap.analyse,
  },
  {
    step: "3",
    title: "Validate",
    body: "Correlate findings and test safely in a controlled sandbox with human approval.",
    Icon: marketingIconMap.validate,
  },
  {
    step: "4",
    title: "Operationalise",
    body: "Push validated issues and remediation actions into Jira, Slack, SIEM and reports.",
    Icon: marketingIconMap["security-workflow"],
  },
];

const supportItems: SupportItem[] = [
  { title: "Controlled AI Engine", body: "Policy-led, safe and explainable", Icon: marketingIconMap["ai-supported"] },
  { title: "Human in the Loop", body: "Analysts approve high-risk steps", Icon: marketingIconMap.approval },
  { title: "Auditable Workflow", body: "Full audit trail for every action", Icon: marketingIconMap["audit-logs"] },
  { title: "Tool-Ready", body: "Built to integrate and scale", Icon: marketingIconMap["integration-categories"] },
];

function WorkflowCard({ item, index }: { item: WorkflowItem; index: number }) {
  const { Icon } = item;

  return (
    <div className="relative min-w-0">
      <span
        className="workflow-step-badge absolute -left-2 -top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-[#04A9C7] text-[13px] font-black text-white shadow-[0_12px_24px_rgba(4,169,199,0.25)]"
        style={{ animationDelay: `${index * 1.25}s` }}
      >
        {item.step}
      </span>
      <div className="flex h-full min-h-[260px] flex-col items-center rounded-[22px] border border-slate-200 bg-white p-5 text-center shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:min-h-[290px] sm:p-6 xl:min-h-[310px]">
        <div className="workflow-icon-orb grid h-20 w-20 place-items-center rounded-full bg-[#E0F2FE] shadow-[0_0_36px_rgba(4,169,199,0.22)] sm:h-24 sm:w-24" style={{ animationDelay: `${index * 1.25 + 0.15}s` }}>
          <Icon aria-hidden="true" className="h-10 w-10 text-[#04A9C7]" strokeWidth={1.9} />
        </div>
        <h3 className="mt-5 text-[18px] font-black tracking-[-0.01em] text-slate-950 sm:text-[22px]">{item.title}</h3>
        <p className="mt-2 max-w-[210px] text-[12px] font-medium leading-relaxed text-slate-600 sm:text-[14px]">
          {item.body}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-5 text-[#04A9C7]">
          <CheckCircle2 className="h-4 w-4" strokeWidth={2.1} />
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#0F172A]" />
        </div>
      </div>
      {index < workflow.length - 1 && (
        <div className="workflow-flow-connector pointer-events-none absolute left-[calc(100%_+_14px)] top-1/2 hidden h-6 w-12 -translate-y-1/2 xl:block" style={{ animationDelay: `${index * 1.25}s` }} aria-hidden="true">
          <span className="workflow-flow-line" />
          <span className="workflow-flow-dot" />
          <svg className="absolute -right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-[#04A9C7]" viewBox="0 0 16 16" fill="none">
            <path d="M5 3.5L10 8L5 12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>
      )}
    </div>
  );
}

function SupportCard({ item }: { item: SupportItem }) {
  const { Icon } = item;

  return (
    <div className="flex min-w-0 items-center gap-3 px-3 py-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E0F2FE] text-[#04A9C7]">
        <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-black leading-tight text-slate-950 sm:text-[16px]">{item.title}</span>
        <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-600 sm:text-[13px]">{item.body}</span>
      </span>
    </div>
  );
}

export default function HowEvadaWorksSection() {
  return (
    <section id="how-evada-works" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="pointer-events-none absolute right-0 top-[32%] hidden h-[560px] w-[560px] rounded-full border border-violet-100 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-12 top-[35%] hidden h-[460px] w-[460px] rounded-full border border-violet-100/80 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-24 top-[38%] hidden h-[360px] w-[360px] rounded-full border border-violet-100/60 xl:block" />

      <div className="relative mx-auto max-w-[1180px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">How EVADA works</p>
            <h2 className="mx-auto mt-4 max-w-[760px] break-words text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em] text-slate-950 sm:tracking-[-0.025em]">
              <span className="block">A controlled validation workflow</span>
              <span className="block">for enterprise security teams</span>
            </h2>
            <span className="mx-auto mt-5 block h-1.5 w-16 rounded-full bg-[#04A9C7]" />
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-5 md:gap-7 xl:grid-cols-4 xl:gap-12">
          {workflow.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 90} className="min-w-0">
              <WorkflowCard item={item} index={index} />
            </Reveal>
          ))}
        </div>

        <Reveal delayMs={180}>
          <div className="problem-edge-card relative isolate mt-8 grid grid-cols-1 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)] sm:grid-cols-2 xl:grid-cols-4">
            <span className="problem-border-runner problem-border-runner-top" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-left" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-right" aria-hidden="true" />
            <span className="problem-border-runner problem-border-runner-bottom" aria-hidden="true" />
            {supportItems.map((item, index) => (
              <div key={item.title} className={index > 0 ? "border-t border-slate-200 sm:border-l sm:border-t-0" : ""}>
                <SupportCard item={item} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
