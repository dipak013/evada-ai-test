import type { LucideIcon } from "lucide-react";
import { FileText, LockKeyhole, ShieldCheck, UserCheck, Users } from "lucide-react";
import Reveal from "@/components/Reveal";

type ControlCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const cards: ControlCard[] = [
  {
    title: "Session & CSRF Ready",
    body: "Designed around session-cookie authentication and CSRF-aware backend APIs for secure platform operations.",
    Icon: LockKeyhole,
  },
  {
    title: "Permission-Gated Access",
    body: "Use role-based permissions to control access to AI Scanner, Admin modules, Knowledge Hub, and reports.",
    Icon: ShieldCheck,
  },
  {
    title: "Multi-Tenant Admin",
    body: "Support tenants, users, clients, agents, licenses, and platform-level access control with clean isolation.",
    Icon: Users,
  },
  {
    title: "Audit & Logs",
    body: "Review audit logs, security events, and operational activity with traceability for governance and compliance teams.",
    Icon: FileText,
  },
];

export default function EnterpriseControlSection() {
  return (
    <section id="enterprise-control" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(109,73,244,0.16),transparent_44%),radial-gradient(circle_at_78%_32%,rgba(4,169,199,0.15),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(248,250,252,0.02)_100%)] opacity-80" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[920px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Enterprise Control</p>
            <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-[1.1] tracking-[-0.025em] text-slate-950">
              Built for Secure, Role-Based Platform Operations
            </h2>
            <p className="mx-auto mt-5 max-w-[780px] text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
              EVADA is built for security teams that need safe validation workflows, strong access control, and auditable operations across clients and environments.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {cards.map(({ title, body, Icon }, index) => (
            <Reveal key={title} delayMs={120 + index * 70} className="min-w-0">
              <article className="h-full min-w-0 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#EEF2FF] text-[#04A9C7] shadow-[0_0_24px_rgba(4,169,199,0.18)]">
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-black leading-tight text-slate-950 sm:text-[18px]">{title}</h3>
                    <p className="mt-2 text-[13px] font-medium leading-relaxed text-slate-600">{body}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[12px] font-black text-slate-700">
                  <UserCheck aria-hidden="true" className="h-4 w-4 text-[#5F3FEA]" strokeWidth={2.1} />
                  <span>Secure by design</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
