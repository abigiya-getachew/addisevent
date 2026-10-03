"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── All event images pool ──────────────────────────────────────────────────────
const ALL_IMAGES = [
  { src: "/images/hero_event_concert_1791041390305.jpg",   label: "Live Music",        alt: "Live concert in Addis Ababa" },
  { src: "/images/hero_event_festival_1791041403567.jpg",  label: "Cultural Festival", alt: "Ethiopian cultural festival" },
  { src: "/images/hero_event_expo_1791041415699.jpg",      label: "Arts & Food Expo",  alt: "Addis Food & Arts Expo" },
  { src: "/images/hero_event_nightclub_1791042109575.jpg", label: "Rooftop Party",     alt: "Rooftop party in Addis Ababa" },
];

// Each floating card gets its own image rotation order (staggered)
const CARD_POOLS = [
  [0, 1, 2, 3],
  [1, 2, 3, 0],
  [2, 3, 0, 1],
];

// Floating card positions & drift speeds
const CARD_LAYOUT = [
  { top: "8%",     left: "2.5%", animDuration: "13s", animDelay: "0s"  },
  { top: "16%",    right: "2%",  animDuration: "17s", animDelay: "-4s" },
  { bottom: "13%", right: "5%",  animDuration: "20s", animDelay: "-8s" },
];

// ── Payment method badges ──────────────────────────────────────────────────────
const PAYMENT_BADGES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#00B0CA" />
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">T</text>
      </svg>
    ),
    label: "Telebirr",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#1D8348" />
        <text x="12" y="17" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="sans-serif">B</text>
      </svg>
    ),
    label: "CBE Birr",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#D4A03C" />
        <path d="M4 8l8 5 8-5M4 8h16v10H4V8z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "SMS Tickets",
  },
];

// ── Gold cross-pattern overlay ─────────────────────────────────────────────────
function CrossPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="cross-pattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect x="20" y="22" width="8" height="4" rx="1" fill="#D4A03C" opacity="0.14" />
          <rect x="22" y="20" width="4" height="8" rx="1" fill="#D4A03C" opacity="0.14" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cross-pattern)" />
    </svg>
  );
}

