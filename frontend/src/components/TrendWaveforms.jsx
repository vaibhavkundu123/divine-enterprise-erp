import React, { useState, useRef } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

// Format short date for X-axis ticks: "2026-08-21" -> "Aug 21"
function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const m = months[parseInt(parts[1], 10) - 1] || parts[1];
    const d = parseInt(parts[2], 10);
    return `${m} ${d}`;
  }
  return dateStr;
}

// Format full date for tooltip: "2026-08-21" -> "Friday, Aug 21, 2026"
function formatFullDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-').map(Number);
    if (parts.length === 3) {
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  } catch (_) {}
  return dateStr;
}

// Calculate human-friendly round tick marks including zero
function calculateNiceTicks(minVal, maxVal, targetTicks = 5) {
  const adjustedMin = minVal < 0 ? minVal : 0;
  const adjustedMax = maxVal > 0 ? maxVal : 100;
  const rawRange = adjustedMax - adjustedMin;
  const rawStep = rawRange / (targetTicks - 1 || 1);

  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep || 1)));
  const residual = rawStep / magnitude;

  let niceStep;
  if (residual <= 1.5) niceStep = 1 * magnitude;
  else if (residual <= 3) niceStep = 2.5 * magnitude;
  else if (residual <= 7) niceStep = 5 * magnitude;
  else niceStep = 10 * magnitude;

  if (niceStep <= 0) niceStep = 100;

  const tickMin = Math.floor(adjustedMin / niceStep) * niceStep;
  const tickMax = Math.ceil(adjustedMax / niceStep) * niceStep;

  const ticks = [];
  for (let val = tickMin; val <= tickMax + niceStep * 0.05; val += niceStep) {
    ticks.push(Math.round(val));
  }

  return { ticks, niceMin: tickMin, niceMax: tickMax };
}

