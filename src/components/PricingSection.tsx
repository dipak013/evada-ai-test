import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16 scroll-mt-24">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(4,169,199,0.16),transparent_44%),radial-gradient(circle_at_82%_22%,rgba(109,73,244,0.15),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(248,251,255,0.02)_100%)] opacity-80" />

      <div className="relative mx-auto max-w-[1360px]">
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Pricing</p>
            <h2 className="mx-auto mt-4 max-w-[760px] text-[clamp(1.55rem,5vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.025em] text-slate-950">
              <span className="block">Pricing</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">Launching Soon</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[700px] text-[15px] leading-[1.75] text-slate-600 sm:text-[16px]">
              Pricing details will be available soon.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/book-demo"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[150px] sm:w-auto"
              >
                Book a Demo
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                View Pricing Page
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
