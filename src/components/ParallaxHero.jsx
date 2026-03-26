import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const ParallaxHero = ({ 
  backgroundImage, 
  title, 
  tagline, 
  ctaText, 
  ctaLink = '#',
  overlayOpacity = 0.6,
  height = 'min-h-screen'
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={ref} className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 container-custom text-center text-white"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance"
        >
          {title}
        </motion.h1>
        
        {tagline && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl mb-10 text-balance max-w-3xl mx-auto font-light"
          >
            {tagline}
          </motion.p>
        )}
        
        {ctaText && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link 
              to={ctaLink}
              className="inline-block gradient-gold text-foreground px-10 py-4 rounded-xl text-lg font-semibold hover:shadow-gold hover:scale-105 transition-all duration-200 active:scale-[0.98]"
            >
              {ctaText}
            </Link>
          </motion.div>
        )}
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/80"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default ParallaxHero;