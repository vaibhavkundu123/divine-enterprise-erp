import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Calculator,
  Compass,
  ArrowRight,
  ShieldCheck,
  Undo2,
  ArrowLeftRight,
  Truck,
  Megaphone,
  Landmark,
  History,
  Layers,
  BarChart3,
  Sliders,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { MASTER_TOUR_STEPS, TAB_TOURS } from '../utils/tourSteps';

export default function InteractiveTour({
  isOpen,
  onClose,
  tourMode = 'master', // 'master' | 'tab'
  activeTab = 'dashboard',
  onNavigateTab,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState(tourMode);

  // --- Interactive Play Simulation States ---
  // 1. Sales Simulation
  const [simQty, setSimQty] = useState(3);
  const [simPrice, setSimPrice] = useState(48);
  const simCost = 14.5;

  // 2. Stock Simulation
  const [simInward, setSimInward] = useState(100);
  const [simDispatched, setSimDispatched] = useState(65);
  const [simRestocked, setSimRestocked] = useState(12);

  // 3. RTO 3-Stage Pipeline State
  const [rtoStage, setRtoStage] = useState('dock'); // 'transit' | 'dock' | 'restocked' | 'damaged'

  // 4. Marketing ROAS Simulation
  const [simAdSpend, setSimAdSpend] = useState(1200);
  const [simAdRev, setSimAdRev] = useState(4600);

  // 5. Returns QC Simulation
  const [qcGrade, setQcGrade] = useState('gradeA'); // 'gradeA' | 'gradeB' | 'damaged' | 'dispute'

  // Sync mode and reset step when tour opens or target changes
  useEffect(() => {
    if (isOpen) {
      setMode(tourMode);
      setCurrentStep(0);
    }
  }, [isOpen, tourMode, activeTab]);

  // Keyboard navigation listener (Esc to exit, Arrow keys to navigate)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, mode, activeTab]);

  if (!isOpen) return null;

  // Determine current steps array
  const isMaster = mode === 'master';
  const steps = isMaster
    ? MASTER_TOUR_STEPS
    : (TAB_TOURS[activeTab]?.steps || []);

  const totalSteps = steps.length;
  const currentData = steps[currentStep] || steps[0];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Auto-navigate tab if in Master Tour
  const syncTabForStep = (stepIndex) => {
    if (isMaster && MASTER_TOUR_STEPS[stepIndex]?.tab && onNavigateTab) {
      onNavigateTab(MASTER_TOUR_STEPS[stepIndex].tab);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      syncTabForStep(nextIndex);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      syncTabForStep(prevIndex);
    }
  };

  const jumpToStep = (index) => {
    setCurrentStep(index);
    syncTabForStep(index);
  };

  const toggleMode = (newMode) => {
    setMode(newMode);
    setCurrentStep(0);
    if (newMode === 'master') {
      syncTabForStep(0);
    }
  };

  // Calculations for Sales simulation
  const simRevenue = simQty * simPrice;
  const simCogs = simQty * simCost;
  const simProfit = simRevenue - simCogs;
  const simMargin = simRevenue > 0 ? ((simProfit / simRevenue) * 100).toFixed(1) : 0;

  // Calculations for Stock simulation
  const simUsableStock = Math.max(0, simInward - simDispatched + simRestocked);
  let stockHealth = 'Star';
  let stockHealthClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
  if (simUsableStock === 0) {
    stockHealth = 'Depleted';
    stockHealthClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (simUsableStock < 10) {
    stockHealth = 'Low';
    stockHealthClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (simUsableStock < 30) {
    stockHealth = 'Adequate';
    stockHealthClass = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  }

  // Calculations for ROAS simulation
  const simRoas = simAdSpend > 0 ? (simAdRev / simAdSpend).toFixed(2) : '0.00';
  let roasTier = 'Profitable';
  let roasTierBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  let roasGuidance = 'Healthy commercial scale.';
  if (parseFloat(simRoas) >= 4.0) {
    roasTier = 'Exceptional';
    roasTierBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    roasGuidance = 'Scale marketing budget aggressively.';
  } else if (parseFloat(simRoas) < 1.5) {
    roasTier = 'Sub-threshold';
    roasTierBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    roasGuidance = 'Pause creative or optimize targeting immediately.';
  } else if (parseFloat(simRoas) < 2.5) {
    roasTier = 'Marginal';
    roasTierBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    roasGuidance = 'Audit creative assets and conversion rates.';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Dimmed Blurred Backdrop with Spotlight Effect */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
      />

      {/* Floating Tour Card */}
      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-slate-900/98 via-[#0c1222]/98 to-[#090e1a]/98 border border-blue-500/35 rounded-2xl shadow-2xl shadow-blue-500/10 backdrop-blur-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glowing Top Progress Bar */}
        <div className="w-full h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Top Header & Tour Mode Switcher */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-lg text-white shadow-md shrink-0 ${
                isMaster
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20'
                  : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono tracking-wider uppercase text-slate-200 truncate">
                  {isMaster ? 'Master System Tour' : (TAB_TOURS[activeTab]?.title || 'Tab Guide')}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                    isMaster
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  Step {currentStep + 1} of {totalSteps}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>{progressPercent}% Complete</span>
                <span>•</span>
                <span className="text-slate-500 hidden sm:inline">Use [←] [→] or [ESC]</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Mode Toggle */}
            <button
              onClick={() => toggleMode(isMaster ? 'tab' : 'master')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all cursor-pointer"
              title={isMaster ? 'Switch to contextual tab guide' : 'Switch to full master tour'}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline font-semibold">
                {isMaster ? 'Active Tab Guide' : 'Master Tour'}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Tour (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Step Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 scrollbar-thin">
          
          {/* Step Badge & Heading */}
          <div>
            <span className="text-[10px] sm:text-[11px] font-bold font-mono uppercase tracking-wider text-blue-400">
              {currentData?.badge || `STEP ${currentStep + 1}`}
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5 font-heading">
              {currentData?.title}
            </h2>
            {currentData?.summary && (
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1 leading-snug">
                {currentData.summary}
              </p>
            )}
          </div>

          {/* Main Description Box */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 sm:p-4 rounded-xl border border-slate-800/80 shadow-inner">
            {currentData?.description}
          </div>

          {/* Key Points Bullet List (if present in step) */}
          {currentData?.keyPoints && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Architectural Features & Rules</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                {currentData.keyPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 sm:p-2.5 rounded-lg border border-slate-700/40"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operator Tip (for Tab Guides) */}
          {currentData?.tip && (
            <div className="flex items-start gap-2.5 p-3 sm:p-3.5 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-blue-200">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-300">Operator Tip: </span>
                <span>{currentData.tip}</span>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* INTERACTIVE PLAY SIMULATIONS FOR CORE ERP SUBSYSTEMS           */}
          {/* ============================================================== */}

          {/* 1. SALES SIMULATION (Master Tour Step 2 or Sales Tab Guide) */}
          {((isMaster && currentData?.id === 'master-sales') || (!isMaster && activeTab === 'sales')) && (
            <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900/80 border border-indigo-500/35 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 font-mono uppercase">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Play Simulation: Test Live Profit Math</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Zero-Drift Preview</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 text-[11px] font-medium">Units Sold (Quantity):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={simQty}
                    onChange={(e) => setSimQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px] font-medium">Selling Price ($ / unit):</label>
                  <input
                    type="number"
                    min="1"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-indigo-500/20 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">Revenue</div>
                  <div className="font-bold text-white">${simRevenue.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">COGS (@$14.50)</div>
                  <div className="font-bold text-slate-300">${simCogs.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Gross Profit</div>
                  <div className="font-bold text-emerald-400">${simProfit.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Margin %</div>
                  <div className="font-bold text-indigo-300">{simMargin}%</div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STOCK BALANCE SIMULATION (Master Tour Step 3 or Stock Tab Guide) */}
          {((isMaster && currentData?.id === 'master-stock') || (!isMaster && activeTab === 'stock')) && (
            <div className="p-4 bg-gradient-to-br from-blue-950/30 to-slate-900/80 border border-blue-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 font-mono uppercase">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Interactive Stock Equation & Dynamic Health Status</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border font-mono ${stockHealthClass}`}>
                  {stockHealth} ({simUsableStock} units)
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-slate-400 text-[11px]">Factory Inward:</label>
                  <input
                    type="number"
                    min="0"
                    value={simInward}
                    onChange={(e) => setSimInward(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Dispatched:</label>
                  <input
                    type="number"
                    min="0"
                    value={simDispatched}
                    onChange={(e) => setSimDispatched(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Restocked:</label>
                  <input
                    type="number"
                    min="0"
                    value={simRestocked}
                    onChange={(e) => setSimRestocked(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-2 bg-slate-950/90 rounded border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Formula: Inward ({simInward}) - Dispatched ({simDispatched}) + Restocked ({simRestocked})</span>
                <span className="text-emerald-400 font-bold">= {simUsableStock} Usable Units</span>
              </div>
            </div>
          )}

          {/* 3. RTO 3-STAGE PIPELINE SIMULATION (Master Tour Step 4 or RTO Tab Guide) */}
          {((isMaster && currentData?.id === 'master-rto') || (!isMaster && activeTab === 'rto')) && (
            <div className="p-4 bg-gradient-to-br from-amber-950/25 to-slate-900/80 border border-amber-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 font-mono uppercase">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Interactive 3-Stage Reverse Logistics Pipeline</span>
                </div>
                <span className="text-[10px] text-slate-400">Click a stage to simulate</span>
              </div>

              {/* Interactive Stage Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setRtoStage('transit')}
                  className={`p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer border ${
                    rtoStage === 'transit'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Stage 1</div>
                  <div className="text-xs">In-Transit</div>
                </button>

                <button
                  onClick={() => setRtoStage('dock')}
                  className={`p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer border ${
                    rtoStage === 'dock'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Stage 2</div>
                  <div className="text-xs">Dock Quarantine</div>
                </button>

                <button
                  onClick={() => setRtoStage('restocked')}
                  className={`p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer border ${
                    rtoStage === 'restocked'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Stage 3a</div>
                  <div className="text-xs">Restocked (+1)</div>
                </button>

                <button
                  onClick={() => setRtoStage('damaged')}
                  className={`p-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer border ${
                    rtoStage === 'damaged'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Stage 3b</div>
                  <div className="text-xs">Damaged Loss</div>
                </button>
              </div>

              {/* Dynamic State Description */}
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs text-slate-300">
                {rtoStage === 'transit' && (
                  <p>🚚 <strong>Stage 1 (IN_TRANSIT):</strong> Delivery failed. Parcel is traveling in courier vans. Sellable stock is unaffected.</p>
                )}
                {rtoStage === 'dock' && (
                  <p>🛡️ <strong>Stage 2 (RECEIVED):</strong> Box is held in warehouse intake quarantine. <em>It cannot be sold until staff inspects condition.</em></p>
                )}
                {rtoStage === 'restocked' && (
                  <p>✅ <strong>Stage 3a (RESTOCKED):</strong> Condition is pristine. 1-click adds +1 to active sellable stock immediately.</p>
                )}
                {rtoStage === 'damaged' && (
                  <p>❌ <strong>Stage 3b (DAMAGED):</strong> Parcel was crushed in transit. Absorbed as inventory loss; <em>never touches active stock.</em></p>
                )}
              </div>
            </div>
          )}

          {/* 4. BLENDED ROAS SIMULATION (Master Tour Step 8 or Ads Tab Guide) */}
          {((isMaster && currentData?.id === 'master-ads') || (!isMaster && activeTab === 'ads')) && (
            <div className="p-4 bg-gradient-to-br from-purple-950/30 to-slate-900/80 border border-purple-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300 font-mono uppercase">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                  <span>Interactive ROAS Benchmark & Scaling Tier</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border font-mono ${roasTierBadge}`}>
                  {roasTier} ({simRoas}x)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 text-[11px]">Total Ad Spend ($):</label>
                  <input
                    type="number"
                    min="1"
                    value={simAdSpend}
                    onChange={(e) => setSimAdSpend(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-[11px]">Dispatched Revenue ($):</label>
                  <input
                    type="number"
                    min="1"
                    value={simAdRev}
                    onChange={(e) => setSimAdRev(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/90 rounded border border-purple-500/20 text-xs font-mono flex items-center justify-between text-slate-300">
                <span>Blended ROAS: ${simAdRev} / ${simAdSpend} = <strong className="text-white">{simRoas}x</strong></span>
                <span className="text-purple-300 text-[11px] font-sans font-medium">{roasGuidance}</span>
              </div>
            </div>
          )}

          {/* 5. CUSTOMER RETURNS QC SIMULATION (Master Tour Step 5 or Returns Tab Guide) */}
          {((isMaster && currentData?.id === 'master-returns') || (!isMaster && activeTab === 'returns')) && (
            <div className="p-4 bg-gradient-to-br from-rose-950/20 to-slate-900/80 border border-rose-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300 font-mono uppercase">
                  <Undo2 className="w-4 h-4 text-rose-400" />
                  <span>Interactive QC Grading & Decision Hub</span>
                </div>
                <span className="text-[10px] text-slate-400">Select physical QC grade</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setQcGrade('gradeA')}
                  className={`p-2 rounded-lg text-xs text-left cursor-pointer border ${
                    qcGrade === 'gradeA'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Grade A</div>
                  <div className="text-xs">Pristine</div>
                </button>
                <button
                  onClick={() => setQcGrade('gradeB')}
                  className={`p-2 rounded-lg text-xs text-left cursor-pointer border ${
                    qcGrade === 'gradeB'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Grade B</div>
                  <div className="text-xs">Packaging Defect</div>
                </button>
                <button
                  onClick={() => setQcGrade('damaged')}
                  className={`p-2 rounded-lg text-xs text-left cursor-pointer border ${
                    qcGrade === 'damaged'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Damaged</div>
                  <div className="text-xs">Defect / Wear</div>
                </button>
                <button
                  onClick={() => setQcGrade('dispute')}
                  className={`p-2 rounded-lg text-xs text-left cursor-pointer border ${
                    qcGrade === 'dispute'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono">Dispute</div>
                  <div className="text-xs">Missing Parcel</div>
                </button>
              </div>
              <div className="p-2.5 bg-slate-950/90 rounded border border-slate-800 text-xs text-slate-300">
                {qcGrade === 'gradeA' && '✨ Grade A: Tags intact, unworn. Approved for 1-click restocking into active sellable stock.'}
                {qcGrade === 'gradeB' && '📦 Grade B: Packaging torn, garment pristine. Sent to re-bagging station for discounted channel sale.'}
                {qcGrade === 'damaged' && '⚠️ Damaged: Defective fabric or stain. Written off to Return Loss ledger; zero stock recovery.'}
                {qcGrade === 'dispute' && '🔍 Dispute: Customer claims return handed over but courier parcel empty. Flagged for investigation.'}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Navigation Controls & Step Dots */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Back Button */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Clickable Progress Indicator Dots */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpToStep(idx)}
                className={`transition-all rounded-full cursor-pointer shrink-0 ${
                  idx === currentStep
                    ? 'w-6 h-2 bg-blue-500 shadow-sm shadow-blue-500/50'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Finish Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <span>{currentStep === totalSteps - 1 ? 'Finish Tour' : 'Next Step'}</span>
            {currentStep === totalSteps - 1 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
