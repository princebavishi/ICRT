import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { VIEWPORT_CONFIG, EASINGS } from '../motionVariants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Scatter, Doughnut } from 'react-chartjs-2';
import { Sparkles, BarChart2, PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartsSection({
  stats,
  allStocks = [],
  onSelectCompany,
  onSelectSector,
  onSelectCap,
}) {
  const [scatterFilter, setScatterFilter] = useState('leaders'); // 'leaders' | 'all'

  const textSecondary = '#687076';
  const gridColor = '#f1f3f5';

  // 1. Sector Bar Chart (Dual Y-Axis)
  const topSectors = useMemo(() => {
    const list = stats?.sector_breakdown || stats?.sectors || [];
    if (list.length > 0) return list.slice(0, 8);
    // Fallback calculation from allStocks
    if (allStocks && allStocks.length > 0) {
      const map = {};
      allStocks.forEach((s) => {
        const sec = s.sector || 'Others';
        if (!map[sec]) map[sec] = { sector: sec, total_mw: 0, total_shield_cr: 0, count: 0, re_pct_sum: 0 };
        map[sec].total_mw += s.re_mw || 0;
        map[sec].total_shield_cr += s.annual_shield_cr || 0;
        map[sec].re_pct_sum += s.re_pct || 0;
        map[sec].count += 1;
      });
      return Object.values(map)
        .sort((a, b) => b.total_shield_cr - a.total_shield_cr)
        .slice(0, 8)
        .map((s) => ({
          ...s,
          total_mw: Math.round(s.total_mw * 10) / 10,
          total_shield_cr: Math.round(s.total_shield_cr * 10) / 10,
          avg_re_pct: s.count > 0 ? Math.round((s.re_pct_sum / s.count) * 10) / 10 : 0,
        }));
    }
    return [];
  }, [stats, allStocks]);

  const sectorData = useMemo(() => {
    return {
      labels: topSectors.map((s) => {
        if (s.sector.includes('&')) {
          const parts = s.sector.split('&');
          return [parts[0].trim(), '& ' + parts.slice(1).join('&').trim()];
        }
        if (s.sector.length > 18) {
          return [s.sector.substring(0, 16), s.sector.substring(16)];
        }
        return s.sector;
      }),
      datasets: [
        {
          label: 'Green MW (Capacity)',
          data: topSectors.map((s) => s.total_mw),
          backgroundColor: '#0066FF',
          hoverBackgroundColor: '#0052cc',
          borderRadius: 6,
          yAxisID: 'y',
        },
        {
          label: 'Cost Shielded (₹ Cr)',
          data: topSectors.map((s) => s.total_shield_cr),
          backgroundColor: '#11181c',
          hoverBackgroundColor: '#2d3748',
          borderRadius: 6,
          yAxisID: 'y1',
        },
      ],
    };
  }, [topSectors]);

  const sectorOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      onHover: (event, chartElement) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      },
      onClick: (evt, elements) => {
        if (elements.length > 0 && onSelectSector) {
          const idx = elements[0].index;
          const s = topSectors[idx];
          if (s?.sector) onSelectSector(s.sector);
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: textSecondary, font: { family: 'Inter', size: 11, weight: '500' } },
        },
        tooltip: {
          backgroundColor: '#11181c',
          titleFont: { family: 'Inter', size: 12, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 11 },
          padding: 12,
          cornerRadius: 6,
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const s = topSectors[items[0].dataIndex];
              return s ? s.sector : '';
            },
            label: (item) => {
              const s = topSectors[item.dataIndex];
              if (!s) return '';
              if (item.datasetIndex === 0) {
                return `⚡ Green Capacity: ${Math.round(s.total_mw).toLocaleString()} MW (Avg RE: ${s.avg_re_pct || 0}%)`;
              } else {
                return `💰 Total Cost Shielded: ₹${Math.round(s.total_shield_cr).toLocaleString()} Cr (${s.count} listed cos)`;
              }
            },
            afterBody: () => (onSelectSector ? ['👉 Click bar to filter table by this sector'] : []),
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textSecondary, font: { family: 'Inter', size: 9 }, maxRotation: 0 },
          grid: { display: false },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Green Capacity (MW)',
            color: '#0066FF',
            font: { family: 'Inter', size: 10, weight: '600' },
          },
          ticks: {
            color: textSecondary,
            font: { family: 'Inter', size: 9 },
            callback: (val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k MW` : `${val} MW`),
          },
          grid: { color: gridColor },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Cost Shielded (₹ Cr)',
            color: '#11181c',
            font: { family: 'Inter', size: 10, weight: '600' },
          },
          ticks: {
            color: textSecondary,
            font: { family: 'Inter', size: 9 },
            callback: (val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k Cr` : `₹${val} Cr`),
          },
          grid: { display: false },
        },
      },
    }),
    [topSectors, onSelectSector]
  );

  // 2. Top 10 Cost Shielded Champions
  const top10 = useMemo(() => {
    if (stats?.top_shielded && stats.top_shielded.length > 0) {
      return stats.top_shielded.slice(0, 10);
    }
    if (allStocks && allStocks.length > 0) {
      return [...allStocks]
        .sort((a, b) => (b.annual_shield_cr || 0) - (a.annual_shield_cr || 0))
        .slice(0, 10);
    }
    return [];
  }, [stats, allStocks]);

  const topShieldData = useMemo(() => {
    return {
      labels: top10.map((t) => (t.name.length > 15 ? t.name.substring(0, 14) + '..' : t.name)),
      datasets: [
        {
          label: 'Annual Cost Shielded (₹ Cr)',
          data: top10.map((t) => t.annual_shield_cr),
          backgroundColor: '#0066FF',
          hoverBackgroundColor: '#0052cc',
          borderRadius: 6,
        },
      ],
    };
  }, [top10]);

  const topShieldOptions = useMemo(
    () => ({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElement) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      },
      onClick: (evt, elements) => {
        if (elements.length > 0 && onSelectCompany) {
          const item = top10[elements[0].index];
          if (item?.ticker) onSelectCompany(item.ticker);
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#11181c',
          titleFont: { family: 'Inter', size: 12, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 11 },
          padding: 12,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const item = top10[items[0].dataIndex];
              return `${item.name} (${item.ticker})`;
            },
            label: (item) => {
              const d = top10[item.dataIndex];
              return [
                `Sector: ${d.sector} • ${d.cap_tier}`,
                `💰 Annual Cost Shielded: ₹${d.annual_shield_cr ? d.annual_shield_cr.toLocaleString() : 0} Cr / year`,
                `⚡ Green Capacity: ${d.re_mw ? d.re_mw.toLocaleString() : '--'} MW (${d.re_pct}%)`,
                `📈 5Y Return: ${d.ret_5y >= 0 ? '+' : ''}${d.ret_5y}%`,
                `👉 Click bar to inspect company details`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textSecondary,
            font: { family: 'Inter', size: 10 },
            callback: (val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k Cr` : `₹${val} Cr`),
          },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textSecondary, font: { family: 'Inter', size: 11, weight: '500' } },
          grid: { display: false },
        },
      },
    }),
    [top10, onSelectCompany]
  );

  // 3. Scatter: RE % vs 5Y Return
  const { leadersData, broaderData } = useMemo(() => {
    if (!allStocks || allStocks.length === 0) return { leadersData: [], broaderData: [] };

    // The first 100 stocks in allStocks are the benchmark top companies
    const top100 = allStocks.slice(0, 100).map((s) => ({
      x: s.re_pct,
      y: Math.min(Math.max(s.ret_5y || 0, -50), 600),
      raw_y: s.ret_5y,
      name: s.name,
      ticker: s.ticker,
      sector: s.sector,
      cap_tier: s.cap_tier,
      annual_shield_cr: s.annual_shield_cr,
      close_price: s.close_price,
      re_mw: s.re_mw,
    }));

    const broader = allStocks.slice(100, 250).map((s) => ({
      x: s.re_pct,
      y: Math.min(Math.max(s.ret_5y || 0, -50), 600),
      raw_y: s.ret_5y,
      name: s.name,
      ticker: s.ticker,
      sector: s.sector,
      cap_tier: s.cap_tier,
      annual_shield_cr: s.annual_shield_cr,
      close_price: s.close_price,
      re_mw: s.re_mw,
    }));

    return { leadersData: top100, broaderData: broader };
  }, [allStocks]);

  const scatterData = useMemo(() => {
    if (scatterFilter === 'leaders') {
      return {
        datasets: [
          {
            label: 'Benchmark Leaders (Top 100)',
            data: leadersData,
            backgroundColor: '#0066FF',
            borderColor: '#ffffff',
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#11181c',
            pointHoverBorderColor: '#0066FF',
            pointHoverBorderWidth: 2,
          },
        ],
      };
    }

    return {
      datasets: [
        {
          label: 'Benchmark Leaders (Top 100)',
          data: leadersData,
          backgroundColor: '#0066FF',
          borderColor: '#ffffff',
          borderWidth: 1.5,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#11181c',
          pointHoverBorderColor: '#0066FF',
          pointHoverBorderWidth: 2,
        },
        {
          label: 'Broader Market Sample',
          data: broaderData,
          backgroundColor: '#94a3b8',
          borderColor: '#ffffff',
          borderWidth: 1,
          pointRadius: 3.5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#11181c',
          pointHoverBorderColor: '#94a3b8',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [leadersData, broaderData, scatterFilter]);

  const scatterOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElement) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      },
      onClick: (evt, elements) => {
        if (elements.length > 0 && onSelectCompany) {
          const dsIdx = elements[0].datasetIndex;
          const idx = elements[0].index;
          const dataset = scatterData.datasets[dsIdx];
          const pt = dataset?.data[idx];
          if (pt?.ticker) onSelectCompany(pt.ticker);
        }
      },
      plugins: {
        legend: {
          display: scatterFilter === 'all',
          position: 'top',
          labels: { color: textSecondary, font: { family: 'Inter', size: 10 } },
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#11181c',
          titleColor: '#ffffff',
          titleFont: { family: 'Inter', size: 12, weight: 'bold' },
          bodyColor: '#e6e8eb',
          bodyFont: { family: 'Inter', size: 11 },
          padding: 12,
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            title: (items) => {
              if (!items.length) return '';
              const pt = items[0].raw;
              return `${pt.name} (${pt.ticker})`;
            },
            label: (item) => {
              const pt = item.raw;
              return [
                `Sector: ${pt.sector} • ${pt.cap_tier}`,
                `⚡ RE Share: ${pt.x?.toFixed(1)}% (${pt.re_mw ? pt.re_mw.toLocaleString() : 0} MW)`,
                `📈 5-Year Equity Return: ${pt.raw_y >= 0 ? '+' : ''}${pt.raw_y?.toFixed(1)}%`,
                `💰 Annual Cost Shielded: ₹${pt.annual_shield_cr ? pt.annual_shield_cr.toLocaleString() : 0} Cr`,
                `🏷️ CMP: ₹${pt.close_price ? pt.close_price.toLocaleString() : '--'}`,
                `👉 Click point to open full profile`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Renewable Electricity Share (%)',
            color: textSecondary,
            font: { family: 'Inter', size: 11, weight: '500' },
          },
          min: 0,
          max: 105,
          ticks: {
            color: textSecondary,
            font: { family: 'Inter', size: 10 },
            callback: (val) => `${val}%`,
          },
          grid: { color: gridColor },
        },
        y: {
          title: {
            display: true,
            text: '5-Year Stock Return (%)',
            color: textSecondary,
            font: { family: 'Inter', size: 11, weight: '500' },
          },
          ticks: {
            color: textSecondary,
            font: { family: 'Inter', size: 10 },
            callback: (val) => `${val >= 0 ? '+' : ''}${val}%`,
          },
          grid: { color: gridColor },
        },
      },
    }),
    [scatterData, scatterFilter, onSelectCompany]
  );

  // 4. Cap Doughnut
  const capData = useMemo(() => {
    const list = stats?.cap_breakdown || stats?.cap_tiers || [];
    if (list.length > 0) return list;
    if (allStocks && allStocks.length > 0) {
      const order = ['Large Cap', 'Mid Cap', 'Small Cap', 'Micro Cap'];
      return order.map((tier) => {
        const matching = allStocks.filter((s) => s.cap_tier === tier);
        const mw = matching.reduce((sum, s) => sum + (s.re_mw || 0), 0);
        return {
          cap_tier: tier,
          count: matching.length,
          total_mw: Math.round(mw * 10) / 10,
        };
      });
    }
    return [];
  }, [stats, allStocks]);

  const totalCapMW = useMemo(() => {
    return capData.reduce((sum, c) => sum + (c.total_mw || 0), 0);
  }, [capData]);

  const doughnutData = useMemo(() => {
    const colorsMap = {
      'Large Cap': '#0066FF',
      'Mid Cap': '#10B981',
      'Small Cap': '#F59E0B',
      'Micro Cap': '#64748B',
    };

    return {
      labels: capData.map((c) => c.cap_tier),
      datasets: [
        {
          data: capData.map((c) => c.total_mw),
          backgroundColor: capData.map((c) => colorsMap[c.cap_tier] || '#687076'),
          hoverBackgroundColor: capData.map((c) => colorsMap[c.cap_tier] || '#687076'),
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, [capData]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onHover: (event, chartElement) => {
        if (event.native?.target) {
          event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        }
      },
      onClick: (evt, elements) => {
        if (elements.length > 0 && onSelectCap) {
          const idx = elements[0].index;
          const tier = capData[idx]?.cap_tier;
          if (tier) onSelectCap(tier);
        }
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textSecondary,
            font: { family: 'Inter', size: 11, weight: '500' },
            generateLabels: (chart) => {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const val = data.datasets[0].data[i] || 0;
                  const pct = totalCapMW > 0 ? ((val / totalCapMW) * 100).toFixed(1) : 0;
                  return {
                    text: `${label} (${pct}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: '#ffffff',
                    lineWidth: 1,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        tooltip: {
          backgroundColor: '#11181c',
          titleFont: { family: 'Inter', size: 12, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 11 },
          padding: 12,
          cornerRadius: 6,
          callbacks: {
            label: (item) => {
              const val = item.raw || 0;
              const pct = totalCapMW > 0 ? ((val / totalCapMW) * 100).toFixed(1) : 0;
              const c = capData[item.dataIndex];
              return [
                `⚡ Clean Capacity: ${Math.round(val).toLocaleString()} MW (${pct}%)`,
                `🏢 Companies: ${c?.count?.toLocaleString() || '--'}`,
                onSelectCap ? `👉 Click slice to filter table by ${c?.cap_tier}` : '',
              ].filter(Boolean);
            },
          },
        },
      },
      cutout: '66%',
    }),
    [capData, totalCapMW, onSelectCap]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ duration: 0.5, ease: EASINGS.materialEntrance }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
    >
      {/* Chart 1: Sector Bar Chart */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-accent" />
              Top 8 Sectors: Green Capacity &amp; Cost Shielded
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Dual-scale comparison • Click bar to filter table
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-surface-muted text-text-secondary border border-border">
            Green MW vs ₹ Cr
          </span>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Bar data={sectorData} options={sectorOptions} />
        </div>
      </div>

      {/* Chart 2: Top 10 Cost Shielded Champions */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Top 10 Energy Cost Shielded Champions
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Annual Utility Bill Savings (₹ Cr/Year) • Click bar for company dossier
            </p>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-accent font-medium border border-blue-100">
            Clickable
          </span>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Bar data={topShieldData} options={topShieldOptions} />
        </div>
      </div>

      {/* Chart 3: Scatter Plot */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Renewable Electricity Share (%) vs 5-Year Equity Returns
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Multi-year returns vs clean adoption • Click point for details
            </p>
          </div>
          <div className="inline-flex rounded-btn border border-border bg-surface-muted p-0.5 self-start sm:self-auto">
            <button
              onClick={() => setScatterFilter('leaders')}
              className={`px-2.5 py-1 text-xs font-medium rounded-[5px] transition-colors ${
                scatterFilter === 'leaders'
                  ? 'bg-white text-text-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Top 100 Leaders
            </button>
            <button
              onClick={() => setScatterFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-[5px] transition-colors ${
                scatterFilter === 'all'
                  ? 'bg-white text-text-primary shadow-xs font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              All Market
            </button>
          </div>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      {/* Chart 4: Market Cap Tier Doughnut */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-text-primary flex items-center gap-2">
              <PieChart className="w-4 h-4 text-text-secondary" />
              Renewable Capacity by Market Cap Tier
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Portfolio distribution • Click slice to filter table
            </p>
          </div>
          <span className="text-xs font-semibold text-accent">
            {totalCapMW > 0 ? `${Math.round(totalCapMW).toLocaleString()} MW Total` : ''}
          </span>
        </div>
        <div className="h-64 sm:h-72 w-full">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </motion.section>
  );
}
