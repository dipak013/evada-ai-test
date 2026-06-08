import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "Free",
    priceSuffix: "",
    subtitle: "5 devices/month",
    features: [
      "5 devices/month",
      "All scan formats (Nessus, OpenVAS, Qualys, Custom)",
      "Google SSO",
      "30-day data retention",
      "Community support",
    ],
    cta: "Current Plan",
    accent: "from-slate-300 to-slate-400",
    border: "border-slate-200",
    buttonClass: "bg-gray-100 text-gray-500 cursor-not-allowed",
    current: true,
  },
  {
    name: "Pro",
    price: "$49",
    priceSuffix: "/month",
    subtitle: "50 devices/month",
    features: [
      "50 devices/month",
      "AI-powered exploit verification",
      "AI script generation",
      "Google SSO",
      "Up to 5 team members",
      "PDF reports",
      "1-year data retention",
      "Email support",
      "Read-only API keys",
      "90-day audit logs",
    ],
    cta: "Upgrade to Pro",
    accent: "from-indigo-500 to-blue-600",
    border: "border-indigo-400",
    buttonClass: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$199",
    priceSuffix: "/month",
    subtitle: "Unlimited devices",
    features: [
      "Unlimited devices",
      "AI exploit + script generation",
      "Knowledge base contributions + approval",
      "Unlimited team members",
      "PDF + HTML + CSV reports",
      "Unlimited data retention",
      "SLA + priority support",
      "Full-scope API keys",
      "Unlimited audit logs",
      "20 concurrent exploit runs",
    ],
    cta: "Upgrade to Enterprise",
    accent: "from-purple-500 to-fuchsia-600",
    border: "border-purple-400",
    buttonClass: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white",
  },
];

export default function SubscriptionPage() {
  return (
    <div className="page-padding">
      <div className="page-header">
        <div>
          <h1 className="text-page-title">Billing & Subscription</h1>
          <p className="text-small mt-1">
            Currently on the <span className="font-semibold text-indigo-700">Free</span> plan.
          </p>
        </div>
        <Link
          href="/#home"
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Home</span>
        </Link>
      </div>

      <section className="card card-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_45%)]"></div>
        <div className="relative">
          <h2 className="text-section-title mb-4">Available Plans</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-2xl border-2 ${plan.border} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                {plan.badge ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className={`inline-flex rounded-full bg-gradient-to-r ${plan.accent} px-3 py-1 text-[11px] font-semibold text-white shadow-md`}>
                      {plan.badge}
                    </span>
                  </div>
                ) : null}

                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-900">{plan.name}</p>
                  <div className="mt-2 flex items-end gap-1">
                    <p className="text-4xl font-bold text-gray-900">{plan.price}</p>
                    {plan.priceSuffix ? <span className="text-sm text-gray-500 pb-1">{plan.priceSuffix}</span> : null}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{plan.subtitle}</p>
                </div>

                <ul className="space-y-2.5 mb-6 min-h-[230px]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${plan.accent} text-white flex-shrink-0`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="h-3.5 w-3.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={plan.current}
                  className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${plan.buttonClass}`}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5 card card-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.15),transparent_42%)]"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 mb-3">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Tailored Enterprise Packaging</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Need a custom plan?</h3>
            <p className="text-body mt-2 text-gray-600">
              For larger organizations, multi-tenant requirements, or private cloud/on-prem deployment,
              our solution architects can design a contract that fits your security and compliance model.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/40 transition-all hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700"
            >
              Contact Sales
            </button>
            <button
              type="button"
              className="rounded-xl border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