// ── Full-bleed background slideshow (crossfade) ────────────────────────────────
function BackgroundSlideshow({ images, intervalMs }: { images: typeof ALL_IMAGES; intervalMs: number }) {
  const [current, setCurrent] = useState(0);
  const [next, setNext]       = useState(1);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      const swap = setTimeout(() => {
        setCurrent((c) => (c + 1) % images.length);
        setNext((n)    => (n + 1) % images.length);
        setFading(false);
      }, 1000);
      return () => clearTimeout(swap);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {/* Current slide stays fully visible */}
      <img
        src={images[current].src}
        alt={images[current].alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 1 }}
      />
      {/* Next slide fades over the current one */}
      <img
        src={images[next].src}
        alt={images[next].alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: fading ? 1 : 0, transition: "opacity 1s ease" }}
      />
      {/* Dark gradient overlay keeps text legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,12,5,0.55) 0%, rgba(20,12,5,0.40) 55%, rgba(20,12,5,0.72) 100%)",
        }}
      />
      {/* Warm radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(10,5,2,0.35) 100%)",
        }}
      />
    </div>
  );
}

// ── Floating card that cycles its own image independently ──────────────────────
function FloatingCard({
  pool,
  layout,
  intervalMs,
  startDelay,
}: {
  pool: number[];
  layout: (typeof CARD_LAYOUT)[number];
  intervalMs: number;
  startDelay: number;
}) {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        setVisible(false);
        const swap = setTimeout(() => {
          setIdx((i) => (i + 1) % pool.length);
          setVisible(true);
        }, 500);
        return () => clearTimeout(swap);
      }, intervalMs);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [pool.length, intervalMs, startDelay]);

  const img = ALL_IMAGES[pool[idx]];
  const { animDuration, animDelay, ...posStyle } = layout;

  return (
    <div
      className="hero-float-card hidden lg:block"
      style={{ ...(posStyle as React.CSSProperties), animationDuration: animDuration, animationDelay: animDelay }}
      aria-hidden="true"
    >
      <img
        src={img.src}
        alt={img.alt}
        loading="lazy"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }}
      />
      <div className="hero-float-label">{img.label}</div>
    </div>
  );
}

// ── Main Hero ──────────────────────────────────────────────────────────────────
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => el.style.setProperty("--scroll-y", `${window.scrollY * 0.3}px`);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes floatDrift {
          0%   { transform: translateY(0px)   rotate(-1deg); }
          33%  { transform: translateY(-14px) rotate(0.5deg); }
          66%  { transform: translateY(-6px)  rotate(-0.8deg); }
          100% { transform: translateY(0px)   rotate(-1deg); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePop {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        .hero-float-card {
          position: absolute;
          width: 220px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 2px 8px rgba(212,160,60,0.25);
          animation: floatDrift linear infinite;
          border: 2px solid rgba(212,160,60,0.35);
          z-index: 5;
          transition: box-shadow 0.3s ease;
        }
        .hero-float-card:hover {
          box-shadow: 0 24px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(212,160,60,0.45);
          z-index: 10;
        }
        .hero-float-card img {
          width: 100%;
          height: 155px;
          object-fit: cover;
          display: block;
        }
        .hero-float-label {
          background: rgba(12,6,2,0.80);
          backdrop-filter: blur(8px);
          padding: 7px 12px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #D4A03C;
          border-top: 1px solid rgba(212,160,60,0.22);
        }
        .hero-content {
          animation: heroFadeUp 0.9s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        .btn-browse {
          background: linear-gradient(135deg, #E04038 0%, #c0312a 100%);
          color: white;
          padding: 14px 36px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
          box-shadow: 0 6px 24px rgba(224,64,56,0.45);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-browse:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 32px rgba(224,64,56,0.55);
        }
        .btn-browse:active { transform: scale(0.99); }
        .btn-organize {
          border: 2px solid rgba(212,160,60,0.80);
          color: #f0c97a;
          background: rgba(212,160,60,0.10);
          padding: 13px 34px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 16px;
          letter-spacing: 0.02em;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(6px);
        }
        .btn-organize:hover {
          background: rgba(212,160,60,0.20);
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 6px 20px rgba(212,160,60,0.35);
        }
        .btn-organize:active { transform: scale(0.99); }
        .payment-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(212,160,60,0.35);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.90);
          backdrop-filter: blur(10px);
          animation: badgePop 0.6s cubic-bezier(0.2,0.8,0.2,1) both;
          white-space: nowrap;
        }
        .gold-divider {
          width: 100px;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(212,160,60,0.70), transparent);
        }
        .cross-motif {
          display: inline-block;
          position: relative;
          width: 18px;
          height: 18px;
        }
        .cross-motif::before {
          content: '';
          position: absolute;
          top: 50%; left: 0;
          width: 100%; height: 2.5px;
          background: rgba(212,160,60,0.70);
          border-radius: 2px;
          transform: translateY(-50%);
        }
        .cross-motif::after {
          content: '';
          position: absolute;
          left: 50%; top: 0;
          height: 100%; width: 2.5px;
          background: rgba(212,160,60,0.70);
          border-radius: 2px;
          transform: translateX(-50%);
        }
      `}</style>

      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden"
        aria-label="Discover the Pulse of Addis"
      >
        {/* Cycling full-bleed background */}
        <BackgroundSlideshow images={ALL_IMAGES} intervalMs={6000} />

        {/* Gold cross-pattern overlay */}
        <CrossPattern />

        {/* 3 independently cycling floating cards */}
        {CARD_LAYOUT.map((layout, i) => (
          <FloatingCard
            key={i}
            pool={CARD_POOLS[i]}
            layout={layout}
            intervalMs={5000}
            startDelay={i * 1600}
          />
        ))}

        {/* Central content */}
        <div className="hero-content relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-5" style={{ color: "#D4A03C" }}>
            Addis Ababa&apos;s Event Hub
          </p>

          <h1
            className="font-heading font-extrabold leading-[1.12] mb-5 text-white"
            style={{ fontSize: "clamp(2.6rem, 6vw, 4.2rem)", letterSpacing: "-0.02em" }}
          >
            Discover the Pulse of{" "}
            <span style={{ color: "#E04038" }}>Addis</span>
          </h1>

          <p className="text-base md:text-lg leading-relaxed mb-3 max-w-xl" style={{ color: "rgba(255,255,255,0.78)" }}>
            Find events you love, pay with local methods, and get your ticket
            straight to your phone {" "}
            <strong style={{ color: "rgba(255,255,255,0.95)" }}>no app required</strong>.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PAYMENT_BADGES.map((b, i) => (
              <span key={b.label} className="payment-badge" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                {b.icon}
                {b.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/events" id="hero-browse-events-btn" className="btn-browse">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Browse Events
            </Link>

            <Link href="/organize" id="hero-organize-event-btn" className="btn-organize">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Organize Your Event
            </Link>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-3 z-10" aria-hidden="true">
          <div className="flex items-center gap-4">
            <div className="gold-divider" />
            <span className="cross-motif" />
            <div className="gold-divider" />
          </div>
          <div className="flex flex-col items-center gap-1" style={{ color: "rgba(212,160,60,0.60)" }}>
            <span className="text-[10px] tracking-widest uppercase font-semibold">Scroll</span>
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 animate-bounce" aria-hidden="true">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
