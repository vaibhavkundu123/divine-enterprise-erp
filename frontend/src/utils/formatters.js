/**
 * Standard financial and numeric formatters for Antigravity Operations Platform.
 */

export function formatCurrency(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  const num = Number(val);
  const isNeg = num < 0;
  const absFormatted = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return isNeg ? `-$${absFormatted}` : `$${absFormatted}`;
}

export function formatNumber(val) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Number(val).toLocaleString('en-US');
}

export function formatPercent(val, decimals = 1) {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(decimals)}%`;
}
