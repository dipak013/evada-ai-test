import { MarketingPageShell } from "@/components/common/MarketingPageShell";

const legalSections = [
  {
    title: "Service scope",
    styleClass: "border-indigo-200 bg-indigo-50/70",
    detail:
      "EVADA provides authorised security testing workflows, exploit validation and reporting capabilities designed for enterprise risk management.",
  },
  {
    title: "Customer responsibilities",
    styleClass: "border-cyan-200 bg-cyan-50/70",
    detail:
      "Customers must maintain legal authority for all assessments, secure account credentials, and assign access rights responsibly.",
  },
  {
    title: "Acceptable use",
    styleClass: "border-rose-200 bg-rose-50/70",
    detail:
      "The platform may not be used for unauthorised scanning, malicious disruption or activity outside approved security boundaries.",
  },
  {
    title: "Intellectual property",
    styleClass: "border-violet-200 bg-violet-50/70",
    detail:
      "EVADA retains software and platform IP rights. Customers retain ownership of their data and generated security assessment outputs.",
  },
  {
    title: "Support and commercial terms",
    styleClass: "border-emerald-200 bg-emerald-50/70",
    detail:
      "Service support, commitments, and contractual obligations are defined by subscription agreements and enterprise order forms.",
  },
  {
    title: "Limitation and enforcement",
    styleClass: "border-amber-200 bg-amber-50/70",
    detail:
      "Violations may result in suspension or termination to protect customers, platform integrity, and lawful operating standards.",
  },
];

export default function TermsOfServicePage() {
  return (
    <MarketingPageShell activePath="/terms-of-service">
      <section className="animate-reveal-up reveal-delay-1 mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.55)] ring-1 ring-white/45 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--evada-primary)]">
              Terms of Service
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Clear legal standards for
              {" "}
              <span className="evada-gradient-text block">responsible security operations</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Effective date: April 25, 2026. These terms define the legal and operational
              framework for using EVADA services, including authorised assessments, governance and
              support obligations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/95 p-5 text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
              Legal principles
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">Authorised use only</p>
              <p className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">Shared responsibility model</p>
              <p className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">Contract-aligned governance</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {legalSections.map((item, index) => (
          <article
            key={item.title}
            className={`animate-reveal-up rounded-2xl border p-5 ring-1 ring-white/40 ${item.styleClass}`}
            style={{ animationDelay: `${150 + index * 85}ms` }}
          >
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-sm leading-relaxed text-slate-700">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="animate-reveal-up reveal-delay-4 mb-6 rounded-3xl border border-white/70 bg-white/75 p-6 ring-1 ring-white/45 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Legal and commercial contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          For contractual or legal enquiries, contact
          {" "}
          <span className="font-semibold text-slate-800">info@evada.ai</span>.
        </p>
      </section>
    </MarketingPageShell>
  );
}
