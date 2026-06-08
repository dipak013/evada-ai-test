import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { EnquiryForm } from "@/components/common/EnquiryForm";
import FooterSection from "@/components/FooterSection";
import MarketingNav from "@/components/MarketingNav";

export default function ContactEnquiryPage() {
  return (
    <main className="evada-homepage min-h-screen overflow-x-clip bg-white text-slate-950">
      <MarketingNav />

      <section className="relative overflow-hidden bg-[#F8FBFF] px-4 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(37,99,235,0.13),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(124,58,237,0.13),transparent_34%),linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)]" />

        <div className="relative mx-auto w-full max-w-[980px]">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-[14px] font-extrabold text-[#2563EB] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900 motion-reduce:transform-none"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
            Back to Contact
          </Link>

          <div className="mt-7 overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_28px_80px_rgba(37,99,235,0.14)]">
            <div className="border-b border-blue-100 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_48%,#F5F3FF_100%)] p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start">
                <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-white text-[#2563EB] shadow-[0_18px_44px_rgba(37,99,235,0.12)] ring-1 ring-blue-100">
                  <ShieldCheck aria-hidden="true" className="h-8 w-8" strokeWidth={2.1} />
                </span>
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#2563EB]">Inquiry Workspace</p>
                  <h1 className="mt-3 text-[32px] font-bold leading-[1.08] tracking-[-0.02em] text-[#071633] sm:text-[44px]">
                    Submit Your Security Inquiry
                  </h1>
                  <p className="mt-4 max-w-[720px] text-[15px] leading-relaxed text-slate-600 sm:text-[16px]">
                    Share your objective, timeline, and security context so the EVADA team can respond with a relevant plan for validation, governance, reporting, or integrations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

      <FooterSection showCta={false} trustBadgeVariant="aligned" descriptionVariant="aiPowered" />
    </main>
  );
}
