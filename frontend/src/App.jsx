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
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Handle deep-linking URL selection
  const handleSelectCompany = useCallback(
    (ticker) => {
      if (!ticker) {
        setSelectedTicker(null);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('symbol');
        currentUrl.searchParams.delete('ticker');
        currentUrl.searchParams.delete('company');
        const nextUrl = currentUrl.pathname + (currentUrl.search ? currentUrl.search : '');
        window.history.pushState({}, '', nextUrl);
        document.title = 'India Corporate Renewables & Stock Returns Terminal | ICRT';
        return;
      }

      const cleanTicker = ticker.toUpperCase().trim();
      setSelectedTicker(cleanTicker);
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('symbol', cleanTicker);
      window.history.pushState({}, '', currentUrl.pathname + currentUrl.search);

      const found = allStocks.find((s) => s.ticker === cleanTicker);
      if (found) {
        document.title = `${found.name} (${found.ticker}) - Renewable Dossier | ICRT`;
      }
    },
    [allStocks]
  );

  // Parse query params (?symbol=... or ?ticker=...) on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sym = params.get('symbol') || params.get('ticker') || params.get('company');
    if (sym) {
      setSelectedTicker(sym.toUpperCase().trim());
    }
  }, []);

  // Sync document title once allStocks is loaded if symbol already in URL
  useEffect(() => {
    if (selectedTicker && allStocks.length > 0) {
      const found = allStocks.find((s) => s.ticker === selectedTicker);
      if (found) {
        document.title = `${found.name} (${found.ticker}) - Renewable Dossier | ICRT`;
      }
    }
  }, [selectedTicker, allStocks]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sym = params.get('symbol') || params.get('ticker') || params.get('company');
      setSelectedTicker(sym ? sym.toUpperCase().trim() : null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Resolves static asset URL relative to base path, subpath, or current directory
  const getStaticAssetUrl = useCallback((relativePath) => {
    const clean = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    try {
      const urlObj = new URL(window.location.href);
      if (!urlObj.pathname.endsWith('/') && !urlObj.pathname.split('/').pop().includes('.')) {
        urlObj.pathname += '/';
      }
      return new URL(clean, urlObj.href).href;
    } catch {
      return `./${clean}`;
    }
  }, []);

  // Data fetching (handles local FastAPI /api/, static Vercel, and GitHub Pages subpath)
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
        // Fallback for GitHub Pages / Vercel static hosting
        const stocksUrl = getStaticAssetUrl('data/stocks.json');
        const statsUrl = getStaticAssetUrl('data/stats.json');
        const sectorsUrl = getStaticAssetUrl('data/sectors.json');

        const [stocksRes, statsRes, sectorsRes] = await Promise.all([
          fetch(stocksUrl),
          fetch(statsUrl),
          fetch(sectorsUrl),
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
  }, [getStaticAssetUrl]);

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

  // Export CSV with full institutional data schema & UTF-8 BOM
  const handleExportCSV = useCallback(() => {
    if (!filteredAndSortedStocks || filteredAndSortedStocks.length === 0) {
      showToast('No matching companies to export.');
      return;
    }

    const headers = [
      'Company Name',
      'Ticker',
      'Cap Tier',
      'Sector',
      'Sub Segment',
      'Market Cap (Cr INR)',
      'Current Price (INR)',
      'PE Ratio',
      'ROCE (%)',
      'Renewable Electricity Share (%)',
      'Green Capacity (MW)',
      'Annual Utility Cost Shielded (Cr INR)',
      'Annual Generation (MU)',
      'Grid Tariff (INR/kWh)',
      'Solar Cost (INR/kWh)',
      'Net Tariff Spread (INR/kWh)',
      '1Y Return (%)',
      '2Y Return (%)',
      '3Y Return (%)',
      '4Y Return (%)',
      '5Y Return (%)',
      '6Y Return (%)',
      'BRSR Status',
      'Renewable Sourcing Model',
      'Decarbonization Targets',
    ];

    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredAndSortedStocks.map((s) => [
      escapeCSV(s.name),
      escapeCSV(s.ticker),
      escapeCSV(s.cap_tier),
      escapeCSV(s.sector),
      escapeCSV(s.sub_segment || ''),
      s.market_cap_cr !== undefined && s.market_cap_cr !== null ? s.market_cap_cr : '',
      s.close_price !== undefined && s.close_price !== null ? s.close_price : '',
      s.pe !== undefined && s.pe !== null ? s.pe : '',
      s.roce !== undefined && s.roce !== null ? s.roce : '',
      s.re_pct !== undefined && s.re_pct !== null ? s.re_pct : '',
      s.re_mw !== undefined && s.re_mw !== null ? s.re_mw : '',
      s.annual_shield_cr !== undefined && s.annual_shield_cr !== null ? s.annual_shield_cr : '',
      s.annual_mu !== undefined && s.annual_mu !== null ? s.annual_mu : '',
      s.grid_tariff !== undefined && s.grid_tariff !== null ? s.grid_tariff : '',
      s.solar_cost !== undefined && s.solar_cost !== null ? s.solar_cost : '',
      s.unit_shield !== undefined && s.unit_shield !== null ? s.unit_shield : '',
      s.ret_1y !== undefined && s.ret_1y !== null ? s.ret_1y : '',
      s.ret_2y !== undefined && s.ret_2y !== null ? s.ret_2y : '',
      s.ret_3y !== undefined && s.ret_3y !== null ? s.ret_3y : '',
      s.ret_4y !== undefined && s.ret_4y !== null ? s.ret_4y : '',
      s.ret_5y !== undefined && s.ret_5y !== null ? s.ret_5y : '',
      s.ret_6y !== undefined && s.ret_6y !== null ? s.ret_6y : '',
      escapeCSV(s.brsr_status || 'Reported'),
      escapeCSV(s.primary_model || s.re_sources || 'Captive Solar & Wind PPA'),
      escapeCSV(s.targets || 'Net Zero & RE Transition'),
    ]);

    // UTF-8 BOM (\uFEFF) ensures Excel handles currency symbols & unicode perfectly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `ICRT_Renewables_Market_Data_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`✓ Exported ${filteredAndSortedStocks.length.toLocaleString()} companies to CSV!`);
  }, [filteredAndSortedStocks, showToast]);

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

      <main className="flex-1 max-w-[1540px] 2xl:max-w-[1780px] 3xl:max-w-[2160px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Top KPI Cards */}
        <KpiGrid overall={stats?.overall || stats?.kpis} />

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
          onSelectCompany={handleSelectCompany}
          onSelectSector={(sec) => {
            setSector(sec);
            setCurrentPage(1);
          }}
          onSelectCap={(cap) => {
            setActiveCap(cap);
            setCurrentPage(1);
          }}
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
          onSelectCompany={handleSelectCompany}
          onExportCSV={handleExportCSV}
          isLoading={isLoading}
        />
      </main>

      {/* Detail Modal */}
      <DetailModal
        company={selectedCompany}
        onClose={() => handleSelectCompany(null)}
        onNotify={showToast}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-text-primary text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-card shadow-lg border border-text-secondary/20 animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      <Footer />
    </div>
  );
}
