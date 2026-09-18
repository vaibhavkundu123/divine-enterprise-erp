import * as XLSX from 'xlsx';

export function exportToExcel(data, fileName = 'export.xlsx', sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
}

export function exportToCSV(data, fileName = 'export.csv') {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports a multi-sheet master workbook (Divine_Master_Ledger.xlsx).
 * @param {Array<{name: string, data: Array<Object>}>} sheets - Array of sheet descriptors.
 * @param {string} fileName - Output filename.
 */
export function exportMasterWorkbook(sheets, fileName = 'Divine_Master_Ledger.xlsx') {
  const wb = XLSX.utils.book_new();
  let hasData = false;
  sheets.forEach(({ name, data }) => {
    if (data && data.length > 0) {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, name);
      hasData = true;
    }
  });
  if (!hasData) {
    alert('No data available to export.');
    return;
  }
  XLSX.writeFile(wb, fileName);
}
