import React from 'react';
import { motion } from 'framer-motion';
import { INTERACTIVE_MOTION } from '../motionVariants';
import { Zap, Download, RefreshCw } from 'lucide-react';

export default function Navbar({ 
  totalStocksCount = 5448, 
  is2W3WActive, 
  onToggle2W3W, 
  onExportCSV, 
  onRefresh, 
  isRefreshing 
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1540px] 2xl:max-w-[1780px] 3xl:max-w-[2160px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-btn bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-accent" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm sm:text-lg font-semibold tracking-tight text-text-primary truncate">
              <span className="hidden sm:inline">India Corporate Renewables Terminal</span>
              <span className="inline sm:hidden">ICRT Terminal</span>
            </span>
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-btn text-xs font-medium bg-surface border border-border text-text-secondary whitespace-nowrap">
              5,461 Equities
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* 2W & 3W OEM Toggle */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onToggle2W3W}
            className={`px-2.5 sm:px-3 py-1.5 rounded-btn text-xs sm:text-sm font-medium transition-colors border ${
              is2W3WActive
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-text-primary border-border hover:bg-border-subtle'
            }`}
            title="Filter to 2-Wheeler and 3-Wheeler automotive manufacturers"
          >
            <span className="hidden sm:inline">🛵 2W &amp; 3W OEMs (41)</span>
            <span className="inline sm:hidden">🛵 2W/3W</span>
          </motion.button>

          {/* Export CSV (Always accessible across screens) */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onExportCSV}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-btn text-xs sm:text-sm font-medium bg-surface text-text-primary border border-border hover:bg-border-subtle transition-colors shadow-xs"
            title="Download full filtered dataset to CSV / Excel"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>

          {/* Refresh / Sync */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-soft"
            title="Sync live market & BRSR filings"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing…' : 'Sync'}</span>
          </motion.button>
        </div>

      </div>
    </header>
  );
}
