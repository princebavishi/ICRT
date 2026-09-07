import React from 'react';
import { motion } from 'framer-motion';
import { INTERACTIVE_MOTION } from '../motionVariants';
import CustomSelect from './CustomSelect';
import {
  Search,
  X,
  RotateCcw,
  Layers,
  Zap,
  ShieldCheck,
  Leaf,
  TrendingUp,
  Tag,
  ArrowUpDown,
} from 'lucide-react';

export default function FilterToolbar({
  search,
  onSearchChange,
  activeCap,
  onCapChange,
  sector,
  onSectorChange,
  sectorsList,
  minRE,
  onMinREChange,
  minShield,
  onMinShieldChange,
  minMW,
  onMinMWChange,
  returnFilter,
  onReturnFilterChange,
  priceFilter,
  onPriceFilterChange,
  sortValue,
  onSortChange,
  activeChips,
  onRemoveChip,
  onResetAll,
}) {
  const capTiers = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'];

  // Sector options
  const sectorOptions = [
    { value: 'All', label: `All Sectors (${sectorsList.length})` },
    ...sectorsList.map((s) => ({ value: s, label: s })),
  ];

  // RE options
  const reOptions = [
    { value: 0, label: 'All RE Shares (%)' },
    { value: 20, label: 'RE Share ≥ 20%' },
    { value: 40, label: 'RE Share ≥ 40%' },
    { value: 60, label: 'RE Share ≥ 60%' },
    { value: 80, label: 'RE Share ≥ 80%' },
    { value: 90, label: 'RE Share ≥ 90% (Champions)' },
  ];

  // Shielded options
  const shieldOptions = [
    { value: 0, label: 'All Cost Shielded' },
    { value: 10, label: 'Shielded ≥ ₹10 Cr' },
    { value: 50, label: 'Shielded ≥ ₹50 Cr' },
    { value: 100, label: 'Shielded ≥ ₹100 Cr' },
    { value: 500, label: 'Shielded ≥ ₹500 Cr' },
    { value: 1000, label: 'Shielded ≥ ₹1,000 Cr' },
  ];

  // MW options
  const mwOptions = [
    { value: 0, label: 'All Green MW' },
    { value: 1, label: 'Capacity ≥ 1 MW' },
    { value: 5, label: 'Capacity ≥ 5 MW' },
    { value: 25, label: 'Capacity ≥ 25 MW' },
    { value: 100, label: 'Capacity ≥ 100 MW' },
    { value: 500, label: 'Capacity ≥ 500 MW' },
  ];

  // 5Y Return options
  const returnOptions = [
    { value: 'all', label: 'All 5Y Returns' },
    { value: 'pos', label: 'Positive Returns (> 0%)' },
    { value: '50', label: '5Y Return > 50%' },
    { value: '100', label: '5Y Return > 100% (2x)' },
    { value: '200', label: '5Y Return > 200% (3x)' },
    { value: '500', label: '5Y Return > 500% (Multibaggers)' },
  ];

  // Price options
  const priceOptions = [
    { value: 'all', label: 'All CMP Prices' },
    { value: 'sub100', label: 'Under ₹100 (Affordable)' },
    { value: '100-500', label: '₹100 – ₹500' },
    { value: '500-2000', label: '₹500 – ₹2,000' },
    { value: 'above2000', label: 'Above ₹2,000' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'market_cap_cr-desc', label: 'Sort: Market Cap (Highest)' },
    { value: 'market_cap_cr-asc', label: 'Sort: Market Cap (Lowest)' },
    { value: 'annual_shield_cr-desc', label: 'Sort: Cost Shielded (Highest)' },
    { value: 'annual_shield_cr-asc', label: 'Sort: Cost Shielded (Lowest)' },
    { value: 're_pct-desc', label: 'Sort: RE Share % (Highest)' },
    { value: 're_pct-asc', label: 'Sort: RE Share % (Lowest)' },
    { value: 're_mw-desc', label: 'Sort: Green MW (Highest)' },
    { value: 'pe-asc', label: 'Sort: P/E Ratio (Lowest / Value)' },
    { value: 'close_price-desc', label: 'Sort: Share Price (Highest)' },
    { value: 'close_price-asc', label: 'Sort: Share Price (Lowest)' },
    { value: 'ret_5y-desc', label: 'Sort: 5Y Return % (Highest)' },
    { value: 'ret_3y-desc', label: 'Sort: 3Y Return % (Highest)' },
    { value: 'ret_1y-desc', label: 'Sort: 1Y Return % (Highest)' },
    { value: 'name-asc', label: 'Sort: Company Name (A to Z)' },
    { value: 'name-desc', label: 'Sort: Company Name (Z to A)' },
    { value: 'ticker-asc', label: 'Sort: Ticker (A to Z)' },
  ];

  return (
    <section className="mb-6 p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col gap-3.5">
      
      {/* Row 1: Search, Market Cap Pills, Sector Custom Select */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">
        {/* Search Input */}
        <div className="relative flex-[2] min-w-[240px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Company Name or Ticker (e.g. Reliance, TVS, Tata Steel, Suzlon)..."
            className="w-full pl-9 pr-9 py-2 bg-white border border-border rounded-input text-xs sm:text-sm text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
          />
          {search && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>

        {/* Market Cap Pills (Mobile horizontal scrollable) */}
        <div className="flex bg-white border border-border rounded-btn p-1 gap-1 overflow-x-auto max-w-full scrollbar-none shrink-0">
          {capTiers.map((cap) => (
            <motion.button
              key={cap}
              {...INTERACTIVE_MOTION}
              onClick={() => onCapChange(cap)}
              className={`px-2.5 sm:px-3 py-1 rounded-btn text-xs font-medium whitespace-nowrap transition-all ${
                activeCap === cap
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {cap === 'All' ? 'All Caps' : cap}
            </motion.button>
          ))}
        </div>

        {/* Sector Custom Dropdown */}
        <CustomSelect
          value={sector}
          onChange={onSectorChange}
          options={sectorOptions}
          icon={Layers}
          className="flex-1 min-w-[170px]"
          menuWidth="w-72"
        />
      </div>

      {/* Row 2: Animated Custom Select Dropdowns */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        {/* RE Share % Custom Dropdown */}
        <CustomSelect
          value={minRE}
          onChange={(val) => onMinREChange(Number(val))}
          options={reOptions}
          icon={Zap}
          className="flex-1 min-w-[155px]"
        />

        {/* Cost Shielded Custom Dropdown */}
        <CustomSelect
          value={minShield}
          onChange={(val) => onMinShieldChange(Number(val))}
          options={shieldOptions}
          icon={ShieldCheck}
          className="flex-1 min-w-[155px]"
        />

        {/* Green MW Custom Dropdown */}
        <CustomSelect
          value={minMW}
          onChange={(val) => onMinMWChange(Number(val))}
          options={mwOptions}
          icon={Leaf}
          className="flex-1 min-w-[145px]"
        />

        {/* 5-Year Return Custom Dropdown */}
        <CustomSelect
          value={returnFilter}
          onChange={onReturnFilterChange}
          options={returnOptions}
          icon={TrendingUp}
          className="flex-1 min-w-[145px]"
        />

        {/* CMP Price Custom Dropdown */}
        <CustomSelect
          value={priceFilter}
          onChange={onPriceFilterChange}
          options={priceOptions}
          icon={Tag}
          className="flex-1 min-w-[145px]"
        />

        {/* Sort Preset Custom Dropdown */}
        <CustomSelect
          value={sortValue}
          onChange={onSortChange}
          options={sortOptions}
          icon={ArrowUpDown}
          className="flex-[1.4] min-w-[200px]"
          menuWidth="w-64"
        />
      </div>

      {/* Row 3: Active Filters & Clear */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border">
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-text-secondary font-medium uppercase tracking-wider text-[11px]">
            Active Filters:
          </span>
          {activeChips.length === 0 ? (
            <span className="text-text-secondary text-xs">None (Displaying all companies)</span>
          ) : (
            activeChips.map((chip, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-btn bg-white border border-border text-text-primary text-xs font-medium shadow-xs"
              >
                <span>{chip.label}</span>
                <button
                  onClick={chip.onRemove}
                  className="text-text-secondary hover:text-accent transition-colors"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))
          )}
        </div>

        {activeChips.length > 0 && (
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onResetAll}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-btn text-xs font-medium text-text-secondary hover:text-accent bg-white border border-border transition-colors hover:border-accent/30"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset all</span>
          </motion.button>
        )}
      </div>

    </section>
  );
}
