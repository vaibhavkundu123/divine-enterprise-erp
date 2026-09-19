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
import StatusView from './views/StatusView';
import GlobalRecordSaleModal from './modals/GlobalRecordSaleModal';
import InteractiveTour from './components/InteractiveTour';
import { api } from './services/api';
import { exportMasterWorkbook } from './utils/exportUtils';

const VALID_TABS = [
  'dashboard',
  'analytics',
  'audit',
  'status',
  'sales',
  'stock',
  'procurement',
  'rto',
  'returns',
  'exchanges',
  'ads',
  'bank',
  'tasks',
];

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    try {
      // 1. Check URL query param (?tab=sales)
      const params = new URLSearchParams(window.location.search);
      const queryTab = params.get('tab');
      if (queryTab && VALID_TABS.includes(queryTab)) return queryTab;

      // 2. Check URL hash (#sales)
      const hashTab = window.location.hash.replace(/^#/, '');
      if (hashTab && VALID_TABS.includes(hashTab)) return hashTab;

      // 3. Check persistent localStorage
      const storedTab = localStorage.getItem('divine_active_tab');
      if (storedTab && VALID_TABS.includes(storedTab)) return storedTab;

      // 4. Status route fallback
      if (window.location.pathname.includes('status')) return 'status';
    } catch (_) {}
    return 'dashboard';
  });

  // Persist activeTab across browser page refreshes and keep URL query in sync
  useEffect(() => {
    try {
      if (activeTab && VALID_TABS.includes(activeTab)) {
        localStorage.setItem('divine_active_tab', activeTab);
        const url = new URL(window.location.href);
        if (url.searchParams.get('tab') !== activeTab) {
          url.searchParams.set('tab', activeTab);
          window.history.replaceState(null, '', url.toString());
        }
      }
    } catch (_) {}
  }, [activeTab]);

  // Handle browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryTab = params.get('tab');
        if (queryTab && VALID_TABS.includes(queryTab)) {
          setActiveTab(queryTab);
        }
      } catch (_) {}
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const [salesRefreshTrigger, setSalesRefreshTrigger] = useState(0);

  const handleSaleSuccess = (newSale) => {
    const slNo = newSale?.sl_no ? ` #${newSale.sl_no}` : '';
    showToast(`Sale${slNo} dispatched & recorded in master ledger.`);
    loadDashboardData();
    setSalesRefreshTrigger((prev) => prev + 1);
    window.dispatchEvent(new CustomEvent('divine-sale-created', { detail: newSale }));
  };

  // Interactive Tour & Playable Manual State
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourMode, setTourMode] = useState('master'); // 'master' | 'tab'

  const handleStartMasterTour = () => {
    setTourMode('master');
    setIsTourOpen(true);
  };

  const handleStartTabTour = () => {
    setTourMode('tab');
    setIsTourOpen(true);
  };

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
    <div className="h-screen bg-[#090d16] flex text-slate-100 antialiased selection:bg-blue-600 selection:text-white pt-2.5 overflow-hidden">
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
        onStartMasterTour={handleStartMasterTour}
        onStartTabTour={handleStartTabTour}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
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
          onStartMasterTour={handleStartMasterTour}
          onStartTabTour={handleStartTabTour}
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
              onStartMasterTour={handleStartMasterTour}
              onStartTabTour={handleStartTabTour}
            />
          )}

          {activeTab === 'sales' && (
            <SalesView
              onRecordSaleClick={() => setIsRecordSaleOpen(true)}
              refreshTrigger={salesRefreshTrigger}
            />
          )}

          {activeTab === 'stock' && (
            <StockView refreshTrigger={salesRefreshTrigger} />
          )}

          {activeTab === 'rto' && <RTOView />}

          {activeTab === 'returns' && <ReturnsView />}

          {activeTab === 'exchanges' && <ExchangesView />}

          {activeTab === 'procurement' && <ProcurementView />}

          {activeTab === 'ads' && <AdsView />}

          {activeTab === 'bank' && <BankView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'audit' && <AuditView />}

          {activeTab === 'status' && <StatusView />}

          {activeTab === 'tasks' && <TasksView />}
        </main>
      </div>

      {/* Global Fast Record Sale Modal */}
      <GlobalRecordSaleModal
        isOpen={isRecordSaleOpen}
        onClose={() => setIsRecordSaleOpen(false)}
        onSuccess={handleSaleSuccess}
        styleCatalog={styleCatalog}
      />

      {/* Interactive Tour & Playable Manual System */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        tourMode={tourMode}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
