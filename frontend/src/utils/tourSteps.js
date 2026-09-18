// Interactive Tour & Playable Manual Definitions
// Level 1: Master System Tour (Walks through all operational subsystems)
// Level 2: Tab-Specific Deep-Dive Guides (Granular manuals for each individual tab)

export const MASTER_TOUR_STEPS = [
  {
    id: 'master-dashboard',
    tab: 'dashboard',
    badge: 'STAGE 1 OF 11 • CORE INTELLIGENCE',
    title: 'Executive Overview & Real-Time Telemetry',
    icon: 'LayoutDashboard',
    summary: 'The central command center for Divine Enterprise operations, financials, and live telemetry.',
    description: 'The Executive Overview aggregates real-time data across all sales, inventory levels, reverse logistics docks, and advertising channels into actionable KPIs and trend waveforms.',
    keyPoints: [
      'Top KPI Cards: Net Realized Profit, Dispatched Revenue, Realized Cash, and Inventory Valuation.',
      'Trend Waveforms: Interactive 7D, 30D, and ALL-TIME visualization of sales volume, revenue, and gross profit margins.',
      'Divine AI Copilot: Real-time heuristic alerts highlighting star performer styles, low-stock runways, and marketing efficiency.',
      'Restock Action Bar: Direct 1-click shortcuts to clear items from courier RTO and customer return docks.'
    ],
    interactiveSimulation: {
      type: 'kpi_overview',
      label: 'Telemetry Engine Status',
      value: 'All 8 data streams connected in real time with zero-drift accuracy.'
    }
  },
  {
    id: 'master-sales',
    tab: 'sales',
    badge: 'STAGE 2 OF 11 • FULFILLMENT',
    title: 'Sales Order Ledger & Instant Profit Engine',
    icon: 'ShoppingCart',
    summary: 'Record, preview, and dispatch wholesale and direct orders with automatic stock deductions.',
    description: 'The Sales Ledger manages all dispatched customer orders. When you record a sale, the system immediately deducts units from usable sellable stock, computes Cost of Goods Sold (COGS), and calculates exact gross profit.',
    keyPoints: [
      'Fast Order Dispatcher: Press Alt+S or click "+ Fast Sale" to open the order modal with live stock validation.',
      'Instant Financial Preview: See Gross Revenue, COGS, Gross Profit, and Margin % before confirming the dispatch.',
      'Dual-Pricing Resolution: Record either by Unit Selling Price or exact Total Invoice Revenue to prevent penny drift.',
      'Restorative Deletion: Deleting an erroneous order automatically credits and restores the sold units back into stock.'
    ],
    interactiveSimulation: {
      type: 'sale_calculator',
      sample: '2 units of DR01 @ $45.00',
      calc: 'Revenue: $90.00 | COGS: $25.00 | Gross Profit: $65.00 (72.2% margin)'
    }
  },
  {
    id: 'master-stock',
    tab: 'stock',
    badge: 'STAGE 3 OF 11 • INVENTORY MATRIX',
    title: 'Real-Time Stock Balance & 4-Tier Health Badges',
    icon: 'Package',
    summary: 'The single source of truth for sellable inventory, replenishment runways, and WAC valuation.',
    description: 'The Stock Matrix tracks every style across the business. It strictly protects sellable stock by excluding returned units that are still sitting in warehouse quarantine.',
    keyPoints: [
      'Usable Stock Formula: Usable Stock = Total Inward - Total Dispatched + Total Restocked.',
      '4-Tier Stock Health Badges: Star (>=30 units), Adequate (10-29), Low (1-9), and Depleted (0 units).',
      'Weighted Average Cost (WAC): Dynamically averages procurement costs across multiple purchase batches.',
      'Inventory Valuation: Usable Stock multiplied by WAC gives exact capital tied up in merchandise.'
    ],
    interactiveSimulation: {
      type: 'stock_math',
      formula: 'Stock = Inward (100) - Dispatched (66) + Restocked (14) = 48 Usable Units'
    }
  },
  {
    id: 'master-rto',
    tab: 'rto',
    badge: 'STAGE 4 OF 11 • REVERSE LOGISTICS',
    title: 'Courier RTO 3-Stage Pipeline & Dock Quarantine',
    icon: 'RotateCcw',
    summary: 'Track non-delivered parcels through a protected 3-stage quarantine pipeline.',
    description: 'When couriers fail to deliver cash-on-delivery orders, items return to the warehouse as RTO. The platform enforces a strict quarantine rule so damaged items never falsely inflate sellable inventory.',
    keyPoints: [
      'Stage 1 (IN_TRANSIT): Courier marks delivery failed. Sellable inventory is untouched.',
      'Stage 2 (RECEIVED): Parcel arrives at the dock and is quarantined in holding buffers while staff inspect condition.',
      'Stage 3a (RESTOCKED): Item is in pristine condition. 1-click adds the unit back to active sellable stock.',
      'Stage 3b (DAMAGED): Box was crushed in transit. Marked as damage loss; never enters active stock.',
      'Bulk Restock: Click "Bulk Restock All Received" to clear all inspected parcels into stock with a single click.'
    ]
  },
  {
    id: 'master-returns',
    tab: 'returns',
    badge: 'STAGE 5 OF 11 • QUALITY CONTROL',
    title: 'Customer Returns & Physical QC Grading Hub',
    icon: 'Undo2',
    summary: 'Process customer returns with physical condition inspection and grading.',
    description: 'Unlike courier RTOs, customer returns have been opened and tried on. The QC Grading Hub provides a structured modal to grade returned merchandise before deciding whether to restock.',
    keyPoints: [
      'Physical QC Grading Modal: Inspect items and assign Grade A (Pristine), Grade B (Packaging Defect), Damaged, or Dispute.',
      'Grade A Restocking: Flawless items are instantly approved back into sellable inventory.',
      'Damage Loss Write-off: Defective items are absorbed as return losses without inflating inventory counts.',
      'Customer Claim & Dispute: Track missing items or courier parcel tampering directly in the audit trail.'
    ]
  },
  {
    id: 'master-exchanges',
    tab: 'exchanges',
    badge: 'STAGE 6 OF 11 • SWAPS',
    title: 'Two-Legged Item Exchanges & Replacement Pipeline',
    icon: 'ArrowLeftRight',
    summary: 'Manage size/color swaps with synchronized two-legged inventory balance.',
    description: 'An exchange requires simultaneous handling of an outflow (the new size/color being sent to the customer) and an inflow (the returned item coming back to the dock).',
    keyPoints: [
      'Leg 1 (Replacement Outflow): Instantly deducts the new replacement item from active stock so it can be shipped.',
      'Leg 2 (Return Inflow): Stages the inbound returned unit in the quarantine intake buffer.',
      'Physical Restock: When the customer return arrives at the warehouse, inspect and restock it with 1 click.'
    ]
  },
  {
    id: 'master-procurement',
    tab: 'procurement',
    badge: 'STAGE 7 OF 11 • SOURCING',
    title: 'Procurement Batches & Factory Purchase Orders',
    icon: 'Truck',
    summary: 'Record factory shipments, purchase rates, and supply lots.',
    description: 'The Procurement Hub logs inward purchase orders from factories and textile mills. Every new batch injects fresh units into the Stock Matrix and recalculates the Weighted Average Cost (WAC).',
    keyPoints: [
      'Batch Intake: Record Date, Style Code, Inward Quantity, and Purchase Rate per unit.',
      'Automatic Valuation: Computes Total Batch Value and updates the inventory cost baseline.',
      'Supply Grouping: Review supplier lot numbers and historical purchase rates per style.'
    ]
  },
  {
    id: 'master-ads',
    tab: 'ads',
    badge: 'STAGE 8 OF 11 • MARKETING',
    title: 'Multi-Channel Advertising Spend & Blended ROAS',
    icon: 'Megaphone',
    summary: 'Monitor advertising campaigns across Meta, Google, and TikTok with ROAS tiers.',
    description: 'Track digital marketing expenditures and attribute customer acquisition efficiency against total dispatched revenue to ensure campaigns remain profitable.',
    keyPoints: [
      'Blended ROAS: Computed dynamically as Total System Revenue divided by Total Advertising Spend.',
      '4 ROAS Tiers: Exceptional (>=4.0x), Profitable (2.5x-3.99x), Marginal (1.5x-2.49x), and Sub-threshold (<1.5x).',
      'Daily Spend Summary: View daily ad spend breakdown alongside daily sales velocity.'
    ]
  },
  {
    id: 'master-bank',
    tab: 'bank',
    badge: 'STAGE 9 OF 11 • TREASURY',
    title: 'Bank Treasury & Continuous Zero-Drift Reconciliation',
    icon: 'Landmark',
    summary: 'Reconcile bank statements with business operations with continuous balance tracking.',
    description: 'The Treasury ledger provides penny-perfect accounting between real-world bank statements and platform transactions, tracking credit inflows (sales remittances) and debit outflows (supplier payments, ads).',
    keyPoints: [
      'Continuous Running Balance: Recalculates closing balance across all chronological credit and debit transactions.',
      'Realized Cash Parity: Compares adjusted net revenue against bank ledger totals to flag cash-flow discrepancies.',
      'Audit Verification: Every bank transaction is stamped with date, type, and description.'
    ]
  },
  {
    id: 'master-audit',
    tab: 'audit',
    badge: 'STAGE 10 OF 11 • REGULATORY TRAIL',
    title: 'Cryptographic-Ready Activity Audit Trail',
    icon: 'History',
    summary: 'Immutable chronological event store recording every operational mutation.',
    description: 'Every action taken on the platform—recording an order, editing an ad expense, approving a return, or syncing spreadsheets—is automatically stamped in the audit trail.',
    keyPoints: [
      'Category Filter Chips: Instantly filter logs by SALE, RTO, CUSTOMER_RETURN, EXCHANGE, STOCK, AD_SPEND, or BANK.',
      'Real-Time Keyword Search: Search across timestamps, style numbers, and operator details.',
      'Export Audit Log: Download the complete regulatory audit trail as a formatted CSV file for tax and compliance audits.'
    ]
  },
  {
    id: 'master-status',
    tab: 'status',
    badge: 'STAGE 11 OF 11 • DIAGNOSTICS',
    title: 'System Health & Multi-Subsystem Diagnostics Probe',
    icon: 'ShieldCheck',
    summary: 'Live real-time health verification across all 6 platform subsystems.',
    description: 'The Diagnostic Engine continuously probes the FastAPI runtime, SQLite database, master Excel workbooks, flat 3NF CSV files, financial math formulas, and quarantine dock buffers.',
    keyPoints: [
      '6 Verified Probes: Validates API uptime, DB ping latency, all 8 table record counts, Excel sheets, and CSV ledgers.',
      'Zero-Drift Financial Check: Mathematically proves Gross Profit = Revenue - COGS with zero penny rounding errors.',
      'Standalone URL: Accessible anytime directly at /status (HTML Dashboard) and /api/status (JSON API).'
    ]
  }
];

