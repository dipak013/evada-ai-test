import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";

type Plan = {
  name: string;
  price: string;
  blurb: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Team",
    price: "Start fast",
    blurb: "For security teams that want a governed validation console connected to their scanning and AI engine.",
    highlights: [
      "Target configuration & scan source ingestion",
      "AI-supported pentest job launch + live monitoring",
      "Vulnerability reports + knowledge hub",
      "Role-based access control",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/signup",
  },
  {
    name: "Enterprise",
    price: "Talk to Sales",
    blurb: "For multi-tenant operations, agent fleets, and enterprise governance requirements.",
    highlights: [
      "Client, agent, license & tenant administration",
      "Policy + approval workflows at scale",
      "Audit logs + operational visibility",
      "Custom integrations & rollout support",
    ],
    ctaLabel: "Book a Demo",
    ctaHref: "/book-demo",
    featured: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(4,169,199,0.16),transparent_44%),radial-gradient(circle_at_82%_22%,rgba(109,73,244,0.15),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(248,251,255,0.02)_100%)] opacity-80" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[920px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Pricing</p>
            <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-black leading-[1.1] tracking-[-0.025em] text-slate-950">
              Pricing for Modern Security Teams
            </h2>
            <p className="mx-auto mt-5 max-w-[780px] text-[15px] leading-[1.75] text-slate-600 sm:text-[17px]">
              EVADA pricing scales with targets, scan sources, tenants, and governance needs. Start with the console and expand when you are ready.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delayMs={120 + index * 90} className="min-w-0">
              <article
                className={`relative h-full min-w-0 overflow-hidden rounded-[28px] border bg-white/93 p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] ${
                  plan.featured ? "border-violet-200" : "border-slate-200"
                }`}
              >
                {plan.featured && (
                  <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-violet-200/35 blur-3xl" />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04A9C7]">{plan.name}</p>
                      <h3 className="mt-2 text-[24px] font-black tracking-[-0.02em] text-slate-950">{plan.price}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[12px] font-black ${plan.featured ? "bg-[#EEF2FF] text-[#5F3FEA]" : "bg-slate-100 text-slate-700"}`}>
                      {plan.featured ? "Best for scale" : "Great for teams"}
                    </span>
                  </div>

                  <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-slate-600">{plan.blurb}</p>

                  <ul className="mt-6 grid gap-3">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#04A9C7]" strokeWidth={2.1} />
                        <span className="text-[14px] font-semibold leading-relaxed text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7">
                    <Link
                      href={plan.ctaHref}
                      className={`inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-[15px] font-extrabold transition hover:-translate-y-0.5 ${
                        plan.featured
                          ? "evada-gradient-cta text-white"
                          : "border border-slate-200 bg-white text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.06)] hover:border-slate-300"
                      }`}
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
