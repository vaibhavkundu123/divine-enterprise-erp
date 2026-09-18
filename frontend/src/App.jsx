import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './views/DashboardView';
import SalesView from './views/SalesView';
import StockView from './views/StockView';
import RTOView from './views/RTOView';
import ReturnsView from './views/ReturnsView';
import ExchangesView from './views/ExchangesView';
import ProcurementView from './views/ProcurementView';
import AdsView from './views/AdsView';
import BankView from './views/BankView';
import AnalyticsView from './views/AnalyticsView';
import AuditView from './views/AuditView';
import TasksView from './views/TasksView';
import GlobalRecordSaleModal from './modals/GlobalRecordSaleModal';
import { api } from './services/api';
import { exportMasterWorkbook } from './utils/exportUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kpis, setKpis] = useState(null);
  const [copilotInsights, setCopilotInsights] = useState([]);
  const [waveforms, setWaveforms] = useState([]);
  const [horizon, setHorizon] = useState('30D');
  const [styleCatalog, setStyleCatalog] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRecordSaleOpen, setIsRecordSaleOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isMasterExporting, setIsMasterExporting] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadDashboardData = () => {
    Promise.all([
      api.getKPIs(),
      api.getCopilot(),
      api.getWaveforms(horizon),
      api.getStyleCatalog(),
    ])
      .then(([kpiData, copilotData, waveformData, catalogData]) => {
        setKpis(kpiData);
        setCopilotInsights(copilotData);
        setWaveforms(waveformData.waveforms || []);
        setStyleCatalog(catalogData);
      })
      .catch((err) => console.error('Error loading dashboard:', err));
  };

  useEffect(() => {
    loadDashboardData();
  }, [horizon]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await api.triggerSync();
      showToast('Excel Workbooks & 3NF CSV files synchronized successfully.');
      loadDashboardData();
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRestockDock = async () => {
    try {
      const res = await api.bulkRestockRTO();
      showToast(res.message);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestockReturns = async () => {
    try {
      const res = await api.bulkRestockReturns();
      showToast(res.message);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRestockExchanges = async () => {
    try {
      const res = await api.bulkRestockExchanges();
      showToast(res.message);
      loadDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleActionClick = (targetTab, filterParams) => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  const handleMasterExport = async () => {
    setIsMasterExporting(true);
    try {
      const [sales, stock, rtos, returns, exchanges, ads, dailySales, dailyAds] = await Promise.all([
        api.getSales(),
        api.getStock(),
        api.getRTO(),
        api.getReturns(),
        api.getExchanges(),
        api.getAds(),
        api.getDailySales(),
        api.getDailyAds(),
      ]);
      exportMasterWorkbook([
        { name: 'Sales', data: sales },
        { name: 'Stock', data: stock },
        { name: 'RTO', data: rtos },
        { name: 'Returns', data: returns },
        { name: 'Exchanges', data: exchanges },
        { name: 'Ads', data: ads },
        { name: 'Daily Sales', data: dailySales },
        { name: 'Daily Ads', data: dailyAds },
      ], `Divine_Master_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Master Ledger exported: Divine_Master_Ledger.xlsx (8 sheets)');
    } catch (err) {
      alert(`Master export failed: ${err.message}`);
    } finally {
      setIsMasterExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 glass-panel px-4 py-3 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in bg-slate-900/95 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Docked Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRecordSaleClick={() => setIsRecordSaleOpen(true)}
        onSyncClick={handleSync}
        isSyncing={isSyncing}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        kpis={kpis}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Command Bar HUD */}
        <TopBar
          activeTab={activeTab}
          onRecordSaleClick={() => setIsRecordSaleOpen(true)}
          onSyncClick={handleSync}
          isSyncing={isSyncing}
          setMobileOpen={setMobileOpen}
          horizon={horizon}
          onHorizonChange={setHorizon}
          onExportMaster={handleMasterExport}
          isExportingMaster={isMasterExporting}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              kpis={kpis}
              copilotInsights={copilotInsights}
              waveforms={waveforms}
              horizon={horizon}
              onHorizonChange={setHorizon}
              onActionClick={handleActionClick}
              onRestockDock={handleRestockDock}
              onRestockReturns={handleRestockReturns}
              onRestockExchanges={handleRestockExchanges}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'sales' && (
            <SalesView onRecordSaleClick={() => setIsRecordSaleOpen(true)} />
          )}

          {activeTab === 'stock' && <StockView />}

          {activeTab === 'rto' && <RTOView />}

          {activeTab === 'returns' && <ReturnsView />}

          {activeTab === 'exchanges' && <ExchangesView />}

          {activeTab === 'procurement' && <ProcurementView />}

          {activeTab === 'ads' && <AdsView />}

          {activeTab === 'bank' && <BankView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'audit' && <AuditView />}

          {activeTab === 'tasks' && <TasksView />}
        </main>
      </div>

      {/* Global Fast Record Sale Modal */}
      <GlobalRecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
        onSuccess={() => {
          showToast('Sale dispatched and recorded in master ledger.');
          loadDashboardData();
        }}
        styleCatalog={styleCatalog}
      />
    </div>
  );
}