export default function TrendWaveforms({ waveforms = [], horizon = '30D', onHorizonChange }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const svgRef = useRef(null);

  if (!waveforms || waveforms.length === 0) {
    return (
      <div className="glass-panel p-10 text-center text-slate-400">
        <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-pulse" />
        <p className="text-sm font-medium">No financial telemetry available for current range.</p>
      </div>
    );
  }

  // Calculate aggregated period totals for header overview
  const periodRevenue = waveforms.reduce((acc, w) => acc + (w.gross_revenue || 0), 0);
  const periodCOGS = waveforms.reduce((acc, w) => acc + (w.cogs || 0), 0);
  const periodNetProfit = waveforms.reduce((acc, w) => acc + (w.net_profit || 0), 0);
  const periodUnits = waveforms.reduce((acc, w) => acc + (w.units_sold || 0), 0);
  const periodMargin = periodRevenue > 0 ? (periodNetProfit / periodRevenue) * 100 : 0;

  // Max units for volume scale
  const maxUnits = Math.max(...waveforms.map((w) => w.units_sold || 0), 1);

  // Chart dimensions
  const width = 960;
  const height = 300;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max and Min values for Y scale
  const rawMax = Math.max(...waveforms.map((w) => Math.max(w.gross_revenue || 0, w.cogs || 0, w.net_profit || 0, 100)));
  const rawMin = Math.min(...waveforms.map((w) => Math.min(w.net_profit || 0, 0)));

  const { ticks, niceMin, niceMax } = calculateNiceTicks(rawMin, rawMax, 5);
  const range = niceMax - niceMin || 1;

  const getX = (index) => paddingLeft + (index / (waveforms.length - 1 || 1)) * chartWidth;
  const getY = (val) => height - paddingBottom - ((val - niceMin) / range) * chartHeight;

  const baselineZeroY = getY(0);

  // Generate smooth cubic bezier paths with boundary safeguards
  const createPath = (key) => {
    if (waveforms.length === 0) return '';
    if (waveforms.length === 1) return `M ${getX(0)} ${getY(waveforms[0][key] || 0)}`;

    const points = waveforms.map((w, i) => ({
      x: getX(i),
      y: getY(w[key] !== undefined ? w[key] : 0),
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i < points.length - 2 ? points[i + 2] : p2;

      // Natural cubic smoothing factor
      const tension = 6;
      const cp1x = p1.x + (p2.x - p0.x) / tension;
      const cp1y = p1.y + (p2.y - p0.y) / tension;
      const cp2x = p2.x - (p3.x - p1.x) / tension;
      const cp2y = p2.y - (p3.y - p1.y) / tension;

      path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    return path;
  };

  const revenuePath = createPath('gross_revenue');
  const cogsPath = createPath('cogs');
  const netProfitPath = createPath('net_profit');

  // Closed area under Gross Revenue for aesthetic soft fill
  const firstX = getX(0);
  const lastX = getX(waveforms.length - 1);
  const revenueArea = `${revenuePath} L ${lastX} ${baselineZeroY} L ${firstX} ${baselineZeroY} Z`;

  // Select evenly spaced indices for X-axis date labels
  const maxLabels = waveforms.length <= 7 ? waveforms.length : 6;
  const labelStep = Math.max(1, Math.floor((waveforms.length - 1) / (maxLabels - 1)));
  const xLabelIndices = [];
  for (let i = 0; i < waveforms.length; i += labelStep) {
    xLabelIndices.push(i);
  }
  // Ensure the final data point is always represented
  if (xLabelIndices[xLabelIndices.length - 1] !== waveforms.length - 1) {
    xLabelIndices.push(waveforms.length - 1);
  }

  // Pointer scrubbing handler across entire chart surface
  const handlePointerMove = (e) => {
    if (!svgRef.current || waveforms.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;

    const mouseX = ((clientX - rect.left) / rect.width) * width;
    const clampedX = Math.max(paddingLeft, Math.min(width - paddingRight, mouseX));
    const ratio = (clampedX - paddingLeft) / chartWidth;
    const idx = Math.min(Math.max(Math.round(ratio * (waveforms.length - 1)), 0), waveforms.length - 1);
    setHoveredIndex(idx);
  };

  const hoveredPoint = hoveredIndex !== null && waveforms[hoveredIndex] ? waveforms[hoveredIndex] : null;
  const hoveredNetMargin = hoveredPoint && hoveredPoint.gross_revenue > 0
    ? ((hoveredPoint.net_profit / hoveredPoint.gross_revenue) * 100).toFixed(1)
    : null;

  return (
    <div className="glass-panel p-5 sm:p-6 select-none relative">
      {/* 1. Header Bar: Title, Horizon Toggle, and Dynamic Metric Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-heading tracking-tight flex items-center gap-2">
                Financial Trends & Margin Velocity
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {waveforms.length} Points
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-axis synchronized tracking of Gross Revenue, Procurement COGS, Realized Net Profit, and Units Sold
              </p>
            </div>
          </div>
        </div>

        {/* Horizon Selector Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shrink-0 self-start sm:self-center">
          {[
            { id: '7D', label: '7 Days' },
            { id: '30D', label: '30 Days' },
            { id: 'ALL', label: 'All Time' },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => onHorizonChange && onHorizonChange(h.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                horizon === h.id
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/25 border border-blue-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Telemetry Bar: Legend + Active Cursor Metrics */}
      <div className="flex items-center justify-between gap-4 text-xs mb-3 flex-wrap min-h-[32px]">
        {/* Metric Color Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
            <span className="text-slate-200 font-medium">Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            <span className="text-slate-200 font-medium">Net Realized Profit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-sm bg-rose-400 shadow-sm shadow-rose-400/50"></span>
            <span className="text-slate-300 font-medium">Procurement COGS (Dashed)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 shadow-sm shadow-purple-400/50"></span>
            <span className="text-purple-300 font-medium">Units Sold (Volume)</span>
          </div>
        </div>

        {/* Live Scrubber Data Display */}
        {hoveredPoint ? (
          <div className="flex items-center gap-2.5 sm:gap-4 text-xs bg-slate-900/90 px-3.5 py-1.5 rounded-lg border border-blue-500/30 shadow-md font-mono animate-fade-in flex-wrap">
            <span className="text-white font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              {formatFullDate(hoveredPoint.date)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-300 font-semibold">
              Units: {hoveredPoint.units_sold || 0}
            </span>
            <span className="text-blue-400 font-semibold">
              Rev: {formatCurrency(hoveredPoint.gross_revenue)}
            </span>
            <span className="text-rose-400">
              COGS: {formatCurrency(hoveredPoint.cogs)}
            </span>
            <span className={hoveredPoint.net_profit >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              Net: {formatCurrency(hoveredPoint.net_profit)}
              {hoveredNetMargin !== null && ` (${hoveredNetMargin}%)`}
            </span>
            {hoveredPoint.ad_spend > 0 && (
              <span className="text-amber-400 text-[11px]">
                Ads: {formatCurrency(hoveredPoint.ad_spend)}
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Period Units: <strong className="text-purple-300">{periodUnits}</strong></span>
            <span className="text-slate-700">•</span>
            <span>Period Rev: <strong className="text-slate-200">{formatCurrency(periodRevenue)}</strong></span>
            <span className="text-slate-700">•</span>
            <span>Period Net: <strong className={periodNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatCurrency(periodNetProfit)} ({periodMargin.toFixed(1)}%)</strong></span>
            <span className="text-slate-500 text-[11px] hidden md:inline ml-2">(Move cursor over chart to inspect)</span>
          </div>
        )}
      </div>

      {/* 3. SVG Financial Chart Surface with Crosshair & Full Column Scrubbing */}
      <div className="relative overflow-hidden w-full select-none bg-slate-950/40 rounded-xl border border-slate-800/80 p-1 sm:p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-64 sm:h-72 cursor-crosshair overflow-visible touch-none"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={() => setHoveredIndex(null)}
          onTouchEnd={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Soft ambient gradient glow for revenue wave */}
            <linearGradient id="revenueSoftGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing filter for active crosshair markers */}
            <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Y-Axis Gridlines & Labels */}
          {ticks.map((val) => {
            const y = getY(val);
            const isZero = val === 0;
            return (
              <g key={`y-tick-${val}`}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isZero ? '#475569' : '#1e293b'}
                  strokeWidth={isZero ? 1.5 : 1}
                  strokeDasharray={isZero ? '5 5' : 'none'}
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  fill={isZero ? '#f1f5f9' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isZero ? '700' : '400'}
                >
                  {formatCurrency(val, 0)}
                </text>
              </g>
            );
          })}

          {/* Baseline X-Axis Line */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#334155"
            strokeWidth="1.2"
          />

          {/* X-Axis Date Ticks & Labels */}
          {xLabelIndices.map((idx) => {
            const point = waveforms[idx];
            if (!point) return null;
            const x = getX(idx);
            const isLast = idx === waveforms.length - 1;
            return (
              <g key={`x-tick-${idx}`}>
                <line
                  x1={x}
                  y1={height - paddingBottom}
                  x2={x}
                  y2={height - paddingBottom + 5}
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 20}
                  textAnchor={isLast ? 'end' : idx === 0 ? 'start' : 'middle'}
                  fill={hoveredIndex === idx ? '#60a5fa' : '#94a3b8'}
                  fontSize="11"
                  fontWeight={hoveredIndex === idx ? '700' : '500'}
                  fontFamily="monospace"
                >
                  {formatShortDate(point.date)}
                </text>
              </g>
            );
          })}

          {/* Units Sold Volume Bars (Purple) along zero baseline */}
          {waveforms.map((w, idx) => {
            const units = w.units_sold || 0;
            if (units <= 0 || maxUnits <= 0) return null;
            const x = getX(idx);
            const barW = Math.max(4, Math.min(18, (chartWidth / waveforms.length) * 0.55));
            const barH = Math.max(4, (units / maxUnits) * 44);
            const y = baselineZeroY - barH;
            const isHovered = hoveredIndex === idx;
            return (
              <rect
                key={`bar-units-${idx}`}
                x={x - barW / 2}
                y={y}
                width={barW}
                height={barH}
                fill="#a855f7"
                rx={2}
                opacity={isHovered ? 0.95 : 0.45}
                className="transition-opacity duration-150"
              />
            );
          })}

          {/* Ambient Revenue Area Fill */}
          <path d={revenueArea} fill="url(#revenueSoftGlow)" />

          {/* 1. Procurement COGS Wave (Pink/Rose Dashed) */}
          <path
            d={cogsPath}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 2. Gross Revenue Wave (Electric Blue Solid) */}
          <path
            d={revenuePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3. Net Realized Profit Wave (Emerald Green Solid) */}
          <path
            d={netProfitPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Static dots for all data points */}
          {waveforms.map((w, idx) => {
            const x = getX(idx);
            const yRev = getY(w.gross_revenue || 0);
            return (
              <circle
                key={`static-pt-${idx}`}
                cx={x}
                cy={yRev}
                r={waveforms.length > 20 ? 2 : 2.5}
                fill="#1e293b"
                stroke="#3b82f6"
                strokeWidth="1.5"
                opacity="0.75"
              />
            );
          })}

          {/* Active Hover Crosshair Guideline & Synchronized Metric Rings */}
          {hoveredIndex !== null && hoveredPoint && (
            <g className="transition-all duration-75 pointer-events-none">
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={height - paddingBottom}
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.9"
              />

              {/* Gross Revenue Active Target */}
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(hoveredPoint.gross_revenue || 0)}
                r={6}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="url(#markerGlow)"
              />

              {/* Procurement COGS Active Target */}
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(hoveredPoint.cogs || 0)}
                r={5}
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="2"
              />

              {/* Net Profit Active Target */}
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(hoveredPoint.net_profit || 0)}
                r={6}
                fill={hoveredPoint.net_profit >= 0 ? '#10b981' : '#f43f5e'}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Invisible full-chart overlay to capture mouse movement smoothly */}
          <rect
            x={paddingLeft}
            y={paddingTop}
            width={chartWidth}
            height={chartHeight + 10}
            fill="transparent"
            className="cursor-crosshair"
          />
        </svg>

        {/* Dynamic Floating Tooltip Badge positioned relative to active scrubber */}
        {hoveredIndex !== null && hoveredPoint && (
          <div
            className="hidden sm:block absolute top-6 z-20 pointer-events-none transition-all duration-75"
            style={{
              left: `${(getX(hoveredIndex) / width) * 100}%`,
              transform: getX(hoveredIndex) > width * 0.65 ? 'translateX(-105%)' : 'translateX(16px)',
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl min-w-[210px] text-xs space-y-1.5">
              <div className="font-bold text-white pb-1 border-b border-slate-800 flex items-center justify-between">
                <span>{formatFullDate(hoveredPoint.date)}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  Day #{hoveredIndex + 1}
                </span>
              </div>
              <div className="flex items-center justify-between text-blue-400 font-medium">
                <span>Gross Revenue:</span>
                <span className="font-bold font-mono">{formatCurrency(hoveredPoint.gross_revenue)}</span>
              </div>
              <div className="flex items-center justify-between text-rose-400 font-medium">
                <span>Procurement COGS:</span>
                <span className="font-mono">{formatCurrency(hoveredPoint.cogs)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 font-medium pt-1 border-t border-slate-800/60">
                <span>Realized Net Profit:</span>
                <span className={`font-bold font-mono ${hoveredPoint.net_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(hoveredPoint.net_profit)}
                </span>
              </div>
              <div className="flex items-center justify-between text-purple-400 font-medium">
                <span>Units Sold:</span>
                <span className="font-bold font-mono">{hoveredPoint.units_sold || 0} units</span>
              </div>
              {hoveredNetMargin !== null && (
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Net Profit Margin:</span>
                  <span className={`font-bold ${hoveredPoint.net_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {hoveredNetMargin}%
                  </span>
                </div>
              )}
              {hoveredPoint.ad_spend > 0 && (
                <div className="flex items-center justify-between text-amber-400 text-[11px]">
                  <span>Ad Spend:</span>
                  <span className="font-mono">{formatCurrency(hoveredPoint.ad_spend)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

