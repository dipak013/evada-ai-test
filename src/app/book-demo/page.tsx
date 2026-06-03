import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { EnquiryForm } from "@/components/common/EnquiryForm";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

const demoHighlights = [
  { label: "Platform walkthrough", Icon: CalendarCheck },
  { label: "AI validation workflow", Icon: Sparkles },
  { label: "Governance & RBAC review", Icon: ShieldCheck },
  { label: "Security team Q&A", Icon: UserCheck },
];

const demoOutcomes = [
  "See how EVADA connects findings, validation workflows, evidence, and reports.",
  "Review controlled AI validation with human approval and safe sandboxing.",
  "Discuss integrations, tenants, agents, RBAC, and remediation workflows.",
];

export default function BookDemoPage() {
  return (
    <main className="evada-homepage relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="demo" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />

        <section className="relative overflow-hidden bg-[#F8FBFF] px-4 pb-12 pt-10 sm:px-8 lg:px-10 lg:pb-16 lg:pt-14">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(37,99,235,0.13),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(124,58,237,0.14),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]" />

          <div className="relative mx-auto grid w-full max-w-[1360px] items-center gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-12">
            <div className="w-full max-w-[620px]">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
                <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
                Book a Demo
              </p>
              <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-[#071633] sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
                See EVADA in <span className="bg-[linear-gradient(90deg,#2563EB,#06B6D4,#7C3AED)] bg-clip-text text-transparent">action.</span>
              </h1>
              <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
                Meet with our team to explore AI-assisted validation, controlled workflows, evidence-backed reporting, and enterprise governance for your security program.
              </p>

              <div className="mt-8 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-4">
                {demoHighlights.map(({ label, Icon }) => (
                  <div key={label} className="rounded-[18px] border border-blue-100 bg-white/86 p-4 text-center shadow-[0_14px_34px_rgba(37,99,235,0.08)]">
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
                      <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <p className="mt-3 text-[12px] font-black leading-tight text-slate-950">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-3">
                {demoOutcomes.map((item) => (
                  <div key={item} className="flex min-w-0 gap-3 rounded-2xl bg-white/84 p-4 text-[15px] font-semibold leading-relaxed text-slate-700 ring-1 ring-blue-100">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" strokeWidth={2.2} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-5 py-3 text-[14px] font-extrabold text-[#2563EB] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 motion-reduce:transform-none"
              >
                Need contact information?
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
              </Link>
            </div>

            <div className="relative w-full">
              <div aria-hidden="true" className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_44%),radial-gradient(circle_at_72%_28%,rgba(124,58,237,0.16),transparent_46%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_28px_80px_rgba(37,99,235,0.14)] sm:p-7">
                <div className="flex flex-col gap-4 border-b border-blue-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#2563EB]">Request Demo</p>
                    <h2 className="mt-2 text-[26px] font-black tracking-[-0.02em] text-[#071633] sm:text-[32px]">Tell us what you want to validate</h2>
                    <p className="mt-2 max-w-[580px] text-[14px] font-medium leading-relaxed text-slate-600">
                      Share your goals and we will route your request to the right EVADA security specialist.
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[13px] font-extrabold text-[#2563EB]">
                    <Clock3 aria-hidden="true" className="h-4 w-4" />
                    24h response
                  </span>
                </div>

                <div className="mt-6">
                  <EnquiryForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
