// Interactive Spotlight Tour & Playable Walkthrough Definitions
// Every step targets a real DOM element via CSS selector and attaches a directional pointer dialog box.
// Level 1: TAB_TOURS - Granular walkthrough of EVERY element on that specific page
// Level 2: MASTER_TOUR_STEPS - Executive multi-tab journey spotlighting core operations across all 11 tabs

export const TAB_TOURS = {
  dashboard: {
    title: 'Executive Overview Walkthrough',
    badge: 'EXECUTIVE OVERVIEW',
    steps: [
      {
        selector: '[data-tour="dash-copilot"]',
        badge: 'INTELLIGENCE CO-PILOT',
        title: 'Divine AI Operational Copilot',
        description: 'Continuously monitors sales velocity, stock runways, and ad efficiency. Emits high-priority heuristic recommendations for star performer styles and inventory reorders.',
        tip: 'Click action buttons on copilot cards to jump directly to low-stock styles or campaigns.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-profit"]',
        badge: 'CORE FINANCIALS',
        title: 'Net Realized Profit KPI',
        description: 'True business profit calculated across all 5 operational tiers: Gross Sales Margin minus Courier COD RTO fees, customer return losses, item exchange fees, and total marketing spend.',
        tip: 'Formula: Realized Profit = Gross Margin - RTO Fees - Return Losses - Ad Spend.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-revenue"]',
        badge: 'FULFILLMENT VOLUME',
        title: 'Dispatched Gross Revenue',
        description: 'Total monetary value of all dispatched sales orders. Reflects top-line commercial turnover prior to any returns or courier deductions.',
        tip: 'Includes live total order count and real-time average order value (AOV).',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-ads"]',
        badge: 'GROWTH ENGINE',
        title: 'Total Advertising & Blended ROAS',
        description: 'Aggregates digital marketing expenditure across Meta, Google, and TikTok, paired with live Blended Return on Ad Spend (ROAS) efficiency rating.',
        tip: 'ROAS >= 4.0x is graded Exceptional; below 1.5x triggers warning badges.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-valuation"]',
        badge: 'ASSET VALUATION',
        title: 'Usable Stock Valuation (WAC)',
        description: 'Total commercial capital tied up in active warehouse stock. Calculated dynamically using Weighted Average Cost (WAC) per unit.',
        tip: 'Quarantined return parcels in dock buffers are strictly excluded from valuation.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-strip-rto"]',
        badge: 'REVERSE LOGISTICS',
        title: 'Courier RTO Returns Dock',
        description: 'Fast operational shortcut for undelivered courier parcels. Shows count of parcels quarantined at dock awaiting inspection and 1-click restocking.',
        tip: 'Click "Courier RTO Returns Dock ➔" to inspect tracking IDs and approve stock return.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-strip-returns"]',
        badge: 'QUALITY CONTROL',
        title: 'Customer Returns Dock',
        description: 'Displays customer-returned parcels in warehouse intake quarantine. Directs you to the physical QC grading hub for inspection and restock approval.',
        tip: 'Only Grade A pristine returns can be restocked into sellable inventory.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-strip-exchanges"]',
        badge: 'TWO-LEGGED SWAPS',
        title: 'Exchanges Inbound Dock',
        description: 'Tracks replacement orders where customer returned units are in transit back to the warehouse dock.',
        tip: 'Ensures replacement unit outflow is balanced with returned unit intake.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-waveforms"]',
        badge: 'TREND VISUALIZATION',
        title: 'Interactive Trend Waveforms',
        description: 'Multi-metric chart displaying daily sales revenue, units sold, and gross margins over 7-day, 30-day, or all-time horizons.',
        tip: 'Use the horizon buttons (7D / 30D / ALL) in the top-right to switch timeframes.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-recent-sales"]',
        badge: 'LIVE ACTIVITY',
        title: 'Real-Time Sales Activity Feed',
        description: 'Chronological stream of recent customer dispatches with instantaneous revenue, COGS, and profit breakdown per order.',
        tip: 'Click any order to jump directly to the Sales Ledger.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-low-stock"]',
        badge: 'INVENTORY ALERT',
        title: 'Stock Runway Warning Dock',
        description: 'Highlights items with depleted or critically low stock (<10 units) to prevent fulfillment stockouts and lost revenue.',
        tip: 'Click "+ Restock" to immediately log a factory procurement batch.',
        preferredPlacement: 'top'
      }
    ]
  },

  sales: {
    title: 'Sales Order Ledger Walkthrough',
    badge: 'SALES & ORDERS',
    steps: [
      {
        selector: '[data-tour="sales-search"]',
        badge: 'QUICK FINDER',
        title: 'Real-Time Order Search Bar',
        description: 'Instantly filter orders by Style SKU (e.g. DE26001G), customer reference, invoice number, or dispatch date with zero typing lag.',
        tip: 'Searches across thousands of sales records in real time.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-export"]',
        badge: 'REPORTING TOOLS',
        title: 'Export to Excel & 3NF CSV',
        description: 'Download the complete sales order ledger formatted with currency styles and formulas for external accounting or tax filings.',
        tip: 'Excel export preserves column formatting and timestamps.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-new-btn"]',
        badge: 'ORDER DISPATCH',
        title: '+ New Fast Sale Order Button',
        description: 'Opens the Fast Order Dispatch modal. Enter any SKU for instant autocomplete, stock validation, and live financial profit preview before confirming dispatch.',
        tip: 'Keyboard shortcut: Press Alt+S anywhere in the platform to launch!',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-table"]',
        badge: 'LEDGER GRID',
        title: 'Master Sales Order Ledger',
        description: 'Complete chronological record of all dispatched customer orders. Each order records date, SKU, units sold, unit selling price, revenue, COGS, and profit.',
        tip: 'Every order mutation updates SQLite and automatically syncs to Sales_Inventory.xlsx.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="sales-col-sku"]',
        badge: 'PRODUCT IDENTIFIER',
        title: 'Style SKU Column',
        description: 'Identifies the exact apparel style code (e.g. DE26003W). Links directly to stock balances and procurement batch costing.',
        tip: 'Style codes follow standard enterprise naming conventions.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-col-revenue"]',
        badge: 'TURNOVER',
        title: 'Selling Price & Total Revenue',
        description: 'Displays the unit selling rate and gross order revenue. Supports dual-pricing entry to eliminate penny drift on bulk discount invoices.',
        tip: 'Total Revenue = Quantity Sold × Unit Selling Price.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-col-cogs"], [data-tour="sales-col-profit"], [data-tour="sales-col-margin"]',
        badge: 'FINANCIAL ENGINE',
        title: 'Cost, Gross Profit & Margin %',
        description: 'The instant financial computation cluster. Directly displays Cost of Goods Sold (COGS), resulting Gross Profit in dollars, and Margin percentage color-coded for fast audit.',
        tip: 'Formula: Gross Profit = Total Revenue - COGS. Margin % = (Profit / Revenue) × 100.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-col-ref"]',
        badge: 'SALES CHANNEL',
        title: 'Order Reference & Channel',
        description: 'Tracks sales origin (Direct Sale, Wholesale Invoice, Shopify, Meesho, Amazon) or custom customer reference notes.',
        tip: 'Helps track channel-specific revenue velocity.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="sales-col-actions"]',
        badge: 'MUTATIONS',
        title: 'Inline Edit & Restorative Delete',
        description: 'Click Edit (pencil) to adjust price or date. Click Delete (trash) to remove an erroneous order — deleting an order automatically restores sold units back into active inventory!',
        tip: 'All edits and deletions are permanently recorded in the regulatory audit trail.',
        preferredPlacement: 'left'
      }
    ]
  },

  stock: {
    title: 'Stock Balance Matrix Walkthrough',
    badge: 'INVENTORY MATRIX',
    steps: [
      {
        selector: '[data-tour="stock-hud"]',
        badge: 'INVENTORY OVERVIEW',
        title: 'Stock Health HUD Counters',
        description: 'High-level inventory telemetry displaying total active styles, star performers, adequate stock levels, and urgent low/depleted styles requiring factory reorders.',
        tip: 'Refreshes live whenever orders, procurement batches, or restocks occur.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-search"]',
        badge: 'INVENTORY FINDER',
        title: 'SKU Search & Health Filters',
        description: 'Filter inventory by style number or filter down to Star, Adequate, Low, or Depleted stock tiers with 1 click.',
        tip: 'Filter by "Depleted" to quickly generate supplier reorder sheets.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-export"]',
        badge: 'SYNC & EXPORT',
        title: 'Export & Master Excel Sync',
        description: 'Download the stock ledger or trigger a live synchronization check between SQLite, Sales_Inventory.xlsx, and 3NF CSV records.',
        tip: 'Excel sync ensures external spreadsheets always match the database.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-table"]',
        badge: 'INVENTORY MATRIX',
        title: 'Single Source of Truth Matrix',
        description: 'Comprehensive inventory balance table accounting for factory inflows, sales outflows, and dock restocks per style.',
        tip: 'Formula: Usable Stock = Total Inward - Dispatched Sales + Restocked Units.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="stock-col-inflow"]',
        badge: 'PROCUREMENT INFLOW',
        title: 'Factory Inward Column',
        description: 'Total cumulative units received from garment factories and textile suppliers across all procurement batches.',
        tip: 'Inward quantities are logged via the Procurement tab.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-col-outflow"]',
        badge: 'SALES OUTFLOW',
        title: 'Dispatched Units Column',
        description: 'Total cumulative units shipped out to customers via confirmed sales orders.',
        tip: 'Deducted immediately when a sale is confirmed.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-col-restocked"]',
        badge: 'REVERSE INFLOW',
        title: 'Approved Restocked Units',
        description: 'Total units safely recovered from courier RTO parcels, customer returns, or exchange returns after passing warehouse QC inspection.',
        tip: 'Quarantined dock returns are never counted until officially approved.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-col-hand"]',
        badge: 'SELLABLE INVENTORY',
        title: 'Usable Stock On-Hand',
        description: 'The definitive quantity of units available to sell right now. The Fast Sale modal strictly validates against this exact column.',
        tip: 'Never sell items when usable stock is 0 to avoid backorders.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-col-wac"]',
        badge: 'COST VALUATION',
        title: 'Weighted Average Cost (WAC)',
        description: 'The blended purchase cost per unit dynamically calculated across all historical purchase batches for this style.',
        tip: 'Multiplying WAC by usable units gives exact capital inventory valuation.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-col-status"]',
        badge: 'HEALTH BADGES',
        title: '4-Tier Health Badges',
        description: 'Visual health classification: Star (>=30 units, Green), Adequate (10-29, Blue), Low (1-9, Amber), and Depleted (0, Rose).',
        tip: 'Color-coding helps warehouse teams spot critical replenishment needs at a glance.',
        preferredPlacement: 'left'
      }
    ]
  },

  rto: {
    title: 'Courier RTO Returns Dock Walkthrough',
    badge: 'COURIER RTO PIPELINE',
    steps: [
      {
        selector: '[data-tour="rto-hud"]',
        badge: 'PIPELINE CONTROL',
        title: 'RTO Search & Status Pipeline Bar',
        description: 'Filter courier RTO parcels by tracking number, style SKU, or pipeline stage: In Transit, Received at Dock, Restocked, or Damaged Loss.',
        tip: 'Parcels follow a strict 3-stage chain of custody.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-bulk-restock"]',
        badge: '1-CLICK RESTOCK',
        title: 'Bulk Restock Dock Parcels',
        description: 'Restock all physically inspected and received RTO parcels back into active warehouse inventory in a single click.',
        tip: 'Clears dozens of received parcels into sellable stock in under 1 second.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-add-btn"]',
        badge: 'INTAKE ENTRY',
        title: 'Log New RTO Parcel',
        description: 'Record incoming failed-delivery parcel: enter initiated date, style SKU, quantity, courier shipping fee, and carrier tracking AWB number.',
        tip: 'Auto-fills style pricing from recent sales records.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-table"]',
        badge: 'PIPELINE LEDGER',
        title: 'Courier RTO Quarantine Ledger',
        description: 'The master reverse-logistics table. Keeps track of parcels from initial courier delivery failure through dock inspection to final restock or loss write-off.',
        tip: 'Items remain quarantined here until warehouse staff approve restock.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="rto-col-tracking"]',
        badge: 'COURIER AWB',
        title: 'Carrier Tracking Number (AWB)',
        description: 'The courier consignment tracking number. Used to reconcile delivery attempt logs from Delhivery, Bluedart, Xpressbees, or Shadowfax.',
        tip: 'Search by full or partial AWB number to instantly locate parcels.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-col-status"]',
        badge: 'STAGE STATUS',
        title: 'Pipeline Stage Indicator',
        description: 'Shows current status: In Transit (on delivery truck), Received (at dock quarantine), Restocked (added back to sellable stock), or Damaged.',
        tip: 'Status pills pulse blue when parcels are awaiting inspection at the dock.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-col-dock"]',
        badge: 'OPERATIONS',
        title: 'Dock Operations: Receive, Restock & Damage',
        description: 'Staff action buttons: Click "Receive" when parcel arrives at dock. Click "Restock" (+1 to stock) if pristine, or "Damage" (records loss write-off) if crushed.',
        tip: 'Restocking immediately updates the Stock Matrix without manual recalculations.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="rto-col-actions"]',
        badge: 'RECORD EDIT',
        title: 'Record Management & Deletion',
        description: 'Edit parcel details or delete erroneous RTO entries. Deletions reverse any inventory adjustments and update the audit log.',
        tip: 'Requires administrative confirmation before deletion.',
        preferredPlacement: 'left'
      }
    ]
  },

  returns: {
    title: 'Customer Returns & QC Hub Walkthrough',
    badge: 'CUSTOMER RETURNS',
    steps: [
      {
        selector: '[data-tour="returns-hud"]',
        badge: 'RETURNS HUD',
        title: 'Returns Filter & Control Bar',
        description: 'Filter customer returns by reverse AWB, customer reason, SKU, or status (In Transit, Received, Restocked, Damaged).',
        tip: 'Customer returns undergo physical inspection because packaging has been opened.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-bulk-restock"]',
        badge: 'QUICK APPROVAL',
        title: 'Bulk Restock Received Returns',
        description: 'Restocks all inspected returns currently sitting in dock quarantine back into sellable inventory.',
        tip: 'Only returns that have arrived at the warehouse can be restocked.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-add-btn"]',
        badge: 'INTAKE',
        title: 'Log Customer Return Entry',
        description: 'Record customer return request: captures refund amount, reverse shipping fee, return reason (Size, Fabric, Defect), and courier AWB.',
        tip: 'Creates a holding record before the physical garment arrives.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-table"]',
        badge: 'QC LEDGER',
        title: 'Customer Returns & QC Ledger',
        description: 'Complete record of all customer returns. Tracks refund disbursements, reverse courier costs, and physical condition grades.',
        tip: 'Refund and reverse fee expenses feed into Net Realized Profit.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="returns-col-reason"]',
        badge: 'CUSTOMER FEEDBACK',
        title: 'Primary Return Reason',
        description: 'Categorizes why customer sent the item back: Size Too Small, Fabric Dislike, Quality Defect, or Late Delivery.',
        tip: 'Identify styles with high sizing defects to improve sizing charts.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-col-dock"]',
        badge: 'QC GRADING',
        title: 'Dock Operations & Physical QC Grading',
        description: 'Click "Receive" upon package arrival. Inspect garment and approve "Restock" if unworn with tags attached, or write off as return loss if stained/torn.',
        tip: 'Defective items are absorbed as financial return losses without polluting sellable stock.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="returns-col-actions"]',
        badge: 'ACTIONS',
        title: 'Edit & Audit Record Actions',
        description: 'Modify return details or remove entries. All mutations are stamped into the regulatory audit log with timestamps.',
        tip: 'Preserves compliance records for financial reconciliations.',
        preferredPlacement: 'left'
      }
    ]
  },

  exchanges: {
    title: 'Item Exchanges Walkthrough',
    badge: 'EXCHANGES PIPELINE',
    steps: [
      {
        selector: '[data-tour="exchanges-hud"]',
        badge: 'EXCHANGE CONTROLS',
        title: 'Exchanges Search & Filter Bar',
        description: 'Filter exchanges by original SKU, replacement SKU, customer return reason, or tracking status.',
        tip: 'Exchanges require two-legged inventory synchronization.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-add-btn"]',
        badge: 'NEW SWAP',
        title: 'Log Two-Legged Exchange',
        description: 'Record size/color swap: select returned original style and newly requested replacement style. The system immediately deducts replacement style from stock so dispatch can ship right away!',
        tip: 'Prevents selling out of replacement sizes while customer return is in transit.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-table"]',
        badge: 'SWAP LEDGER',
        title: 'Exchanges Synchronized Ledger',
        description: 'Tracks both sides of the transaction: the outbound replacement shipment and the inbound customer return shipment.',
        tip: 'Monitors net settlement and courier reverse fees.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="exchanges-col-returned"]',
        badge: 'INBOUND LEG',
        title: 'Returned Original SKU',
        description: 'The style code being returned by the customer (e.g. DE26001G in Size M). Stages into intake buffer until parcel arrives.',
        tip: 'Inspect condition before releasing back into sellable inventory.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-col-dispatched"]',
        badge: 'OUTBOUND LEG',
        title: 'Dispatched Replacement SKU',
        description: 'The new size/color style shipped to the customer (e.g. DE26001G in Size L). Deducted from active stock immediately.',
        tip: 'Ensures stock balances reflect the outgoing replacement unit.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-col-dock"]',
        badge: 'INTAKE RESTOCK',
        title: 'Dock Intake & Restock Action',
        description: 'When the customer return shipment reaches the warehouse dock, click "Receive", inspect the garment, and click "Restock" to restore the original style to sellable stock.',
        tip: 'Completes both legs of the inventory transaction.',
        preferredPlacement: 'left'
      }
    ]
  },

  procurement: {
    title: 'Procurement & Purchase Orders Walkthrough',
    badge: 'PROCUREMENT & SOURCING',
    steps: [
      {
        selector: '[data-tour="proc-hud"]',
        badge: 'PROCUREMENT HUD',
        title: 'Procurement Controls & Subtabs',
        description: 'Switch between individual factory inward batches and daily supply aggregates. Search by supplier lot or style SKU.',
        tip: 'New procurement batches replenish stock and recalculate Weighted Average Cost (WAC).',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-subtabs"]',
        badge: 'SUB-VIEWS',
        title: 'Inward Batches vs Daily Supply',
        description: 'Toggle between chronological purchase orders and daily factory delivery summaries.',
        tip: 'Daily supply view aggregates total factory shipments received each day.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-add-btn"]',
        badge: 'SUPPLY INTAKE',
        title: '+ Inward Batch Order Button',
        description: 'Log new factory shipment: enter arrival date, style SKU, inward unit quantity, and purchase rate per unit.',
        tip: 'Batch intake immediately reflects in the Stock Matrix usable inventory.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-table"]',
        badge: 'SOURCING LEDGER',
        title: 'Procurement Batches Ledger',
        description: 'Complete record of all factory purchase orders, lot numbers, unit purchase costs, and total batch value.',
        tip: 'Procurement records automatically sync to Logistic.xlsx.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="proc-col-rate"]',
        badge: 'UNIT COST',
        title: 'Purchase Rate per Unit',
        description: 'Factory wholesale cost per unit. Blended dynamically with prior inventory to determine the style Weighted Average Cost (WAC).',
        tip: 'Track purchase cost fluctuations across production seasons.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-col-value"]',
        badge: 'BATCH CAPITAL',
        title: 'Total Batch Value',
        description: 'Total capital invested into the procurement lot (Quantity × Purchase Rate). Recorded as debit outflow in financial reconciliations.',
        tip: 'Total Batch Value = Inward Quantity × Purchase Rate.',
        preferredPlacement: 'bottom'
      }
    ]
  },

  ads: {
    title: 'Marketing & Ad Spend Walkthrough',
    badge: 'MARKETING & ROAS',
    steps: [
      {
        selector: '[data-tour="ads-hud"]',
        badge: 'CAMPAIGN CONTROLS',
        title: 'Marketing Search & Export Bar',
        description: 'Search ad campaigns across platforms (Meta Ads, Google Ads, TikTok, Influencers) or export campaign spend data to Excel.',
        tip: 'Keep daily marketing spend updated to calculate accurate Blended ROAS.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-add-btn"]',
        badge: 'LOG EXPENSE',
        title: 'Log Ad Spend Button',
        description: 'Record daily advertising expense: select date, platform channel, spend amount ($), and campaign strategy notes.',
        tip: 'Ad spend is factored directly into Net Realized Profit calculations.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-table"]',
        badge: 'CAMPAIGN LEDGER',
        title: 'Multi-Channel Ad Spend Ledger',
        description: 'Chronological register of marketing investments across all digital acquisition channels.',
        tip: 'Helps evaluate marketing budget efficiency against daily sales revenue.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="ads-col-platform"]',
        badge: 'CHANNEL',
        title: 'Platform Channel Column',
        description: 'Displays the digital acquisition source: Meta Ads (Facebook/Instagram), Google Ads, TikTok, or Influencer collaborations.',
        tip: 'Attribute revenue spikes to specific platform campaigns.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-col-amount"]',
        badge: 'DAILY BUDGET',
        title: 'Spend Amount ($)',
        description: 'Exact daily spend allocated to the campaign. Feeds into the blended acquisition cost model.',
        tip: 'Formula: Blended ROAS = Total Dispatched Revenue ÷ Total Ad Spend.',
        preferredPlacement: 'bottom'
      }
    ]
  },

  bank: {
    title: 'Bank Treasury Walkthrough',
    badge: 'TREASURY & RECONCILIATION',
    steps: [
      {
        selector: '[data-tour="bank-hud"]',
        badge: 'TREASURY HUD',
        title: '4-Card Bank Reconciliation HUD',
        description: 'Displays live treasury metrics: Current Bank Balance, Total Credited deposits (+), Total Debited withdrawals (-), and total transactions.',
        tip: 'Matches real-world bank account statements with zero-drift accuracy.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-balance-card"]',
        badge: 'CLOSING BALANCE',
        title: 'Current Bank Balance Card',
        description: 'Continuous chronological closing balance calculated across all historical credit and debit entries. Shows active surplus or deficit status.',
        tip: 'Reconcile this number with your online banking dashboard regularly.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-toolbar"]',
        badge: 'TOOLBAR',
        title: 'Search, Flow Filters & Actions',
        description: 'Filter transactions by Credit Inflow (Deposits) or Debit Outflow (Withdrawals), search by transaction description, or export bank statements.',
        tip: 'Quickly isolate supplier debits or courier remittances.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-add-btn"]',
        badge: 'BANK ENTRY',
        title: 'Record Bank Entry Button',
        description: 'Log deposits or expenses: select date, transaction type (Credited (+) or Debited (-)), and exact dollar amount.',
        tip: 'Automatically recalculates the continuous running balance for all subsequent rows.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-table"]',
        badge: 'TREASURY MATRIX',
        title: 'Continuous Treasury Ledger',
        description: 'Chronological financial matrix displaying every cash event with color-coded flow badges and closing running balances.',
        tip: 'Every row shows the exact state of treasury cash after that event.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="bank-col-balance"]',
        badge: 'RUNNING BALANCE',
        title: 'Closing Running Balance ($) Column',
        description: 'Dynamically recomputed for every transaction: Previous Balance + Credit Amount (or - Debit Amount) = New Closing Balance.',
        tip: 'Zero penny drift guaranteed through integer cents math.',
        preferredPlacement: 'left'
      }
    ]
  },

  analytics: {
    title: 'Financial Analytics Walkthrough',
    badge: 'ANALYTICS & REPORTS',
    steps: [
      {
        selector: '[data-tour="analytics-controls"]',
        badge: 'VIEW CONTROLS',
        title: 'Analytics View Mode Switcher',
        description: 'Toggle between viewing both financial tables side-by-side, Daily Sales Only, or Daily Marketing Ad Spend Only.',
        tip: 'Isolate daily sales to review gross profit margins across specific calendar weeks.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="analytics-export"]',
        badge: 'REPORTS',
        title: 'Export Daily Breakdowns',
        description: 'Export structured daily sales performance and daily ad spend sheets directly to Excel or CSV.',
        tip: 'Includes daily order counts, units sold, gross revenue, COGS, and profit margins.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="analytics-sales-table"]',
        badge: 'DAILY SALES',
        title: 'Table 1: Daily Sales & Profit Breakdown',
        description: 'Aggregates commercial performance day-by-day: orders count, units sold, gross revenue, COGS, and daily gross profit with margin percentages.',
        tip: 'The bottom sticky footer computes overall grand totals and blended margin.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="analytics-ads-table"]',
        badge: 'DAILY MARKETING',
        title: 'Table 2: Daily Ad Spend Breakdown',
        description: 'Day-by-day marketing expenditures detailing campaigns count, platforms utilized, and total ad dollars deployed.',
        tip: 'Compare against Table 1 to identify marketing spend correlation with sales spikes.',
        preferredPlacement: 'top'
      }
    ]
  },

  audit: {
    title: 'Regulatory Audit Trail Walkthrough',
    badge: 'AUDIT & COMPLIANCE',
    steps: [
      {
        selector: '[data-tour="audit-toolbar"]',
        badge: 'AUDIT CONTROLS',
        title: 'Audit Search, Polling & Export',
        description: 'Real-time keyword search across all system mutations. Features a 5-second live telemetry polling toggle and direct CSV export.',
        tip: 'Export CSV to provide regulatory and tax authorities with an immutable audit log.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="audit-filters"]',
        badge: 'CATEGORY CHIPS',
        title: 'Domain Category Filter Chips',
        description: 'Click any domain chip to isolate specific actions: SALE, RTO, CUSTOMER_RETURN, EXCHANGE, STOCK, AD_SPEND, BANK, SYNC, or SYSTEM.',
        tip: 'Click "BANK" or "SALE" to immediately audit transactions within that subsystem.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="audit-table"]',
        badge: 'IMMUTABLE LOG',
        title: 'Chronological Audit Event Stream',
        description: 'Permanent event store recording every creation, update, deletion, or sync action with timestamp, operator category, and detailed delta summary.',
        tip: 'Guarantees 100% operational transparency and traceability.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="audit-col-action"]',
        badge: 'MUTATION ACTION',
        title: 'Action & Severity Indicator',
        description: 'Color-coded action types (CREATE, UPDATE, DELETE, SYNC) with severity badges (SUCCESS, WARNING, DANGER, INFO).',
        tip: 'Deletions and damage write-offs appear in prominent warning colors.',
        preferredPlacement: 'bottom'
      }
    ]
  },

  status: {
    title: 'System Health & Diagnostics Walkthrough',
    badge: 'SYSTEM STATUS & PROBES',
    steps: [
      {
        selector: '[data-tour="status-header"]',
        badge: 'TELEMETRY STATUS',
        title: 'Subsystem Health Header & Diagnostics',
        description: 'Live status banner showing overall platform health (HEALTHY) and passing diagnostic check counters (e.g. 6/6 Checks Passed).',
        tip: 'Click "Re-run Diagnostics" to probe all backend services in real time.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-quick-banner"]',
        badge: 'PUBLIC ACCESS',
        title: 'Dedicated /status Dashboard URL',
        description: 'Public health dashboard accessible at /status and raw JSON telemetry probe at /api/status. Click the copy button to share with your DevOps team.',
        tip: 'Allows monitoring uptime and latency without logging into the ERP interface.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-runtime"]',
        badge: 'PROCESS PROBE',
        title: 'API Service & Process Runtime',
        description: 'Monitors FastAPI service uptime, resident memory RSS consumption in MB, OS process ID (PID), Python runtime version, and diagnostic response latency (<30ms).',
        tip: 'Ensures the backend server is running smoothly without memory leaks.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-db"]',
        badge: 'DATABASE PROBE',
        title: 'Database & All 8 Table Counters',
        description: 'Pings SQLite database connectivity, verifies file size on disk, and displays live record counters across all 8 relational tables.',
        tip: 'Guarantees that tables are healthy and no database corruption exists.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-financial"]',
        badge: 'INTEGRITY PROBE',
        title: 'Zero-Drift Financial Verification',
        description: 'Mathematically verifies the fundamental financial identity: Gross Profit = Dispatched Revenue - Total System COGS with zero rounding drift.',
        tip: 'Continuous mathematical audit ensuring penny-perfect ledger continuity.',
        preferredPlacement: 'bottom'
      }
    ]
  }
};

