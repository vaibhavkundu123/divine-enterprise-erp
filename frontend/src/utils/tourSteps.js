// Interactive Spotlight Tour & Operational Knowledge Base
// Every step targets a real DOM element via CSS selector, highlights it with zero dimming,
// and attaches a directional pointer dialog box with elaborate operational details and mathematical rules.

export const TAB_TOURS = {
  dashboard: {
    title: 'Executive Overview Walkthrough',
    badge: 'EXECUTIVE COMMAND',
    steps: [
      {
        selector: '[data-tour="dash-copilot"]',
        badge: 'AI INTELLIGENCE',
        title: 'Divine AI Operational Copilot Banner',
        description: 'The autonomous heuristic engine continuously audits real-time operational streams across sales, warehouse inventory, reverse logistics docks, and digital marketing efficiency.',
        details: [
          'Scans sales velocity curves to identify top-grossing star performer apparel styles.',
          'Calculates stock replenishment runways and fires urgent reorder warnings when styles drop below 10 sellable units.',
          'Evaluates blended advertising ROAS efficiency across channels to flag underperforming campaigns.',
          'Direct-action shortcuts allow jumping straight from a copilot recommendation into the corresponding operational ledger with 1 click.'
        ],
        tip: 'Check this copilot banner at the start of every business day to address urgent inventory or marketing actions.'
      },
      {
        selector: '[data-tour="dash-kpi-profit"]',
        badge: '5-TIER FINANCIALS',
        title: 'Net Realized Profit KPI Engine',
        description: 'Represents true net commercial earnings after accounting for all 5 enterprise operational tiers, avoiding deceptive gross revenue vanity figures.',
        details: [
          'Tier 1 (Gross Sales Margin): Aggregate Selling Revenue minus factory procurement COGS.',
          'Tier 2 (Courier RTO Losses): Deducts non-refundable forward shipping and cash-on-delivery courier fees.',
          'Tier 3 (Customer Return Losses): Accounts for reverse shipping logistics and damaged/disputed write-offs.',
          'Tier 4 (Item Exchange Costs): Absorbs replacement shipping logistics fees.',
          'Tier 5 (Digital Marketing Overhead): Fully amortizes multi-channel advertising expenditures.'
        ],
        formula: 'Net Profit = Gross Margin - Courier RTO Fees - Customer Return Losses - Exchange Logistics - Ad Spend',
        tip: 'Click this card to verify underlying revenue deductions and cost breakdowns.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-revenue"]',
        badge: 'TOP-LINE TURNOVER',
        title: 'Dispatched Gross Revenue',
        description: 'Total cumulative invoice turnover generated across all customer fulfillment orders successfully dispatched from the warehouse.',
        details: [
          'Derived directly from confirmed sales orders in the SQLite order ledger.',
          'Reflects invoice value before any reverse logistics or customer return subtractions.',
          'Calculates real-time Average Order Value (AOV) and overall customer volume velocity.',
          'Synchronized synchronously to the Sales_Inventory.xlsx workbook for accountant verification.'
        ],
        formula: 'Dispatched Revenue = Σ (Quantity Sold × Unit Selling Price)',
        tip: 'Track revenue velocity across the 7D, 30D, and ALL-TIME filters in the waveforms below.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-ads"]',
        badge: 'MARKETING EFFICIENCY',
        title: 'Marketing Spend & Blended ROAS',
        description: 'Consolidates digital customer acquisition investments across Meta Ads, Google Ads, TikTok, and offline influencer campaigns into a unified ROAS benchmark.',
        details: [
          'Blended ROAS gauges whole-system commercial leverage across all paid channels.',
          'ROAS >= 4.0x is classified as Exceptional (scale budget aggressively).',
          'ROAS between 2.5x and 3.99x is graded Profitable (sustainable scale).',
          'ROAS below 1.5x triggers warning alerts indicating unviable customer acquisition costs.'
        ],
        formula: 'Blended ROAS = Total Dispatched Revenue ÷ Total Advertising Spend',
        tip: 'Audit daily ad spend against daily sales surges in the Analytics tab to detect channel attribution lag.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-kpi-valuation"]',
        badge: 'CAPITAL ASSETS',
        title: 'Active Inventory Valuation (WAC)',
        description: 'Total working capital tied up in active warehouse stock, calculated using dynamic Weighted Average Costing (WAC) per individual style SKU.',
        details: [
          'Strict Quarantine Rule: Quarantined return parcels in dock buffers are strictly excluded until inspected.',
          'Blended Valuation: Dynamically averages procurement costs across diverse factory purchase batches.',
          'Liquidity Protection: Identifies dead stock capital to prevent over-purchasing slow-moving garments.',
          'Zero Penny Drift: Evaluates valuation using exact integer cents math without floating-point errors.'
        ],
        formula: 'Inventory Valuation = Σ (Usable Stock On-Hand × Weighted Average Cost)',
        tip: 'Procuring new batches at lower rates immediately brings down average inventory holding costs.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-strip-rto"]',
        badge: 'REVERSE LOGISTICS',
        title: 'Courier RTO Returns Dock Quick-Bar',
        description: 'High-speed reverse logistics shortcut showing parcels returned undelivered by cash-on-delivery couriers that are currently waiting in dock quarantine.',
        details: [
          'Highlights exact count of parcels arrived at warehouse intake awaiting physical inspection.',
          'Strict Quarantine Isolation: Items in this count are NOT yet in sellable stock to prevent phantom stockouts.',
          'Clicking the bright blue button opens the Courier RTO Returns Dock for 1-click bulk restocking.',
          'Pristine parcels approved for restock immediately increment usable warehouse inventory counts.'
        ],
        tip: 'Click "Courier RTO Returns Dock ➔" to inspect courier AWB tracking numbers and process restocks.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-strip-returns"]',
        badge: 'QUALITY CONTROL',
        title: 'Customer Returns Intake Dock',
        description: 'Tracks customer-initiated returns currently in transit or arrived at the warehouse intake dock awaiting physical condition grading.',
        details: [
          'Customer returns undergo strict QC inspection because garments have been opened and tried on.',
          'Inspectors assign condition grades: Grade A (Pristine), Grade B (Packaging defect), or Damaged.',
          'Grade A garments are approved directly back into primary sellable stock.',
          'Damaged garments are absorbed as return loss write-offs without polluting active inventory.'
        ],
        tip: 'Click the blue button to open the Customer Returns & QC Grading Hub.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-strip-exchanges"]',
        badge: 'TWO-LEGGED LOGISTICS',
        title: 'Item Exchanges Balance Dock',
        description: 'Supervises two-legged replacement orders to ensure outbound replacement shipments are balanced with inbound customer return deliveries.',
        details: [
          'Leg 1 (Outflow): Replacement style is deducted immediately from stock so dispatch can package and ship.',
          'Leg 2 (Inflow): Original garment return is tracked in transit back to the warehouse dock.',
          'When the returned package arrives, 1-click restocking returns the original size back to active inventory.',
          'Prevents inventory shrinkage by tracking courier reverse fees and net replacement settlements.'
        ],
        tip: 'Click the blue button to view the Exchanges pipeline and clear arrived return items.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="dash-waveforms"]',
        badge: 'DATA VISUALIZATION',
        title: 'Interactive Trend Waveforms Chart',
        description: 'Multi-metric analytical waveform graphing daily sales revenue, unit dispatch volume, and gross profit margin trajectories across custom horizons.',
        details: [
          'Supports 7-Day, 30-Day, and All-Time timeline filters in the top-right toggle buttons.',
          'Visualizes gross margin stability across seasonal promotions and volume discounts.',
          'Helps spot weekly purchasing cycles (e.g. weekend order surges versus weekday fulfillment).',
          'Renders with zero layout shift and smooth responsive curves.'
        ],
        tip: 'Use the 7D / 30D / ALL buttons to analyze long-term commercial momentum vs short-term spikes.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-recent-sales"]',
        badge: 'LIVE TELEMETRY',
        title: 'Real-Time Sales Activity Feed',
        description: 'Chronological real-time ledger stream showing recent customer order dispatches with instantaneous financial metrics.',
        details: [
          'Displays Order Date, Style SKU, Units Sold, and Gross Profit in real time.',
          'Color-coded profit margin badges (Green for positive, Red for negative) provide instant health visibility.',
          'Clicking any record navigates directly to the full Sales Order Ledger.',
          'Guarantees zero lag between order dispatch and dashboard reflection.'
        ],
        tip: 'Click any order to jump into the Sales Ledger for full price editing or invoice printing.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="dash-low-stock"]',
        badge: 'FULFILLMENT SAFETY',
        title: 'Low Stock Runway Alert Dock',
        description: 'Continuous replenishment watchdog highlighting styles that have fallen into Low (<10 units) or Depleted (0 units) status.',
        details: [
          'Protects against costly stockouts on popular high-velocity styles.',
          'Displays current units on-hand alongside the style Weighted Average Cost.',
          'Features a direct "+ Restock" shortcut that opens the Procurement Batch modal with the SKU pre-selected.',
          'Reduces supply lead-time delay between inventory depletion and factory purchase orders.'
        ],
        tip: 'Click "+ Restock" next to any low-stock SKU to immediately record an incoming supplier shipment.',
        preferredPlacement: 'top'
      }
    ]
  },

  sales: {
    title: 'Sales Order Ledger Walkthrough',
    badge: 'FULFILLMENT & LEDGER',
    steps: [
      {
        selector: '[data-tour="sales-search"]',
        badge: 'FAST QUERY',
        title: 'Real-Time Search & Autocomplete Filter',
        description: 'Search across thousands of order records by Style SKU, dispatch date, sales channel, or customer invoice reference.',
        details: [
          'Instant client-side indexing delivers sub-millisecond query results with zero typing lag.',
          'Supports partial SKU matching (e.g. typing "2600" matches DE26001G, DE26003B, etc.).',
          'Filter queries dynamically update the visible table rows and table summary counts.'
        ],
        tip: 'Type a date (e.g. 2026-08-24) to filter orders dispatched on that exact business day.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-export"]',
        badge: 'DATA EXPORT',
        title: 'Universal Excel & 3NF CSV Export',
        description: 'Export the complete sales order ledger formatted with currency columns, percentages, and formula headers for accountants and auditors.',
        details: [
          'Excel Export (.xlsx): Generates clean multi-column spreadsheets with formatted numbers and dates.',
          'CSV Export (.csv): Clean 3NF flat file ideal for ERP integrations, Google Sheets, or Python data pipelines.',
          'Includes all columns: Order ID, Date, SKU, Quantity, Unit Selling Price, Revenue, COGS, Profit, Margin %, and Channel.'
        ],
        tip: 'Use Excel export for executive monthly reviews and CSV export for automated accounting imports.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-new-btn"]',
        badge: 'ORDER DISPATCH',
        title: '+ New Fast Sale Order Dispatcher',
        description: 'The core operational gateway to record new customer shipments, wholesale invoices, and direct retail sales with live inventory validation.',
        details: [
          'Instant Stock Availability Guard: Autocompletes SKU and immediately checks usable inventory on-hand.',
          'Zero Over-Selling Safeguard: Warns and blocks dispatch if usable stock is 0 to prevent unfulfillable backorders.',
          'Live Financial Preview: As you type quantity and price, real-time preview computes Total Revenue, COGS, Gross Profit, and Margin % before confirming.',
          'Dual-Pricing Resolution: Enter either Unit Selling Price OR Total Invoice Revenue to eliminate fractional penny drift on bulk discounts.',
          'Tri-Write Synchronization: Submitting an order updates SQLite database, decrements stock matrix, syncs Sales_Inventory.xlsx, and logs to the audit trail.'
        ],
        tip: 'Keyboard Shortcut: Press Alt+S from any screen in the ERP to launch this order modal immediately!',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="sales-table"]',
        badge: 'MASTER LEDGER',
        title: 'Dispatched Sales Orders Master Ledger',
        description: 'The definitive chronological log of all completed dispatches. Every row represents an immutable fulfillment record verified by relational integrity.',
        details: [
          'Row Numbers: Sequential chronological dispatch tracking.',
          'Dispatched Date: System timestamp and operational fulfillment date.',
          'Stock Deductions: Confirmed orders immediately deduct units from sellable stock.',
          'Zero-Drift Continuity: All profit calculations are mathematically verifiable against procurement cost baselines.'
        ],
        tip: 'Hover over any row to reveal quick edit and restorative delete action buttons on the right.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="sales-col-sku"]',
        badge: 'STYLE IDENTIFIER',
        title: 'Style SKU Code Column',
        description: 'The unique alphanumeric apparel style code (e.g. DE26003W, DE26001G) identifying the specific garment design, fabric, and colorway.',
        details: [
          'Links directly into the Stock Balance Matrix for real-time inventory tracking.',
          'Pulls procurement costing to compute Cost of Goods Sold (COGS) dynamically.',
          'Standardized uppercase formatting avoids duplicate records caused by lowercase typos.'
        ],
        tip: 'Consistent style code naming ensures seamless cross-referencing with factory procurement batches.',
        preferredPlacement: 'right'
      },
      {
        selector: '[data-tour="sales-col-revenue"]',
        badge: 'COMMERCIAL TURNOVER',
        title: 'Selling Price & Total Dispatched Revenue',
        description: 'Displays the unit selling rate and total commercial gross revenue collected from the customer for this specific dispatch.',
        details: [
          'Selling Price: The unit price invoiced to the customer or wholesale client.',
          'Total Revenue: Evaluated as Quantity Sold × Unit Selling Price.',
          'Zero Penny Drift: Evaluated using exact integer cents rounding to guarantee penny-perfect bookkeeping.',
          'Feeds directly into daily gross turnover benchmarks on the executive dashboard.'
        ],
        formula: 'Total Revenue = Quantity Sold × Unit Selling Price',
        tip: 'For custom wholesale deals with special package pricing, input the exact total invoice amount.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="sales-col-cogs"], [data-tour="sales-col-profit"], [data-tour="sales-col-margin"]',
        badge: 'FINANCIAL ENGINE',
        title: 'Cost, Gross Profit & Margin % Cluster',
        description: 'The heart of Divine Enterprise profitability. Directly showcases the financial return generated on every sale with live margin grading.',
        details: [
          'COGS (Cost of Goods Sold): Factory procurement cost per unit multiplied by quantity sold, based on Weighted Average Cost (WAC).',
          'Gross Profit ($): Exact dollar surplus generated after recovering product acquisition costs (Revenue - COGS).',
          'Margin %: Percentage of revenue retained as profit. Color-coded: Green for positive profit, Red for negative.',
          'Zero-Drift Guarantee: Mathematically verified identity ensures Profit + COGS always equals Total Revenue with zero rounding errors.'
        ],
        formula: 'Gross Profit = Total Revenue - COGS  |  Margin % = (Gross Profit ÷ Total Revenue) × 100',
        tip: 'Aim for gross profit margins above 25% to safely cover courier RTO fees and digital advertising costs.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="sales-col-ref"]',
        badge: 'SALES ORIGIN',
        title: 'Customer Reference & Sales Channel',
        description: 'Identifies the originating sales channel (Sale, Wholesale, Shopify, Meesho, Amazon) or custom customer order reference number.',
        details: [
          'Enables channel-specific profitability attribution and courier COD reconciliation.',
          'Provides traceability when matching courier COD remittance bank statements against order dispatches.',
          'Defaults to "Sale" if no external invoice number is entered.'
        ],
        tip: 'Enter the courier consignment number or platform order ID here for instant customer support lookups.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="sales-col-actions"]',
        badge: 'ORDER MUTATIONS',
        title: 'Inline Edit & Restorative Order Deletion',
        description: 'Administrative tools to maintain ledger accuracy. Edit pricing or dates, or safely delete mistaken orders with automatic inventory restoration.',
        details: [
          'Edit Order (Pencil): Opens modal to adjust selling price, dispatch date, or quantity with instantaneous recalculation.',
          'Restorative Deletion (Trash): Deleting an order cancels the sale and automatically restores the sold units back into usable inventory!',
          'Audit Compliance: Every edit and deletion stamps a permanent timestamped record into the regulatory audit log.',
          'Confirmation Safeguard: Requires explicit confirmation to prevent accidental order removals.'
        ],
        tip: 'Never worry about mistaken test sales — deleting an order restores your stock balance instantly!',
        preferredPlacement: 'left'
      }
    ]
  },

  stock: {
    title: 'Stock Balance Matrix Walkthrough',
    badge: 'INVENTORY INTEGRITY',
    steps: [
      {
        selector: '[data-tour="stock-hud"]',
        badge: 'INVENTORY HEALTH',
        title: 'Stock Health HUD Telemetry',
        description: 'Executive inventory summary cards categorizing warehouse stock health across Star, Adequate, Low, and Depleted inventory tiers.',
        details: [
          'Total Active Styles: Complete count of garment designs managed in the business catalog.',
          'Star Styles (>=30 units): High-velocity styles with robust inventory runways.',
          'Adequate Styles (10-29 units): Stable inventory buffer for ongoing fulfillment.',
          'Low / Depleted Styles (<10 units): Urgent replenishment alerts requiring factory purchase orders.'
        ],
        tip: 'Filter down to Depleted styles at the start of each production cycle to prepare factory orders.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-search"]',
        badge: 'MATRIX QUERY',
        title: 'SKU Search & Health Filter Chips',
        description: 'Instantly isolate inventory balances by typing style codes or clicking health filter chips (Star, Adequate, Low, Depleted).',
        details: [
          'Search across style SKU codes with real-time reactive filtering.',
          'Clicking a health pill (e.g. "Low Stock") filters the matrix to show only items needing replenishment.',
          'Combines with export tools to generate supplier purchase orders.'
        ],
        tip: 'Click "Depleted" to see all out-of-stock items that must be replenished before running ad campaigns.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-export"]',
        badge: 'SYNC & EXPORT',
        title: 'Export Stock Matrix & Excel Sync',
        description: 'Export clean inventory valuation sheets or verify parity between SQLite database, Sales_Inventory.xlsx, and 3NF CSV files.',
        details: [
          'Download Excel / CSV: Generates snapshot of all style balances, WAC rates, and total valuation.',
          'Background Excel Sync: Probes external spreadsheets to guarantee zero divergence between database and workbook files.',
          'Asynchronous Architecture: Sync checks run in the background without freezing the user interface.'
        ],
        tip: 'Use Excel export when conducting physical warehouse stock counts for month-end reconciliation.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="stock-table"]',
        badge: 'BALANCE MATRIX',
        title: 'Single Source of Truth Inventory Matrix',
        description: 'The definitive inventory equation balancing cumulative factory inflows, sales order outflows, and approved reverse logistics restocks.',
        details: [
          'Strict Inflow-Outflow Accounting: Every unit is tracked from factory arrival to customer doorstep.',
          'Protective Buffer: Uninspected returns in warehouse quarantine are strictly excluded from usable counts.',
          'Eliminates ghost inventory and prevents accidental out-of-stock cancellations.'
        ],
        formula: 'Usable Stock = Total Factory Inward - Total Dispatched Sales + Total Approved Restocks',
        tip: 'This matrix is the exact baseline referenced by the Fast Order Dispatcher during live sales entry.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="stock-col-inflow"]',
        badge: 'FACTORY SUPPLY',
        title: 'Total Factory Inward Units Column',
        description: 'Cumulative quantity of garments manufactured, shipped, and received from factory mills across all procurement batches.',
        details: [
          'Directly linked to records created in the Procurement Hub.',
          'Increments automatically when a new inward procurement batch is logged.',
          'Serves as the supply foundation for Weighted Average Cost (WAC) calculations.'
        ],
        tip: 'Verify this column against factory delivery challans during physical receiving.',
        preferredPlacement: 'right'
      },
      {
        selector: '[data-tour="stock-col-outflow"]',
        badge: 'FULFILLMENT',
        title: 'Total Dispatched Sales Units Column',
        description: 'Cumulative count of units packaged, invoiced, and shipped to customers via confirmed sales orders.',
        details: [
          'Deducted in real time when an order is submitted in the Sales Ledger.',
          'Accurately reflects historical customer demand and consumption volume.',
          'Restorative order deletions automatically reduce this count and return units to stock.'
        ],
        tip: 'Compare dispatched units against inward units to monitor historical sell-through rates.',
        preferredPlacement: 'right'
      },
      {
        selector: '[data-tour="stock-col-restocked"]',
        badge: 'REVERSE LOGISTICS',
        title: 'Total Approved Restocked Units Column',
        description: 'Units recovered from courier RTO parcels, customer returns, or exchange returns that have passed physical inspection.',
        details: [
          'Quarantine Rule: Only parcels officially marked "Restocked" at the dock increment this column.',
          'Damaged or stained items are never restocked and do not inflate this number.',
          'Protects customers from receiving previously worn or damaged return garments.'
        ],
        tip: 'All restocks undergo physical warehouse verification before entering sellable stock.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="stock-col-hand"]',
        badge: 'SELLABLE INVENTORY',
        title: 'Usable Stock On-Hand Column',
        description: 'The exact sellable stock currently sitting on warehouse shelves, available for immediate order fulfillment.',
        details: [
          'The Fast Sale modal validates strictly against this exact quantity.',
          'When usable stock reaches 0, the style is flagged as Depleted and sales entry is blocked.',
          'Reflects the true operational capacity of the business right now.'
        ],
        formula: 'Usable Stock = Inward - Dispatched + Restocked',
        tip: 'Keep at least 15 units on-hand for star performer styles to buffer against shipping transit delays.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="stock-col-wac"]',
        badge: 'VALUATION RATE',
        title: 'Weighted Average Cost (WAC) Column',
        description: 'The dynamic blended acquisition cost per garment unit, recomputed across all procurement batches for this style.',
        details: [
          'Blended Valuation: Averages batch purchase rates weighted by inward unit quantities.',
          'Used to calculate Cost of Goods Sold (COGS) on every dispatched sales order.',
          'Multiplied by usable stock to evaluate total capital tied up in inventory.'
        ],
        formula: 'WAC = Total Cumulative Procurement Value ÷ Total Inward Units',
        tip: 'WAC automatically adjusts whenever you log a new procurement batch with different purchase rates.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="stock-col-status"]',
        badge: 'HEALTH CLASSIFICATION',
        title: '4-Tier Stock Health Status Badges',
        description: 'Color-coded visual classification badges indicating stock runway and urgency of factory reorders.',
        details: [
          'Star (>=30 units, Green): High stock reserve; star performer sales velocity.',
          'Adequate (10-29 units, Blue): Normal operational stock buffer.',
          'Low (1-9 units, Amber): Approaching stockout; reorder recommended.',
          'Depleted (0 units, Rose): Out of stock; urgent factory replenishment required.'
        ],
        tip: 'Filter by "Depleted" or "Low" to quickly compile manufacturing purchase orders.',
        preferredPlacement: 'left'
      }
    ]
  },

  rto: {
    title: 'Courier RTO Returns Dock Walkthrough',
    badge: 'REVERSE LOGISTICS PIPELINE',
    steps: [
      {
        selector: '[data-tour="rto-hud"]',
        badge: 'PIPELINE CONTROL',
        title: 'Courier RTO Filter & Pipeline Controls',
        description: 'Filter courier RTO parcels by tracking number, style SKU, or pipeline stage: In Transit, Received at Dock, Restocked, or Damaged Loss.',
        details: [
          'Tracks parcels where cash-on-delivery (COD) delivery failed and parcels are returning.',
          'Supports keyword search across Courier AWB, SKU, or RTO reference numbers.',
          'Pills indicate active parcel counts in each logistics stage.'
        ],
        tip: 'Parcels follow a strict 3-stage chain of custody to prevent inventory inflation.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-bulk-restock"]',
        badge: '1-CLICK AUTOMATION',
        title: 'Bulk Restock All Received Parcels',
        description: 'Clears all physically inspected and received parcels from the dock quarantine buffer into active warehouse inventory with 1 click.',
        details: [
          'Batch Processes: Inspect and scan 50+ delivered courier parcels throughout the day.',
          'Single Click: Click this button to approve all received parcels into sellable stock simultaneously.',
          'Automated Ledger Entries: Increments usable stock per style and logs audit trail records in milliseconds.'
        ],
        tip: 'Use this at the end of every warehouse shift to clear dock buffers into sellable stock.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-add-btn"]',
        badge: 'PARCEL INTAKE',
        title: 'Log Incoming Courier RTO Parcel',
        description: 'Record failed delivery parcels when couriers update tracking status to NDR (Non-Delivery Report) or RTO Initiated.',
        details: [
          'Captures Initiated Date, Style SKU, Unit Quantity, Sale Price, Courier COD Fee, and Tracking AWB.',
          'Auto-fills style pricing from recent sales records to save time.',
          'Stages parcel into Stage 1 (IN_TRANSIT) without touching sellable warehouse inventory.'
        ],
        tip: 'Log tracking numbers promptly to track courier reverse transit turnaround times.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="rto-table"]',
        badge: 'PIPELINE LEDGER',
        title: 'Courier RTO Quarantine Ledger',
        description: 'The master reverse logistics pipeline matrix tracking parcels from delivery failure through warehouse inspection to final stock recovery.',
        details: [
          'Stage 1 (IN_TRANSIT): Courier delivery failed. Parcel is in transit on return truck. Stock is untouched.',
          'Stage 2 (RECEIVED): Parcel arrived at warehouse dock and is held in quarantine buffer for inspection.',
          'Stage 3a (RESTOCKED): Garment is brand new. 1-click adds the unit back to active sellable stock.',
          'Stage 3b (DAMAGED): Package crushed in transit. Marked as damage loss; never enters active inventory.'
        ],
        tip: 'Items remain quarantined here until warehouse staff physically inspect box condition.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="rto-col-tracking"]',
        badge: 'COURIER AWB',
        title: 'Carrier Tracking Consignment (AWB)',
        description: 'The courier consignment tracking number issued by logistics partners (Delhivery, Bluedart, Xpressbees, Shadowfax).',
        details: [
          'Used to reconcile courier return manifests against physically delivered parcels.',
          'Allows searching by full or partial AWB number to instantly find customer parcels.',
          'Helps identify courier delays when parcels stay in transit longer than 7 days.'
        ],
        tip: 'Scan courier barcode labels directly into the search box to locate parcels instantly.',
        preferredPlacement: 'right'
      },
      {
        selector: '[data-tour="rto-col-status"]',
        badge: 'PIPELINE STATUS',
        title: 'Pipeline Stage Indicator Badge',
        description: 'Color-coded visual indicator displaying current parcel location and quarantine holding state.',
        details: [
          'In Transit (Amber): On return delivery vehicle.',
          'Received (Pulsing Blue): Arrived at warehouse dock; awaiting inspection.',
          'Restocked (Emerald): Approved and credited back into sellable inventory.',
          'Damaged (Rose): Box crushed or tampered; written off as inventory loss.'
        ],
        tip: 'Pulsing blue badges indicate parcels requiring immediate dock staff inspection.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="rto-col-dock"]',
        badge: 'DOCK WORKFLOW',
        title: 'Dock Operations: Receive, Restock & Damage',
        description: 'Staff operational action buttons managing the physical intake workflow for each returning parcel.',
        details: [
          'Receive: Click when delivery truck drops off the package. Moves status to "Received" quarantine.',
          'Restock: Click if garment is in brand-new sellable condition. Immediately adds +1 to Usable Stock.',
          'Damage: Click if box was crushed or soaked in transit. Records damage loss without inflating inventory counts.'
        ],
        tip: 'Restocking updates the Stock Balance Matrix dynamically without needing page reloads.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="rto-col-actions"]',
        badge: 'RECORD AUDIT',
        title: 'RTO Record Management & Deletion',
        description: 'Edit parcel consignment details or delete incorrect RTO records with automatic inventory restoration.',
        details: [
          'Edit: Modify courier fees, AWB numbers, or style codes if mislabeled by shipping staff.',
          'Delete: Deleting an RTO record reverses any inventory mutations and logs an immutable audit trail entry.',
          'Protected: Requires administrative confirmation before record deletion.'
        ],
        tip: 'All deletions are permanently recorded in the system audit trail.',
        preferredPlacement: 'left'
      }
    ]
  },

  returns: {
    title: 'Customer Returns & QC Hub Walkthrough',
    badge: 'CUSTOMER RETURNS & QC',
    steps: [
      {
        selector: '[data-tour="returns-hud"]',
        badge: 'INTAKE CONTROLS',
        title: 'Customer Returns Filter & Search Bar',
        description: 'Filter customer return consignments by tracking AWB, SKU code, return reason, or inspection status.',
        details: [
          'Unlike courier RTOs, customer returns have been opened, tried on, or inspected by customers.',
          'Filter by return reason to identify recurring fabric defects or sizing inaccuracies.',
          'Tracks reverse courier logistics expenses ($175 default) and customer refund amounts.'
        ],
        tip: 'Inspect returns promptly to prevent customer dispute claim deadlines from expiring.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-bulk-restock"]',
        badge: 'QUICK CLEARANCE',
        title: 'Bulk Restock Received Returns Dock',
        description: 'Approves and restocks all inspected return parcels currently sitting in warehouse intake quarantine in a single action.',
        details: [
          'Restocks all received return units back into active sellable inventory simultaneously.',
          'Increments usable stock on-hand for each returned garment style.',
          'Records batch audit entries confirming physical warehouse restock.'
        ],
        tip: 'Only returns that have physically arrived and been marked "Received" will be restocked.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-add-btn"]',
        badge: 'RETURN LOGGING',
        title: 'Log Customer Return Entry Button',
        description: 'Record incoming return requests when customers initiate returns through customer support or online portals.',
        details: [
          'Captures Return Date, Style SKU, Quantity, Customer Refund Amount, and Reverse Courier Fee.',
          'Categorizes primary customer return reason (e.g. Size Too Small, Fabric Dislike, Defective Garment).',
          'Stages parcel into quarantine buffer awaiting physical warehouse arrival.'
        ],
        tip: 'Record customer return requests as soon as reverse shipping labels are generated.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-table"]',
        badge: 'QC LEDGER',
        title: 'Customer Returns & QC Inspection Ledger',
        description: 'Comprehensive reverse logistics ledger tracking refunds, reverse fees, and garment physical inspection grading.',
        details: [
          'Financial Deductions: Refund amounts and reverse shipping fees feed into Net Realized Profit.',
          'Physical Grading: Enforces inspection before garments can be made available for resale.',
          'Prevents returning defective or worn clothing to future paying customers.'
        ],
        tip: 'Check this ledger to monitor return loss write-offs against gross sales margin.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="returns-col-reason"]',
        badge: 'PRODUCT FEEDBACK',
        title: 'Primary Return Reason Column',
        description: 'Identifies why the customer initiated the return (e.g. Size Too Small / Fit Issue, Fabric Dislike, Quality Defect).',
        details: [
          'Provides actionable feedback to factory manufacturing and pattern design teams.',
          'Highlights apparel styles with chronic sizing discrepancies so size charts can be adjusted.',
          'Helps detect supplier quality inconsistencies across production batches.'
        ],
        tip: 'If a style consistently shows "Size Too Small", update product descriptions with sizing recommendations.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="returns-col-dock"]',
        badge: 'QC GRADING',
        title: 'Dock Operations & Physical QC Grading',
        description: 'Staff action buttons to manage the arrival and physical condition grading of customer return packages.',
        details: [
          'Receive: Marks package as physically arrived at warehouse dock quarantine.',
          'Restock: Grade A pristine garments with tags intact are approved into sellable stock (+1).',
          'Damage: Worn, stained, or torn garments are written off as return loss without inflating stock.'
        ],
        tip: 'Defective items are absorbed as return losses to maintain premium inventory quality.',
        preferredPlacement: 'left'
      },
      {
        selector: '[data-tour="returns-col-actions"]',
        badge: 'LEDGER ACTIONS',
        title: 'Edit & Audit Record Management',
        description: 'Modify refund amounts or reverse fees, or delete duplicate return entries with automated stock corrections.',
        details: [
          'Edit: Adjust refund disbursements or courier fees for accurate accounting reconciliation.',
          'Delete: Deleting an entry reverses inventory mutations and records an audit log entry.',
          'Requires confirmation before record removal.'
        ],
        tip: 'All return modifications are permanently stamped in the audit trail.',
        preferredPlacement: 'left'
      }
    ]
  },

  exchanges: {
    title: 'Item Exchanges Walkthrough',
    badge: 'TWO-LEGGED SWAP PIPELINE',
    steps: [
      {
        selector: '[data-tour="exchanges-hud"]',
        badge: 'EXCHANGE CONTROLS',
        title: 'Exchanges Search & Status Controls',
        description: 'Filter two-legged size/color exchanges by original SKU, replacement SKU, customer return reason, or tracking status.',
        details: [
          'Manages complex two-legged inventory balance without spreadsheet drift.',
          'Filter by In Transit, Received at Dock, Restocked, or Damaged Loss.',
          'Monitors reverse exchange courier fees ($175 standard) and net customer settlements.'
        ],
        tip: 'Use search to quickly locate customer exchange requests by tracking AWB.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-add-btn"]',
        badge: 'CREATE SWAP',
        title: 'Log Two-Legged Exchange Button',
        description: 'Record customer size or color swap requests with synchronized inventory coordination across both styles.',
        details: [
          'Select Original Style: The item the customer is returning (e.g. DE26001G Size M).',
          'Select Replacement Style: The new size/color requested by the customer (e.g. DE26001G Size L).',
          'Immediate Outflow Deduction: Replacement style is deducted immediately from sellable stock so fulfillment can ship it right away!',
          'Inbound Intake Buffer: Returned original style is staged into quarantine buffer until the return package arrives at the warehouse.'
        ],
        tip: 'Immediate deduction ensures you never sell out of the replacement size while waiting for the return parcel!',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-table"]',
        badge: 'SWAP MATRIX',
        title: 'Synchronized Two-Legged Exchanges Ledger',
        description: 'The master balance ledger tracking the outbound replacement shipment and the inbound customer return shipment.',
        details: [
          'Prevents inventory shrinkage by coordinating both legs of the swap.',
          'Tracks standard retail price, reverse shipping logistics fee, and net customer settlement.',
          'Statuses pulse blue when customer return packages arrive at the warehouse dock.'
        ],
        tip: 'Review this ledger to verify that outbound replacements match inbound return arrivals.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="exchanges-col-returned"]',
        badge: 'INBOUND LEG',
        title: 'Returned Original SKU Column',
        description: 'The original garment style code being sent back by the customer (e.g. DE26001G in Size M).',
        details: [
          'Held in intake buffer while the parcel travels back via courier.',
          'Usable stock for this style is NOT increased until warehouse staff inspect condition.',
          'Protects stock accuracy while return shipment is in transit.'
        ],
        tip: 'Inspect garment tags and fabric upon delivery before approving restock.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-col-dispatched"]',
        badge: 'OUTBOUND LEG',
        title: 'Dispatched Replacement SKU Column',
        description: 'The newly requested replacement garment shipped out to the customer (e.g. DE26001G in Size L).',
        details: [
          'Deducted from warehouse sellable inventory immediately upon exchange creation.',
          'Ensures dispatch teams package and fulfill the correct replacement size.',
          'Eliminates double-shipping errors and inventory discrepancies.'
        ],
        tip: 'Stock balance for this SKU decrements right away to safeguard inventory.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="exchanges-col-dock"]',
        badge: 'INBOUND RESTOCK',
        title: 'Dock Intake & Restock Workflow',
        description: 'When the customer return shipment reaches the warehouse dock, click "Receive", inspect the garment, and click "Restock".',
        details: [
          'Receive: Confirms physical parcel arrival at the warehouse dock.',
          'Restock: Flawless original garments are approved into sellable inventory (+1).',
          'Damage: Defective return items are absorbed as damage losses.',
          'Completes both legs of the two-legged transaction with zero inventory drift.'
        ],
        tip: 'Click "Restock" once inspection confirms the garment is unworn with tags attached.',
        preferredPlacement: 'left'
      }
    ]
  },

  procurement: {
    title: 'Procurement & Purchase Orders Walkthrough',
    badge: 'SOURCING & COSTING',
    steps: [
      {
        selector: '[data-tour="proc-hud"]',
        badge: 'PROCUREMENT HUD',
        title: 'Procurement Controls & Subtabs Bar',
        description: 'Manage factory inward purchase orders, supplier shipments, lot numbers, and historical purchase rates.',
        details: [
          'Switch between individual inward batches and aggregated daily factory supply summaries.',
          'Search across supplier lots, dates, or style codes with instant filtering.',
          'Export procurement purchase registers directly to Excel for financial auditing.'
        ],
        tip: 'Procurement batches directly determine the Weighted Average Cost (WAC) baseline for sales COGS.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-subtabs"]',
        badge: 'VIEW TOGGLE',
        title: 'Inward Batches vs Daily Supply Summary',
        description: 'Toggle between chronological purchase orders and daily aggregated factory deliveries.',
        details: [
          'Inward Batches: Granular view of every supplier delivery lot and purchase rate.',
          'Daily Supply Summary: Aggregates total units received per day across all manufacturing mills.',
          'Helps spot factory delivery delays and supplier fulfillment bottlenecks.'
        ],
        tip: 'Use Daily Supply view to check daily factory delivery volume against scheduled production targets.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-add-btn"]',
        badge: 'SUPPLY INTAKE',
        title: '+ Inward Batch Order Button',
        description: 'Record new factory shipments: captures arrival date, style SKU, inward unit quantity, and purchase rate per unit.',
        details: [
          'Batch Intake: Inward units immediately increment Usable Stock On-Hand in the Stock Balance Matrix.',
          'Automatic WAC Recalculation: Blends the new batch purchase rate into the Weighted Average Cost baseline.',
          'Capital Valuation: Computes Total Batch Value (Quantity × Rate) and syncs to Logistic.xlsx.'
        ],
        tip: 'Record supplier delivery lots as soon as parcels are unloaded and counted in the warehouse.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-table"]',
        badge: 'SOURCING LEDGER',
        title: 'Factory Procurement Batches Ledger',
        description: 'The master purchase order ledger detailing historical manufacturing costs, lot numbers, and supplier invoice totals.',
        details: [
          'Records Batch ID, Arrival Date, Style Code, Inward Quantity, and Purchase Rate.',
          'Synchronizes automatically to Logistic.xlsx and flat 3NF CSV ledgers.',
          'Serves as the cost foundation for all sales gross margin and COGS calculations.'
        ],
        tip: 'Monitor historical purchase rates to evaluate fabric price inflation across manufacturing seasons.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="proc-col-rate"]',
        badge: 'UNIT COST',
        title: 'Purchase Rate per Unit Column',
        description: 'Factory wholesale cost per unit charged by the garment manufacturer or textile mill.',
        details: [
          'Evaluated in dollars and cents with zero-drift accuracy.',
          'Blended dynamically with prior inventory quantities to compute Weighted Average Cost (WAC).',
          'Determines the exact baseline COGS deducted on every customer sales dispatch.'
        ],
        tip: 'Negotiating lower factory purchase rates immediately widens your sales gross profit margin.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="proc-col-value"]',
        badge: 'CAPITAL OUTFLOW',
        title: 'Total Batch Value Column',
        description: 'Total capital invested into the procurement lot (Inward Quantity × Purchase Rate per Unit).',
        details: [
          'Represents working capital outflow required to manufacture and procure the shipment.',
          'Recorded as debit transaction in treasury and bank reconciliation registers.',
          'Directly feeds into total inventory asset valuation.'
        ],
        formula: 'Total Batch Value = Inward Quantity × Purchase Rate per Unit',
        tip: 'Reconcile this column against supplier tax invoices before issuing bank wire remittances.',
        preferredPlacement: 'bottom'
      }
    ]
  },

  ads: {
    title: 'Marketing & Ad Spend Walkthrough',
    badge: 'MARKETING & BLENDED ROAS',
    steps: [
      {
        selector: '[data-tour="ads-hud"]',
        badge: 'MARKETING HUD',
        title: 'Campaign Controls & Excel Export',
        description: 'Search marketing campaigns across platforms (Meta Ads, Google Ads, TikTok, Influencer collabs) or export ad spend sheets.',
        details: [
          'Track daily advertising expenditures to maintain accurate customer acquisition benchmarks.',
          'Search by platform channel or campaign targeting notes.',
          'Export formatted spreadsheets to review marketing spend alongside daily sales turnover.'
        ],
        tip: 'Log ad expenses daily to ensure the Executive Overview displays live, accurate Blended ROAS.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-add-btn"]',
        badge: 'LOG EXPENSE',
        title: 'Log Ad Spend Button',
        description: 'Record daily marketing expenditure: select date, platform channel, spend amount ($), and campaign strategy notes.',
        details: [
          'Select platform: Meta Ads (Facebook/Instagram), Google Ads, TikTok, Influencer, or Offline.',
          'Amortizes marketing costs into the 5-Tier Net Realized Profit calculation on the executive dashboard.',
          'Logs permanent audit entry detailing campaign platform and budget deployed.'
        ],
        tip: 'Include campaign name or targeting angle in notes to remember which creatives drove sales spikes.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-table"]',
        badge: 'CAMPAIGN MATRIX',
        title: 'Multi-Channel Ad Spend Ledger',
        description: 'Chronological register of digital advertising expenditures across all marketing channels and promotional campaigns.',
        details: [
          'Displays Date, Platform Channel, Daily Spend Amount, and Campaign Strategy Notes.',
          'Helps correlate marketing budget increases with daily sales dispatch volume.',
          'Supports inline editing and deletion with automatic ROAS recalculation.'
        ],
        tip: 'Compare weekend ad spend against weekend sales dispatches in the Analytics tab.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="ads-col-platform"]',
        badge: 'ACQUISITION SOURCE',
        title: 'Platform Channel Column',
        description: 'Identifies the paid digital acquisition channel driving web traffic and customer orders.',
        details: [
          'Meta Ads: Facebook & Instagram feed/reels direct-response campaigns.',
          'Google Ads: High-intent search queries and Google Shopping campaigns.',
          'TikTok Ads: Short-form viral video creative campaigns.',
          'Influencer & Offline: Sponsorship packages and promotional partnerships.'
        ],
        tip: 'Diversifying across Meta and Google reduces reliance on any single ad algorithm.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="ads-col-amount"]',
        badge: 'DAILY BUDGET',
        title: 'Spend Amount ($) Column',
        description: 'The exact dollar amount invested into the marketing platform for that specific calendar date.',
        details: [
          'Evaluated in integer cents to eliminate penny drift.',
          'Aggregated to calculate whole-system Blended ROAS (Total Revenue ÷ Total Ad Spend).',
          'Subtracted directly from gross sales margins in the Net Realized Profit equation.'
        ],
        formula: 'Blended ROAS = Total Dispatched Revenue ÷ Total Advertising Spend',
        tip: 'Maintain Blended ROAS above 3.0x to ensure strong commercial profitability.',
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
        description: 'Live treasury overview displaying Current Bank Balance, Total Credited deposits (+), Total Debited disbursements (-), and total transactions.',
        details: [
          'Current Bank Balance: Continuous running balance matching real-world bank statements.',
          'Total Credited (+): Customer prepaid remittances, courier COD cash settlements, and partner deposits.',
          'Total Debited (-): Supplier fabric invoices, courier shipping bills, ad platform charges, and facility expenses.',
          'Total Transactions: Count of synced entries validated against flat CSV and Excel ledgers.'
        ],
        tip: 'Check this HUD weekly against your online banking dashboard to flag uncredited courier deposits.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-balance-card"]',
        badge: 'CLOSING BALANCE',
        title: 'Current Bank Balance Card',
        description: 'The exact liquid cash position of the business, computed chronologically across all historical credit and debit entries with zero drift.',
        details: [
          'Status Badge: Green "Active" indicates healthy surplus; Rose "Deficit / Overdrawn" warns of cash shortfalls.',
          'Continuous Integrity: Evaluates balance iteratively so every row reflects the exact state of cash after that event.',
          'Matches real bank statement closing balances to the exact penny.'
        ],
        formula: 'Current Balance = Σ Credits (+) - Σ Debits (-)',
        tip: 'Compare this card directly with your corporate bank account balance to ensure zero accounting drift.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-toolbar"]',
        badge: 'TOOLBAR',
        title: 'Search, Flow Filters & Actions Toolbar',
        description: 'Filter transactions by Credit Inflow (Deposits) or Debit Outflow (Withdrawals), search descriptions, or export statement spreadsheets.',
        details: [
          'Search by transaction description, date, or dollar amount with instant filtering.',
          'Click 🟢 Credited to isolate courier COD cash disbursements and sales remittances.',
          'Click 🔴 Debited to isolate supplier factory payments and operational expenses.',
          'Export statements to Excel or CSV for monthly tax and accountant filing.'
        ],
        tip: 'Filter by "Credited" to verify that all courier cash remittances have been properly deposited.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-add-btn"]',
        badge: 'TREASURY ENTRY',
        title: 'Record Bank Entry Button',
        description: 'Log real-world banking events: select date, transaction type (Credited (+) or Debited (-)), and exact dollar amount.',
        details: [
          'Credited (+): Records bank deposits, courier COD disbursements, or owner capital injections.',
          'Debited (-): Records supplier purchase wires, courier freight bills, or ad platform debits.',
          'Continuous Recalculation: Submitting an entry automatically updates running balances for all subsequent transactions with zero penny drift.'
        ],
        tip: 'Input transaction references or bank statement UTR numbers for easy audit matching.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="bank-table"]',
        badge: 'LEDGER MATRIX',
        title: 'Continuous Treasury Matrix Ledger',
        description: 'Chronological financial ledger recording every deposit and withdrawal alongside its closing running balance.',
        details: [
          'Transaction Type: Color-coded pills indicate deposit inflow (green) or withdrawal outflow (rose).',
          'Sequential Integrity: Every row mathematically reconciles with the preceding and following rows.',
          'Supports inline editing and restorative deletion with full balance recalculation.'
        ],
        tip: 'Review row balances to verify that your cash runway remained positive throughout prior months.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="bank-col-balance"]',
        badge: 'RUNNING RECONCILIATION',
        title: 'Closing Running Balance ($) Column',
        description: 'Dynamically recomputed for every transaction row: Previous Balance + Credit Amount (or - Debit Amount) = New Closing Balance.',
        details: [
          'Guarantees zero-drift accounting: No rounding errors, no drifting pennies.',
          'Provides an immutable chronological audit trail for corporate tax inspections.',
          'Modifying or deleting any historical row automatically ripples forward to update all subsequent closing balances.'
        ],
        formula: 'New Balance = Previous Balance + Inflow Credit (or - Outflow Debit)',
        tip: 'The bottom row of this column always matches the Current Bank Balance HUD card at the top.',
        preferredPlacement: 'left'
      }
    ]
  },

  analytics: {
    title: 'Financial Analytics Walkthrough',
    badge: 'ANALYTICS & REPORTING',
    steps: [
      {
        selector: '[data-tour="analytics-controls"]',
        badge: 'VIEW CONTROLS',
        title: 'Analytics View Mode Switcher',
        description: 'Toggle between viewing both financial breakdowns side-by-side, Daily Sales Only, or Daily Marketing Ad Spend Only.',
        details: [
          'View Both: Compare daily sales revenue spikes directly against daily marketing spend.',
          'Daily Sales Only: Isolate daily order volume, gross revenue, COGS, and daily profit margins.',
          'Daily Ads Only: Analyze platform campaign counts and daily marketing budget allocations.'
        ],
        tip: 'Toggle to "Daily Sales Only" when reviewing weekly gross margin percentages for sales teams.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="analytics-export"]',
        badge: 'EXCEL EXPORTS',
        title: 'Export Daily Breakdowns to Excel & CSV',
        description: 'Export structured daily performance sheets directly to formatted Excel workbooks or flat 3NF CSV files.',
        details: [
          'Export Daily Sales: Complete ledger of daily order counts, units sold, gross revenue, COGS, and profit.',
          'Export Daily Ads: Daily breakdown of campaigns count, platforms utilized, and total dollars deployed.',
          'Clean multi-column format with currency styles ready for executive presentation.'
        ],
        tip: 'Download Daily Sales Excel spreadsheets for monthly corporate board reviews.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="analytics-sales-table"]',
        badge: 'DAILY SALES',
        title: 'Table 1: Daily Sales & Gross Profit Breakdown',
        description: 'Aggregates commercial performance day-by-day: orders count, units sold, gross revenue, COGS, and daily gross profit with margin percentages.',
        details: [
          'Aggregated exclusively from confirmed sales orders in the SQLite database.',
          'Evaluates daily gross profit margin percentages to identify high-margin operational days.',
          'Sticky Grand Totals Footer: Computes cumulative order counts, total units sold, gross turnover, total COGS, and blended margin.'
        ],
        formula: 'Daily Gross Profit = Daily Revenue - Daily COGS  |  Daily Margin % = (Profit ÷ Revenue) × 100',
        tip: 'Review the bottom sticky footer for grand totals across the entire recording history.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="analytics-ads-table"]',
        badge: 'DAILY MARKETING',
        title: 'Table 2: Daily Advertisement Spend Breakdown',
        description: 'Tracks day-by-day marketing expenditures detailing campaigns count, platforms utilized, and total ad dollars deployed.',
        details: [
          'Aggregated exclusively from marketing campaigns logged in the Ads tab.',
          'Displays platforms utilized on each date (e.g. Meta Ads, Google Ads, TikTok).',
          'Compare dates directly against Table 1 to identify which ad campaigns generated sales spikes.'
        ],
        tip: 'Look for days with high ad spend to see if revenue in Table 1 increased correspondingly.',
        preferredPlacement: 'top'
      }
    ]
  },

  audit: {
    title: 'Regulatory Audit Trail Walkthrough',
    badge: 'REGULATORY AUDIT TRAIL',
    steps: [
      {
        selector: '[data-tour="audit-toolbar"]',
        badge: 'AUDIT CONTROLS',
        title: 'Audit Search, Polling & Export Controls',
        description: 'Real-time keyword search across all operational mutations. Features a 5-second live telemetry polling toggle and direct CSV export.',
        details: [
          'Real-time Search: Search across timestamps, operator actions, style SKU codes, or summaries.',
          '5s Live Poll: When enabled, automatically queries the backend every 5 seconds to show new system events as they happen.',
          'Export CSV: Download the complete regulatory event log for tax authorities, corporate legal, or external accounting audits.',
          'Archive & Clear: Snapshots active logs to persistent disk storage and begins a fresh active trail.'
        ],
        tip: 'Leave 5s Live Poll active during busy warehouse shifts to monitor real-time fulfillment events.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="audit-filters"]',
        badge: 'DOMAIN CHIPS',
        title: 'Domain Category Filter Chips',
        description: 'Click any domain chip to isolate specific operational categories: SALE, RTO, CUSTOMER_RETURN, EXCHANGE, STOCK, AD_SPEND, BANK, SYNC, or SYSTEM.',
        details: [
          'SALE: Filter to view all order recordings, price edits, and restorative deletions.',
          'RTO & CUSTOMER_RETURN: Track parcel receipts, inspection decisions, restocks, and damage write-offs.',
          'BANK: Inspect deposits, withdrawals, and balance recalculations.',
          'SYNC: Review background synchronization checks with Excel workbooks and 3NF CSV files.'
        ],
        tip: 'Click "BANK" or "SALE" to immediately isolate transactions within that subsystem.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="audit-table"]',
        badge: 'IMMUTABLE STORE',
        title: 'Chronological Audit Event Stream',
        description: 'Permanent event store recording every creation, update, deletion, or sync action with timestamp, operator category, and detailed delta summary.',
        details: [
          'Timestamp: High-resolution timestamp recording the exact time of the mutation.',
          'Domain Category: The operational subsystem affected (e.g. SALE, STOCK, BANK).',
          'Action & Summary: Detailed human-readable explanation of the operational change.',
          'Source: Client web interface, background sync worker, or API automated process.'
        ],
        tip: 'Guarantees 100% operational transparency, eliminating disputes over inventory or pricing changes.',
        preferredPlacement: 'top'
      },
      {
        selector: '[data-tour="audit-col-action"]',
        badge: 'SEVERITY BADGES',
        title: 'Action & Severity Indicator Column',
        description: 'Color-coded action types (CREATE, UPDATE, DELETE, SYNC) with severity badges (SUCCESS, WARNING, DANGER, INFO).',
        details: [
          'SUCCESS (Emerald): Normal operations like sales creation, batch intake, or restocks.',
          'WARNING (Amber): Critical edits or status modifications.',
          'DANGER (Rose): Order deletions, damage write-offs, or audit log archiving.',
          'INFO (Blue): Background telemetry polling and health probe heartbeats.'
        ],
        tip: 'Scan for rose DANGER badges to quickly audit all order deletions and damage write-offs.',
        preferredPlacement: 'bottom'
      }
    ]
  },

  status: {
    title: 'System Health & Diagnostics Walkthrough',
    badge: 'DIAGNOSTIC TELEMETRY',
    steps: [
      {
        selector: '[data-tour="status-header"]',
        badge: 'HEALTH STATUS',
        title: 'Subsystem Health Header & Probes',
        description: 'Live status banner showing overall platform health (HEALTHY) and passing diagnostic check counters across all 6 core subsystems.',
        details: [
          'Overall Status: Verified green "HEALTHY" indicator when all subsystem probes pass.',
          'Checks Passed: Real-time counter (e.g. 6/6 Checks Passed) validating all infrastructure layers.',
          'Re-run Diagnostics: Probes API uptime, database latency, table record counts, Excel files, and CSVs in real time.'
        ],
        tip: 'Click "Re-run Diagnostics" at any time to verify system health across all backend services.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-quick-banner"]',
        badge: 'STANDALONE ACCESS',
        title: 'Dedicated /status Dashboard URL',
        description: 'Public health dashboard accessible at /status and raw JSON telemetry probe at /api/status for uptime monitors and DevOps teams.',
        details: [
          'Standalone Dashboard: Full-screen diagnostic UI available at /status without logging into the ERP interface.',
          'Raw JSON API: Standardized JSON payload at /api/status for ping services (e.g. UptimeRobot, Datadog).',
          'Click "Copy /status URL" to share real-time platform health links with system administrators.'
        ],
        tip: 'Bookmark /status on your mobile device to monitor ERP health on the go.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-runtime"]',
        badge: 'PROCESS PROBE',
        title: 'API Service & Process Runtime Probe',
        description: 'Monitors FastAPI service uptime, resident memory RSS consumption in MB, OS process ID (PID), Python runtime version, and diagnostic response latency.',
        details: [
          'Diagnostic Latency: Sub-30ms response latency confirming high backend responsiveness.',
          'Memory RSS: Tracks RAM utilization to verify zero memory leaks in the Python runtime.',
          'Process ID (PID): Identifies the active OS process running the FastAPI Uvicorn server.'
        ],
        tip: 'Low latency (<30ms) guarantees instantaneous order recording and real-time dashboard loading.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-db"]',
        badge: 'DATABASE PROBE',
        title: 'Database & All 8 Table Counters',
        description: 'Pings SQLite database connectivity, inspects file size on disk, and verifies exact live record counts across all 8 relational tables.',
        details: [
          'Ping Latency: Sub-millisecond database connection latency.',
          'Live Record Counters: Audits sales_orders, rto_orders, customer_returns, exchanges, procurement, stock, ads, and bank tables.',
          'Guarantees that no table is corrupted, locked, or missing from disk.'
        ],
        tip: 'Verify that table record counts match your business expectations across all departments.',
        preferredPlacement: 'bottom'
      },
      {
        selector: '[data-tour="status-card-financial"]',
        badge: 'ZERO-DRIFT PROBE',
        title: 'Zero-Drift Financial Verification Probe',
        description: 'Mathematically verifies the fundamental financial identity: Gross Profit = Dispatched Revenue - Total System COGS with zero rounding drift.',
        details: [
          'Identity Proof: Proves Gross Profit + COGS == Dispatched Revenue down to the exact penny.',
          'Continuous Audit: Detects any penny rounding discrepancies or floating-point precision errors.',
          'Guarantees 100% tax and accounting compliance across all multi-currency calculations.'
        ],
        formula: 'Gross Profit Identity: Total Revenue - Total COGS = Verified Gross Profit (Zero Drift)',
        tip: 'This mathematical probe proves your ERP financials are 100% penny-perfect at all times.',
        preferredPlacement: 'bottom'
      }
    ]
  }
};

