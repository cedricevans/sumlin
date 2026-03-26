import React from 'react';
import { Helmet } from 'react-helmet';
import SmoothScroller from '@/components/SmoothScroller';
import { Camera, Users, Heart, Image } from 'lucide-react';

const FamilyPortraitsPage = () => {
  const portraitSessions = [
    {
      title: 'Individual family portraits',
      description: 'Professional photos of your immediate family to treasure for generations.',
      icon: Users
    },
    {
      title: 'Multi-generational photos',
      description: 'Capture the beauty of multiple generations together in one frame.',
      icon: Heart
    },
    {
      title: 'Candid moments',
      description: 'Natural, spontaneous shots that capture the joy of the reunion.',
      icon: Camera
    },
    {
      title: 'Group photos',
      description: 'Large family group shots with everyone together.',
      icon: Image
    }
  ];

  return (
    <>
      <Helmet>
        <title>Family Portraits - Sumlin Family Reunion 2026</title>
        <meta
          name="description"
          content="Professional family portrait sessions at the Sumlin Family Reunion. Capture precious memories with multi-generational photos and candid moments."
        />
      </Helmet>

      <section className="section-spacing bg-background pt-32">
        <div className="container-custom">
          <SmoothScroller>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">Family portraits</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Preserve precious memories with professional family portrait sessions. Capture the love, laughter, and legacy of the Sumlin Family Reunion 2026.
              </p>
            </div>
          </SmoothScroller>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {portraitSessions.map((session, index) => (
              <SmoothScroller key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-xl gradient-gold flex items-center justify-center mb-6">
                    <session.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{session.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{session.description}</p>
                </div>
              </SmoothScroller>
            ))}
          </div>

          <SmoothScroller delay={0.4}>
            <div className="bg-muted rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">Book your portrait session</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Professional photographers will be available throughout the reunion weekend. Sessions are complimentary for all registered attendees. Sign up early to secure your preferred time slot.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/family-legacy"
                  className="inline-block gradient-gold text-foreground px-8 py-3 rounded-xl font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98]"
                >
                  Register for reunion
                </a>
                <a
                  href="/contact"
                  className="inline-block bg-card text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-card/80 hover:scale-105 transition-all duration-200 active:scale-[0.98]"
                >
                  Contact us
                </a>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </section>
    </>
  );
};

export default FamilyPortraitsPage;