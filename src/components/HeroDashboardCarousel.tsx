import Image from "next/image";
import type { CSSProperties } from "react";

const slides = [
  {
    image: "/logos/Dashbord1.png",
    alt: "EVADA overview dashboard showing validation metrics, risk severity, and recent validations",
  },
  {
    image: "/logos/Dashbord2.png",
    alt: "EVADA validation queue dashboard showing findings, severity, filters, and approval workflow",
  },
  {
    image: "/logos/Dashbord3.png",
    alt: "EVADA evidence dashboard showing exploit proof, confidence score, and audit trail",
  },
  {
    image: "/logos/Dashbord4.png",
    alt: "EVADA governance dashboard showing approval workflows, policy controls, and audit coverage",
  },
  {
    image: "/logos/Dashbord5.png",
    alt: "EVADA dashboard preview showing before and after validated risk transformation",
  },
];

export default function HeroDashboardCarousel() {
  return (
    <div
      className="hero-carousel-float relative mx-auto w-full max-w-[calc(100vw-2.5rem)] sm:max-w-[760px] lg:-mr-1 xl:-mr-3"
      role="img"
      aria-label="EVADA dashboard preview carousel"
    >
      <div aria-hidden="true" className="absolute -inset-8 rounded-[38px] bg-[radial-gradient(circle_at_50%_46%,rgba(34,211,238,0.18),transparent_62%),radial-gradient(circle_at_76%_18%,rgba(124,58,237,0.15),transparent_44%),radial-gradient(circle_at_28%_76%,rgba(37,99,235,0.10),transparent_52%)] blur-2xl" />

      <div className="hero-carousel-shell relative overflow-hidden rounded-[26px] border border-blue-100/80 bg-white/95 shadow-[0_24px_70px_rgba(37,99,235,0.12)] backdrop-blur">
        <div className="relative aspect-[1640/1124] w-full overflow-hidden">
          {slides.map((slide, index) => {
            return (
              <div
                key={slide.image}
                className="hero-dashboard-slide absolute inset-0 grid place-items-center"
                style={{ "--slide-delay": `${index * 3.5}s` } as CSSProperties}
                aria-hidden="true"
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1280px) 760px, (min-width: 1024px) 57vw, (min-width: 640px) 640px, calc(100vw - 2.5rem)"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