// Master Tour: An executive 11-stage journey through all tabs, auto-switching views and spotlighting primary hero operations
export const MASTER_TOUR_STEPS = [
  {
    tab: 'dashboard',
    selector: '[data-tour="dash-copilot"]',
    badge: 'STAGE 1 OF 11 • CORE INTELLIGENCE',
    title: 'Executive Overview & AI Copilot',
    description: 'Welcome to Divine Enterprise ERP! The Executive Dashboard aggregates real-time telemetry across sales, inventory, reverse logistics, and advertising into actionable intelligence alerts.',
    details: [
      'Top KPI cards evaluate true Net Realized Profit, Dispatched Revenue, and Inventory Valuation.',
      'AI Copilot highlights star performer styles, low-stock runways, and marketing efficiency.',
      'Reverse logistics dock shortcuts provide 1-click bulk restocking for courier RTO and customer return parcels.',
      'Interactive trend waveforms visualize revenue, volume, and profit margin momentum over 7D, 30D, and All-Time.'
    ],
    tip: 'Click any copilot recommendation card to immediately jump into the relevant operational ledger.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'sales',
    selector: '[data-tour="sales-new-btn"]',
    badge: 'STAGE 2 OF 11 • FULFILLMENT',
    title: 'Fast Order Dispatcher & Profit Preview',
    description: 'The Sales Order Ledger manages customer shipments. Click "+ New Sale" (or press Alt+S anywhere) to dispatch orders with live stock availability validation and instant COGS profit preview.',
    details: [
      'Type any style code for instant SKU autocomplete and live stock availability validation.',
      'Real-time financial preview computes Revenue, COGS, Gross Profit, and Margin % before confirming dispatch.',
      'Dual-pricing resolution supports entering either unit price or total invoice revenue to eliminate fractional penny drift.',
      'Deleting an erroneous order automatically credits and restores sold units back into usable warehouse inventory.'
    ],
    tip: 'Keyboard shortcut: Press Alt+S from anywhere in the platform to launch the order modal instantly!',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'sales',
    selector: '[data-tour="sales-col-cogs"], [data-tour="sales-col-profit"], [data-tour="sales-col-margin"]',
    badge: 'STAGE 3 OF 11 • INSTANT FINANCIALS',
    title: 'Real-Time Profit & Margin Engine',
    description: 'Every sale automatically computes exact Cost of Goods Sold (COGS), resulting Gross Profit, and Margin % with zero penny drift.',
    details: [
      'COGS: Dynamically evaluated based on the style Weighted Average Cost (WAC).',
      'Gross Profit: Exact dollar earnings generated after recovering product acquisition costs.',
      'Margin %: Color-coded (Green for positive, Red for negative) for instant profitability auditing.',
      'Tri-Write Synchronization: Updates SQLite, decrements stock matrix, and syncs Sales_Inventory.xlsx in real time.'
    ],
    formula: 'Gross Profit = Total Revenue - COGS  |  Margin % = (Profit ÷ Revenue) × 100',
    tip: 'Maintain gross margins above 25% to comfortably absorb courier reverse shipping fees and advertising overhead.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'stock',
    selector: '[data-tour="stock-hud"]',
    badge: 'STAGE 4 OF 11 • INVENTORY MATRIX',
    title: 'Single Source of Truth Inventory Matrix',
    description: 'Tracks every apparel style across the business. Usable stock strictly excludes damaged or uninspected returns sitting in warehouse quarantine.',
    details: [
      'Single Source Equation: Usable Stock = Total Factory Inward - Dispatched Sales + Approved Dock Restocks.',
      '4-Tier Stock Health Badges: Star (>=30 units), Adequate (10-29), Low (1-9), and Depleted (0 units).',
      'Weighted Average Cost (WAC): Dynamically averages procurement costs across diverse factory purchase batches.',
      'Inventory Valuation: Usable stock multiplied by WAC provides exact working capital tied up in merchandise.'
    ],
    formula: 'Usable Stock = Total Inward - Total Dispatched + Approved Restocked',
    tip: 'Filter by "Depleted" to quickly identify out-of-stock styles requiring factory purchase orders.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'rto',
    selector: '[data-tour="rto-hud"]',
    badge: 'STAGE 5 OF 11 • REVERSE LOGISTICS',
    title: 'Courier RTO 3-Stage Pipeline',
    description: 'When couriers fail to deliver cash-on-delivery parcels, items return through a protected 3-stage pipeline: In Transit -> Received at Dock -> Restocked into Inventory (or Damaged).',
    details: [
      'Stage 1 (IN_TRANSIT): Courier marked delivery failed. Sellable inventory is untouched.',
      'Stage 2 (RECEIVED): Parcel arrived at dock quarantine buffer awaiting physical inspection.',
      'Stage 3a (RESTOCKED): Item in pristine condition; 1-click adds the unit back to sellable stock.',
      'Stage 3b (DAMAGED): Box crushed in transit; written off as damage loss without inflating stock.',
      'Bulk Restock: Click "Bulk Restock Dock" to clear all inspected parcels into stock with a single click.'
    ],
    tip: 'Use Bulk Restock at the end of each shift to process dozens of parcels in under a second.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'returns',
    selector: '[data-tour="returns-hud"]',
    badge: 'STAGE 6 OF 11 • QUALITY CONTROL',
    title: 'Customer Returns & Physical QC Hub',
    description: 'Unlike courier RTOs, customer returns have been opened and tried on. The QC Hub provides structured inspection before deciding whether to restock.',
    details: [
      'Captures customer return reason (e.g. Size Too Small, Fabric Dislike, Quality Defect).',
      'Physical inspection ensures worn or defective garments are never shipped to future buyers.',
      'Pristine items are approved into sellable inventory; defective garments are recorded as return losses.',
      'Refund disbursements and reverse courier fees feed into the Net Realized Profit equation.'
    ],
    tip: 'Monitor return reasons to identify apparel styles with chronic sizing discrepancies.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'exchanges',
    selector: '[data-tour="exchanges-add-btn"]',
    badge: 'STAGE 7 OF 11 • TWO-LEGGED SWAPS',
    title: 'Item Exchanges Balance Pipeline',
    description: 'Coordinated two-legged inventory balance: immediately deducts replacement style from stock so dispatch can ship the new size, while tracking customer return intake.',
    details: [
      'Leg 1 (Outflow): Replacement style is deducted immediately from stock so dispatch can ship right away.',
      'Leg 2 (Inflow): Original customer return is staged into quarantine buffer until parcel arrives.',
      'When the return shipment arrives back at the warehouse, 1-click restocking returns the original size to stock.',
      'Prevents inventory shrinkage and eliminates double-shipping errors.'
    ],
    tip: 'Immediate deduction ensures you never sell out of the replacement size while waiting for the return parcel.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'procurement',
    selector: '[data-tour="proc-add-btn"]',
    badge: 'STAGE 8 OF 11 • SOURCING & WAC',
    title: 'Factory Procurement & WAC Costing',
    description: 'Log inward garment shipments from manufacturers. Every new batch injects units into stock and recalculates the Weighted Average Cost (WAC) baseline.',
    details: [
      'Batch Intake: Record arrival date, style SKU, inward unit quantity, and purchase rate per unit.',
      'Automatic WAC Recalculation: Blends batch purchase rate into the Weighted Average Cost formula.',
      'Capital Valuation: Evaluates Total Batch Value and synchronizes records to Logistic.xlsx.',
      'Supply Grouping: Review supplier lot numbers and historical manufacturing costs per style.'
    ],
    formula: 'WAC = Total Cumulative Inward Value ÷ Total Inward Units',
    tip: 'Record supplier delivery lots as soon as parcels are unloaded and counted in the warehouse.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'ads',
    selector: '[data-tour="ads-hud"]',
    badge: 'STAGE 9 OF 11 • MARKETING & ROAS',
    title: 'Multi-Channel Advertising & Blended ROAS',
    description: 'Monitor marketing campaigns across Meta, Google, and TikTok. Computes Blended ROAS as Total System Revenue divided by Total Ad Spend.',
    details: [
      'Blended ROAS: Evaluated as Total Dispatched Revenue ÷ Total Advertising Spend.',
      '4 ROAS Tiers: Exceptional (>=4.0x), Profitable (2.5x-3.99x), Marginal (1.5x-2.49x), and Sub-threshold (<1.5x).',
      'Daily Spend Summary: View daily ad spend breakdown alongside daily sales velocity.',
      'Ad expenditures factor directly into the Net Realized Profit calculation on the executive dashboard.'
    ],
    formula: 'Blended ROAS = Total Dispatched Revenue ÷ Total Ad Spend',
    tip: 'Compare daily ad spend against gross profit waveforms in the Analytics tab to detect profitable marketing spikes.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'bank',
    selector: '[data-tour="bank-balance-card"]',
    badge: 'STAGE 10 OF 11 • TREASURY',
    title: 'Bank Treasury & Continuous Running Balance',
    description: 'Reconcile bank accounts with zero-drift accuracy. Continuously recalculates closing balance across all credit deposits and debit disbursements.',
    details: [
      'Continuous Running Balance: Recalculates closing balance across all chronological credit and debit transactions.',
      'Realized Cash Parity: Compares adjusted net revenue against bank ledger totals to flag transit cash lag.',
      'Integer Cents Math: Eliminates penny rounding errors across thousands of transactions.',
      'Audit Verification: Every bank transaction is permanently recorded with date, type, and description.'
    ],
    formula: 'Closing Balance = Previous Balance + Inflow Credit (or - Outflow Debit)',
    tip: 'Reconcile this card weekly against your online banking dashboard to confirm courier cash deposits.',
    preferredPlacement: 'bottom'
  },
  {
    tab: 'status',
    selector: '[data-tour="status-header"]',
    badge: 'STAGE 11 OF 11 • DIAGNOSTICS PROBE',
    title: 'Multi-Subsystem Health & Diagnostics Probe',
    description: 'Continuously probes the FastAPI backend, SQLite database, master Excel workbooks, flat 3NF CSV files, and zero-drift financial integrity.',
    details: [
      '6 Subsystem Probes: Validates API uptime, DB ping latency, all 8 table record counts, Excel files, and CSVs.',
      'Zero-Drift Financial Check: Mathematically proves Gross Profit = Revenue - COGS with zero rounding drift.',
      'Standalone URL: Accessible anytime at /status (HTML Dashboard) and /api/status (JSON API).',
      'Auto-refreshes every 15 seconds to provide continuous liveness monitoring.'
    ],
    formula: 'Financial Identity: Total Revenue - Total COGS = Verified Gross Profit (Zero Drift)',
    tip: 'Bookmark /status to monitor platform health from any phone or external monitoring service.',
    preferredPlacement: 'bottom'
  }
];
