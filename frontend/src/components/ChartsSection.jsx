import React from 'react';
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

export default function ChartsSection({ stats, allStocks, onSelectCompany }) {
  if (!stats) return null;

  const textSecondary = '#687076';
  const gridColor = '#f1f3f5';

  // 1. Sector Bar Chart
  const topSectors = (stats.sector_breakdown || []).slice(0, 8);
  const sectorData = {
    labels: topSectors.map((s) => s.sector.replace('&', '\n&')),
    datasets: [
      {
        label: 'Green MW',
        data: topSectors.map((s) => s.total_mw),
        backgroundColor: '#0066FF',
        borderRadius: 6,
      },
      {
        label: 'Cost Shielded (₹ Cr)',
        data: topSectors.map((s) => s.total_shield_cr),
        backgroundColor: '#11181c',
        borderRadius: 6,
      },
    ],
  };

  const sectorOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textSecondary, font: { family: 'Inter', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#11181c',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: { color: textSecondary, font: { family: 'Inter', size: 9 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: textSecondary, font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor },
      },
    },
  };

  // 2. Top 10 Cost Shielded
  const top10 = stats.top_shielded || [];
  const topShieldData = {
    labels: top10.map((t) => (t.name.length > 16 ? t.name.substring(0, 15) + '..' : t.name)),
    datasets: [
      {
        label: 'Annual Cost Shielded (₹ Cr)',
        data: top10.map((t) => t.annual_shield_cr),
        backgroundColor: '#0066FF',
        borderRadius: 6,
      },
    ],
  };

  const topShieldOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
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
              `💰 Cost Shielded: ₹${d.annual_shield_cr.toLocaleString()} Cr / year`,
              `⚡ Green Capacity: ${d.re_mw ? d.re_mw.toLocaleString() : '--'} MW (${d.re_pct}%)`,
              `📈 5Y Return: +${d.ret_5y}%`,
            ];
          },
        },
      },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0) {
        const item = top10[elements[0].index];
        if (item && item.ticker) onSelectCompany(item.ticker);
      }
    },
    scales: {
      x: {
        ticks: { color: textSecondary, font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: textSecondary, font: { family: 'Inter', size: 11, weight: '500' } },
        grid: { display: false },
      },
    },
  };

  // 3. Scatter: RE % vs 5Y Return with Full Company Name Tooltips
  const scatterPoints = (allStocks || []).slice(0, 350).map((s) => ({
    x: s.re_pct,
    y: Math.min(s.ret_5y, 800),
    name: s.name,
    ticker: s.ticker,
    sector: s.sector,
    cap_tier: s.cap_tier,
    annual_shield_cr: s.annual_shield_cr,
    close_price: s.close_price,
    ret_5y_raw: s.ret_5y,
  }));

  const scatterData = {
    datasets: [
      {
        label: 'Companies',
        data: scatterPoints,
        backgroundColor: '#0066FF',
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#11181c',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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
              `⚡ RE Electricity Share: ${pt.x.toFixed(1)}%`,
              `📈 5-Year Equity Return: ${pt.ret_5y_raw >= 0 ? '+' : ''}${pt.ret_5y_raw.toFixed(1)}%`,
              `💰 Annual Cost Shielded: ₹${pt.annual_shield_cr.toLocaleString()} Cr`,
              `🏷️ CMP: ₹${pt.close_price.toLocaleString()}`,
              `👉 Click to inspect company details`,
            ];
          },
        },
      },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0) {
        const pt = scatterPoints[elements[0].index];
        if (pt && pt.ticker) onSelectCompany(pt.ticker);
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Renewable Electricity Share (%)',
          color: textSecondary,
          font: { family: 'Inter', size: 11 },
        },
        ticks: { color: textSecondary, font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor },
      },
      y: {
        title: {
          display: true,
          text: '5-Year Stock Return (%)',
          color: textSecondary,
          font: { family: 'Inter', size: 11 },
        },
        ticks: { color: textSecondary, font: { family: 'Inter', size: 10 } },
        grid: { color: gridColor },
      },
    },
  };

  // 4. Cap Doughnut
  const capData = stats.cap_breakdown || [];
  const doughnutData = {
    labels: capData.map((c) => c.cap_tier),
    datasets: [
      {
        data: capData.map((c) => c.total_mw),
        backgroundColor: ['#0066FF', '#11181c', '#687076', '#a1a7ac'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: textSecondary, font: { family: 'Inter', size: 11 } },
      },
      tooltip: {
        backgroundColor: '#11181c',
        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 6,
      },
    },
    cutout: '68%',
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ duration: 0.5, ease: EASINGS.materialEntrance }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
    >
      {/* Chart 1 */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Top 8 Sectors: Green Capacity &amp; Cost Shielded
          </h3>
          <span className="text-xs text-text-secondary">Green MW vs ₹ Cr Shielded</span>
        </div>
        <div className="h-64 w-full">
          <Bar data={sectorData} options={sectorOptions} />
        </div>
      </div>

      {/* Chart 2 */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Top 10 Energy Cost Shielded Champions (₹ Crore/Year)
          </h3>
          <span className="text-xs text-text-secondary">Utility Bill Savings</span>
        </div>
        <div className="h-64 w-full">
          <Bar data={topShieldData} options={topShieldOptions} />
        </div>
      </div>

      {/* Chart 3 */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Renewable Electricity Share (%) vs 5-Year Equity Returns
          </h3>
          <span className="text-xs text-text-secondary">Hover for company profile</span>
        </div>
        <div className="h-64 w-full">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      {/* Chart 4 */}
      <div className="p-5 rounded-card bg-surface border border-border shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-text-primary">
            Renewable Capacity by Market Cap Tier
          </h3>
          <span className="text-xs text-text-secondary">Large vs Mid vs Small vs Micro</span>
        </div>
        <div className="h-64 w-full">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
    </motion.section>
  );
}
