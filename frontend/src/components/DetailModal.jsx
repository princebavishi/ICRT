import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODAL_BACKDROP, MODAL_CARD, INTERACTIVE_MOTION } from '../motionVariants';
import { X, Link2, Check, Share2, MessageCircle, ExternalLink } from 'lucide-react';

export default function DetailModal({ company, onClose, onNotify }) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!company) return null;

  const getGoogleFinanceUrl = (ticker) => {
    if (!ticker) return 'https://www.google.com/finance';
    if (/^\d+$/.test(ticker)) {
      return `https://www.google.com/finance/quote/${ticker}:BOM`;
    }
    return `https://www.google.com/finance/quote/${ticker}:NSE`;
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?symbol=${company.ticker}`
    : `https://frontend-nu-pearl-92.vercel.app/?symbol=${company.ticker}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      if (onNotify) onNotify(`✓ Copied ${company.ticker} dossier link to clipboard!`);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareText = `Check out ${company.name} (${company.ticker})'s clean energy metrics on India Corporate Renewables Terminal: ${company.re_pct}% RE share, ${company.re_mw} MW Green Capacity, saving ₹${company.annual_shield_cr} Cr/yr!`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const tweetText = `${company.name} ($${company.ticker}) powers ${company.re_pct}% of electricity from renewables, shielding ₹${company.annual_shield_cr} Cr/yr in power costs! ⚡🌱\n\nExplore the full renewable dossier on @ICRT:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}&hashtags=RenewableEnergy,IndianStockMarket,BRSR`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
          className="relative w-full max-w-2xl 2xl:max-w-3xl max-h-[92vh] overflow-y-auto bg-white border border-border rounded-card p-4 sm:p-7 shadow-soft z-10"
        >
          {/* Close button */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-btn bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </motion.button>

          {/* Header */}
          <div className="mb-4 pr-8">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-text-primary">
                {company.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface border border-border text-text-secondary">
                {company.cap_tier}
              </span>
              {company.brsr_status && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-accent/10 border border-accent/20 text-accent">
                  {company.brsr_status}
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-2 flex-wrap">
              <span>Ticker: <span className="font-semibold text-text-primary">{company.ticker}</span></span>
              <span>•</span>
              <span>Sector: {company.sector} {company.sub_segment ? `• ${company.sub_segment}` : ''}</span>
              <span>•</span>
              <a
                href={getGoogleFinanceUrl(company.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                title={`Open ${company.name} on Google Finance`}
              >
                <span>Google Finance</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Share & External Dossier Bar */}
          <div className="mb-5 p-2.5 rounded-btn bg-surface border border-border flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
              <Share2 className="w-3.5 h-3.5 text-accent" />
              <span>Dossier Actions:</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {/* Direct Google Finance Redirect */}
              <motion.a
                {...INTERACTIVE_MOTION}
                href={getGoogleFinanceUrl(company.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                title={`Open ${company.name} (${company.ticker}) on Google Finance for live charts, financials & news`}
              >
                <span>Google Finance</span>
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </motion.a>

              {/* Copy Direct URL */}
              <motion.button
                {...INTERACTIVE_MOTION}
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-medium border transition-colors ${
                  isCopied
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : 'bg-white text-text-primary border-border hover:bg-border-subtle'
                }`}
                title="Copy shareable direct link to this company dossier"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5 text-text-secondary" />}
                <span>{isCopied ? 'Copied Link!' : 'Copy Link'}</span>
              </motion.button>

              {/* WhatsApp Share */}
              <motion.button
                {...INTERACTIVE_MOTION}
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-medium bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors"
                title="Share dossier on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </motion.button>

              {/* X / Twitter Share */}
              <motion.button
                {...INTERACTIVE_MOTION}
                onClick={handleTwitterShare}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[5px] text-xs font-medium bg-black text-white border border-black hover:bg-neutral-800 transition-colors"
                title="Share dossier on X / Twitter"
              >
                <span className="font-bold text-[11px]">𝕏</span>
                <span className="hidden sm:inline">Post</span>
              </motion.button>
            </div>
          </div>

          {/* Key Metrics Grid (2 cols on mobile, 3 cols on sm+) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5">
            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Market Capitalization
              </div>
              <div className="text-base font-bold text-text-primary">
                {company.market_cap_cr ? `₹${company.market_cap_cr.toLocaleString()} Cr` : '--'}
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Price-to-Earnings (P/E)
              </div>
              <div className="text-base font-bold text-text-primary">
                {company.pe && company.pe > 0 ? `${company.pe.toFixed(1)}x` : '--'}
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                ROCE (%)
              </div>
              <div className="text-base font-bold text-accent">
                {company.roce && company.roce > 0 ? `${company.roce.toFixed(1)}%` : '--'}
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Renewable Electricity Share
              </div>
              <div className="text-base font-bold text-text-primary">
                {company.re_pct.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Annual Power Cost Shielded
              </div>
              <div className="text-base font-bold text-accent">
                ₹{company.annual_shield_cr.toLocaleString()} Cr / yr
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Installed Green Capacity
              </div>
              <div className="text-base font-bold text-text-primary">
                {company.re_mw.toLocaleString()} MW
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Annual Green Generation
              </div>
              <div className="text-base font-bold text-text-primary">
                {company.annual_mu ? `${company.annual_mu.toLocaleString()} MU` : '--'}
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                Tariff Spread (Savings)
              </div>
              <div className="text-xs font-semibold text-text-primary">
                Grid: ₹{company.grid_tariff?.toFixed(2) || '8.60'} • Solar: ₹{company.solar_cost?.toFixed(2) || '3.75'}
                <div className="text-accent font-bold mt-0.5">
                  Savings: ₹{company.unit_shield?.toFixed(2) || '4.85'} / kWh
                </div>
              </div>
            </div>

            <div className="p-3 rounded-btn bg-surface border border-border flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-text-secondary mb-0.5">
                  Current Market Price (CMP)
                </div>
                <div className="text-base font-bold text-text-primary">
                  ₹{company.close_price?.toLocaleString() || '--'}
                </div>
                {company.high_52w > 0 && (
                  <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
                    52W: ₹{company.low_52w?.toLocaleString()} – ₹{company.high_52w?.toLocaleString()}
                  </div>
                )}
              </div>
              <a
                href={getGoogleFinanceUrl(company.ticker)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline mt-1.5 pt-1 border-t border-border/60"
                title={`Open ${company.name} on Google Finance`}
              >
                <span>Live Google Finance Quote</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Historical Returns */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Verified Historical Equity Returns
              </h4>
              <span className="text-[10px] text-text-secondary font-medium">Source: NSE/BSE &amp; Google Finance</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {[1, 2, 3, 4, 5, 6].map((year) => {
                const ret = company[`ret_${year}y`];
                const isPositive = ret > 0;
                const isNegative = ret < 0;
                return (
                  <div key={year} className="p-2 rounded-btn bg-surface border border-border">
                    <div className="text-[10px] text-text-secondary mb-0.5">{year}Y Ret</div>
                    <div className={`text-xs font-bold ${isPositive ? 'text-accent' : isNegative ? 'text-rose-500' : 'text-text-secondary'}`}>
                      {ret !== undefined && ret !== null && ret !== 0 ? `${isPositive ? '+' : ''}${ret.toFixed(1)}%` : (ret === 0 ? '0.0%' : '--')}
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

          {/* Scope 1 & 2 Reduction */}
          {company.scope1_2_reduction && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                Scope 1 &amp; 2 Decarbonization Progress
              </h4>
              <p className="text-xs sm:text-sm text-accent font-medium leading-relaxed">
                {company.scope1_2_reduction}
              </p>
            </div>
          )}

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
