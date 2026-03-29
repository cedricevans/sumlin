import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';
import ContactSection from '@/components/ContactSection';
import { Calendar, DollarSign, Trophy, Shield, Castle, Sword, Crown, Users } from 'lucide-react';

const boardMembers = [
  { name: 'Michael C.', position: 'President', image: '/Michael C - President.png', rotate: 90 },
  { name: 'Debi', position: 'Owner', image: '/debi.png' },
  { name: 'David', position: 'Officer / Treasurer', image: '/David Officer-Treasurer.png' },
  { name: 'Ronika Sumlin', position: 'Secretary', image: '/Ronika Sumlin-Secretary.png', rotate: 90 },
  { name: 'Peggy W.', position: 'Co-Treasurer', image: '/Peggy W - Co Treasure.png' },
  { name: 'Carrie', position: 'Historian', image: '/Carrie - Historian.png' },
  { name: 'Nia P.', position: 'Historian Assistant', image: '/Nia P - Historian Assistant.png' },
];

const FamilyLegacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Family Legacy | Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Learn the meaning behind the Sumlin Family crest and support the reunion through our family fundraiser."
        />
      </Helmet>

      <ParallaxHero
        backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
        title="Our Family Legacy"
        tagline="Honoring our roots, protecting our name, building what lasts"
        height="min-h-[70vh]"
      />

      <section className="section-spacing bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <SmoothScroller direction="left">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">The Sumlin Family Crest</h2>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  The Sumlin crest reflects our family&apos;s strength, protection, and enduring pride.
                  Rooted in heritage and carried forward through generations, it stands as a symbol of
                  identity, resilience, and legacy.
                </p>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Every part of the crest carries meaning. The banner honors our roots. The leopard
                  speaks to courage, leadership, and strength. The axes, helmet, and swords represent
                  honor and protection. Within the shield, the Old English S marks the Sumlin name,
                  while the castles point to stability, endurance, and the safeguarding of home.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block mb-1">Identity</span>
                      <p className="text-muted-foreground text-sm">
                        The Old English S carries the Sumlin name with pride, memory, and belonging.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-burgundy flex items-center justify-center flex-shrink-0">
                      <Castle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block mb-1">Strength</span>
                      <p className="text-muted-foreground text-sm">
                        The castles stand for stability, protection, and a foundation built to last.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                      <Sword className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block mb-1">Honor</span>
                      <p className="text-muted-foreground text-sm">
                        The swords, axes, and helmet reflect courage, resilience, and the duty to protect what matters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SmoothScroller>

            <SmoothScroller direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 gradient-burgundy rounded-2xl blur-3xl opacity-20" />
                <img
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
                  alt="Sumlin Family Crest representing identity, strength, and legacy"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      {/* Reunion Board Section */}
      <section className="section-spacing bg-muted/50" id="reunion-board">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary mb-6">
                <Users className="w-4 h-4" />
                Meet the Board
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Family Board Members</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The dedicated family members who plan, organize, and bring our reunion together every year.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {boardMembers.map((member, index) => (
              <SmoothScroller key={member.name} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-rose-950/20 to-amber-950/20">
                      <img
                        src={member.image}
                        alt={`${member.name} - ${member.position}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={member.rotate ? { transform: `rotate(${member.rotate}deg) scale(1.5)` } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {index === 0 && (
                        <div className="absolute top-3 right-3">
                          <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                            <Crown className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-lg text-foreground leading-tight">{member.name}</h3>
                      <p className="text-sm text-primary font-semibold mt-1">{member.position}</p>
                    </div>
                  </div>
                </motion.div>
              </SmoothScroller>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-muted">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The 25-Ticket Challenge</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Support the Sumlin Family Reunion through our fundraiser baskets. Every entry helps
                support the gathering and the memories we are building together.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <SmoothScroller delay={0.1}>
              <div className="bg-card rounded-2xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">$1 Per Entry</h3>
                <p className="text-muted-foreground text-sm">
                  A simple way for family and friends to join in
                </p>
              </div>
            </SmoothScroller>

            <SmoothScroller delay={0.2}>
              <div className="bg-card rounded-2xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 rounded-xl gradient-burgundy flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">May 2 Deadline</h3>
                <p className="text-muted-foreground text-sm">
                  Be sure to enter before the deadline
                </p>
              </div>
            </SmoothScroller>

            <SmoothScroller delay={0.3}>
              <div className="bg-card rounded-2xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">May 9 Drawing</h3>
                <p className="text-muted-foreground text-sm">
                  Winners will be announced with the family
                </p>
              </div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background" id="fundraiser-baskets">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Support Our Family Legacy</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose your fundraiser basket entries below. Every entry supports the 2026 reunion
                and helps carry the family legacy forward.
              </p>
            </div>
          </SmoothScroller>

          <ProductsList />
        </div>
      </section>

      <ContactSection />
    </>
  );
};

export default FamilyLegacyPage;
