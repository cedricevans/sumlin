
import React from 'react';
import { Helmet } from 'react-helmet';
import ParallaxHero from '@/components/ParallaxHero';
import SmoothScroller from '@/components/SmoothScroller';
import { FAMILY_REUNION_DETAILS } from '@/lib/sumlinData';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Reunion2026Page = () => {
  const eventDetails = [
    {
      icon: Calendar,
      title: 'Dates',
      detail: FAMILY_REUNION_DETAILS.dateRangeLabel,
      description: 'Mark your calendars for reunion weekend'
    },
    {
      icon: MapPin,
      title: 'Location',
      detail: FAMILY_REUNION_DETAILS.locationLabel,
      description: 'Dayton will host the 2026 family gathering'
    },
    {
      icon: Clock,
      title: 'Registration',
      detail: 'Coming Soon',
      description: 'Registration details will be shared on the site as soon as they are ready'
    },
    {
      icon: Users,
      title: 'Expected attendance',
      detail: '200+ family members',
      description: 'Generations coming together in celebration'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Reunion 2026 - Sumlin Family Reunion</title>
        <meta name="description" content="Join us for the Sumlin Family Reunion 2026. A weekend celebration of faith, family, and heritage with activities for all ages." />
      </Helmet>

      <ParallaxHero
        backgroundImage="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/b21b2d1ea8690c7803645629877d22a3.jpg"
        title="Reunion 2026"
        tagline="A celebration of family, faith, and togetherness"
        ctaText="Purchase Ticket"
        ctaLink="/family-legacy"
      />

      <section className="section-spacing bg-background">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join us for an unforgettable weekend</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The Sumlin Family Reunion 2026 will be a milestone celebration bringing together family members from across the country. This is more than an event it's a homecoming, a celebration of our shared heritage, and an opportunity to strengthen the bonds that unite us.
              </p>
              <p className="text-base text-primary font-semibold mt-4">
                {FAMILY_REUNION_DETAILS.registrationLabel}
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {eventDetails.map((detail, index) => (
              <SmoothScroller key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mb-6">
                    <detail.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-sm uppercase tracking-wide text-muted-foreground mb-2">{detail.title}</h3>
                  <p className="text-2xl font-bold mb-2">{detail.detail}</p>
                  <p className="text-muted-foreground">{detail.description}</p>
                </div>
              </SmoothScroller>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <SmoothScroller direction="left">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">What to expect</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Family activities</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Enjoy a full schedule of activities designed for all ages, from children's games to adult workshops, ensuring everyone has a memorable experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Shared meals</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Break bread together with catered meals featuring family favorites and traditional dishes that celebrate our culinary heritage.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Entertainment</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Live music, talent shows, and performances showcasing the incredible gifts within our family community.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Raffle drawings</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The highlight of the weekend our raffle drawing where lucky winners will take home amazing gift baskets.
                    </p>
                  </div>
                </div>
              </div>
            </SmoothScroller>

            <SmoothScroller direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 gradient-burgundy rounded-2xl blur-3xl opacity-20" />
                <div className="relative bg-card rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6">Weekend schedule</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl gradient-gold flex items-center justify-center text-foreground font-bold flex-shrink-0">
                        Day 1
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Welcome reception</span>
                        <p className="text-sm text-muted-foreground">Registration, meet and greet, opening ceremony</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl gradient-burgundy flex items-center justify-center text-white font-bold flex-shrink-0">
                        Day 2
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Main celebration</span>
                        <p className="text-sm text-muted-foreground">Activities, meals, entertainment, raffle drawing</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl gradient-gold flex items-center justify-center text-foreground font-bold flex-shrink-0">
                        Day 3
                      </div>
                      <div>
                        <span className="font-semibold block mb-1">Farewell brunch</span>
                        <p className="text-sm text-muted-foreground">Final gathering, group photos, closing remarks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SmoothScroller>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-background">
        <div className="container-custom text-center">
          <SmoothScroller>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Be part of the celebration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Don't miss this opportunity to reconnect with family, create new memories, and celebrate our shared legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/family-legacy"
                className="inline-block gradient-gold text-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98]"
              >
                Purchase Ticket
              </a>
              <a
                href="/events"
                className="inline-block bg-muted text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-muted/80 hover:scale-105 transition-all duration-200 active:scale-[0.98]"
              >
                View family calendar
              </a>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default Reunion2026Page;
