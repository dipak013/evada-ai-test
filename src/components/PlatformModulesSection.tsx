import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Network,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Webhook,
} from "lucide-react";
import Reveal from "@/components/Reveal";

type ModuleCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
  tone: "cyan" | "blue" | "violet";
};

const modules: ModuleCard[] = [
  {
    title: "Application Configuration",
    body: "Configure applications, scan targets, schedules, and enable or disable monitored assets.",
    Icon: SlidersHorizontal,
    tone: "cyan",
  },
  {
    title: "Classic Scans",
    body: "Run traditional scans, upload scan data, review scan history, and inspect latest results.",
    Icon: ShieldCheck,
    tone: "blue",
  },
  {
    title: "Network Scans",
    body: "Trigger infrastructure scans and visualize network findings using graph-style outputs.",
    Icon: Network,
    tone: "violet",
  },
  {
    title: "AI Scanner",
    body: "Launch AI-supported pentest jobs, monitor pipeline stages, and review validated findings.",
    Icon: Bot,
    tone: "cyan",
  },
  {
    title: "WebApp Scanner",
    body: "Start OWASP ZAP-style web scans, stream scan output, and download reports.",
    Icon: Webhook,
    tone: "blue",
  },
  {
    title: "Knowledge Hub",
    body: "Search vulnerability knowledge, exploit context, remediation guidance, and AI scanner knowledge.",
    Icon: BookOpen,
    tone: "violet",
  },
  {
    title: "Clients & Agents",
    body: "Manage clients, agents, licenses, agent health, heartbeat status, downloads, and uploads.",
    Icon: Users,
    tone: "cyan",
  },
  {
    title: "Admin & RBAC",
    body: "Support SaaS Admin, Client Admin, and Superadmin workflows with permission-gated access.",
    Icon: Settings,
    tone: "blue",
  },
];

function toneClasses(tone: ModuleCard["tone"]) {
  if (tone === "blue") return "bg-blue-50 text-[#2563EB] ring-blue-100";
  if (tone === "violet") return "bg-violet-50 text-[#7C3AED] ring-violet-100";
  return "bg-cyan-50 text-[#04A9C7] ring-cyan-100";
}

export default function PlatformModulesSection() {
  return (
    <section id="modules" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(37,99,235,0.14),transparent_42%),radial-gradient(circle_at_82%_28%,rgba(4,169,199,0.16),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(248,251,255,0.02)_100%)] opacity-80" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[900px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Platform Modules</p>
            <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-[1.1] tracking-[-0.025em] text-slate-950">
              One Console for Scans, Agents, Reports, and Administration
            </h2>
            <p className="mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
              EVADA unifies target configuration, scan sources, governed AI validation, and operational workflows in one platform console.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {modules.map(({ title, body, Icon, tone }, index) => (
            <Reveal key={title} delayMs={120 + index * 60} className="min-w-0">
              <article className="group h-full min-w-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                <div className="flex items-start gap-4">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ring-1 shadow-[0_0_24px_rgba(4,169,199,0.12)] ${toneClasses(tone)}`}>
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-black leading-tight text-slate-950 sm:text-[18px]">{title}</h3>
                    <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-600">{body}</p>
                  </div>
                </div>
                <span className="mt-5 block h-1.5 w-11 rounded-full bg-[#04A9C7] opacity-70 transition group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
