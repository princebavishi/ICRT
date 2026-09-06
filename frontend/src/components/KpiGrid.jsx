import React from 'react';
import { motion } from 'framer-motion';
import { CONTAINER_STAGGER, ITEM_FADE_UP, VIEWPORT_CONFIG, EASINGS } from '../motionVariants';
import { Building2, Zap, ShieldCheck, TrendingUp } from 'lucide-react';

export default function KpiGrid({ overall }) {
  const cards = [
    {
      title: 'Companies Ingested',
      value: overall ? overall.total_companies.toLocaleString() : '5,448',
      subtext: 'Screener.in All 219 Pages',
      icon: Building2,
    },
    {
      title: 'Total Operational Green Capacity',
      value: overall ? `${Math.round(overall.total_green_mw).toLocaleString()} MW` : '23,317 MW',
      subtext: 'Captive Solar, Wind, WHRS & Utilities',
      icon: Zap,
    },
    {
      title: 'Total Annual Cost Shielded',
      value: overall ? `₹${Math.round(overall.total_shield_cr).toLocaleString()} Cr` : '₹1,68,829 Cr',
      subtext: 'Net savings vs DISCOM Grid Tariffs',
      icon: ShieldCheck,
      highlight: true,
    },
    {
      title: 'Average 5-Year Equity Return',
      value: overall ? `${overall.avg_5y_ret >= 0 ? '+' : ''}${overall.avg_5y_ret}%` : '+189.1%',
      subtext: 'Multi-year equity compounding',
      icon: TrendingUp,
      accent: true,
    },
  ];

  return (
    <motion.section
      variants={CONTAINER_STAGGER}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_CONFIG}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            variants={ITEM_FADE_UP}
            whileHover={{ scale: 1.03, transition: { ease: EASINGS.subtleOvershoot, duration: 0.25 } }}
            className="p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col justify-between transition-colors hover:border-text-secondary/30"
          >
            <div>
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="w-7 h-7 rounded-btn bg-white border border-border flex items-center justify-center text-text-secondary">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-2xl font-bold tracking-tight text-text-primary mb-1">
                {card.value}
              </div>
            </div>

            <div className="text-xs text-text-secondary pt-2 border-t border-border-subtle mt-2">
              {card.subtext}
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
