import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  FileCheck2,
  FileText,
  LockKeyhole,
  MessageSquare,
  ShieldCheck,
  Upload,
  UserCheck,
} from "lucide-react";
import Reveal from "@/components/Reveal";

type DiagramItem = {
  label: string;
  Icon: LucideIcon;
  tone?: "cyan" | "blue" | "purple";
};

const governanceChecks = [
  "Input restrictions & policy-based validation",
  "Approval workflows & human accountability",
  "Secure sandbox testing & data isolation",
  "Full audit trail for every action",
  "No unsupervised exploitation",
];

const inputSources: DiagramItem[] = [
  { label: "Vulnerability Scanners", Icon: ShieldCheck },
  { label: "Cloud Findings", Icon: Cloud },
  { label: "AppSec Tools", Icon: Code2 },
  { label: "Security Signals", Icon: Database },
  { label: "Manual Uploads", Icon: Upload },
];

const engineSteps: DiagramItem[] = [
  { label: "Sanitization Layer", Icon: ShieldCheck },
  { label: "AI Analysis & Prioritization", Icon: Bot },
  { label: "Controlled Validation (Safe Sandbox)", Icon: LockKeyhole },
  { label: "Human Approval", Icon: UserCheck },
  { label: "Evidence & Audit Logging", Icon: FileCheck2 },
];

const outputs: DiagramItem[] = [
  { label: "Jira / ITSM", Icon: ArrowRight, tone: "blue" },
  { label: "SIEM", Icon: ShieldCheck, tone: "blue" },
  { label: "Slack / Teams", Icon: MessageSquare, tone: "purple" },
  { label: "Reports", Icon: FileText, tone: "purple" },
  { label: "Dashboards", Icon: BarChart3, tone: "cyan" },
];

function toneClass(tone: DiagramItem["tone"]) {
  if (tone === "blue") return "bg-blue-50 text-[#2563EB] ring-blue-100";
  if (tone === "purple") return "bg-violet-50 text-[#7C3AED] ring-violet-100";
  return "bg-[#EEF2FF] text-[#04A9C7] ring-violet-100";
}

