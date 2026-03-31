
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SmoothScroller from '@/components/SmoothScroller';
import ProductsList from '@/components/ProductsList';

const fundraiserHighlights = [
  {
    title: 'Household goal',
    description: 'Each household is encouraged to sell at least 25 tickets or make a $25 donation to support reunion weekend.',
  },
  {
    title: 'Honor a loved one',
    description: 'A $25 donation may be given in memory of or in honor of a loved one or family member.',
  },
  {
    title: 'Direct reunion support',
    description: 'All donations go directly to support the Sumlin Family Reunion and the shared needs of the family gathering.',
  },
];

const StorePage = ({ setIsCartOpen }) => {
  return (
    <>
      <Helmet>
        <title>Fundraiser - Sumlin Family Reunion Support</title>
        <meta name="description" content="Support the Sumlin Family Reunion fundraiser, explore basket options, and review the official entry rules." />
      </Helmet>

      <section className="section-spacing bg-background pt-24 md:pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[48rem] rounded-full bg-yellow-200/20 blur-3xl" />
          <div className="absolute top-40 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <SmoothScroller>
            <div className="text-center mb-12 max-w-5xl mx-auto">
              <p className="text-sm uppercase tracking-[0.28em] text-primary font-semibold mb-4">Sumlin Family Fundraiser</p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Support the family fundraiser</h1>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Each household is encouraged to sell 25 tickets or donate $25 in support of the Sumlin Family Reunion.
                </p>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.05}>
            <div className="max-w-6xl mx-auto mb-10 rounded-[2rem] border border-yellow-300/80 bg-gradient-to-br from-yellow-50 via-amber-50 to-white shadow-[0_24px_80px_-40px_rgba(120,53,15,0.45)] overflow-hidden">
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
                <div className="p-7 md:p-10 lg:p-12">
                  <p className="text-sm uppercase tracking-[0.24em] text-yellow-900 font-semibold mb-4">Family household goal</p>
                  <h2 className="text-3xl md:text-5xl font-bold text-yellow-950 leading-tight mb-5 text-balance">
                    Sell 25 tickets minimum or donate $25
                  </h2>
                  <div className="space-y-4 max-w-2xl">
                    <p className="text-base md:text-lg text-yellow-950/90 leading-relaxed">
                      Each household is encouraged to help in one of these two ways as we prepare for reunion weekend.
                    </p>
                    <p className="text-base md:text-lg text-yellow-900/85 leading-relaxed">
                      Donations may be made in memory of or in honor of a loved one or family member, and every donation goes directly to support the Sumlin Family Reunion.
                    </p>
                    <p className="text-sm font-medium text-yellow-900/80">
                      Thank you for supporting the family goal and helping us keep the reunion strong.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Option one</p>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Sell raffle tickets</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Support the fundraiser by choosing a basket and helping your household reach the 25-ticket goal.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-yellow-200 bg-white/80 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2">Option two</p>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Make a memorial donation</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Give $25 in memory of or in honor of a loved one or family member if that is the better fit for your household.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-yellow-900 via-yellow-950 to-neutral-950 p-7 md:p-8 lg:p-10 text-white flex flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-yellow-200 font-semibold mb-4">Quick access</p>
                    <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">Choose the path that works best for your household</h3>
                    <div className="space-y-3 text-sm md:text-base text-yellow-50/85 leading-relaxed">
                      <p>View baskets if your household is ready to support the fundraiser through ticket sales.</p>
                      <p>Use the donation button if you want to give $25 in memory of or in honor of someone special.</p>
                      <p>Read the official rules for current fundraiser guidance, payment details, and family participation notes.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-8">
                    <a
                      href="#basket-options"
                      className="inline-flex items-center justify-center gradient-burgundy text-white px-5 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
                    >
                      View baskets
                    </a>
                    <Link
                      to="/donate"
                      className="inline-flex items-center justify-center gradient-gold text-foreground px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Donate $25
                    </Link>
                    <Link
                      to="/fundraiser-rules"
                      className="inline-flex items-center justify-center bg-white text-yellow-950 border border-white/60 px-5 py-3 rounded-xl font-semibold transition-all duration-200"
                    >
                      Read official rules
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.15}>
            <div className="max-w-6xl mx-auto mb-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-5">
              <div className="rounded-3xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
                <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-3">Before you enter</p>
                <h3 className="text-2xl font-bold mb-3">Official rules still apply</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Please review the current fundraiser guidance before you purchase tickets or make a support donation.
                </p>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold">Important notice</p>
                    <p className="text-base md:text-lg leading-relaxed">
                      Please review the official rules before you enter so the family fundraiser stays clear and fair for everyone.
                    </p>
                  </div>
                  <Link
                    to="/fundraiser-rules"
                    className="inline-flex items-center justify-center gradient-burgundy text-white px-6 py-3 rounded-xl font-semibold hover:shadow-burgundy transition-all duration-200"
                  >
                    Read official rules
                  </Link>
                </div>
              </div>
            </div>
          </SmoothScroller>

          <SmoothScroller delay={0.2}>
            <div className="grid md:grid-cols-3 gap-5 mb-14 max-w-6xl mx-auto">
              {fundraiserHighlights.map((item) => (
                <div key={item.title} className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 gradient-gold" />
                  <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold mb-3">{item.title}</p>
                  <p className="text-base text-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </SmoothScroller>

          <div id="basket-options" className="mb-16 max-w-6xl mx-auto">
            <div className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-6 md:p-8 lg:p-10 shadow-sm">
              <div className="text-center mb-8 max-w-3xl mx-auto">
                <p className="text-sm uppercase tracking-[0.22em] text-primary font-semibold mb-3">Fundraiser baskets</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose your basket</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If your household is supporting the fundraiser through ticket sales, start here. The basket buttons and store links below remain the same.
                </p>
              </div>
              <ProductsList setIsCartOpen={setIsCartOpen} />
            </div>
          </div>

          <SmoothScroller delay={0.4}>
            <div className="mt-16 text-center">
              <div className="bg-muted rounded-3xl p-8 max-w-2xl mx-auto border border-border/50 shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Need help?</h3>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>If you have questions about fundraiser baskets, entry options, or reunion support, the family can help.</p>
                  <p>Please contact a family organizer listed in the footer or visit the Business Corner page for more planning information.</p>
                </div>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default StorePage;
