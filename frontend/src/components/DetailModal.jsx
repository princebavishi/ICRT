import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODAL_BACKDROP, MODAL_CARD, INTERACTIVE_MOTION } from '../motionVariants';
import { X } from 'lucide-react';

export default function DetailModal({ company, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!company) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={MODAL_BACKDROP}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-text-primary/40 backdrop-blur-[2px]"
        />

        {/* Modal Card */}
        <motion.div
          variants={MODAL_CARD}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-border rounded-card p-6 sm:p-7 shadow-soft z-10"
        >
          {/* Close button */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-btn bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Header */}
          <div className="mb-5 pr-8">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {company.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface border border-border text-text-secondary">
                {company.cap_tier}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Ticker: <span className="font-semibold text-text-primary">{company.ticker}</span> • Sector: {company.sector} {company.sub_segment ? `• ${company.sub_segment}` : ''}
            </p>
          </div>

          {/* 6 Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Renewable Electricity Share
              </div>
              <div className="text-lg font-bold text-text-primary">
                {company.re_pct.toFixed(1)}%
              </div>
            </div>

            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Annual Power Cost Shielded
              </div>
              <div className="text-lg font-bold text-accent">
                ₹{company.annual_shield_cr.toLocaleString()} Cr / yr
              </div>
            </div>

            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Installed Green Capacity
              </div>
              <div className="text-lg font-bold text-text-primary">
                {company.re_mw.toLocaleString()} MW
              </div>
            </div>

            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Annual Green Generation
              </div>
              <div className="text-lg font-bold text-text-primary">
                {company.annual_mu ? `${company.annual_mu.toLocaleString()} MU` : '--'}
              </div>
            </div>

            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Tariff Spread (Savings)
              </div>
              <div className="text-xs font-semibold text-text-primary">
                Grid: ₹{company.grid_tariff?.toFixed(2) || '8.60'} • Solar: ₹{company.solar_cost?.toFixed(2) || '3.75'}
                <div className="text-accent font-bold mt-0.5">
                  Savings: ₹{company.unit_shield?.toFixed(2) || '4.85'} / kWh
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-btn bg-surface border border-border">
              <div className="text-[11px] font-medium uppercase tracking-wider text-text-secondary mb-1">
                Current Market Price (CMP)
              </div>
              <div className="text-lg font-bold text-text-primary">
                ₹{company.close_price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Historical Returns */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Historical Equity Returns
            </h4>
            <div className="grid grid-cols-6 gap-2 text-center">
              {[1, 2, 3, 4, 5, 6].map((year) => {
                const ret = company[`ret_${year}y`];
                return (
                  <div key={year} className="p-2 rounded-btn bg-surface border border-border">
                    <div className="text-[10px] text-text-secondary mb-0.5">{year}Y Ret</div>
                    <div className={`text-xs font-bold ${ret >= 0 ? 'text-accent' : 'text-text-secondary'}`}>
                      {ret !== undefined && ret !== null ? `${ret >= 0 ? '+' : ''}${ret.toFixed(1)}%` : '--'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sourcing Model */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Renewable Energy Sourcing Model
            </h4>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              {company.primary_model || company.re_sources || 'Captive Solar & Wind corporate PPA structures across manufacturing units.'}
            </p>
          </div>

          {/* Decarbonization roadmap */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Decarbonization Roadmap &amp; Net-Zero Targets
            </h4>
            <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
              {company.targets || 'Targeting net-zero scope 1 and scope 2 emissions through phased renewable expansion.'}
            </p>
          </div>

          {/* Plants */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Manufacturing Footprint &amp; Facilities
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {company.plants_info || 'Industrial facilities across major operational hubs in India.'}
            </p>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