export const TAB_TOURS = {
  dashboard: {
    title: 'Executive Overview Guide',
    badge: 'TAB GUIDE • DASHBOARD',
    steps: [
      {
        title: '1. Executive KPI Cards',
        description: 'Displays top-line performance: Net Realized Profit, Dispatched Revenue, Realized Cash (after RTO deductions), Total Quarantined Units, and Total Inventory Valuation.',
        tip: 'Click any card to review underlying calculations.'
      },
      {
        title: '2. Financial Trend Waveforms',
        description: 'Interactive multi-metric chart displaying daily sales revenue, units sold, and gross margins over 7-day, 30-day, or all-time horizons.',
        tip: 'Use the horizon buttons (7D / 30D / ALL) in the top-right to switch timeframes.'
      },
      {
        title: '3. Divine AI Copilot Banner',
        description: 'The copilot scans operational telemetry and outputs prioritized recommendation cards: Star Performer velocity, Low-Stock runways, and Marketing ROAS efficiency alerts.',
        tip: 'Click the action button on any copilot card to jump directly to the relevant view.'
      },
      {
        title: '4. Quick Restock Action Dock',
        description: 'When parcels are received at courier RTO docks or customer return docks, this shortcut bar enables 1-click bulk restocking directly into sellable inventory.',
        tip: 'Only items that have been physically inspected and marked as received will be restocked.'
      }
    ]
  },

  sales: {
    title: 'Sales Ledger & Orders Guide',
    badge: 'TAB GUIDE • SALES',
    steps: [
      {
        title: '1. Fast Order Dispatcher',
        description: 'Click "+ Fast Record Sale" (or press Alt+S anywhere) to open the order modal. Type any style code for instant autocomplete and live stock availability.',
        tip: 'The modal warns you immediately if a style has low stock or zero inventory.'
      },
      {
        title: '2. Instant Financial Preview',
        description: 'As you enter quantity and selling price, the real-time preview box calculates Gross Revenue, COGS, Gross Profit, and Margin % before you click dispatch.',
        tip: 'You can input either unit selling price or exact total invoice amount.'
      },
      {
        title: '3. Inline Order Management',
        description: 'Every dispatched order is logged in the sales table. Click the Edit pencil icon to adjust prices or dates, or use the Search box to filter by customer reference.',
        tip: 'Edits update the SQLite database and sync to Sales_Inventory.xlsx in the background.'
      },
      {
        title: '4. Restorative Order Deletion',
        description: 'If an order was created by mistake, clicking the trash icon deletes the record and automatically restores the sold units back into active sellable stock.',
        tip: 'An audit log entry is permanently stamped for every deletion.'
      }
    ]
  },

  stock: {
    title: 'Stock Balance Matrix Guide',
    badge: 'TAB GUIDE • INVENTORY',
    steps: [
      {
        title: '1. Usable Stock vs Total Stock',
        description: 'Usable stock represents active units available to sell right now. It is computed as Total Inward minus Total Dispatched plus Restocked units.',
        tip: 'Quarantined dock returns are strictly excluded from this number.'
      },
      {
        title: '2. 4-Tier Health Status Badges',
        description: 'Styles are color-coded: Star (>=30 units, Green), Adequate (10-29 units, Blue), Low (1-9 units, Amber), and Depleted (0 units, Rose).',
        tip: 'Use the health filter dropdown to quickly see all styles that need factory reorders.'
      },
      {
        title: '3. Weighted Average Cost (WAC)',
        description: 'The WAC column dynamically computes the blended purchase cost per unit across all procurement batches, multiplying by usable stock to give inventory valuation.',
        tip: 'WAC updates automatically whenever you log a new procurement batch.'
      },
      {
        title: '4. Excel & CSV Sync Trigger',
        description: 'Click "Sync Excel" at any time to verify parity between SQLite, the Sales_Inventory.xlsx workbook, and flat 3NF CSV files.',
        tip: 'Sync operations run asynchronously without blocking your interface.'
      }
    ]
  },

  rto: {
    title: 'Courier RTO Returns Dock Guide',
    badge: 'TAB GUIDE • RTO PIPELINE',
    steps: [
      {
        title: '1. The 3-Stage RTO Pipeline',
        description: 'When a parcel is not delivered, it enters Stage 1 (IN_TRANSIT). When it arrives at your warehouse, click "Receive" to move it into Stage 2 (RECEIVED quarantine holding).',
        tip: 'Sellable stock is never inflated until you physically inspect and approve the package.'
      },
      {
        title: '2. Restock vs Damage Decision',
        description: 'For received parcels: click "Restock" if the item is brand new (adds +1 to sellable stock), or click "Damage" if the package was crushed in transit (records inventory loss).',
        tip: 'Damage rate telemetry helps evaluate courier handling quality.'
      },
      {
        title: '3. 1-Click Bulk Restock',
        description: 'At the end of the day, after scanning all delivered parcels, click "Bulk Restock All Received" to clear all inspected items into sellable stock in one action.',
        tip: 'A single bulk restock can process dozens of parcels in under 1 second.'
      }
    ]
  },

  returns: {
    title: 'Customer Returns & QC Hub Guide',
    badge: 'TAB GUIDE • CUSTOMER RETURNS',
    steps: [
      {
        title: '1. Customer Return Intake',
        description: 'Record customer returns with tracking ID, customer order reference, and return reason (e.g. Size Too Small, Fabric Dislike, Defective).',
        tip: 'Returned parcels enter holding quarantine upon arrival.'
      },
      {
        title: '2. Physical QC Inspection & Grading',
        description: 'Open the QC modal and assign a quality grade: Grade A (Pristine condition), Grade B (Packaging defect), Damaged (Fabric wear/stain), or Dispute.',
        tip: 'Grade A items can be restocked immediately into primary inventory.'
      },
      {
        title: '3. Return Loss Accounting',
        description: 'Damaged returns are recorded as return losses and deducted from Net Realized Profit without altering active sellable stock counts.',
        tip: 'Monitor return defect percentages in the Analytics tab.'
      }
    ]
  },

  exchanges: {
    title: 'Item Exchanges Guide',
    badge: 'TAB GUIDE • EXCHANGES',
    steps: [
      {
        title: '1. Two-Legged Swap Balance',
        description: 'When a customer requests a size/color exchange, record the original style and the newly requested replacement style.',
        tip: 'The platform coordinates both legs of the inventory transaction simultaneously.'
      },
      {
        title: '2. Immediate Replacement Deduction',
        description: 'The replacement style is immediately deducted from sellable stock so the dispatch team can package and ship the new size right away.',
        tip: 'Prevents selling out of the replacement size while waiting for the return parcel.'
      },
      {
        title: '3. Inbound Return Restocking',
        description: 'When the customer return shipment arrives back at the warehouse, click "Restock" to inspect the original unit and return it to active inventory.',
        tip: 'Click "Bulk Restock Received" to process all incoming exchange returns.'
      }
    ]
  },

  procurement: {
    title: 'Procurement & Purchase Orders Guide',
    badge: 'TAB GUIDE • SOURCING',
    steps: [
      {
        title: '1. Factory Inward Logging',
        description: 'Record new shipments from fabric mills and manufacturers: specify Date, Style Code, Inward Unit Quantity, and Purchase Rate per unit.',
        tip: 'Batch intake immediately reflects in the Stock Matrix.'
      },
      {
        title: '2. Automatic WAC Recalculation',
        description: 'Every procurement batch automatically blends into the Weighted Average Cost (WAC) formula to update inventory valuation and profit baselines.',
        tip: 'View historical procurement rates across supply lots.'
      },
      {
        title: '3. Sourcing Ledger Synchronization',
        description: 'Procurement entries automatically sync to Logistic.xlsx and the flat procurement_batches.csv ledger.',
        tip: 'Master Excel exports include all procurement records.'
      }
    ]
  },

  ads: {
    title: 'Marketing & ROAS Guide',
    badge: 'TAB GUIDE • MARKETING',
    steps: [
      {
        title: '1. Multi-Channel Spend Tracking',
        description: 'Log daily marketing expenditures across Meta Ads, Google Ads, TikTok, Influencers, and Offline campaigns.',
        tip: 'Supports quick platform selection chips.'
      },
      {
        title: '2. Blended ROAS Evaluation',
        description: 'The system computes Blended ROAS as Total System Dispatched Revenue divided by Total Ad Spend across the selected timeframe.',
        tip: 'ROAS over 4.0x is graded Exceptional; below 1.5x triggers warning badges.'
      },
      {
        title: '3. Net Profit Attribution',
        description: 'Total advertising expenditure is factored directly into the 5-Tier Net Realized Profit calculation on the executive dashboard.',
        tip: 'Compare ad spend trends against gross profit waveforms in the Analytics tab.'
      }
    ]
  },

  bank: {
    title: 'Bank Treasury Guide',
    badge: 'TAB GUIDE • TREASURY',
    steps: [
      {
        title: '1. Credit & Debit Register',
        description: 'Log customer prepaid sales, courier COD cash remittances (Credits), supplier procurement invoices, and facility expenses (Debits).',
        tip: 'Supports direct reference tagging for easy bank statement matching.'
      },
      {
        title: '2. Continuous Running Balance',
        description: 'The treasury card continuously computes the exact closing balance across all chronological transactions with zero penny drift.',
        tip: 'Compare the balance card with your actual online bank account balance.'
      },
      {
        title: '3. Realized Cash Reconciliation',
        description: 'Helps identify transit cash lag between courier shipments and actual settled cash disbursements into your company bank account.',
        tip: 'Every banking entry is stamped in the regulatory audit trail.'
      }
    ]
  },

  analytics: {
    title: 'Financial Analytics & Performance Guide',
    badge: 'TAB GUIDE • ANALYTICS',
    steps: [
      {
        title: '1. Daily Sales & Profit Table',
        description: 'Detailed day-by-day breakdown of gross dispatched revenue, total units sold, purchase COGS, and daily gross profit.',
        tip: 'Shows high-margin vs low-margin operational days.'
      },
      {
        title: '2. Daily Marketing Spend Table',
        description: 'Tracks day-by-day ad spend alongside revenue velocity to identify profitable advertising spikes.',
        tip: 'Useful for evaluating weekend sale promotions.'
      },
      {
        title: '3. Trend Waveform Insights',
        description: 'Analyze revenue growth, unit volume velocity, and margin stability over 7-day, 30-day, and all-time horizons.',
        tip: 'Helps spot seasonality trends and procurement reorder timing.'
      }
    ]
  },

  audit: {
    title: 'System Audit Trail Guide',
    badge: 'TAB GUIDE • AUDIT',
    steps: [
      {
        title: '1. Regulatory Event Logging',
        description: 'Every transaction, update, deletion, or sync action is permanently recorded with timestamp, operator category, and mutation details.',
        tip: 'Creates an immutable record for tax, legal, and operational compliance.'
      },
      {
        title: '2. Real-Time Category Filter Chips',
        description: 'Click any category chip (SALE, RTO, CUSTOMER_RETURN, EXCHANGE, STOCK, AD_SPEND, BANK) to instantly isolate relevant events.',
        tip: 'Use the search box to find specific style numbers or order IDs.'
      },
      {
        title: '3. Export Audit Log to CSV',
        description: 'Click "Export CSV" to download the complete regulatory event log for external archiving or accountant verification.',
        tip: 'Click "Archive & Clear" to snapshot active logs to disk and start a fresh active trail.'
      }
    ]
  },

  status: {
    title: 'System Health & Diagnostics Guide',
    badge: 'TAB GUIDE • STATUS & CHECKS',
    steps: [
      {
        title: '1. Real-Time Telemetry & Probes',
        description: 'Probes API process uptime, RAM consumption (MB), process ID (PID), Python runtime version, and diagnostic response latency (<30ms).',
        tip: 'Auto-refreshes every 15 seconds to monitor system liveness.'
      },
      {
        title: '2. Database & All 8 Table Counters',
        description: 'Pings SQLite database connectivity, inspects file size on disk, and verifies exact live record counts across all 8 relational tables.',
        tip: 'Guarantees that no table is corrupted or missing.'
      },
      {
        title: '3. Zero-Drift Math & Quarantine Verification',
        description: 'Mathematically proves Gross Profit = Revenue - COGS, verifies bank ledger continuity, and confirms that all dock returns are quarantined safely.',
        tip: 'Click "Dedicated /status URL" to view the standalone full-screen status dashboard.'
      }
    ]
  },

  tasks: {
    title: 'Verified Roadmap & Tasks Guide',
    badge: 'TAB GUIDE • ROADMAP',
    steps: [
      {
        title: '1. Verified Deliverables Tracker',
        description: 'Tracks all 38 production deliverables across all 5 build phases: Database, Financial Math, FastAPI Backend, React Frontend, and DevOps.',
        tip: 'All 38 items are 100% verified and operational.'
      },
      {
        title: '2. Delivery Milestones',
        description: 'Provides full architectural transparency on features, models, test suites, and containerization specifications.',
        tip: 'Everything built follows strict enterprise zero-drift principles.'
      }
    ]
  }
};
