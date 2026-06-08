import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import { MarketingIcon, marketingIconMap } from "@/components/marketing/MarketingIcon";

type ControlCard = {
  title: string;
  body: string;
  Icon: LucideIcon;
};

const cards: ControlCard[] = [
  {
    title: "Session and CSRF ready",
    body: "Designed around session-cookie authentication and CSRF-aware backend APIs for secure platform operations.",
    Icon: marketingIconMap["session-csrf"],
  },
  {
    title: "Permission-gated access",
    body: "Use role-based permissions to control access to AI Scanner, Admin modules, Knowledge Hub and reports.",
    Icon: marketingIconMap["identity-access"],
  },
  {
    title: "Multi-tenant admin",
    body: "Support tenants, users, clients, agents, licences and platform-level access control with clean isolation.",
    Icon: marketingIconMap["tenant-isolation"],
  },
  {
    title: "Audit and logs",
    body: "Review audit logs, security events and operational activity with traceability for governance and compliance teams.",
    Icon: marketingIconMap["audit-logs"],
  },
];

export default function EnterpriseControlSection() {
  return (
    <section id="enterprise-control" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(109,73,244,0.16),transparent_44%),radial-gradient(circle_at_78%_32%,rgba(4,169,199,0.15),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(248,250,252,0.02)_100%)] opacity-80" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Enterprise control</p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
              <span className="block">Secure, role-based operations</span>
              <span className="block">for enterprise teams</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
              EVADA is built for security teams that need safe validation workflows, strong access control and auditable operations across clients and environments.
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
                  <MarketingIcon name="secure-platform" className="h-4 w-4 text-[#5F3FEA]" strokeWidth={2.1} />
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