function DiagramChip({ item, compact = false, delay = 0 }: { item: DiagramItem; compact?: boolean; delay?: number }) {
  const { Icon } = item;

  return (
    <div
      className={`governance-chip flex min-h-[58px] min-w-0 items-center gap-3 rounded-[14px] border bg-white px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.055)] ${
        compact ? "governance-engine-chip border-violet-200 xl:min-h-[54px]" : "border-slate-200"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className={`governance-chip-icon grid h-9 w-9 shrink-0 place-items-center rounded-[11px] ring-1 ${toneClass(item.tone)}`}>
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="min-w-0 text-[12px] font-black leading-tight text-slate-950 sm:text-[13px]">{item.label}</span>
    </div>
  );
}

function DiagramColumn({ title, items }: { title: string; items: DiagramItem[] }) {
  return (
    <div className="relative z-10 min-w-0">
      <h3 className="text-center text-[13px] font-black text-slate-950 sm:text-[14px]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <DiagramChip key={item.label} item={item} delay={index * 0.32} />
        ))}
      </div>
    </div>
  );
}

function EngineColumn() {
  return (
    <div className="relative z-10 min-w-0 rounded-[18px] border border-violet-200 bg-[#EEF2FF]/65 p-3 shadow-[inset_0_0_0_1px_rgba(4,169,199,0.08)] xl:p-4">
      <h3 className="text-center text-[13px] font-black text-slate-950 sm:text-[14px]">EVADA Validation Engine</h3>
      <div className="relative mt-4 grid gap-2.5">
        <div className="pointer-events-none absolute inset-x-5 top-8 bottom-8 hidden xl:block" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 260 270" fill="none" preserveAspectRatio="none">
            <path className="governance-engine-path" d="M70 12 C28 36 28 104 72 130 C28 156 28 228 70 256" stroke="#04A9C7" strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2" />
            <path className="governance-engine-path governance-engine-path-alt" d="M190 12 C232 36 232 104 188 130 C232 156 232 228 190 256" stroke="#04A9C7" strokeDasharray="3 8" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
        <div className="governance-engine-spine pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-64px)] -translate-x-1/2 xl:block" aria-hidden="true" />
        {engineSteps.map((item, index) => (
          <div key={item.label} className="relative z-10">
            <DiagramChip item={item} compact delay={index * 0.58} />
            {index < engineSteps.length - 1 && (
              <div className="mx-auto h-4 w-px border-l-2 border-dotted border-[#04A9C7] xl:hidden" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectorLane({ delayOffset = 0, markerId }: { delayOffset?: number; markerId: string }) {
  return (
    <div className="relative hidden min-h-[370px] xl:block" aria-hidden="true">
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-200" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 44 370" fill="none" preserveAspectRatio="none">
        <defs>
          <marker id={markerId} markerHeight="6" markerWidth="6" orient="auto" refX="5.5" refY="3">
            <path d="M0 0L6 3L0 6" fill="none" stroke="#04A9C7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </marker>
        </defs>
        <path className="governance-flow-path" d="M5 66 H39" markerEnd={`url(#${markerId})`} stroke="#04A9C7" strokeDasharray="3 7" strokeLinecap="round" strokeWidth="2" />
        <path className="governance-flow-path governance-flow-path-alt" d="M5 206 H39" markerEnd={`url(#${markerId})`} stroke="#04A9C7" strokeDasharray="3 7" strokeLinecap="round" strokeWidth="2" />
      </svg>
      <span className="governance-flow-dot absolute left-[5px] top-[66px]" style={{ animationDelay: `${delayOffset}s` }} />
      <span className="governance-flow-dot absolute left-[5px] top-[206px]" style={{ animationDelay: `${delayOffset + 1.05}s` }} />
    </div>
  );
}

export default function AIGovernanceSection() {
  return (
    <section id="ai-governance" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
      <div aria-hidden="true" className="absolute inset-x-5 inset-y-0 rounded-[28px] border border-white/60 bg-[linear-gradient(135deg,rgba(238,242,255,0.56)_0%,rgba(255,255,255,0.28)_52%,rgba(224,247,250,0.46)_100%)] shadow-[0_26px_80px_rgba(37,99,235,0.08)] backdrop-blur-[1px] sm:inset-x-8 lg:inset-x-10" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-160px] left-0 hidden h-[560px] w-[560px] rounded-full border border-violet-200/70 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-95px] left-16 hidden h-[420px] w-[420px] rounded-full border border-violet-200/55 xl:block" />
      <div aria-hidden="true" className="pointer-events-none absolute right-10 top-8 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1360px] min-w-0 grid-cols-1 items-center gap-12 px-0 py-2 xl:grid-cols-[0.38fr_0.62fr] xl:gap-16">
        <Reveal className="min-w-0">
          <div className="max-w-[480px]">
            <p className="text-[12px] font-black uppercase leading-tight tracking-[0.18em] text-[#5F3FEA]">AI Governance</p>
            <h2 className="mt-6 text-[clamp(2rem,6.4vw,3.1rem)] font-black leading-[1.02] tracking-[-0.03em] text-slate-950">
              AI Governance
              <br />
              Built for
              <br />
              Safety,
              <br />
              Control &amp; Trust
            </h2>
            <p className="mt-6 text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
              Partial or unsafe AI is not good enough. EVADA makes every validation governed, auditable, and enterprise-ready.
            </p>

            <div className="mt-7 grid gap-4">
              {governanceChecks.map((item) => (
                <div key={item} className="flex min-w-0 items-start gap-3">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
                  <p className="min-w-0 text-[14px] font-semibold leading-relaxed text-slate-700 sm:text-[15px]">{item}</p>
                </div>
              ))}
            </div>

            <Link href="/trust-center" className="mt-7 inline-flex items-center gap-2 text-[15px] font-black text-slate-950 transition hover:text-[#5F3FEA]">
              Learn more about <span className="text-[#5F3FEA]">Security</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
            </Link>
          </div>
        </Reveal>

        <Reveal className="min-w-0 xl:justify-self-end" delayMs={120}>
          <div className="relative w-full max-w-[800px] rounded-[22px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-5 lg:p-6">
            <div className="relative z-10 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[1fr_44px_1.28fr_44px_1fr] xl:gap-0">
              <div className="min-w-0">
                <DiagramColumn title="Input Sources" items={inputSources} />
              </div>

              <ConnectorLane markerId="governance-arrow-in" />

              <div className="flex items-center justify-center xl:hidden" aria-hidden="true">
                <ArrowDown className="h-6 w-6 text-[#04A9C7]" strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <EngineColumn />
              </div>

              <ConnectorLane delayOffset={0.45} markerId="governance-arrow-out" />

              <div className="flex items-center justify-center xl:hidden" aria-hidden="true">
                <ArrowDown className="h-6 w-6 text-[#04A9C7]" strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <DiagramColumn title="Outputs" items={outputs} />
              </div>
            </div>

            <div className="governance-audit-band relative z-10 mt-5 flex flex-col items-center gap-3 rounded-[16px] bg-[#EEF2FF] px-4 py-4 text-center sm:flex-row sm:px-5 sm:text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[13px] bg-white text-[#04A9C7] shadow-[0_12px_24px_rgba(4,169,199,0.14)]">
                <ShieldCheck aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="text-[13px] font-bold leading-relaxed text-slate-700 sm:text-[14px]">
                Every action is logged. <span className="font-black text-[#5F3FEA] underline decoration-[#04A9C7]/50 decoration-4 underline-offset-4">Every validation is auditable.</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
