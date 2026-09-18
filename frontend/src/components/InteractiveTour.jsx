import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Compass,
  Lightbulb,
  CheckCircle2,
  Calculator,
  Check,
} from 'lucide-react';
import { MASTER_TOUR_STEPS, TAB_TOURS } from '../utils/tourSteps';

export default function InteractiveTour({
  isOpen,
  onClose,
  tourMode = 'tab', // 'tab' | 'master'
  activeTab = 'sales',
  onNavigateTab,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState(tourMode);
  const [targetRect, setTargetRect] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 100, left: 100, placement: 'bottom' });
  const [arrowOffset, setArrowOffset] = useState(24);
  const popoverRef = useRef(null);

  // Sync mode and reset step when tour opens or tourMode prop changes
  useEffect(() => {
    if (isOpen) {
      setMode(tourMode);
      setCurrentStep(0);
    }
  }, [isOpen, tourMode]);

  // Current steps array
  const isMaster = mode === 'master';
  const steps = isMaster
    ? MASTER_TOUR_STEPS
    : (TAB_TOURS[activeTab]?.steps || []);
  const totalSteps = steps.length;
  const currentData = steps[currentStep] || steps[0];

  // Auto-navigate tab if in Master Tour
  const syncTabForStep = useCallback((stepIndex) => {
    if (isMaster && MASTER_TOUR_STEPS[stepIndex]?.tab && onNavigateTab) {
      onNavigateTab(MASTER_TOUR_STEPS[stepIndex].tab);
    }
  }, [isMaster, onNavigateTab]);

  // Find target element(s) and compute union bounding rect
  const updateTargetPosition = useCallback(() => {
    if (!isOpen || !currentData?.selector) {
      setTargetRect(null);
      return;
    }

    try {
      const elements = Array.from(document.querySelectorAll(currentData.selector));
      if (elements.length === 0) {
        setTargetRect(null);
        return;
      }

      // Compute bounding box that unions all matching elements (e.g. cluster of columns)
      let minTop = Infinity;
      let minLeft = Infinity;
      let maxRight = -Infinity;
      let maxBottom = -Infinity;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          minTop = Math.min(minTop, rect.top);
          minLeft = Math.min(minLeft, rect.left);
          maxRight = Math.max(maxRight, rect.right);
          maxBottom = Math.max(maxBottom, rect.bottom);
        }
      });

      if (minTop !== Infinity) {
        const unionRect = {
          top: minTop,
          left: minLeft,
          right: maxRight,
          bottom: maxBottom,
          width: maxRight - minLeft,
          height: maxBottom - minTop,
        };
        setTargetRect(unionRect);

        // Position popover relative to unionRect
        const popoverWidth = 430;
        const popoverHeight = popoverRef.current ? popoverRef.current.offsetHeight : 280;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const preferred = currentData.preferredPlacement || 'bottom';

        let placement = preferred;
        let top = 0;
        let left = 0;

        // Space checks
        const spaceBelow = windowHeight - unionRect.bottom;
        const spaceAbove = unionRect.top;
        const spaceRight = windowWidth - unionRect.right;
        const spaceLeft = unionRect.left;

        if (preferred === 'bottom' && spaceBelow < popoverHeight + 30 && spaceAbove > popoverHeight + 30) {
          placement = 'top';
        } else if (preferred === 'top' && spaceAbove < popoverHeight + 30 && spaceBelow > popoverHeight + 30) {
          placement = 'bottom';
        } else if (preferred === 'right' && spaceRight < popoverWidth + 30 && spaceLeft > popoverWidth + 30) {
          placement = 'left';
        } else if (preferred === 'left' && spaceLeft < popoverWidth + 30 && spaceRight > popoverWidth + 30) {
          placement = 'right';
        }

        if (placement === 'bottom') {
          top = unionRect.bottom + 16;
          left = unionRect.left + (unionRect.width / 2) - (popoverWidth / 2);
        } else if (placement === 'top') {
          top = unionRect.top - popoverHeight - 16;
          left = unionRect.left + (unionRect.width / 2) - (popoverWidth / 2);
        } else if (placement === 'right') {
          top = unionRect.top + (unionRect.height / 2) - (popoverHeight / 2);
          left = unionRect.right + 16;
        } else if (placement === 'left') {
          top = unionRect.top + (unionRect.height / 2) - (popoverHeight / 2);
          left = unionRect.left - popoverWidth - 16;
        }

        // Clamp inside viewport
        const clampedLeft = Math.max(16, Math.min(left, windowWidth - popoverWidth - 16));
        const clampedTop = Math.max(16, Math.min(top, windowHeight - popoverHeight - 16));

        // Arrow calculation
        let calculatedArrowOffset = 24;
        if (placement === 'top' || placement === 'bottom') {
          const targetCenter = unionRect.left + (unionRect.width / 2);
          calculatedArrowOffset = Math.max(20, Math.min(targetCenter - clampedLeft, popoverWidth - 24));
        } else {
          const targetCenter = unionRect.top + (unionRect.height / 2);
          calculatedArrowOffset = Math.max(20, Math.min(targetCenter - clampedTop, popoverHeight - 24));
        }

        setPopoverPos({ top: clampedTop, left: clampedLeft, placement });
        setArrowOffset(calculatedArrowOffset);
      }
    } catch (err) {
      console.warn('Tour target error:', err);
    }
  }, [isOpen, currentData]);

  // Smooth scroll target into view on step change
  useEffect(() => {
    if (!isOpen || !currentData?.selector) return;

    // Small delay to allow tab transitions or DOM renders
    const scrollTimer = setTimeout(() => {
      try {
        const el = document.querySelector(currentData.selector);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
      } catch (e) {
        // ignore invalid selector
      }
      updateTargetPosition();
    }, 120);

    return () => clearTimeout(scrollTimer);
  }, [isOpen, currentStep, mode, activeTab, currentData, updateTargetPosition]);

  // Window listeners for continuous alignment
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updateTargetPosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    const interval = setInterval(handleUpdate, 400);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      clearInterval(interval);
    };
  }, [isOpen, updateTargetPosition]);

  // Keyboard controls (Left/Right arrow, Esc)
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
  }, [isOpen, currentStep, totalSteps, isMaster]);

  if (!isOpen || !currentData) return null;

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

  const toggleMode = (newMode) => {
    setMode(newMode);
    setCurrentStep(0);
    if (newMode === 'master') {
      syncTabForStep(0);
    }
  };

  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Padding around the highlighted element
  const pad = 6;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* 1. Backdrop click-catcher when target is not yet located */}
      {!targetRect && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* 2. Transparent backdrop click-catcher to dismiss when clicking outside */}
      <div
        className="fixed inset-0 z-35"
        onClick={onClose}
      />

      {/* 3. Spotlight Cutout: Transparent Center with 9999px Dark Dimmed Outer Shadow & Neon Glowing Border */}
      {targetRect && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: `${targetRect.left - pad}px`,
            top: `${targetRect.top - pad}px`,
            width: `${targetRect.width + pad * 2}px`,
            height: `${targetRect.height + pad * 2}px`,
            boxShadow: '0 0 0 9999px rgba(5, 9, 20, 0.82), 0 0 30px rgba(34, 211, 238, 0.6), inset 0 0 16px rgba(34, 211, 238, 0.15)',
            background: 'transparent',
          }}
          className="z-40 border-2 border-cyan-400 rounded-xl pointer-events-auto transition-all duration-200"
        >
          {/* Animated corner accents */}
          <span className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
        </div>
      )}

      {/* 3. Floating Callout Dialog Box with Pointer Arrow */}
      <div
        ref={popoverRef}
        style={{
          position: 'fixed',
          top: `${popoverPos.top}px`,
          left: `${popoverPos.left}px`,
          width: '430px',
          maxWidth: 'calc(100vw - 32px)',
        }}
        className="z-50 bg-gradient-to-b from-[#0f172a] via-[#0c1222] to-[#070b14] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl text-slate-100 overflow-visible transition-all duration-200 animate-fade-in"
      >
        {/* Directional Pointer Arrow */}
        {targetRect && (
          <>
            {popoverPos.placement === 'bottom' && (
              <div
                style={{ left: `${arrowOffset}px` }}
                className="absolute -top-2 w-4 h-4 bg-[#0f172a] border-t border-l border-cyan-500/40 transform rotate-45 -translate-x-1/2 shadow-sm"
              />
            )}
            {popoverPos.placement === 'top' && (
              <div
                style={{ left: `${arrowOffset}px` }}
                className="absolute -bottom-2 w-4 h-4 bg-[#070b14] border-b border-r border-cyan-500/40 transform rotate-45 -translate-x-1/2 shadow-sm"
              />
            )}
            {popoverPos.placement === 'right' && (
              <div
                style={{ top: `${arrowOffset}px` }}
                className="absolute -left-2 w-4 h-4 bg-[#0c1222] border-b border-l border-cyan-500/40 transform rotate-45 -translate-y-1/2 shadow-sm"
              />
            )}
            {popoverPos.placement === 'left' && (
              <div
                style={{ top: `${arrowOffset}px` }}
                className="absolute -right-2 w-4 h-4 bg-[#0c1222] border-t border-r border-cyan-500/40 transform rotate-45 -translate-y-1/2 shadow-sm"
              />
            )}
          </>
        )}

        {/* Glowing Top Micro-Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-t-2xl overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header */}
        <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
              STEP {currentStep + 1} OF {totalSteps}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
              {currentData.badge || (isMaster ? 'MASTER TOUR' : activeTab.toUpperCase())}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleMode(isMaster ? 'tab' : 'master')}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMaster ? 'Switch to contextual tab guide' : 'Switch to full 11-stage master tour'}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Walkthrough (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body with Elaborate Details */}
        <div className="px-5 py-3.5 space-y-3 max-h-[min(520px,65vh)] overflow-y-auto pr-2 scrollbar-thin">
          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
            {currentData.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {currentData.description}
          </p>

          {/* Structured Key Operational Details */}
          {currentData.details && currentData.details.length > 0 && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 font-mono block mb-1">
                Operational Mechanics & Architecture
              </span>
              {currentData.details.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Mathematical Formula / Identity Box */}
          {currentData.formula && (
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-800/50 text-xs font-mono text-cyan-200 flex items-start gap-2 shadow-inner">
              <Calculator className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block font-mono">Zero-Drift Formula</span>
                <span>{currentData.formula}</span>
              </div>
            </div>
          )}

          {/* Operational Tip / Shortcut Box */}
          {currentData.tip && (
            <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{currentData.tip}</span>
            </div>
          )}
        </div>

        {/* Card Footer with Controls */}
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800/80 rounded-b-2xl flex items-center justify-between gap-2">
          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalSteps, 11) }).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-4 bg-cyan-400'
                    : idx < currentStep
                    ? 'w-1.5 bg-slate-600'
                    : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{currentStep === totalSteps - 1 ? 'Finish' : 'Next'}</span>
              {currentStep === totalSteps - 1 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
