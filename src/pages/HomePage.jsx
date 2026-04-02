
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import CountdownTimer from '@/components/CountdownTimer';
import LegacySection from '@/components/LegacySection';
import FamilyTreePreview from '@/components/FamilyTreePreview';
import { FAMILY_REUNION_DETAILS } from '@/lib/sumlinData';
import { TreePine, Gift, ShoppingBag } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Sumlin Family Reunion 2026 - Rooted in Faith, United in Legacy</title>
        <meta name="description" content="Join the Sumlin Family Reunion 2026. Celebrate our heritage, participate in raffle drawings, and create lasting memories with family." />
      </Helmet>

      {/* Hero */}
      <ParallaxHero
        backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/bc40c07d60cdf4a592ad526b10aeddb5.png"
        title="Sumlin Family Reunion 2026"
        tagline="Rooted in Faith, United in Legacy"
        ctaText="Support the Reunion"
        ctaLink="/store"
        overlayOpacity={0.5}
      />

      {/* Countdown — slim strip */}
      <section className="bg-stone-900 py-8 md:py-10">
        <div className="container-custom">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-widest">
              <TreePine className="w-4 h-4" />
              Countdown to Reunion 2026
            </div>
            <CountdownTimer />
            <div className="space-y-1 text-stone-400 text-sm">
              <p className="text-stone-200 font-semibold">
                {FAMILY_REUNION_DETAILS.dateRangeLabel} · {FAMILY_REUNION_DETAILS.locationLabel}
              </p>
              <p>{FAMILY_REUNION_DETAILS.registrationLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Family Tree — warm light background */}
      <section className="section-spacing bg-[hsl(var(--warm-cream))]/40">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-14">
<h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
                Our Family Tree
              </h2>
              <p className="text-lg text-stone-500 max-w-2xl mx-auto">
                The Sumlin family spans seven generations — rooted in faith, bound by love,
                and growing still.
              </p>
              <div className="w-16 h-0.5 bg-amber-700 mx-auto mt-6 opacity-60" />
            </div>
          </SmoothScroller>

          <FamilyTreePreview />
        </div>
      </section>

      {/* Legacy — crest + history cards */}
      <LegacySection />

      {/* Fundraiser */}
      <section className="section-spacing bg-stone-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SmoothScroller direction="left">
              <div>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-950 to-amber-950 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
                  <Gift className="w-4 h-4" />
                  Fundraiser Event
                </span>

                <h2 className="text-4xl md:text-5xl font-bold mb-5 text-stone-900">
                  The 25-Ticket Challenge
                </h2>

                <p className="text-lg text-stone-500 mb-6 leading-relaxed">
                  Support our family reunion through basket entries, shared giving, and the
                  excitement of celebrating together as drawing day gets closer.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Men's BBQ Basket — Perfect for the grill master",
                    "Women's Spa Basket — Relaxation and self-care essentials",
                    "Children's Fun Basket — Games, toys, and activities",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-900 to-amber-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className="text-stone-600">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-950 to-amber-950 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Support the fundraiser
                </Link>
              </div>
            </SmoothScroller>

            <SmoothScroller direction="right" delay={0.2}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/image-7-KlQC4.png"
                  alt="Sumlin Family fundraiser baskets"
                  className="w-full"
                />
              </div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="section-spacing bg-gradient-to-br from-rose-950 to-amber-950 text-white text-center">
        <div className="container-custom">
          <SmoothScroller>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300 mb-4">
              September 2026 · Dayton, OH
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-5">Join Us in 2026</h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
              Be part of a celebration that honors our past, celebrates our present,
              and builds our future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/store"
                className="inline-block bg-amber-400 text-stone-900 px-8 py-3 rounded-xl font-semibold hover:bg-amber-300 transition-colors duration-200"
              >
                Support the fundraiser
              </Link>
              <Link
                to="/family-business"
                className="inline-block bg-white/10 border border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors duration-200"
              >
                Family Business
              </Link>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default HomePage;
