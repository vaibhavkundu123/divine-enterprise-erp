import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

export default function ExcelImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith('.xlsx')) {
        setError('Please select an Excel (.xlsx) file.');
        return;
      }
      setFile(selected);
      setError(null);
      setImportResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to import.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const res = await api.importExcelCatalog(file);
      setImportResult(res);
      onSuccess?.(res);
      window.dispatchEvent(new CustomEvent('divine-catalog-updated'));
    } catch (err) {
      setError(err.message || 'Failed to import Excel file.');
    } finally {
      setIsUploading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg border border-slate-700/80 bg-slate-900 shadow-2xl rounded-2xl flex flex-col text-slate-100">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Upload & Sync Excel Workbook</h2>
              <p className="text-xs text-slate-400">Import bulk updates from Barcode Master or Meesho Template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {importResult && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Successfully imported and synced {importResult.imported_count} products across database and disk files!</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
              id="excel-file-upload"
            />
            <label htmlFor="excel-file-upload" className="cursor-pointer flex flex-col items-center gap-2.5">
              <div className="p-3 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Click to browse or drag & drop</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Accepts <span className="text-emerald-300 font-mono">Barcode Master.xlsx</span> or <span className="text-emerald-300 font-mono">MeeshoTemplate.xlsx</span>
                </p>
              </div>
              {file && (
                <div className="mt-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </label>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300">Automated Ingestion Protocol:</div>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Matching <span className="text-slate-200">BARCODE</span> sheet updates rates, margins, and MRPs.</li>
              <li>Matching <span className="text-slate-200">Nightdress-Fill this</span> updates prices, image URLs, and descriptions.</li>
              <li>Calculates and triggers automatic two-way physical file write upon upload.</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={!file || isUploading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing & Syncing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Ingest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
