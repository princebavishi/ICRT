import React from 'react';
import { motion } from 'framer-motion';
import { EASINGS, VIEWPORT_CONFIG } from '../motionVariants';

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ duration: 0.5, ease: EASINGS.materialEntrance }}
      className="relative mb-6 p-4 sm:p-7 lg:p-8 rounded-card border border-border bg-surface bg-noise-subtle overflow-hidden"
    >
      <div className="max-w-4xl 2xl:max-w-5xl relative z-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-btn text-[11px] sm:text-xs font-medium bg-white border border-border text-text-secondary mb-2.5 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>NSE &amp; BSE Corporate Energy Transition Intelligence</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-bold tracking-tight text-text-primary mb-2 sm:mb-2.5">
          5,461 Indian Listed Companies: Clean Energy Adoption &amp; Returns Terminal
        </h1>
        
        <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-text-secondary leading-relaxed">
          Extracted live from Screener.in's All Listed Companies across all 219 pages. Covering Large Caps, Mid Caps, Small Caps, and Micro Caps with captive solar/wind capacity, avoided power tariffs (annual cost shielded), and historical 1 to 6-year stock returns.
        </p>
      </div>

      {/* Crafted subtle accent line detail */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
    </motion.section>
  );
}
