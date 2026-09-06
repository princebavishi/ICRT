import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import KpiGrid from './components/KpiGrid';
import FilterToolbar from './components/FilterToolbar';
import ChartsSection from './components/ChartsSection';
import StocksTable from './components/StocksTable';
import DetailModal from './components/DetailModal';
import Footer from './components/Footer';

export default function App() {
  const [allStocks, setAllStocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [sectorsList, setSectorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [activeCap, setActiveCap] = useState('All');
  const [sector, setSector] = useState('All');
  const [minRE, setMinRE] = useState(0);
  const [minShield, setMinShield] = useState(0);
  const [minMW, setMinMW] = useState(0);
  const [returnFilter, setReturnFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [is2W3WActive, setIs2W3WActive] = useState(false);

  // Sorting State
  const [sortCol, setSortCol] = useState('annual_shield_cr');
  const [sortDir, setSortDir] = useState('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('25');

  // Selected company for modal
  const [selectedTicker, setSelectedTicker] = useState(null);

  // Data fetching (handles both local FastAPI /api/ and static Vercel /data/ fallback)
  const loadData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      let stocksJson = null;
      let statsJson = null;
      let sectorsJson = [];

      try {
        const [stocksRes, statsRes, sectorsRes] = await Promise.all([
          fetch('/api/stocks'),
          fetch('/api/stats'),
          fetch('/api/sectors'),
        ]);

        if (stocksRes.ok && statsRes.ok) {
          stocksJson = await stocksRes.json();
          statsJson = await statsRes.json();
          sectorsJson = sectorsRes.ok ? await sectorsRes.json() : [];
        } else {
          throw new Error('API route response not ok');
        }
      } catch (apiErr) {
        // Fallback for Vercel static hosting
        const [stocksRes, statsRes, sectorsRes] = await Promise.all([
          fetch('/data/stocks.json'),
          fetch('/data/stats.json'),
          fetch('/data/sectors.json'),
        ]);
        stocksJson = await stocksRes.json();
        statsJson = await statsRes.json();
        sectorsJson = sectorsRes.ok ? await sectorsRes.json() : [];
      }

      setAllStocks(stocksJson?.data || []);
      setStats(statsJson);
      setSectorsList(sectorsJson || []);
    } catch (err) {
      console.error('Error fetching terminal data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle header sorting click
  const handleSort = (colId) => {
    if (sortCol === colId) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(colId);
      if (['name', 'ticker', 'sector', 'cap_tier'].includes(colId)) {
        setSortDir('asc');
      } else {
        setSortDir('desc');
      }
    }
    setCurrentPage(1);
  };

  // Handle sort preset dropdown change
  const handleSortPreset = (val) => {
    const [col, dir] = val.split('-');
    setSortCol(col);
    setSortDir(dir);
    setCurrentPage(1);
  };

  // Filtered and Sorted dataset calculation
  const filteredAndSortedStocks = useMemo(() => {
    const q = search.toLowerCase().trim();

    const filtered = allStocks.filter((s) => {
      // Search
      if (q) {
        const matchesName = s.name && s.name.toLowerCase().includes(q);
        const matchesTicker = s.ticker && s.ticker.toLowerCase().includes(q);
        const matchesSector = s.sector && s.sector.toLowerCase().includes(q);
        if (!matchesName && !matchesTicker && !matchesSector) return false;
      }

      // Cap
      if (activeCap !== 'All' && s.cap_tier !== activeCap) return false;

      // Sector
      if (sector !== 'All' && s.sector !== sector) return false;

      // RE %
      if (minRE > 0 && (s.re_pct || 0) < minRE) return false;

      // Shielded
      if (minShield > 0 && (s.annual_shield_cr || 0) < minShield) return false;

      // MW
      if (minMW > 0 && (s.re_mw || 0) < minMW) return false;

      // 5Y Return
      if (returnFilter === 'pos' && (s.ret_5y || 0) <= 0) return false;
      if (returnFilter === '50' && (s.ret_5y || 0) < 50) return false;
      if (returnFilter === '100' && (s.ret_5y || 0) < 100) return false;
      if (returnFilter === '200' && (s.ret_5y || 0) < 200) return false;
      if (returnFilter === '500' && (s.ret_5y || 0) < 500) return false;

      // CMP Price
      const price = s.close_price || 0;
      if (priceFilter === 'sub100' && price >= 100) return false;
      if (priceFilter === '100-500' && (price < 100 || price > 500)) return false;
      if (priceFilter === '500-2000' && (price < 500 || price > 2000)) return false;
      if (priceFilter === 'above2000' && price <= 2000) return false;

      // 2W / 3W OEM filter
      if (is2W3WActive) {
        const isOEM =
          s.sector === 'Automotive & 2W/3W' ||
          (s.sub_segment &&
            (s.sub_segment.includes('2W') || s.sub_segment.includes('3W')));
        if (!isOEM) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let valA = a[sortCol];
      let valB = b[sortCol];

      if (valA === undefined || valA === null) valA = typeof valB === 'string' ? '' : -999999;
      if (valB === undefined || valB === null) valB = typeof valA === 'string' ? '' : -999999;

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    allStocks,
    search,
    activeCap,
    sector,
    minRE,
    minShield,
    minMW,
    returnFilter,
    priceFilter,
    is2W3WActive,
    sortCol,
    sortDir,
  ]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (search) {
      chips.push({ label: `Search: "${search}"`, onRemove: () => setSearch('') });
    }
    if (activeCap !== 'All') {
      chips.push({ label: `Cap: ${activeCap}`, onRemove: () => setActiveCap('All') });
    }
    if (sector !== 'All') {
      chips.push({ label: `Sector: ${sector}`, onRemove: () => setSector('All') });
    }
    if (minRE > 0) {
      chips.push({ label: `RE ≥ ${minRE}%`, onRemove: () => setMinRE(0) });
    }
    if (minShield > 0) {
      chips.push({ label: `Shielded ≥ ₹${minShield} Cr`, onRemove: () => setMinShield(0) });
    }
    if (minMW > 0) {
      chips.push({ label: `MW ≥ ${minMW} MW`, onRemove: () => setMinMW(0) });
    }
    if (returnFilter !== 'all') {
      const retText = returnFilter === 'pos' ? '> 0%' : `> ${returnFilter}%`;
      chips.push({ label: `5Y Ret ${retText}`, onRemove: () => setReturnFilter('all') });
    }
    if (priceFilter !== 'all') {
      const pText =
        priceFilter === 'sub100'
          ? '< ₹100'
          : priceFilter === '100-500'
          ? '₹100–500'
          : priceFilter === '500-2000'
          ? '₹500–2000'
          : '> ₹2000';
      chips.push({ label: `Price: ${pText}`, onRemove: () => setPriceFilter('all') });
    }
    if (is2W3WActive) {
      chips.push({ label: `2W & 3W OEMs Only`, onRemove: () => setIs2W3WActive(false) });
    }
    return chips;
  }, [
    search,
    activeCap,
    sector,
    minRE,
    minShield,
    minMW,
    returnFilter,
    priceFilter,
    is2W3WActive,
  ]);

  const handleResetAll = () => {
    setSearch('');
    setActiveCap('All');
    setSector('All');
    setMinRE(0);
    setMinShield(0);
    setMinMW(0);
    setReturnFilter('all');
    setPriceFilter('all');
    setIs2W3WActive(false);
    setSortCol('annual_shield_cr');
    setSortDir('desc');
    setCurrentPage(1);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!filteredAndSortedStocks || filteredAndSortedStocks.length === 0) return;
    const headers = [
      'Company Name',
      'Ticker',
      'Cap Tier',
      'Sector',
      'CMP (Rs)',
      'RE %',
      'Green MW',
      'Annual Cost Shielded (Cr)',
      '1Y Ret %',
      '3Y Ret %',
      '5Y Ret %',
      '6Y Ret %',
    ];
    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    filteredAndSortedStocks.forEach((s) => {
      csvContent += `"${s.name}","${s.ticker}","${s.cap_tier}","${s.sector}",${s.close_price},${s.re_pct},${s.re_mw},${s.annual_shield_cr},${s.ret_1y},${s.ret_3y},${s.ret_5y},${s.ret_6y}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'india_corporate_renewables_stocks_filtered.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Selected company object
  const selectedCompany = useMemo(() => {
    if (!selectedTicker) return null;
    return allStocks.find((s) => s.ticker === selectedTicker) || null;
  }, [selectedTicker, allStocks]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      <Navbar
        totalStocksCount={allStocks.length}
        is2W3WActive={is2W3WActive}
        onToggle2W3W={() => {
          setIs2W3WActive((prev) => !prev);
          setCurrentPage(1);
        }}
        onExportCSV={handleExportCSV}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-[1540px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Top KPI Cards */}
        <KpiGrid overall={stats?.overall} />

        {/* Filters Toolbar */}
        <FilterToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          activeCap={activeCap}
          onCapChange={(val) => {
            setActiveCap(val);
            setCurrentPage(1);
          }}
          sector={sector}
          onSectorChange={(val) => {
            setSector(val);
            setCurrentPage(1);
          }}
          sectorsList={sectorsList}
          minRE={minRE}
          onMinREChange={(val) => {
            setMinRE(val);
            setCurrentPage(1);
          }}
          minShield={minShield}
          onMinShieldChange={(val) => {
            setMinShield(val);
            setCurrentPage(1);
          }}
          minMW={minMW}
          onMinMWChange={(val) => {
            setMinMW(val);
            setCurrentPage(1);
          }}
          returnFilter={returnFilter}
          onReturnFilterChange={(val) => {
            setReturnFilter(val);
            setCurrentPage(1);
          }}
          priceFilter={priceFilter}
          onPriceFilterChange={(val) => {
            setPriceFilter(val);
            setCurrentPage(1);
          }}
          sortValue={`${sortCol}-${sortDir}`}
          onSortChange={handleSortPreset}
          activeChips={activeChips}
          onRemoveChip={(idx) => activeChips[idx]?.onRemove()}
          onResetAll={handleResetAll}
        />

        {/* Visual Charts */}
        <ChartsSection
          stats={stats}
          allStocks={allStocks}
          onSelectCompany={(ticker) => setSelectedTicker(ticker)}
        />

        {/* Listed Stocks Table */}
        <StocksTable
          stocks={filteredAndSortedStocks}
          totalCount={allStocks.length}
          sortCol={sortCol}
          sortDir={sortDir}
          onSort={handleSort}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onSelectCompany={(ticker) => setSelectedTicker(ticker)}
          isLoading={isLoading}
        />
      </main>

      {/* Detail Modal */}
      <DetailModal
        company={selectedCompany}
        onClose={() => setSelectedTicker(null)}
      />

      <Footer />
    </div>
  );
}
