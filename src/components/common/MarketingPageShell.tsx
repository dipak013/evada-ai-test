import { ReactNode } from "react";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";
import { MarketingWarmup } from "./MarketingWarmup";

type MarketingPageShellProps = {
  activePath: string;
  children: ReactNode;
};

export function MarketingPageShell({ activePath, children }: Readonly<MarketingPageShellProps>) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-100/70 to-cyan-100/70 text-[var(--evada-text)]">
      <MarketingWarmup />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          className="marketing-video-bg"
          src="/videos/hero-bg.mp4?v=3"
          autoPlay
          muted
          loop
          playsInline
          tabIndex={-1}
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/78 via-indigo-100/72 to-cyan-100/76" />
        <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-indigo-300/35 blur-3xl animate-ambient-float" />
        <div className="absolute -right-16 top-24 h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl animate-ambient-float" style={{ animationDelay: "700ms" }} />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl animate-ambient-float" style={{ animationDelay: "1400ms" }} />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_1px_1px,_#6366f1_1px,_transparent_0)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(79,70,229,0.18),transparent_32%),radial-gradient(circle_at_80%_78%,rgba(8,145,178,0.16),transparent_30%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 md:px-10 md:py-6 lg:px-8 lg:py-6">
        <MarketingHeader activePath={activePath} />
        <div aria-hidden="true" className="h-[108px] sm:h-[118px]" />
        <div className="flex-1">{children}</div>
        <MarketingFooter />
      </div>
    </main>
  );
}
