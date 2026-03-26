import React from 'react';
import { Helmet } from 'react-helmet';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';
import ContactSection from '@/components/ContactSection';
import { Calendar, DollarSign, Trophy, Shield, Castle, Sword } from 'lucide-react';

const FamilyLegacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Family Legacy | Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Learn the meaning behind the Sumlin Family crest and support the reunion through our family raffle challenge."
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
                  This crest represents the Sumlin family’s strength, protection, and ancestral pride.
                  Rooted in Nigerian heritage and carried through the African American experience,
                  it stands as a symbol of origin, resilience, and legacy.
                </p>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  The banner honors family roots. The leopard reflects courage, leadership, and
                  noble strength. The axes, helmet, and swords represent honor and defense. Within
                  the shield, the Old English S stands for the Sumlin name, the castles reflect
                  stability and endurance, and the final symbol points to order and the protection
                  of the family house.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <span className="font-semibold text-lg block mb-1">Identity</span>
                      <p className="text-muted-foreground text-sm">
                        The Old English S marks the Sumlin name with pride, memory, and family identity.
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
                        The castles stand for stability, protection, and a legacy built to last.
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
                        The swords, axes, and helmet represent courage, resilience, and the duty to defend family legacy.
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

      <section className="section-spacing bg-muted">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">The 25-Ticket Challenge</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Support the Sumlin Family Reunion by purchasing raffle tickets. Every ticket helps
                support the family gathering, family efforts, and the legacy we are building together.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <SmoothScroller delay={0.1}>
              <div className="bg-card rounded-2xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">$1 Per Ticket</h3>
                <p className="text-muted-foreground text-sm">
                  A simple way for everyone in the family to contribute
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
                  Purchase your tickets before the deadline
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
                  Winners will be announced during the reunion
                </p>
              </div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background" id="raffle-baskets">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Support Our Family Legacy</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Purchase your raffle tickets below. Every ticket supports the 2026 reunion and helps
                move the family legacy forward.
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