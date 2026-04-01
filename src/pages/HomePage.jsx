
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
import { Calendar, Users, Heart, Gift, TreePine, ShoppingBag, Star, Sparkles, Award } from 'lucide-react';

const HomePage = () => {

  return (
    <>
      <Helmet>
        <title>Sumlin Family Reunion 2026 - Rooted in Faith, United in Legacy</title>
        <meta name="description" content="Join the Sumlin Family Reunion 2026. Celebrate our heritage, participate in raffle drawings, and create lasting memories with family." />
      </Helmet>

      {/* Enhanced Hero with Dynamic Overlay */}
      <div className="relative">
        <ParallaxHero
          backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/bc40c07d60cdf4a592ad526b10aeddb5.png"
          title="Sumlin Family Reunion 2026"
          tagline="Rooted in Faith, United in Legacy"
          ctaText="Support the Reunion"
          ctaLink="/store"
          overlayOpacity={0.5}
        />
        
        {/* Floating Icons Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-[10%] text-white/20"
          >
            <Heart className="w-16 h-16" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/3 right-[15%] text-white/20"
          >
            <Star className="w-20 h-20" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-1/3 left-[20%] text-white/20"
          >
            <Sparkles className="w-14 h-14" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 25, 0],
              rotate: [0, -8, 0]
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-[60%] right-[8%] text-white/20"
          >
            <Award className="w-16 h-16" />
          </motion.div>
        </div>
      </div>

      {/* Countdown Section with Nature Background */}
      <section className="py-3 md:py-4 lg:py-6 relative overflow-hidden shadow-inner">
        {/* Trees background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80')"}}></div>
        {/* Light overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/75 to-rose-50/80"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        
        {/* Subtle animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-gradient-to-br from-rose-950/20 to-red-950/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.25, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gradient-to-br from-amber-950/20 to-orange-950/20 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <SmoothScroller>
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-3"
              >
                <TreePine className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              </motion.div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-stone-900 mb-4 tracking-wide">
                Countdown to Reunion 2026
              </h2>
              <div className="countdown-compact w-full max-w-4xl mx-auto">
                <CountdownTimer />
              </div>
              <div className="mt-5 space-y-2 text-stone-700">
                <p className="text-base md:text-lg font-semibold">
                  2026 Reunion Dates: {FAMILY_REUNION_DETAILS.dateRangeLabel}
                </p>
                <p className="text-sm md:text-base uppercase tracking-[0.2em] text-amber-700 font-semibold">
                  {FAMILY_REUNION_DETAILS.locationLabel}
                </p>
                <p className="text-sm md:text-base text-stone-500">
                  {FAMILY_REUNION_DETAILS.registrationLabel}
                </p>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>

      {/* Family Tree Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Deep heritage background */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-rose-950 to-amber-950"></div>
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&q=80')", backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        {/* Soft inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>

        <div className="container-custom relative z-10">
          <SmoothScroller>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <div className="flex items-center gap-2 bg-gradient-to-r from-rose-950 via-red-950 to-amber-950 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <TreePine className="w-4 h-4" />
                  <span>Discover Our Family</span>
                  <Heart className="w-4 h-4" />
                </div>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                Welcome to our family
              </h2>
              <p className="text-lg text-stone-300 max-w-2xl mx-auto">
                The Sumlin Family Reunion is more than an event it's a celebration of our shared heritage, faith, and the bonds that unite us across generations.
              </p>
            </div>
          </SmoothScroller>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/40 p-6 md:p-10 border border-white/20">
            <FamilyTreePreview />
          </div>
        </div>
      </section>



      {/* New Legacy Section */}
      <LegacySection />

      {/* Enhanced 25-Ticket Challenge Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Nature/wood background with earth tones */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1600&q=80')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-amber-50/70 to-rose-100/50"></div>
          <motion.div
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-rose-950/10 to-red-950/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SmoothScroller direction="left">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="mb-4"
                >
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-950 to-amber-950 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    <Gift className="w-4 h-4" />
                    Fundraiser Event
                  </span>
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-rose-950 to-amber-950 bg-clip-text text-transparent">
                  The 25-ticket challenge
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Support our family reunion through basket entries, shared giving, and the excitement of celebrating together as drawing day gets closer.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    { text: "Men's BBQ Basket - Perfect for the grill master", gradient: "from-amber-950 to-orange-950" },
                    { text: "Women's Spa Basket - Relaxation and self-care essentials", gradient: "from-rose-950 to-red-950" },
                    { text: "Children's Fun Basket - Games, toys, and activities", gradient: "from-green-950 to-emerald-950" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 group"
                    >
                      <span className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                        ✓
                      </span>
                      <span className="pt-1">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/store"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-950 via-red-950 to-amber-950 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Support the fundraiser
                  </Link>
                </motion.div>
              </div>
            </SmoothScroller>

            <SmoothScroller direction="right" delay={0.2}>
              <motion.div
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                {/* Subtle earth tone glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-rose-950 via-red-950 to-amber-950 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                
                {/* Image container */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/image-7-KlQC4.png"
                    alt="Sumlin Family Crest representing our heritage and values"
                    className="relative w-full"
                  />
                  
                  {/* Subtle shimmer effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </div>
              </motion.div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-custom text-center">
          <SmoothScroller>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join us in 2026</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Be part of a celebration that honors our past, celebrates our present, and builds our future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/store"
                className="inline-block gradient-gold text-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98]"
              >
                Support the fundraiser
              </Link>
              <Link
                to="/family-business"
                className="inline-block bg-muted text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-muted/80 hover:scale-105 transition-all duration-200 active:scale-[0.98]"
              >
                Open family business
              </Link>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default HomePage;
