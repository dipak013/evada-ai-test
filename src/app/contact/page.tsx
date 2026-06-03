import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { EnquiryForm } from "@/components/common/EnquiryForm";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";
import MarketingAnimatedBackground from "@/components/marketing/MarketingAnimatedBackground";

const contactChannels = [
  {
    title: "Email",
    detail: "info@evada.ai",
    href: "mailto:info@evada.ai",
    Icon: Mail,
  },
  {
    title: "Phone",
    detail: "02039166414 / 07723115384",
    href: "tel:02039166414",
    Icon: Phone,
  },
  {
    title: "Address",
    detail: "124 City Road, London, EC1V 2NX",
    Icon: MapPin,
  },
];

const demoHighlights = [
  { label: "Platform questions", Icon: CalendarCheck },
  { label: "Security inquiries", Icon: Sparkles },
  { label: "Governance support", Icon: ShieldCheck },
  { label: "Team response", Icon: UserCheck },
];

const expectationItems = [
  "See how EVADA connects findings, validation workflows, evidence, and reports.",
  "Review how controlled AI validation works with human approval and safe sandboxing.",
  "Discuss integrations, admin access layers, tenants, agents, and remediation workflows.",
];

function ChannelCard({ channel }: { channel: (typeof contactChannels)[number] }) {
  const { Icon } = channel;

  const content = (
    <div className="group flex min-w-0 items-start gap-4 rounded-[20px] border border-blue-100 bg-white p-4 shadow-[0_14px_34px_rgba(37,99,235,0.07)] transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_48px_rgba(37,99,235,0.12)] motion-reduce:transform-none">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#EEF6FF,#F3E8FF)] text-[#2563EB] ring-1 ring-blue-100 transition group-hover:text-[#7C3AED]">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-black uppercase tracking-[0.18em] text-[#2563EB]">{channel.title}</span>
        <span className="mt-1 block text-[15px] font-extrabold leading-relaxed text-slate-950">{channel.detail}</span>
      </span>
    </div>
  );

  if (!channel.href) {
    return content;
  }

  return (
    <a href={channel.href} className="block rounded-[20px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
      {content}
    </a>
  );
}

function OfficeMapCard() {
  return (
    <div className="relative mt-5 overflow-hidden rounded-[24px] border border-blue-100 bg-white shadow-[0_18px_46px_rgba(37,99,235,0.10)]">
      <div className="absolute left-4 top-4 z-10">
        <a
          href="https://www.google.com/maps/search/?api=1&query=124%20City%20Road%2C%20London%2C%20EC1V%202NX"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[12px] border border-blue-100 bg-white px-4 py-2 text-[14px] font-extrabold text-[#2563EB] shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:border-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 motion-reduce:transform-none"
        >
          Open in Maps
          <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.1} />
        </a>
      </div>
      <iframe
        title="EVADA office map"
        src="https://www.google.com/maps?q=124%20City%20Road%2C%20London%2C%20EC1V%202NX&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[260px] w-full border-0 grayscale-[10%] sm:h-[300px] lg:h-[315px]"
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="evada-homepage relative min-h-screen overflow-x-clip bg-[#F8FBFF] text-slate-950">
      <MarketingAnimatedBackground variant="demo" />
      <div className="evada-homepage-content relative z-10">
        <MarketingNav />

        <section className="relative overflow-hidden bg-[#F8FBFF] px-4 pb-12 pt-10 sm:px-8 lg:px-10 lg:pb-16 lg:pt-14">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(37,99,235,0.13),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(124,58,237,0.14),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]" />

        <div className="relative mx-auto grid w-full max-w-[1360px] items-center gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:gap-12">
          <div className="w-full max-w-[620px]">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              <span className="h-2 w-2 rounded-full bg-[#04A9C7]" />
              Contact
            </p>
            <h1 className="mt-5 max-w-full break-words text-[34px] font-bold leading-[1.07] tracking-[-0.035em] text-[#071633] sm:text-[46px] lg:text-[clamp(3rem,4.55vw,3.75rem)]">
              Contact <span className="bg-[linear-gradient(90deg,#2563EB,#06B6D4,#7C3AED)] bg-clip-text text-transparent">EVADA.</span>
            </h1>
            <p className="mt-5 w-full max-w-full text-[15px] leading-[1.7] text-slate-600 sm:max-w-[540px] sm:text-[16px]">
              Reach our team for platform questions, partnership inquiries, security validation guidance, and customer support.
            </p>

            <div className="mt-8 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:grid-cols-4">
              {demoHighlights.map(({ label, Icon }) => (
                <div key={label} className="rounded-[18px] border border-blue-100 bg-white/86 p-4 text-center shadow-[0_14px_34px_rgba(37,99,235,0.08)]">
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-100">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <p className="mt-3 text-[12px] font-black leading-tight text-slate-950">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4">
              {contactChannels.map((channel) => (
                <ChannelCard key={channel.title} channel={channel} />
              ))}
            </div>
            <OfficeMapCard />
          </div>

          <div className="relative w-full">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_44%),radial-gradient(circle_at_72%_28%,rgba(124,58,237,0.16),transparent_46%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_28px_80px_rgba(37,99,235,0.14)] sm:p-7">
              <div className="flex flex-col gap-4 border-b border-blue-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#2563EB]">Send an Inquiry</p>
                  <h2 className="mt-2 text-[clamp(1.55rem,4vw,2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">Tell us how we can help</h2>
                  <p className="mt-2 max-w-[580px] text-[14px] font-normal leading-relaxed text-slate-600">
                    Provide your details and inquiry context. We will prepare a focused response from the right EVADA specialist.
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[13px] font-extrabold text-[#2563EB]">
                  <Clock3 aria-hidden="true" className="h-4 w-4" />
                  24h response
                </span>
              </div>

              <div className="mt-6">
                <EnquiryForm />
              </div>
            </div>
          </div>
        </div>
        </section>

        <section className="bg-white px-4 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto grid max-w-[1360px] gap-6 rounded-[26px] border border-blue-100 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_48%,#F5F3FF_100%)] p-6 shadow-[0_22px_60px_rgba(37,99,235,0.10)] md:grid-cols-[0.36fr_0.64fr] md:p-8">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#2563EB]">What to expect</p>
              <h2 className="mt-3 max-w-[420px] text-[clamp(1.55rem,4vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">A focused security validation session</h2>
            </div>
            <div className="grid gap-3">
              {expectationItems.map((item) => (
                <div key={item} className="flex min-w-0 gap-3 rounded-2xl bg-white/84 p-4 text-[15px] font-semibold leading-relaxed text-slate-700 ring-1 ring-blue-100">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#2563EB]" strokeWidth={2.2} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8FBFF] px-4 pb-14 sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-4 rounded-[24px] border border-blue-100 bg-white p-6 shadow-[0_20px_56px_rgba(37,99,235,0.09)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#2563EB]">Prefer a direct inquiry?</p>
              <h2 className="mt-2 text-[clamp(1.5rem,4vw,2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#071633]">Use the dedicated inquiry workspace.</h2>
            </div>
            <Link
              href="/contact/enquiry"
              className="evada-gradient-cta inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-extrabold text-white transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 motion-reduce:transform-none"
            >
              Open Inquiry Workspace
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            </Link>
          </div>
        </section>

        <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
      </div>
    </main>
  );
}