// Master Tour: An executive 11-stage journey through all tabs, auto-switching views and spotlighting primary hero elements
export const MASTER_TOUR_STEPS = [
  {
    tab: 'dashboard',
    selector: '[data-tour="dash-copilot"]',
    badge: 'STAGE 1 OF 11 • CORE INTELLIGENCE',
    title: 'Executive Overview & AI Copilot',
    description: 'Welcome to the Divine Enterprise ERP! The Executive Dashboard aggregates real-time telemetry across sales, inventory, reverse logistics, and advertising into high-priority action alerts.',
    tip: 'Click any copilot recommendation card to immediately navigate to the relevant workflow.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'sales',
    selector: '[data-tour="sales-new-btn"]',
    badge: 'STAGE 2 OF 11 • FULFILLMENT',
    title: 'Fast Order Dispatcher & Profit Preview',
    description: 'The Sales Order Ledger manages customer shipments. Click "+ New Sale" (or press Alt+S anywhere) to dispatch orders with live stock availability validation and instant COGS profit preview.',
    tip: 'Deleting an erroneous order automatically credits and restores sold units back into stock.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'sales',
    selector: '[data-tour="sales-col-cogs"], [data-tour="sales-col-profit"], [data-tour="sales-col-margin"]',
    badge: 'STAGE 3 OF 11 • INSTANT FINANCIALS',
    title: 'Real-Time Profit & Margin Engine',
    description: 'Every sale automatically computes exact Cost of Goods Sold (COGS), resulting Gross Profit, and Margin % with zero penny drift.',
    tip: 'Gross Profit = Total Revenue - COGS. Margin % = (Profit / Revenue) × 100.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'stock',
    selector: '[data-tour="stock-hud"]',
    badge: 'STAGE 4 OF 11 • INVENTORY MATRIX',
    title: 'Single Source of Truth Inventory Matrix',
    description: 'Tracks every apparel style across the business. Usable stock strictly excludes damaged or uninspected returns sitting in warehouse quarantine.',
    tip: 'Usable Stock = Total Factory Inward - Dispatched Sales + Approved Dock Restocks.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'rto',
    selector: '[data-tour="rto-hud"]',
    badge: 'STAGE 5 OF 11 • REVERSE LOGISTICS',
    title: 'Courier RTO 3-Stage Pipeline',
    description: 'When couriers fail to deliver cash-on-delivery parcels, items return through a protected 3-stage pipeline: In Transit -> Received at Dock -> Restocked into Inventory (or Damaged).',
    tip: 'Use "Bulk Restock Dock" to clear all inspected parcels into stock in one click.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'returns',
    selector: '[data-tour="returns-hud"]',
    badge: 'STAGE 6 OF 11 • QUALITY CONTROL',
    title: 'Customer Returns & Physical QC Hub',
    description: 'Unlike courier RTOs, customer returns have been opened and tried on. The QC Hub provides structured inspection before deciding whether to restock.',
    tip: 'Pristine items are approved into sellable inventory; defective garments are recorded as return losses.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'exchanges',
    selector: '[data-tour="exchanges-add-btn"]',
    badge: 'STAGE 7 OF 11 • TWO-LEGGED SWAPS',
    title: 'Item Exchanges Pipeline',
    description: 'Coordinated two-legged inventory balance: immediately deducts replacement style from stock so dispatch can ship the new size, while tracking customer return intake.',
    tip: 'Restocking the incoming returned item restores active stock for that size.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'procurement',
    selector: '[data-tour="proc-add-btn"]',
    badge: 'STAGE 8 OF 11 • SOURCING & WAC',
    title: 'Factory Procurement & WAC Costing',
    description: 'Log inward garment shipments from manufacturers. Every new batch injects units into stock and recalculates the Weighted Average Cost (WAC) baseline.',
    tip: 'Batch intake automatically synchronizes to Logistic.xlsx.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'ads',
    selector: '[data-tour="ads-hud"]',
    badge: 'STAGE 9 OF 11 • MARKETING & ROAS',
    title: 'Multi-Channel Advertising & Blended ROAS',
    description: 'Monitor marketing campaigns across Meta, Google, and TikTok. Computes Blended ROAS as Total System Revenue divided by Total Ad Spend.',
    tip: 'Ad expenditures are factored directly into the Net Realized Profit equation.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'bank',
    selector: '[data-tour="bank-balance-card"]',
    badge: 'STAGE 10 OF 11 • TREASURY',
    title: 'Bank Treasury & Continuous Running Balance',
    description: 'Reconcile bank accounts with zero-drift accuracy. Continuously recalculates closing balance across all credit deposits and debit disbursements.',
    tip: 'Compare closing balance against your actual online bank account balance.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'status',
    selector: '[data-tour="status-header"]',
    badge: 'STAGE 11 OF 11 • DIAGNOSTICS PROBE',
    title: 'Multi-Subsystem Health & Diagnostics',
    description: 'Continuously probes the FastAPI backend, SQLite database, master Excel workbooks, flat 3NF CSV files, and zero-drift financial integrity.',
    tip: 'Accessible anytime at /status (HTML Dashboard) and /api/status (JSON API).',
    preferredPlacement: 'bottom'
  }
];
