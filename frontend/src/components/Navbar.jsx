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
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-btn bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Zap className="w-5 h-5 fill-accent" />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              India Corporate Renewables Terminal
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-btn text-xs font-medium bg-surface border border-border text-text-secondary">
              Screener.in 5,461 Stocks
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 2W & 3W OEM Toggle */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onToggle2W3W}
            className={`px-3 py-1.5 rounded-btn text-xs sm:text-sm font-medium transition-colors border ${
              is2W3WActive
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-text-primary border-border hover:bg-border-subtle'
            }`}
          >
            <span>🛵 2W &amp; 3W OEMs (41)</span>
          </motion.button>

          {/* Export CSV */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onExportCSV}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-xs sm:text-sm font-medium bg-surface text-text-primary border border-border hover:bg-border-subtle transition-colors"
          >
            <Download className="w-4 h-4 text-text-secondary" />
            <span>Export dataset</span>
          </motion.button>

          {/* Refresh */}
          <motion.button
            {...INTERACTIVE_MOTION}
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn text-xs sm:text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-soft"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing…' : 'Sync'}</span>
          </motion.button>
        </div>

      </div>
    </header>
  );
}
