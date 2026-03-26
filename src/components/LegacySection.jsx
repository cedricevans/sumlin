
import React from 'react';
import SmoothScroller from '@/components/SmoothScroller';

const LegacySection = () => {
  return (
    <section className="section-spacing bg-[hsl(var(--warm-cream))]/40 dark:bg-background relative overflow-hidden">
      {/* Subtle background pattern/texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
      
      <div className="container-custom relative z-10">
        <SmoothScroller>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[hsl(var(--legacy-blue))] dark:text-foreground">
              Our Legacy
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the rich history and heritage of the Sumlin family
            </p>
            <div className="w-24 h-1 gradient-gold mx-auto mt-8 rounded-full opacity-80"></div>
          </div>
        </SmoothScroller>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Card 1: Our Crest */}
          <SmoothScroller delay={0.1}>
            <div className="legacy-card group">
              <div className="legacy-card-image-wrapper">
                <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--legacy-blue))]/5 to-transparent opacity-50"></div>
                <img 
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/598e50a4e99a46765f00762889ff45da.jpg" 
                  alt="Modern Sumlin family crest featuring crossed swords, castle towers, and a lion emblem" 
                  className="legacy-card-image rounded-xl mix-blend-multiply dark:mix-blend-normal"
                />
              </div>
              <div className="legacy-card-content">
                <h3 className="legacy-card-title">Our Crest</h3>
                <p className="legacy-card-text">
                  The Sumlin family crest represents centuries of heritage, strength, and unity. The crossed swords symbolize courage and protection, while the castle towers represent our enduring legacy and foundation. The lion emblem stands for nobility and pride in our family name.
                </p>
              </div>
            </div>
          </SmoothScroller>

          {/* Card 2: Our History */}
          <SmoothScroller delay={0.3}>
            <div className="legacy-card group">
              <div className="legacy-card-image-wrapper">
                <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--legacy-gold))]/10 to-transparent opacity-50"></div>
                <img 
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/daef4ebf432945202e3e81d58b72723e.png" 
                  alt="Vintage Sumlin family crest illustrating our ancestral roots" 
                  className="legacy-card-image drop-shadow-2xl"
                />
              </div>
              <div className="legacy-card-content">
                <h3 className="legacy-card-title">Our History</h3>
                <p className="legacy-card-text">
                  The Sumlin family has a rich and storied past spanning generations. From our ancestral roots to the present day, we have maintained strong family bonds, cultural traditions, and values that define who we are. This legacy continues to guide us as we gather, celebrate, and honor those who came before us.
                </p>
              </div>
            </div>
          </SmoothScroller>
        </div>
      </div>
    </section>
  );
};

export default LegacySection;
