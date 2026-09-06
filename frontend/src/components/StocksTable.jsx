import React from 'react';
import { motion } from 'framer-motion';
import { INTERACTIVE_MOTION } from '../motionVariants';
import CustomSelect from './CustomSelect';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export default function StocksTable({
  stocks,
  totalCount,
  sortCol,
  sortDir,
  onSort,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSelectCompany,
  isLoading,
}) {
  const columns = [
    { id: 'name', label: 'Company Name', align: 'left', desc: 'Listed corporate entity' },
    { id: 'ticker', label: 'Ticker', align: 'left', desc: 'NSE/BSE Trading Ticker' },
    { id: 'cap_tier', label: 'Cap Tier', align: 'left', desc: 'Market Capitalization Tier' },
    { id: 'sector', label: 'Sector', align: 'left', desc: 'Primary Industry Sector' },
    { id: 'close_price', label: 'CMP (₹)', align: 'right', desc: 'Current Market Price' },
    { id: 're_pct', label: 'RE Share (%)', align: 'right', desc: 'Renewable Electricity %' },
    { id: 're_mw', label: 'Green MW', align: 'right', desc: 'Captive/PPA Solar & Wind Capacity' },
    { id: 'annual_shield_cr', label: 'Cost Shielded (₹ Cr)', align: 'right', desc: 'Annual Avoided Grid Tariff Bill' },
    { id: 'ret_1y', label: '1Y Ret', align: 'right', desc: '1-Year Compounded Return' },
    { id: 'ret_3y', label: '3Y Ret', align: 'right', desc: '3-Year Compounded Return' },
    { id: 'ret_5y', label: '5Y Ret', align: 'right', desc: '5-Year Compounded Return' },
    { id: 'ret_6y', label: '6Y Ret', align: 'right', desc: '6-Year Compounded Return' },
  ];

  const pageSizeOptions = [
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' },
    { value: '250', label: '250 per page' },
    { value: '500', label: '500 per page' },
    { value: 'all', label: 'Show All' },
  ];

  // Pagination calculation
  const totalPages = pageSize === 'all' ? 1 : Math.ceil(stocks.length / parseInt(pageSize)) || 1;
  const currentSafePage = Math.min(Math.max(currentPage, 1), totalPages);
  
  let paginatedRows = stocks;
  if (pageSize !== 'all') {
    const size = parseInt(pageSize);
    const start = (currentSafePage - 1) * size;
    paginatedRows = stocks.slice(start, start + size);
  }

  const formatReturn = (val) => {
    if (val === undefined || val === null) return '--';
    const isPos = val >= 0;
    return (
      <span className={isPos ? 'text-accent font-medium' : 'text-text-secondary font-medium'}>
        {isPos ? '+' : ''}
        {val.toFixed(1)}%
      </span>
    );
  };

  return (
    <section className="mb-8 rounded-card bg-surface border border-border shadow-soft overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">
            Listed Stocks Corporate Energy &amp; Returns Directory
          </h2>
          <span className="px-2.5 py-0.5 rounded-btn text-xs font-semibold bg-white border border-border text-accent">
            {stocks.length.toLocaleString()} matching
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Display:</span>
          <CustomSelect
            value={pageSize}
            onChange={(val) => {
              onPageSizeChange(val);
              onPageChange(1);
            }}
            options={pageSizeOptions}
            className="w-36"
            menuWidth="w-36"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-surface border-b border-border text-text-secondary font-medium select-none shadow-xs">
            <tr>
              {columns.map((col) => {
                const isSorted = sortCol === col.id;
                return (
                  <th
                    key={col.id}
                    onClick={() => onSort(col.id)}
                    title={`${col.desc} • Click to sort`}
                    className={`py-3 px-3.5 whitespace-nowrap cursor-pointer hover:text-text-primary transition-colors ${
                      col.align === 'right' ? 'text-right' : 'text-left'
                    } ${isSorted ? 'bg-border-subtle/70 text-text-primary font-semibold' : ''}`}
                  >
                    <div className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                      <span>{col.label}</span>
                      {isSorted ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-accent" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-text-secondary/40" />
                      )}
                    </div>
                  </th>
                );
              })}
              <th className="py-3 px-3.5 text-center whitespace-nowrap text-text-secondary">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={13} className="text-center py-14 text-text-secondary">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <span className="text-sm font-medium">One moment… retrieving corporate database</span>
                  </div>
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-14 text-text-secondary">
                  <div className="text-base font-medium text-text-primary mb-1">
                    No matching companies found
                  </div>
                  <div className="text-xs">
                    Try adjusting your search query, market cap selection, or filter thresholds.
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRows.map((stock) => {
                const isOEM =
                  stock.sector === 'Automotive & 2W/3W' ||
                  (stock.sub_segment &&
                    (stock.sub_segment.includes('2W') || stock.sub_segment.includes('3W')));

                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => onSelectCompany(stock.ticker)}
                    className="hover:bg-accent/[0.03] transition-colors cursor-pointer group"
                    title="Click row to inspect complete company profile"
                  >
                    {/* Name */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-text-primary flex items-center gap-1.5 group-hover:text-accent transition-colors">
                        <span>{stock.name}</span>
                        {isOEM && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                            2W/3W
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-text-secondary truncate max-w-[200px]">
                        {stock.sub_segment || stock.sector}
                      </div>
                    </td>

                    {/* Ticker */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-medium text-text-secondary">
                      {stock.ticker}
                    </td>

                    {/* Cap Tier */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface border border-border text-text-secondary">
                        {stock.cap_tier}
                      </span>
                    </td>

                    {/* Sector */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-text-secondary text-xs">
                      {stock.sector}
                    </td>

                    {/* CMP */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right font-semibold text-text-primary">
                      ₹{stock.close_price.toLocaleString()}
                    </td>

                    {/* RE % */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      <span className="font-semibold text-text-primary">
                        {stock.re_pct.toFixed(1)}%
                      </span>
                    </td>

                    {/* Green MW */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right font-medium text-text-primary">
                      {stock.re_mw.toLocaleString()}
                    </td>

                    {/* Shielded */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right font-bold text-accent">
                      ₹{stock.annual_shield_cr.toLocaleString()} Cr
                    </td>

                    {/* Returns */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {formatReturn(stock.ret_1y)}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {formatReturn(stock.ret_3y)}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {formatReturn(stock.ret_5y)}
                    </td>
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {formatReturn(stock.ret_6y)}
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        {...INTERACTIVE_MOTION}
                        onClick={() => onSelectCompany(stock.ticker)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-btn text-xs font-medium text-text-primary bg-white border border-border hover:border-accent hover:text-accent transition-colors shadow-xs"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3 text-text-secondary group-hover:text-accent" />
                      </motion.button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pageSize !== 'all' && (
        <div className="p-4 border-t border-border flex items-center justify-between flex-wrap gap-3 text-xs text-text-secondary bg-surface">
          <div>
            Showing{' '}
            <span className="font-semibold text-text-primary">
              {stocks.length === 0
                ? 0
                : `${(currentSafePage - 1) * parseInt(pageSize) + 1} – ${Math.min(
                    currentSafePage * parseInt(pageSize),
                    stocks.length
                  )}`}
            </span>{' '}
            of {stocks.length.toLocaleString()} companies
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              {...INTERACTIVE_MOTION}
              onClick={() => onPageChange(1)}
              disabled={currentSafePage <= 1}
              className="px-2 py-1 rounded-btn border border-border bg-white text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              First
            </motion.button>
            <motion.button
              {...INTERACTIVE_MOTION}
              onClick={() => onPageChange(currentSafePage - 1)}
              disabled={currentSafePage <= 1}
              className="px-2.5 py-1 rounded-btn border border-border bg-white text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </motion.button>

            <span className="flex items-center gap-1 px-1">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentSafePage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) onPageChange(val);
                }}
                className="w-12 px-1.5 py-0.5 border border-border rounded-input text-center font-medium text-text-primary bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <span>of {totalPages.toLocaleString()}</span>
            </span>

            <motion.button
              {...INTERACTIVE_MOTION}
              onClick={() => onPageChange(currentSafePage + 1)}
              disabled={currentSafePage >= totalPages}
              className="px-2.5 py-1 rounded-btn border border-border bg-white text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
            <motion.button
              {...INTERACTIVE_MOTION}
              onClick={() => onPageChange(totalPages)}
              disabled={currentSafePage >= totalPages}
              className="px-2 py-1 rounded-btn border border-border bg-white text-text-primary hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Last
            </motion.button>
          </div>
        </div>
      )}

    </section>
  );
}
