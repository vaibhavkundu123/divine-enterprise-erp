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

  // Scroll target element into view leaving optimal clearance for the popover
  const scrollToTarget = useCallback((selector, preferredPlacement) => {
    try {
      const el = document.querySelector(selector);
      if (!el) return;

      // 1. Horizontal visibility: scroll any horizontally scrollable container (e.g. table overflow-x-auto)
      let hScroll = el.parentElement;
      while (hScroll && hScroll !== document.body) {
        const style = window.getComputedStyle(hScroll);
        const ox = style.overflowX;
        if ((ox === 'auto' || ox === 'scroll') && hScroll.scrollWidth > hScroll.clientWidth + 4) {
          const elRect = el.getBoundingClientRect();
          const hRect = hScroll.getBoundingClientRect();
          if (elRect.left < hRect.left + 24 || elRect.right > hRect.right - 24) {
            const targetScrollLeft = hScroll.scrollLeft + (elRect.left - hRect.left) - (hScroll.clientWidth / 2) + (elRect.width / 2);
            hScroll.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
          }
          break;
        }
        hScroll = hScroll.parentElement;
      }

      // 2. Vertical visibility: find actual main scrollable ancestor container (e.g. App's main viewport div)
      let scrollContainer = el.parentElement;
      while (scrollContainer && scrollContainer !== document.body) {
        const style = window.getComputedStyle(scrollContainer);
        const oy = style.overflowY;
        if ((oy === 'auto' || oy === 'scroll') && scrollContainer.scrollHeight > scrollContainer.clientHeight + 10) {
          break;
        }
        scrollContainer = scrollContainer.parentElement;
      }
      if (!scrollContainer || scrollContainer === document.body) {
        scrollContainer = document.querySelector('.overflow-y-auto') || document.scrollingElement || document.documentElement;
      }

      const elemRect = el.getBoundingClientRect();
      const containerRect = (scrollContainer === document.documentElement || scrollContainer === document.body)
        ? { top: 0, height: window.innerHeight }
        : scrollContainer.getBoundingClientRect();

      const currentScrollTop = scrollContainer.scrollTop || window.scrollY || 0;
      const relativeTop = elemRect.top - containerRect.top + currentScrollTop;
      const elemHeight = elemRect.height;
      const viewportH = containerRect.height || window.innerHeight;
      const topBarSafe = 75; // fixed top bar height + breathing room

      let targetScrollTop = currentScrollTop;

      if (preferredPlacement === 'top') {
        // Element sits in lower portion of viewport so there is maximum clearance (~450-550px) ABOVE
        const desiredTopInViewport = Math.max(topBarSafe + 180, viewportH - elemHeight - 100);
        targetScrollTop = relativeTop - desiredTopInViewport;
      } else if (preferredPlacement === 'left' || preferredPlacement === 'right') {
        // Center vertically so side popover has balanced space above and below
        const desiredTopInViewport = Math.max(topBarSafe + 20, Math.min((viewportH / 2) - (elemHeight / 2), viewportH - elemHeight - 80));
        targetScrollTop = relativeTop - desiredTopInViewport;
      } else {
        // Preferred 'bottom': Element sits in upper portion so there is maximum clearance (~500-650px) BELOW
        const desiredTopInViewport = topBarSafe + 16;
        targetScrollTop = relativeTop - desiredTopInViewport;
      }

      const maxScroll = Math.max(0, scrollContainer.scrollHeight - viewportH);
      const clampedScrollTop = Math.max(0, Math.min(targetScrollTop, maxScroll));

      scrollContainer.scrollTo({
        top: clampedScrollTop,
        behavior: 'smooth',
      });
    } catch (err) {
      console.warn('Scroll to target error:', err);
    }
  }, []);

  // Find target element(s) and compute union bounding rect with strict 4-way non-overlap geometry
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

      // Compute bounding box that unions all matching elements
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

      if (minTop === Infinity) {
        setTargetRect(null);
        return;
      }

      const unionRect = {
        top: minTop,
        left: minLeft,
        right: maxRight,
        bottom: maxBottom,
        width: maxRight - minLeft,
        height: maxBottom - minTop,
      };
      setTargetRect(unionRect);

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const topBarSafe = 70; // safe top margin below navbar
      const gap = 14; // gap between target border and popover
      const popoverWidth = Math.min(430, windowWidth - 32);

      // Space available in all 4 directions around target
      const spaceBelow = windowHeight - unionRect.bottom - 16;
      const spaceAbove = unionRect.top - topBarSafe - 16;
      const spaceLeft = unionRect.left - 16;
      const spaceRight = windowWidth - unionRect.right - 16;

      const preferred = currentData.preferredPlacement || 'bottom';
      let placement = preferred;

      // Smart 4-way placement selection based on actual real-time space
      if (preferred === 'left') {
        if (spaceLeft >= popoverWidth + gap) {
          placement = 'left';
        } else if (spaceRight >= popoverWidth + gap) {
          placement = 'right';
        } else if (spaceBelow >= 260) {
          placement = 'bottom';
        } else {
          placement = 'top';
        }
      } else if (preferred === 'right') {
        if (spaceRight >= popoverWidth + gap) {
          placement = 'right';
        } else if (spaceLeft >= popoverWidth + gap) {
          placement = 'left';
        } else if (spaceBelow >= 260) {
          placement = 'bottom';
        } else {
          placement = 'top';
        }
      } else if (preferred === 'bottom') {
        if (spaceBelow >= 260) {
          placement = 'bottom';
        } else if (spaceAbove >= 260) {
          placement = 'top';
        } else if (spaceLeft >= popoverWidth + gap) {
          placement = 'left';
        } else if (spaceRight >= popoverWidth + gap) {
          placement = 'right';
        } else {
          placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
        }
      } else if (preferred === 'top') {
        if (spaceAbove >= 260) {
          placement = 'top';
        } else if (spaceBelow >= 260) {
          placement = 'bottom';
        } else if (spaceLeft >= popoverWidth + gap) {
          placement = 'left';
        } else if (spaceRight >= popoverWidth + gap) {
          placement = 'right';
        } else {
          placement = spaceAbove >= spaceBelow ? 'top' : 'bottom';
        }
      }

      let top = 0;
      let left = 0;
      let maxHeight = 520;
      let calculatedArrowOffset = 24;

      if (placement === 'bottom') {
        // STRICT INVARIANT: top is strictly below the target's bottom edge
        top = unionRect.bottom + gap;
        maxHeight = Math.max(200, windowHeight - top - 16);
        const targetCenterX = unionRect.left + (unionRect.width / 2);
        const idealLeft = targetCenterX - (popoverWidth / 2);
        left = Math.max(16, Math.min(idealLeft, windowWidth - popoverWidth - 16));
        calculatedArrowOffset = Math.max(28, Math.min(targetCenterX - left, popoverWidth - 28));
      } else if (placement === 'top') {
        // STRICT INVARIANT: popover bottom is strictly above the target's top edge
        maxHeight = Math.max(200, unionRect.top - gap - topBarSafe);
        const popoverActualHeight = popoverRef.current
          ? Math.min(popoverRef.current.offsetHeight, maxHeight)
          : Math.min(460, maxHeight);
        top = Math.max(topBarSafe, unionRect.top - gap - popoverActualHeight);
        const targetCenterX = unionRect.left + (unionRect.width / 2);
        const idealLeft = targetCenterX - (popoverWidth / 2);
        left = Math.max(16, Math.min(idealLeft, windowWidth - popoverWidth - 16));
        calculatedArrowOffset = Math.max(28, Math.min(targetCenterX - left, popoverWidth - 28));
      } else if (placement === 'left') {
        // STRICT INVARIANT: popover right is strictly to the left of the target's left edge
        left = Math.max(16, unionRect.left - gap - popoverWidth);
        maxHeight = Math.max(200, windowHeight - topBarSafe - 24);
        const popoverActualHeight = popoverRef.current
          ? Math.min(popoverRef.current.offsetHeight, maxHeight)
          : Math.min(460, maxHeight);
        const targetCenterY = unionRect.top + (unionRect.height / 2);
        top = Math.max(topBarSafe, Math.min(targetCenterY - (popoverActualHeight / 2), windowHeight - popoverActualHeight - 16));
        calculatedArrowOffset = Math.max(28, Math.min(targetCenterY - top, popoverActualHeight - 28));
      } else if (placement === 'right') {
        // STRICT INVARIANT: popover left is strictly to the right of the target's right edge
        left = Math.min(windowWidth - popoverWidth - 16, unionRect.right + gap);
        maxHeight = Math.max(200, windowHeight - topBarSafe - 24);
        const popoverActualHeight = popoverRef.current
          ? Math.min(popoverRef.current.offsetHeight, maxHeight)
          : Math.min(460, maxHeight);
        const targetCenterY = unionRect.top + (unionRect.height / 2);
        top = Math.max(topBarSafe, Math.min(targetCenterY - (popoverActualHeight / 2), windowHeight - popoverActualHeight - 16));
        calculatedArrowOffset = Math.max(28, Math.min(targetCenterY - top, popoverActualHeight - 28));
      }

      setPopoverPos({
        top,
        left,
        maxHeight,
        placement,
      });
      setArrowOffset(calculatedArrowOffset);
    } catch (err) {
      console.warn('Tour target error:', err);
    }
  }, [isOpen, currentData]);

  // Smooth scroll target into view on step change
  useEffect(() => {
    if (!isOpen || !currentData?.selector) return;

    const preferred = currentData.preferredPlacement || 'bottom';
    scrollToTarget(currentData.selector, preferred);

    // Initial update plus scheduled syncs during smooth scroll
    updateTargetPosition();
    const t1 = setTimeout(updateTargetPosition, 80);
    const t2 = setTimeout(updateTargetPosition, 200);
    const t3 = setTimeout(updateTargetPosition, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, currentStep, mode, activeTab, currentData, scrollToTarget, updateTargetPosition]);

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
          maxHeight: popoverPos.maxHeight ? `${popoverPos.maxHeight}px` : '540px',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="z-50 bg-gradient-to-b from-[#0f172a] via-[#0c1222] to-[#070b14] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl text-slate-100 overflow-visible transition-all duration-150 animate-fade-in"
      >
        {/* Directional Pointer Arrow */}
        {targetRect && (
          <>
            {popoverPos.placement === 'bottom' && (
              <div
                style={{ left: `${arrowOffset}px` }}
                className="absolute -top-2 w-4 h-4 bg-[#0f172a] border-t border-l border-cyan-500/40 transform rotate-45 -translate-x-1/2 shadow-sm pointer-events-none"
              />
            )}
            {popoverPos.placement === 'top' && (
              <div
                style={{ left: `${arrowOffset}px` }}
                className="absolute -bottom-2 w-4 h-4 bg-[#070b14] border-b border-r border-cyan-500/40 transform rotate-45 -translate-x-1/2 shadow-sm pointer-events-none"
              />
            )}
            {popoverPos.placement === 'right' && (
              <div
                style={{ top: `${arrowOffset}px` }}
                className="absolute -left-2 w-4 h-4 bg-[#0c1222] border-b border-l border-cyan-500/40 transform rotate-45 -translate-y-1/2 shadow-sm pointer-events-none"
              />
            )}
            {popoverPos.placement === 'left' && (
              <div
                style={{ top: `${arrowOffset}px` }}
                className="absolute -right-2 w-4 h-4 bg-[#0c1222] border-t border-r border-cyan-500/40 transform rotate-45 -translate-y-1/2 shadow-sm pointer-events-none"
              />
            )}
          </>
        )}

        {/* Glowing Top Micro-Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-t-2xl overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Header */}
        <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
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
        <div className="px-5 py-3.5 space-y-3 flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin">
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
        <div className="px-5 py-3 bg-slate-900/60 border-t border-slate-800/80 rounded-b-2xl flex items-center justify-between gap-2 shrink-0">
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
