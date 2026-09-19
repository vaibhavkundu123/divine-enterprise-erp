import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Filter, X, ArrowUp, ArrowDown, Check, RotateCcw, Search } from 'lucide-react';

/**
 * SortableHeader — interactive <th> with Excel-like sort indicators and column filter dropdown.
 *
 * @param {Object} props
 * @param {string}  props.label               – visible header text
 * @param {string}  props.columnKey           – key for the column (matches useTableControls column key)
 * @param {boolean} props.sortable            – whether this column can be sorted (default: true)
 * @param {boolean} props.filterable          – whether this column has a filter dropdown (default: true)
 * @param {Object}  props.sortConfig          – current sort config { key, direction }
 * @param {Object}  props.columnFilters       – map of { [key]: Set<selectedValues> }
 * @param {Function} props.onSort             – requestSort(key, direction?)
 * @param {Function} props.clearSort          – clearSort()
 * @param {Function} props.getUniqueValues    – (key) => string[]
 * @param {Function} props.getValueCounts     – (key) => { [val]: count }
 * @param {Function} props.isFilterActive     – (key) => boolean
 * @param {Set}     props.activeFilterValues  – explicitly passed filter values set (optional)
 * @param {Function} props.onToggleFilter     – toggleFilterValue(key, value)
 * @param {Function} props.onSelectOnlyFilter – selectOnlyFilter(key, value)
 * @param {Function} props.onSelectAll        – selectAllFilter(key)
 * @param {Function} props.onDeselectAll      – deselectAllFilter(key)
 * @param {Function} props.onClearFilter      – clearFilter(key)
 * @param {string}  props.className           – extra classes for the <th>
 * @param {string}  props.align               – text alignment: 'left'|'center'|'right'
 * @param {Object}  props.extraProps          – extra props like data-tour
 */
