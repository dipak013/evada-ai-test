import { MarketingPageShell } from "@/components/common/MarketingPageShell";

const sections = [
  {
    title: "Information we process",
    toneClass: "border-cyan-200 bg-cyan-50/70",
    points: [
      "Account identity and authentication metadata required for secure access.",
      "Security telemetry and scan outputs generated through authorised platform use.",
      "Operational diagnostics used to maintain reliability, threat visibility, and response quality.",
    ],
  },
  {
    title: "Why we process it",
    toneClass: "border-indigo-200 bg-indigo-50/70",
    points: [
      "Deliver continuous security monitoring, exploit validation, and report generation.",
      "Improve model-assisted detection quality and prioritise high-confidence risks.",
      "Meet contractual, legal, and regulatory obligations for enterprise customers.",
    ],
  },
  {
    title: "Sharing and subprocessors",
    toneClass: "border-violet-200 bg-violet-50/70",
    points: [
      "We do not sell personal information.",
      "Data may be processed by approved infrastructure/security subprocessors under strict DPA terms.",
      "All subprocessors are subject to confidentiality, access control, and security review requirements.",
    ],
  },
  {
    title: "Retention and security",
    toneClass: "border-emerald-200 bg-emerald-50/70",
    points: [
      "Encryption in transit and at rest for sensitive data channels.",
      "Role-based access controls, auditing, and environment hardening.",
      "Retention periods are aligned with customer agreements and legal obligations.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell activePath="/privacy-policy">
      <section className="animate-reveal-up reveal-delay-1 mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.55)] ring-1 ring-white/45 sm:p-8 lg:p-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--evada-primary)]">
              Privacy Policy
            </p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Transparent data practices,
              {" "}
              <span className="evada-gradient-text block">engineered for enterprise trust</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Effective date: April 25, 2026. This policy describes how EVADA processes data to
              power secure operations, maintain service integrity, and support compliant cyber risk
              programmes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/70 bg-slate-900/95 p-5 text-slate-100">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
              Privacy commitments
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">No sale of personal data</li>
              <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">Controlled subprocessor governance</li>
              <li className="rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2">Encryption and auditability by default</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {sections.map((section, index) => (
          <article
            key={section.title}
            className={`animate-reveal-up rounded-2xl border p-5 ring-1 ring-white/40 ${section.toneClass}`}
            style={{ animationDelay: `${150 + index * 90}ms` }}
          >
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {section.points.map((point) => (
                <li key={point} className="rounded-lg bg-white/70 px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="animate-reveal-up reveal-delay-4 mb-6 rounded-3xl border border-white/70 bg-white/75 p-6 ring-1 ring-white/45 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Privacy contact</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          For data rights, processing requests or privacy review enquiries, contact
          {" "}
          <span className="font-semibold text-slate-800">info@evada.ai</span>.
        </p>
      </section>
    </MarketingPageShell>
  );
}
