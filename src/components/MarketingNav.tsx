"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import HomeLogoLink from "@/components/HomeLogoLink";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Security", href: "/trust-center" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "Company", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const prefetchRoutes = [...navItems.map((item) => item.href), "/book-demo", "/contact/enquiry", "/login"];

function BrandLogo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center">
        <Image
          src="/logos/title.png"
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
          priority
        />
      </span>
      <span className={`text-[22px] font-black leading-none tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>EVADA</span>
    </span>
  );
}

export default function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const warmNavigation = () => {
      prefetchRoutes.forEach((href) => router.prefetch(href));
    };

    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(warmNavigation, { timeout: 4200 })
      : undefined;
    const timeoutId = idleId === undefined ? window.setTimeout(warmNavigation, 2200) : undefined;

    return () => {
      if (idleId !== undefined) {
        idleWindow.cancelIdleCallback?.(idleId);
      }

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.startsWith("/#")) {
      return false;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-[100dvw] overflow-x-clip border-b border-slate-200/75 bg-white/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[70px] w-full max-w-full items-center justify-between gap-3 px-4 sm:max-w-[1360px] sm:px-8 lg:px-10">
        <HomeLogoLink ariaLabel="EVADA home" className="shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
          <BrandLogo />
        </HomeLogoLink>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3 text-[13px] font-medium text-slate-800 2xl:gap-6 xl:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={`group relative inline-flex items-center gap-1.5 rounded-lg px-1 py-2 transition-all hover:font-bold hover:text-[#5F3FEA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 ${
                  active ? "font-bold text-[#2563EB]" : ""
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-[15px] left-0 h-0.5 rounded-full bg-[linear-gradient(90deg,#2563EB,#7C3AED)] transition-all duration-300 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link
            href="/login"
            prefetch={false}
            className="whitespace-nowrap rounded-xl px-2 py-2 text-[13px] font-medium text-slate-800 transition-all hover:font-bold hover:text-[#5F3FEA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            See EVADA in Action
          </Link>
          <Link
            href="/book-demo"
            prefetch={false}
            className="evada-gradient-cta inline-flex min-w-[142px] items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-[13px] font-extrabold text-white transition hover:-translate-y-0.5 motion-reduce:transform-none 2xl:px-7 2xl:text-[14px]"
          >
            Book a Demo
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 xl:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" strokeWidth={2.4} /> : <Menu className="h-5 w-5" strokeWidth={2.4} />}
        </button>
      </div>

      <div
        className={`grid overflow-hidden border-t border-slate-200/70 bg-white transition-[grid-template-rows,opacity] duration-300 xl:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0">
          <div className="mx-auto max-w-[560px] px-5 pb-6 pt-2 sm:px-8">
            <nav className="grid gap-1 rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[16px] font-semibold transition hover:bg-[#F8FAFC] hover:font-bold ${
                    isActive(item.href) ? "bg-blue-50 font-bold text-[#2563EB]" : "text-slate-950"
                  }`}
                >
                  {item.label}
                  <ArrowRight className="h-4 w-4 text-slate-400" strokeWidth={2.1} />
                </Link>
              ))}
            </nav>

            <div className="mt-3 grid gap-3">
              <Link
                href="/login"
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-[14px] border border-slate-200 bg-white px-4 py-3 text-[15px] font-semibold text-slate-950 shadow-sm transition hover:font-bold hover:text-[#5F3FEA]"
              >
                See EVADA in Action
              </Link>
              <Link
                href="/book-demo"
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className="evada-gradient-cta inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-[15px] font-extrabold text-white"
              >
                Book a Demo <ArrowRight className="h-4 w-4" strokeWidth={2.1} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
