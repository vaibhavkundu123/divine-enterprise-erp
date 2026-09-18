import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  AlertTriangle,
  Zap,
  Boxes,
  TrendingUp,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

export default function AICopilotBanner({ insights = [], onActionClick, onRestockDock }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation every 8 seconds
  useEffect(() => {
    if (!insights || insights.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [insights, isPaused]);

  if (!insights || insights.length === 0) return null;

  const current = insights[currentIndex] || insights[0];

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'DANGER':
        return {
          bg: 'bg-rose-950/20 border-rose-500/30',
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-950/20 border-amber-500/30',
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      case 'SUCCESS':
        return {
          bg: 'bg-emerald-950/20 border-emerald-500/30',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      default:
        return {
          bg: 'bg-blue-950/20 border-blue-500/30',
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        };
    }
  };

  const style = getSeverityStyle(current.severity);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 sm:p-5 ${style.bg} transition-colors`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          {/* Clean Icon Pod */}
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${style.iconBg}`}>
            <Lightbulb className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${style.badge}`}>
                {current.badge}
              </span>
              <span className="text-xs text-slate-400">
                Insight {current.rule_id} of {insights.length}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-heading">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              {current.summary}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {current.can_auto_restock ? (
            <button
              onClick={() => onRestockDock && onRestockDock()}
              className="btn btn-success text-xs px-3.5 py-1.5 h-8 font-medium shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{current.action_label}</span>
            </button>
          ) : (
            current.action_target && (
              <button
                onClick={() => onActionClick && onActionClick(current.action_target, current.action_filter)}
                className="btn btn-primary text-xs px-3.5 py-1.5 h-8 font-medium shadow-sm flex items-center gap-1.5"
              >
                <span>{current.action_label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {/* Stepper Carousel Controls */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? insights.length - 1 : prev - 1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous insight"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? 'w-3.5 bg-blue-500' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Go to insight ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % insights.length)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next insight"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
