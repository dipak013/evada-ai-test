import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

function PricingHeroVisual() {
  return (
    <div className="pricing-hero-visual relative mx-auto h-[500px] w-full max-w-full overflow-hidden sm:h-[560px] sm:max-w-[760px] sm:overflow-visible lg:-mt-4 xl:-mt-6" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.88),transparent_30%),radial-gradient(circle_at_50%_52%,rgba(37,99,235,0.18),transparent_44%),radial-gradient(circle_at_42%_58%,rgba(124,58,237,0.16),transparent_44%)] blur-sm" />

      <div className="absolute left-1/2 top-1/2 h-[560px] w-[760px] -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-[0.78] lg:scale-[0.86] xl:scale-[0.92] 2xl:scale-95">
        <div className="absolute left-[86px] top-[74px] h-[408px] w-[560px] rounded-[34px] border border-blue-100 bg-white/82 shadow-[0_28px_80px_rgba(37,99,235,0.16)] backdrop-blur-xl" />
        <div className="absolute left-[128px] top-[118px] grid h-[320px] w-[476px] place-items-center rounded-[30px] border border-blue-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] p-8 text-center shadow-[0_20px_54px_rgba(37,99,235,0.12)]">
          <div>
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-[24px] bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white shadow-[0_20px_44px_rgba(37,99,235,0.24)]">
              <Clock3 className="h-10 w-10" strokeWidth={2.1} />
            </span>
            <p className="mt-7 text-[15px] font-black uppercase tracking-[0.18em] text-[#2563EB]">
              Pricing
            </p>
            <h2 className="mt-3 text-[42px] font-bold leading-none tracking-[-0.035em] text-slate-950">
              Launching Soon
            </h2>
          </div>
        </div>

        <span className="absolute left-[88px] top-[128px] h-4 w-4 rounded-full bg-[#04A9C7] shadow-[0_0_26px_rgba(4,169,199,0.65)]" />
        <span className="absolute right-[80px] top-[106px] h-5 w-5 rounded-full bg-[#7C3AED] shadow-[0_0_30px_rgba(124,58,237,0.55)]" />
        <span className="absolute bottom-[96px] right-[112px] h-3 w-3 rounded-full bg-[#2563EB] shadow-[0_0_26px_rgba(37,99,235,0.55)]" />
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(37,99,235,0.12),transparent_36%),radial-gradient(circle_at_84%_18%,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_58%,#FFFFFF_100%)]" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              PRICING
            </p>

            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Pricing</span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">Launching Soon</span>
            </h1>

            <p className="mt-5 w-full max-w-full text-[15px] font-normal leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              Pricing details will be available soon.
            </p>

            <div className="mt-8 grid w-full max-w-full gap-3 sm:max-w-[520px] sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="/book-demo"
                className="evada-gradient-cta inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-semibold text-white transition hover:-translate-y-0.5 sm:min-w-[150px] sm:w-auto"
              >
                Book a Demo
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                Back Home
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0 max-w-full" delayMs={120}>
          <PricingHeroVisual />
        </Reveal>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="evada-homepage evada-pricing-page relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="pricing" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
