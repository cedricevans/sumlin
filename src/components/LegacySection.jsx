
import React from 'react';
import SmoothScroller from '@/components/SmoothScroller';

const LegacySection = () => {
  return (
    <section className="py-10 md:py-14 bg-stone-900">
      <div className="container-custom">

        {/* Heading */}
        <SmoothScroller>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-3 w-full text-center block">
              Heritage &amp; Identity
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Our Legacy
            </h2>
            <p className="text-base text-stone-400 max-w-2xl mx-auto">
              Discover the rich history and heritage of the Sumlin family
            </p>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto mt-4" />
          </div>
        </SmoothScroller>

        {/* Three panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

          {/* Our Crest */}
          <SmoothScroller delay={0.1}>
            <div className="group rounded-2xl overflow-hidden border border-white/10 bg-stone-800 hover:border-amber-700/40 transition-colors duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden bg-stone-950" style={{ height: '280px' }}>
                <img
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/598e50a4e99a46765f00762889ff45da.jpg"
                  alt="Modern Sumlin family crest featuring crossed swords, castle towers, and a lion emblem"
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-amber-500" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">Our Crest</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  The Sumlin family crest represents centuries of heritage, strength, and unity.
                  The crossed swords symbolize courage and protection, while the castle towers
                  represent our enduring legacy and foundation. The lion emblem stands for
                  nobility and pride in our family name.
                </p>
              </div>
            </div>
          </SmoothScroller>

          {/* Mark & Lydia — center panel */}
          <SmoothScroller delay={0.15}>
            <div className="group rounded-2xl overflow-hidden border border-white/10 bg-stone-800 hover:border-amber-700/40 transition-colors duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden bg-stone-950" style={{ height: '280px' }}>
                <img
                  src="/Mark_Lydia.png"
                  alt="Mark and Lydia Sumlin"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-amber-500" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">The Sumlin Family Patriarch &amp; Matriarch</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  Mark &amp; LydiaSumlin married 1880 in Rivertown, Georgia. The roots of our
                  family tree, united in faith and legacy.
                </p>
              </div>
            </div>
          </SmoothScroller>

          {/* Our History */}
          <SmoothScroller delay={0.2}>
            <div className="group rounded-2xl overflow-hidden border border-white/10 bg-stone-800 hover:border-amber-700/40 transition-colors duration-300 h-full flex flex-col">
              <div className="relative overflow-hidden bg-stone-950" style={{ height: '280px' }}>
                <img
                  src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/daef4ebf432945202e3e81d58b72723e.png"
                  alt="Vintage Sumlin family crest illustrating our ancestral roots"
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-amber-500" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wide">Our History</h3>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  The Sumlin family has a rich and storied past spanning generations. From our
                  ancestral roots to the present day, we have maintained strong family bonds,
                  cultural traditions, and values that define who we are. This legacy continues
                  to guide us as we gather, celebrate, and honor those who came before us.
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
