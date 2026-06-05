import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe2, Mail, MapPin, Phone, Plus, ShieldCheck } from "lucide-react";
import HomeLogoLink from "@/components/HomeLogoLink";
import Reveal from "@/components/Reveal";

type FooterColumn = {
  title: string;
  links: string[];
};

const columns: FooterColumn[] = [
  {
    title: "Platform",
    links: ["How It Works", "Features", "Integrations", "Use Cases", "Roadmap"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Blog", "Guides", "Webinars", "Help Centre"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Partners", "News", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Security", "Compliance", "Trust"],
  },
];

const footerContactItems = [
  { label: "info@evada.ai", href: "mailto:info@evada.ai", Icon: Mail },
  { label: "02039166414 / 07723115384", href: "tel:02039166414", Icon: Phone },
  {
    label: "124 City Road, London, EC1V 2NX",
    href: "https://www.google.com/maps/search/?api=1&query=124%20City%20Road%2C%20London%2C%20EC1V%202NX",
    Icon: MapPin,
  },
];

const footerHrefMap: Record<string, string> = {
  "How It Works": "/#how-evada-works",
  Features: "/platform",
  Integrations: "/platform#integrations",
  "Use Cases": "/solutions",
  Roadmap: "/#platform-evolution",
  Documentation: "/resources",
  Blog: "/resources",
  Guides: "/resources",
  Webinars: "/resources",
  "Help Centre": "/resources",
  "About Us": "/about",
  Careers: "/about",
  Partners: "/about",
  News: "/about",
  Contact: "/contact",
  "Contact Us": "/contact",
  "Privacy Policy": "/privacy-policy",
  "Terms of Service": "/terms-of-service",
  Security: "/trust-center",
  Compliance: "/trust-center",
  Trust: "/trust-center",
};

function footerHref(label: string) {
  return footerHrefMap[label] ?? "#";
}

function FooterCTA() {
  return (
    <section className="bg-white px-5 pb-12 pt-4 sm:px-8 lg:px-10">
      <Reveal>
        <div className="relative mx-auto flex max-w-[1220px] flex-col gap-6 overflow-hidden rounded-[24px] border border-blue-100 bg-[linear-gradient(135deg,#EEF5FF_0%,#FFFFFF_45%,#F3E8FF_100%)] px-6 py-6 shadow-[0_24px_70px_rgba(37,99,235,0.12)] sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(34,211,238,0.24),transparent_32%),radial-gradient(circle_at_78%_30%,rgba(124,58,237,0.18),transparent_34%)]" />
          <div className="relative flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
            <span className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white text-[#2563EB] shadow-[0_0_44px_rgba(124,58,237,0.20)] ring-1 ring-blue-100">
              <ShieldCheck aria-hidden="true" className="h-11 w-11" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[clamp(1.65rem,4.4vw,2.35rem)] font-black leading-tight tracking-[-0.025em] text-slate-950">
                Ready to validate risk continuously?
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600 sm:text-[17px]">
                See how EVADA helps security teams move faster with confidence.
              </p>
            </div>
          </div>

          <div className="relative grid gap-3 sm:flex sm:shrink-0 sm:items-center">
            <Link
              href="/book-demo"
              className="evada-gradient-cta inline-flex min-h-12 min-w-[156px] items-center justify-center whitespace-nowrap rounded-[14px] px-8 py-3 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5"
            >
              Book a Demo
            </Link>
            <Link
              href="/platform#architecture"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-7 py-3 text-center text-[15px] font-extrabold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[#2563EB] sm:min-w-[282px] sm:whitespace-nowrap"
            >
              Explore platform architecture
              <span aria-hidden="true">{"\u2192"}</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FooterColumnLinks({ column }: { column: FooterColumn }) {
  return (
    <div className="min-w-0">
      <h3 className="text-[12px] font-black uppercase tracking-[0.16em] text-[#04A9C7]">{column.title}</h3>
      <ul className="mt-4 grid gap-2.5">
        {column.links.map((link) => (
          <li key={link}>
            <Link href={footerHref(link)} className="text-[14px] font-semibold text-slate-200/90 transition hover:text-[#04A9C7]">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileFooterGroup({ column }: { column: FooterColumn }) {
  return (
    <details className="group border-b border-white/10 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[14px] font-black uppercase tracking-[0.16em] text-[#04A9C7]">
        {column.title}
        <Plus className="h-4 w-4 transition group-open:rotate-45" strokeWidth={2.1} />
      </summary>
      <ul className="mt-4 grid gap-3 pb-1">
        {column.links.map((link) => (
          <li key={link}>
            <Link href={footerHref(link)} className="text-[15px] font-semibold text-slate-200/90">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function FooterContactInfo() {
  return (
    <div className="min-w-0">
      <h3 className="text-[12px] font-black uppercase tracking-[0.18em] text-[#04A9C7]">Contact</h3>
      <div className="mt-5 grid gap-4">
        {footerContactItems.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex min-w-0 items-center gap-3 rounded-xl text-slate-300 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#04A9C7] transition group-hover:text-cyan-300" strokeWidth={2} />
            <span className="min-w-0 text-[15px] font-semibold leading-relaxed">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}


function FooterBrand() {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center">
        <Image
          src="/logos/title.png"
          alt=""
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
        />
      </span>
      <span className="text-[26px] font-black leading-none tracking-tight text-white">EVADA</span>
    </div>
  );
}

type FooterSectionProps = {
  showCta?: boolean;
  trustBadgeVariant?: "standard" | "aligned";
  descriptionVariant?: "continuous" | "aiPowered";
};

type SocialIconName = "LinkedIn" | "X" | "GitHub" | "YouTube";

function FooterSocialIcon({ name }: { name: SocialIconName }) {
  if (name === "LinkedIn") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M7.2 9.2V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M11.3 18v-4.7c0-2.4 1.4-4 3.5-4 2 0 3 1.4 3 3.8V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path d="M7.2 6.2h.01" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      </svg>
    );
  }

  if (name === "X") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M5 5l14 14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        <path d="M19 5 5 19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "GitHub") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M9 19c-4.5 1.3-4.5-2-6.3-2.4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
        <path d="M15 22v-3.5c0-1 .1-1.4-.5-2 3.8-.4 7.7-1.8 7.7-8a6.2 6.2 0 0 0-1.7-4.3 5.9 5.9 0 0 0-.1-4.2s-1.4-.4-4.5 1.7a15.4 15.4 0 0 0-8.2 0C4.6-.4 3.2 0 3.2 0a5.9 5.9 0 0 0-.1 4.2 6.2 6.2 0 0 0-1.7 4.3c0 6.2 3.9 7.6 7.6 8-.5.5-.7 1.1-.7 2V22" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <rect x="3.5" y="6.5" width="17" height="11" rx="3" stroke="currentColor" strokeWidth="1.9" />
      <path d="m10.5 9.5 4 2.5-4 2.5v-5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

export default function FooterSection({
  showCta = true,
  descriptionVariant = "continuous",
}: FooterSectionProps) {
  const description =
    descriptionVariant === "aiPowered"
      ? ["AI-supported pentest platform", "for modern security teams.", "Validate exploitable risk.", "Remediate with confidence."]
      : ["Continuous security validation platform", "for modern security teams.", "Validate findings, reduce risk", "and accelerate remediation."];

  const socialLinks: Array<{ label: SocialIconName }> = [
    { label: "LinkedIn" },
    { label: "X" },
    { label: "GitHub" },
    { label: "YouTube" },
  ];

  return (
    <>
      {showCta && <FooterCTA />}

      <footer className="relative overflow-hidden bg-[#020B1F] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(4,169,199,0.16),transparent_30%),linear-gradient(180deg,#020B1F,#031127)]" />
        <div className="relative mx-auto max-w-[1360px]">
          <div className="grid min-w-0 grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.65fr_0.7fr] lg:gap-12">
            <div className="min-w-0">
              <div>
                <HomeLogoLink ariaLabel="EVADA home" className="inline-flex rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                  <FooterBrand />
                </HomeLogoLink>
                <p className="mt-5 max-w-[320px] text-[15px] font-medium leading-relaxed text-slate-300">
                  {description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  {socialLinks.map(({ label }, index) => (
                    <a
                      href="#"
                      key={label}
                      aria-label={label}
                      className="footer-social-link grid h-10 w-10 place-items-center rounded-full text-[12px] font-black text-white"
                      style={{ animationDelay: `${index * 0.18}s` }}
                    >
                      <FooterSocialIcon name={label} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden min-w-0 grid-cols-4 gap-9 md:grid lg:grid">
              {columns.map((column) => (
                <FooterColumnLinks key={column.title} column={column} />
              ))}
            </div>

            <div className="min-w-0 md:hidden">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4">
                {columns.map((column) => (
                  <MobileFooterGroup key={column.title} column={column} />
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="grid gap-5 border-white/15 lg:border-l lg:pl-10">
                <FooterContactInfo />
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] font-medium text-slate-400">{"\u00A9"} 2025 EVADA, Inc. All rights reserved.</p>
              <button type="button" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[14px] font-bold text-slate-100">
                <Globe2 aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                English (UK)
                <ChevronDown aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
