import { useState, useCallback, useMemo } from 'react';

/**
 * useTableControls — Excel-like column sort + per-column filter hook.
 *
 * @param {Object} options
 * @param {Array}  options.data            – source array (already search/status filtered by the view)
 * @param {Array}  options.columns         – column definitions:
 *   { key: string, sortable?: boolean, filterable?: boolean, getValue?: (row) => any }
 */
export default function useTableControls({ data = [], columns = [] }) {
  const [sortConfig, setSortConfig] = useState(null); // { key, direction: 'asc'|'desc' }
  const [columnFilters, setColumnFilters] = useState({}); // { [key]: Set<string> }

  // Build a lookup for column defs
  const colMap = useMemo(() => {
    const m = {};
    columns.forEach((c) => { m[c.key] = c; });
    return m;
  }, [columns]);

  // Helper: extract a comparable value from a row for a given column key
  const getCellValue = useCallback((row, key) => {
    const col = colMap[key];
    if (col?.getValue) return col.getValue(row);
    const val = row[key];
    return val === null || val === undefined ? '' : val;
  }, [colMap]);

  // Unique values for a column across the source data
  const getUniqueValues = useCallback((key) => {
    const set = new Set();
    data.forEach((row) => {
      const v = getCellValue(row, key);
      set.add(String(v));
    });
    return Array.from(set).sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!isNaN(aNum) && !isNaN(bNum) && a.trim() !== '' && b.trim() !== '') {
        return aNum - bNum;
      }
      return a.localeCompare(b, undefined, { numeric: true });
    });
  }, [data, getCellValue]);

  // Value counts for badges in filter dropdown
  const getValueCounts = useCallback((key) => {
    const counts = {};
    data.forEach((row) => {
      const v = String(getCellValue(row, key));
      counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  }, [data, getCellValue]);

  // Sort toggling:
  // If direction is provided: sets explicit direction ('asc' or 'desc')
  // If no direction: cycles none -> asc -> desc -> none
  const requestSort = useCallback((key, direction) => {
    setSortConfig((prev) => {
      if (direction) {
        if (prev?.key === key && prev?.direction === direction) {
          return null; // toggle off if already active
        }
        return { key, direction };
      }
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return null;
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  // Filter is active if columnFilters has this key defined as a Set
  const isFilterActive = useCallback((key) => {
    return Boolean(columnFilters[key]);
  }, [columnFilters]);

  // Toggle individual filter value
  const toggleFilterValue = useCallback((key, value) => {
    setColumnFilters((prev) => {
      const allUnique = getUniqueValues(key);
      let current;
      if (!prev[key]) {
        // Was previously all selected; now unchecking this value
        current = new Set(allUnique.filter((v) => v !== value));
      } else {
        current = new Set(prev[key]);
        if (current.has(value)) {
          current.delete(value);
        } else {
          current.add(value);
        }
      }

      // If all unique values are now checked, remove filter key completely
      if (current.size === allUnique.length) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }

      return { ...prev, [key]: current };
    });
  }, [getUniqueValues]);

  // Select only this single value (1-click filter)
  const selectOnlyFilter = useCallback((key, value) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: new Set([String(value)]),
    }));
  }, []);

  // Select all values for this column (clears column filter)
  const selectAllFilter = useCallback((key) => {
    setColumnFilters((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, []);

  // Deselect all values for this column (empty set)
  const deselectAllFilter = useCallback((key) => {
    setColumnFilters((prev) => ({
      ...prev,
      [key]: new Set(),
    }));
  }, []);

  // Clear filter on specific column
  const clearFilter = useCallback((key) => {
    selectAllFilter(key);
  }, [selectAllFilter]);

  // Clear all filters across all columns
  const clearAllFilters = useCallback(() => {
    setColumnFilters({});
  }, []);

  // Active filter count across all columns
  const activeFilterCount = useMemo(() => {
    return Object.keys(columnFilters).length;
  }, [columnFilters]);

  // processedData: apply column filters then sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply column filters
    const filterKeys = Object.keys(columnFilters);
    filterKeys.forEach((key) => {
      const allowed = columnFilters[key];
      if (allowed === undefined) return;
      result = result.filter((row) => {
        const v = String(getCellValue(row, key));
        return allowed.has(v);
      });
    });

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let aVal = getCellValue(a, key);
        let bVal = getCellValue(b, key);

        // Numeric comparison if both numbers
        const aNum = typeof aVal === 'number' ? aVal : (aVal !== '' && aVal !== null && !isNaN(Number(aVal))) ? Number(aVal) : NaN;
        const bNum = typeof bVal === 'number' ? bVal : (bVal !== '' && bVal !== null && !isNaN(Number(bVal))) ? Number(bVal) : NaN;

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const aStr = String(aVal ?? '').toLowerCase();
        const bStr = String(bVal ?? '').toLowerCase();
        if (aStr < bStr) return direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columnFilters, sortConfig, getCellValue]);

  return {
    sortConfig,
    columnFilters,
    requestSort,
    clearSort,
    getUniqueValues,
    getValueCounts,
    isFilterActive,
    toggleFilterValue,
    selectOnlyFilter,
    selectAllFilter,
    deselectAllFilter,
    clearFilter,
    clearAllFilters,
    activeFilterCount,
    processedData,
  };
}
