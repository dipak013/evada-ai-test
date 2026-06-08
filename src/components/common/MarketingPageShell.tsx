import { ReactNode } from "react";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

type MarketingPageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function MarketingPageShell({ children }: Readonly<MarketingPageShellProps>) {
  return (
    <main className="evada-homepage relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="security" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />
        <section className="relative overflow-hidden bg-[#F8FBFF] px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(124,58,237,0.14),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]"
          />
          <div className="relative mx-auto w-full max-w-[1180px]">{children}</div>
        </section>
        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