export default function SortableHeader({
  label,
  columnKey,
  sortable = true,
  filterable = true,
  sortConfig,
  columnFilters,
  onSort,
  clearSort,
  getUniqueValues,
  getValueCounts,
  isFilterActive,
  activeFilterValues,
  onToggleFilter,
  onSelectOnlyFilter,
  onSelectAll,
  onDeselectAll,
  onClearFilter,
  className = '',
  align = 'left',
  extraProps = {},
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!filterOpen) return;
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setFilterOpen(false);
        setFilterSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterOpen]);

  // Active sort direction for this column
  const isSorted = sortConfig && sortConfig.key === columnKey;
  const sortDir = isSorted ? sortConfig.direction : null;

  // Active filter values for this column
  const activeVals = activeFilterValues !== undefined
    ? activeFilterValues
    : (columnFilters && columnKey in columnFilters ? columnFilters[columnKey] : undefined);

  // Is filter currently active on this column?
  const hasFilterActive = typeof isFilterActive === 'function'
    ? isFilterActive(columnKey)
    : Boolean(activeVals !== undefined);

  // Unique values and counts
  const uniqueValues = filterable && filterOpen ? (getUniqueValues?.(columnKey) || []) : [];
  const counts = filterable && filterOpen ? (getValueCounts?.(columnKey) || {}) : {};

  // Search in dropdown
  const filteredUnique = filterSearch
    ? uniqueValues.filter((v) => v.toLowerCase().includes(filterSearch.toLowerCase()))
    : uniqueValues;

  const isAllSelected = activeVals === undefined;
  const isNoneSelected = activeVals !== undefined && activeVals.size === 0;

  // Text alignment
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  const dropdownAlignClass = align === 'right' ? 'align-right' : align === 'center' ? 'align-center' : '';

  return (
    <th
      className={`py-3 px-4 relative select-none ${alignClass} ${className}`}
      {...extraProps}
    >
      <div className={`inline-flex items-center gap-1.5 ${
        align === 'right' ? 'justify-end w-full' :
        align === 'center' ? 'justify-center w-full' : ''
      }`}>
        {/* Sort click area */}
        {sortable ? (
          <button
            type="button"
            onClick={() => onSort?.(columnKey)}
            className="inline-flex items-center gap-1 cursor-pointer hover:text-white transition-colors group/sort"
            title={`Sort by ${label} (click to toggle)`}
          >
            <span>{label}</span>
            <span className="inline-flex flex-col -space-y-1.5">
              <ChevronUp className={`w-3 h-3 transition-colors ${
                sortDir === 'asc' ? 'text-blue-400 font-bold stroke-[3]' : 'text-slate-600 group-hover/sort:text-slate-400'
              }`} />
              <ChevronDown className={`w-3 h-3 transition-colors ${
                sortDir === 'desc' ? 'text-blue-400 font-bold stroke-[3]' : 'text-slate-600 group-hover/sort:text-slate-400'
              }`} />
            </span>
          </button>
        ) : (
          <span>{label}</span>
        )}

        {/* Filter button */}
        {filterable && (
          <button
            ref={btnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen((p) => !p);
              setFilterSearch('');
            }}
            className={`p-1 rounded transition-all cursor-pointer relative ${
              hasFilterActive
                ? 'text-blue-300 bg-blue-600/30 ring-1 ring-blue-500/50 shadow-sm shadow-blue-500/20'
                : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={`Filter & Sort ${label}`}
          >
            <Filter className={`w-3 h-3 ${hasFilterActive ? 'fill-blue-400/30' : ''}`} />
            {hasFilterActive && (
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            )}
          </button>
        )}
      </div>

      {/* Filter & Sort dropdown */}
      {filterable && filterOpen && (
        <div
          ref={dropdownRef}
          className={`col-filter-dropdown ${dropdownAlignClass} text-left font-normal`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-950/60 rounded-t-lg">
            <span className="text-[11px] font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-blue-400" />
              <span>{label}</span>
            </span>
            <button
              type="button"
              onClick={() => { setFilterOpen(false); setFilterSearch(''); }}
              className="p-0.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort Section */}
          {sortable && (
            <div className="p-1 border-b border-slate-800/80 bg-slate-900/40">
              <button
                type="button"
                onClick={() => onSort?.(columnKey, 'asc')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  sortDir === 'asc'
                    ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ArrowUp className="w-3 h-3 text-blue-400" />
                <span>Sort Ascending</span>
                {sortDir === 'asc' && <Check className="w-3 h-3 ml-auto text-blue-400" />}
              </button>
              <button
                type="button"
                onClick={() => onSort?.(columnKey, 'desc')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-medium transition-colors mt-0.5 ${
                  sortDir === 'desc'
                    ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ArrowDown className="w-3 h-3 text-blue-400" />
                <span>Sort Descending</span>
                {sortDir === 'desc' && <Check className="w-3 h-3 ml-auto text-blue-400" />}
              </button>
              {isSorted && (
                <button
                  type="button"
                  onClick={() => onSort?.(columnKey)}
                  className="w-full flex items-center gap-2 px-2 py-1 text-[10px] text-slate-400 hover:text-rose-400 transition-colors mt-0.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear Sort</span>
                </button>
              )}
            </div>
          )}

          {/* Search Box */}
          <div className="p-2 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search values..."
                className="w-full pl-6 pr-6 py-1 text-[11px] rounded bg-slate-900 border border-slate-700/80 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                autoFocus
              />
              {filterSearch && (
                <button
                  type="button"
                  onClick={() => setFilterSearch('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Bulk Select / Deselect actions */}
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-800/60 text-[10px]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectAll?.(columnKey)}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-700">|</span>
              <button
                type="button"
                onClick={() => onDeselectAll?.(columnKey)}
                className="font-medium text-slate-400 hover:text-slate-300 transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
            {hasFilterActive && (
              <button
                type="button"
                onClick={() => onSelectAll?.(columnKey)}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Checkbox List */}
          <div className="max-h-48 overflow-y-auto p-1 col-filter-list">
            {/* (Select All) Checkbox item */}
            {!filterSearch && uniqueValues.length > 0 && (
              <label className="flex items-center gap-2 px-2 py-1 rounded text-[11px] font-semibold text-slate-300 hover:bg-slate-800/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = !isAllSelected && !isNoneSelected;
                  }}
                  onChange={() => {
                    if (isAllSelected) {
                      onDeselectAll?.(columnKey);
                    } else {
                      onSelectAll?.(columnKey);
                    }
                  }}
                  className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="italic">(Select All)</span>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">({uniqueValues.length})</span>
              </label>
            )}

            {filteredUnique.length === 0 ? (
              <div className="text-[11px] text-slate-500 py-3 text-center">No matching values</div>
            ) : (
              filteredUnique.map((val) => {
                const isChecked = isAllSelected || (activeVals && activeVals.has(val));
                const count = counts[val] || 0;
                return (
                  <div
                    key={val}
                    className="flex items-center gap-2 px-2 py-1 rounded text-[11px] text-slate-300 hover:bg-slate-800/60 group/item transition-colors"
                  >
                    <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!isChecked}
                        onChange={() => onToggleFilter?.(columnKey, val)}
                        className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="truncate" title={val || '(Blank)'}>
                        {val === '' ? <span className="italic text-slate-500">(Blank)</span> : val}
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">({count})</span>
                    <button
                      type="button"
                      onClick={() => onSelectOnlyFilter?.(columnKey, val)}
                      className="opacity-0 group-hover/item:opacity-100 text-[10px] text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer transition-opacity ml-1"
                      title={`Filter only to "${val}"`}
                    >
                      only
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer stats */}
          <div className="px-2.5 py-1.5 bg-slate-950/50 border-t border-slate-800/60 rounded-b-lg flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>{filteredUnique.length} values</span>
            {hasFilterActive && (
              <span className="text-blue-400 font-sans font-medium">Filter active</span>
            )}
          </div>
        </div>
      )}
    </th>
  );
}
