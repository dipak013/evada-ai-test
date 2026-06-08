import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import Reveal from "@/components/Reveal";
import HeroDashboardCarousel from "@/components/HeroDashboardCarousel";
import HomepageAnimatedBackground from "@/components/marketing/HomepageAnimatedBackground";
import { marketingIconMap } from "@/components/marketing/MarketingIcon";
import ProblemSection from "@/components/ProblemSection";
import HowEvadaWorksSection from "@/components/HowEvadaWorksSection";
import AIPentesterPipelineSection from "@/components/AIPentesterPipelineSection";
import PlatformModulesSection from "@/components/PlatformModulesSection";
import AIGovernanceSection from "@/components/AIGovernanceSection";
import WhyEvadaSection from "@/components/WhyEvadaSection";
import PlatformInActionSection from "@/components/PlatformInActionSection";
import EnterpriseControlSection from "@/components/EnterpriseControlSection";
import PlatformEvolutionSection from "@/components/PlatformEvolutionSection";
import PricingSection from "@/components/PricingSection";
import FooterSection from "@/components/FooterSection";

type FeatureItem = {
  label: string;
  Icon: LucideIcon;
};

const heroFeatures: FeatureItem[] = [
  { label: "AI-Supported Pentest", Icon: marketingIconMap["ai-pentester"] },
  { label: "Continuous Risk Validation", Icon: marketingIconMap["continuous-validation"] },
  { label: "Security Workflow Ready", Icon: marketingIconMap["security-workflow"] },
  { label: "Enterprise Governance", Icon: marketingIconMap["enterprise-governance"] },
];

function HeroFeatureCard({ item }: { item: FeatureItem }) {
  const { Icon } = item;

  return (
    <div className="group flex min-w-0 flex-col items-center border-slate-200/80 text-center sm:border-l sm:first:border-l-0">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#5F3FEA] shadow-[0_10px_26px_rgba(37,99,235,0.08)] ring-1 ring-blue-100 transition group-hover:-translate-y-0.5 group-hover:text-[#04A9C7] motion-reduce:transform-none">
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
      </span>
      <span className="mt-3 max-w-[118px] text-[11px] font-semibold leading-snug text-slate-900 [overflow-wrap:normal] [word-break:normal] sm:text-[12px]">
        {item.label}
      </span>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="evada-home-hero relative overflow-hidden bg-white px-5 pb-10 pt-7 sm:px-8 sm:pb-12 sm:pt-9 lg:px-10 lg:pb-16 lg:pt-10">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_88%_24%,rgba(124,58,237,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(248,251,255,0.28)_100%)] opacity-45" />

      <div className="relative mx-auto grid w-full max-w-full min-w-0 grid-cols-1 items-center gap-10 sm:max-w-[1220px] lg:grid-cols-[0.43fr_0.57fr] xl:gap-12">
        <Reveal className="w-full min-w-0 max-w-full">
          <div className="w-full max-w-full sm:max-w-[560px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              AI-Supported Pentest
            </p>

            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-slate-950 sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              <span className="block">Validate</span>
              <span className="block">exploitable risk</span>
              <span className="block">before <span className="text-[0.84em] sm:text-[0.88em] lg:text-[0.9em]">it becomes</span></span>
              <span className="block bg-[linear-gradient(90deg,#6D49F4,#2563EB,#04A9C7)] bg-clip-text text-transparent">business impact</span>
            </h1>

            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              EVADA helps security teams continuously validate what attackers can exploit, reduce scanner noise and turn findings into evidence-backed action.
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
                href="/trust-center"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-blue-100 bg-white px-6 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_12px_28px_rgba(37,99,235,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:w-auto"
              >
                View Trust Centre
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>

            <div className="mt-8 grid w-full max-w-full grid-cols-2 gap-x-4 gap-y-6 sm:max-w-[560px] sm:grid-cols-4">
              {heroFeatures.map((item) => (
                <HeroFeatureCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="w-full min-w-0 max-w-full lg:-mt-4 xl:-mt-6" delayMs={120}>
          <HeroDashboardCarousel />
        </Reveal>
      </div>
    </section>
  );
}

function BetweenPentestsSection() {
  const items = [
    {
      title: "Point-in-time tests expire quickly",
      text: "Traditional reports become stale as environments change.",
      Icon: marketingIconMap["stale-reports"],
    },
    {
      title: "Attack paths keep changing",
      text: "EVADA helps teams track exploitable paths between assessment cycles.",
      Icon: marketingIconMap["attack-paths"],
    },
    {
      title: "Evidence guides action",
      text: "Proof-backed context helps teams focus on real risk rather than every finding.",
      Icon: marketingIconMap["evidence-action"],
    },
  ];

  return (
    <section className="bg-[#FBFDFF] px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto grid max-w-[1220px] gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <Reveal>
          <div className="max-w-[520px]">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#2563EB]">Between pentests</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.55rem)] font-black leading-tight tracking-[-0.025em] text-slate-950">
              What happens after the annual pentest?
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
              New releases, assets and configuration changes create fresh exposure long before the next assessment. EVADA keeps validation active so teams can see what remains exploitable.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 80}>
              <article className="h-full rounded-[18px] border border-blue-100 bg-white p-6 shadow-[0_18px_44px_rgba(37,99,235,0.07)]">
                <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[linear-gradient(135deg,#EEF5FF,#F5F3FF)] text-[15px] font-black text-[#2563EB] ring-1 ring-blue-100">
                  <item.Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-[18px] font-black leading-snug text-slate-950">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-600">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="evada-homepage relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <HomepageAnimatedBackground />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <HeroSection />
        <BetweenPentestsSection />
        <ProblemSection />
        <HowEvadaWorksSection />
        <AIPentesterPipelineSection />
        <PlatformModulesSection />
        <AIGovernanceSection />
        <WhyEvadaSection />
        <PlatformInActionSection />
        <EnterpriseControlSection />
        <PlatformEvolutionSection />
        <PricingSection />
        <FooterSection />
      </div>
    </main>
  );
}
