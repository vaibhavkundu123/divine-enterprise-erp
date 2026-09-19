# Divine Enterprise ERP & Financial Intelligence Platform

[![Python](<https://img.shields.io/badge/Python-3.11%20%7C%203.14-3776AB?logo=python&logoColor=white>)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](<https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?logo=sqlite&logoColor=white>)](https://www.sqlite.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Ngrok](https://img.shields.io/badge/Ngrok-Permanent%20Fixed%20URL-1F1E38?logo=ngrok&logoColor=white)](https://blurred-submerge-underuse.ngrok-free.dev)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare-24%2F7%20Tunnel-F38020?logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![Status](https://img.shields.io/badge/System%20Health-100%25%20Verified-10B981)](#-system-health-diagnostics--endpoints)

> **Autonomous Enterprise Resource Planning, Inventory, Logistics & Financial Intelligence Suite**
> Engineered specifically for apparel, fashion retail, and multi-channel e-commerce operations. Unifies procurement, order fulfillment, reverse logistics quarantine, advertising attribution, bank treasury, and zero-drift financial reconciliation into an always-on, non-volatile architecture.

---

## ⚡ Quick Links & Live URL Directory

> [!IMPORTANT]
> ### 🔗 Permanent Fixed Access Links (Never Change)
>
> | Portal | Permanent URL |
> | :--- | :--- |
> | **Main Web App HUD** | 👉 [https://blurred-submerge-underuse.ngrok-free.dev](https://blurred-submerge-underuse.ngrok-free.dev/) |
> | **System Status & Diagnostics** | 👉 [https://blurred-submerge-underuse.ngrok-free.dev/status](https://blurred-submerge-underuse.ngrok-free.dev/status) |
> | **Direct In-App Status Tab** | 👉 [https://blurred-submerge-underuse.ngrok-free.dev/?tab=status](https://blurred-submerge-underuse.ngrok-free.dev/?tab=status) |

### 🌐 Web Interfaces & Dashboards

| Service / Interface | Localhost (LAN) URL | Permanent Fixed URL (Ngrok) | Temporary Cloudflare URL | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Integrated Web App HUD** | [`http://localhost:8000`](http://localhost:8000) | [https://blurred-submerge-underuse.ngrok-free.dev](https://blurred-submerge-underuse.ngrok-free.dev) | [Quick Cloudflare Tunnel](https://range-holdem-kind-ventures.trycloudflare.com) | Primary executive portal: Sales, Inventory, RTO, Ads, Treasury & Analytics. |
| **Dedicated Status Dashboard** | [`http://localhost:8000/status`](http://localhost:8000/status) | [https://blurred-submerge-underuse.ngrok-free.dev/status](https://blurred-submerge-underuse.ngrok-free.dev/status) | [Cloudflare /status](https://range-holdem-kind-ventures.trycloudflare.com/status) | Standalone dark-mode telemetry dashboard displaying all 6 subsystem checks. |
| **In-App Health & Status Tab** | [`http://localhost:8000/?tab=status`](http://localhost:8000/?tab=status) | [https://blurred-submerge-underuse.ngrok-free.dev/?tab=status](https://blurred-submerge-underuse.ngrok-free.dev/?tab=status) | [Cloudflare Tab](https://range-holdem-kind-ventures.trycloudflare.com/?tab=status) | Direct link to the System Health tab embedded inside the full web app HUD. |
| **Vite Frontend Dev Server** | [`http://localhost:5173`](http://localhost:5173) | *Local Dev Only* | *Local Dev Only* | Hot-reloading React developer server with instant code refresh. |

### 📡 API & Diagnostic Endpoints

| API Endpoint                          | Method | Format | Full URL                                                                | Description                                                                       |
| :------------------------------------ | :-----: | :----: | :---------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **System Status JSON API**      | `GET` |  JSON  | [`http://localhost:8000/api/status`](http://localhost:8000/api/status) | Real-time diagnostic telemetry, RAM usage, ping latency, and table record counts. |
| **Interactive Swagger UI**      | `GET` |  HTML  | [`http://localhost:8000/docs`](http://localhost:8000/docs)             | Interactive API documentation to execute and test all 11 REST API routers.        |
| **ReDoc OpenAPI Documentation** | `GET` |  HTML  | [`http://localhost:8000/redoc`](http://localhost:8000/redoc)           | Clean, readable reference documentation for all REST API endpoints.               |
| **Liveness Health Probe**       | `GET` |  JSON  | [`http://localhost:8000/health`](http://localhost:8000/health)         | Lightweight 200 OK health check probe for Docker, Kubernetes, and uptime bots.    |

### 📁 Core Files & Workbooks

| Resource                                         | File Link                                                                                   | Purpose                                                                                |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------- |
| **Master Sales & Inventory Workbook**      | [`Sales_Inventory.xlsx`](<file:///d:/Business%20Website/Sales_Inventory.xlsx>)             | 9-sheet master workbook (Sales, Stock, RTO, Returns, Exchanges, Ads, Bank, Summaries). |
| **Master Sourcing & Procurement Workbook** | [`Logistic.xlsx`](<file:///d:/Business%20Website/Logistic.xlsx>)                           | 2-sheet master procurement and supply batch ledger.                                    |
| **Core Relational SQLite Database**        | [`data/app.db`](<file:///d:/Business%20Website/data/app.db>)                               | WAL-mode SQLite database with 8 relational tables.                                    |
| **Standard 3NF Flat CSV Directory**        | [`data/`](<file:///d:/Business%20Website/data>)                                            | 7 normalized flat CSV ledgers auto-synchronized with every mutation.                   |
| **Windows Permanent Fixed URL Launcher**   | [`deploy/run_with_fixed_url.bat`](<file:///d:/Business%20Website/deploy/run_with_fixed_url.bat>) | 1-click startup for server + permanent fixed Ngrok HTTPS URL.                          |
| **Windows 1-Click Launch Script**          | [`deploy/run_dev.bat`](<file:///d:/Business%20Website/deploy/run_dev.bat>)                 | Starts database verification and launches the backend on port 8000.                    |
| **Linux/macOS 1-Click Launch Script**      | [`deploy/run_dev.sh`](<file:///d:/Business%20Website/deploy/run_dev.sh>)                   | Executable bash script to start the platform on Unix systems.                          |
| **Automated Database Backup Utility**      | [`deploy/backup_data.py`](<file:///d:/Business%20Website/deploy/backup_data.py>)           | Captures hot SQLite snapshots and creates zip archives with 30-day retention.          |
| **Portable Remote Tunnel Binaries**        | [`deploy/bin/`](<file:///d:/Business%20Website/deploy/bin>)                                 | Pre-configured `ngrok.exe` (fixed domain) and `cloudflared.exe` (quick tunnel).        |

---

## ⚡ 1-Minute Quickstart: How to Run the Platform

Choose your preferred way to start the system:

### Option A: The Fastest Way (1-Click Run Script)

* **On Windows**: Double-click [`deploy/run_dev.bat`](<file:///d:/Business%20Website/deploy/run_dev.bat>) or run in terminal:
  ```bat
  deploy\run_dev.bat
  ```
* **On Linux / macOS**:
  ```bash
  chmod +x deploy/run_dev.sh && ./deploy/run_dev.sh
  ```
* Once started, open **`http://localhost:8000`** in any web browser!

### Option B: Run Backend & Frontend in Developer Mode (Hot Reload)

If you want to edit code and see instant updates:

```bash
# Terminal 1 - Backend API (port 8000)
.\.venv\Scripts\activate
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2 - Frontend Dev HUD (port 5173)
cd frontend
npm run dev
```

* Open **`http://localhost:5173`** for hot-reloading frontend development.

### Option C: Run 24/7 Mobile Remote Access via Permanent Fixed URL (Ngrok)
To launch your website with your **permanent, fixed link that never changes**:
* Simply double-click **[`deploy/run_with_fixed_url.bat`](file:///d:/Business%20Website/deploy/run_with_fixed_url.bat)**!
* Your permanent address is:  
  👉 **`https://blurred-submerge-underuse.ngrok-free.dev`**

### Option D: Run via Zero-Config Cloudflare Tunnel (Temporary Link)
If you prefer Cloudflare without registering an account:
* Double-click **[`deploy/run_with_tunnel.bat`](file:///d:/Business%20Website/deploy/run_with_tunnel.bat)**.
* Cloudflare provides a randomly generated public HTTPS URL on each run (e.g. `https://xxxx.trycloudflare.com`).

### Option E: Run with Docker Compose

```bash
docker compose up -d --build
```

* Container mounts `./data` to protect all data permanently. Live at **`http://localhost:8000`**.

---

## 📑 Table of Contents

1. [Quick Links &amp; Live URL Directory](#-quick-links--live-url-directory)
2. [1-Minute Quickstart: How to Run the Platform](#-1-minute-quickstart-how-to-run-the-platform)
3. [Executive Summary &amp; Problem Statement](#-executive-summary--problem-statement)
4. [Core Architectural Principles](#-core-architectural-principles)
5. [System Architecture &amp; Data Topology](#-system-architecture--data-topology)
6. [Subsystems &amp; Operational Flows](#-subsystems--operational-flows)
   - [Flow 1: Procurement &amp; Supply Intake](#flow-1-procurement--supply-intake)
   - [Flow 2: Order Fulfillment &amp; Sales Dispatch](#flow-2-order-fulfillment--sales-dispatch)
   - [Flow 3: Courier RTO (Return to Origin) 3-Stage Pipeline](#flow-3-courier-rto-return-to-origin-3-stage-pipeline)
   - [Flow 4: Customer Returns &amp; QC Grading Hub](#flow-4-customer-returns--qc-grading-hub)
   - [Flow 5: Item Exchanges &amp; Replacement Swaps](#flow-5-item-exchanges--replacement-swaps)
   - [Flow 6: Treasury &amp; Bank Reconciliation](#flow-6-treasury--bank-reconciliation)
   - [Flow 7: Marketing Attribution &amp; Blended ROAS](#flow-7-marketing-attribution--blended-roas)
   - [Flow 8: Dual-Tier Excel &amp; 3NF CSV Synchronization](#flow-8-dual-tier-excel--3nf-csv-synchronization)
   - [Flow 9: System Health &amp; Multi-Subsystem Diagnostics](#flow-9-system-health--multi-subsystem-diagnostics)
   - [Flow 10: Zero-Cost 24/7 Remote Mobile Access](#flow-10-zero-cost-247-remote-mobile-access)
   - [Flow 11: Interactive Playable Manual &amp; System Tour (Dual-Tier)](#flow-11-interactive-playable-manual--system-tour-dual-tier)
   - [Flow 12: Excel-Style Column Sorting &amp; Multi-Filter Engine (All Tables)](#flow-12-excel-style-column-sorting--multi-filter-engine-all-tables)
7. [Financial Mathematics &amp; Calculation Engine (23 Formulas)](#-financial-mathematics--calculation-engine-23-formulas)
8. [Divine AI Copilot Engine (5 Heuristic Rules)](#-divine-ai-copilot-engine-5-heuristic-rules)
9. [Database Schema &amp; ORM Entities](#-database-schema--orm-entities)
10. [Project Structure &amp; Codebase Map](#-project-structure--codebase-map)
11. [Comprehensive Installation, Setup &amp; Deployment Guide](#-installation-setup--how-to-run)
    - [Prerequisites](#prerequisites)
    - [Method 1: Native Local Runner (Quickstart)](#method-1-native-local-runner-quickstart)
    - [Method 2: Developer Mode (Hot-Reloading)](#method-2-developer-mode-hot-reloading)
    - [Method 3: Multi-Stage Production Docker](#method-3-multi-stage-production-docker)
    - [Method 4: Permanent Fixed URL via Ngrok (24/7 Smartphone Access)](#method-4-permanent-fixed-url-via-ngrok-247-smartphone-access)
    - [Method 5: Zero-Cost 24/7 Cloudflare Tunnel (Remote Mobile Phone)](#method-5-zero-cost-247-cloudflare-tunnel-remote-mobile-phone)
    - [Method 6: Cloud Hosting (Render / Railway / VPS)](#method-6-cloud-hosting-render--railway--vps)
12. [System Health Diagnostics &amp; Endpoints Reference](#-system-health-diagnostics--endpoints)
13. [Management, Operations &amp; Disaster Recovery](#-management-operations--disaster-recovery)
14. [Testing, Verification &amp; Quality Assurance](#-testing-verification--quality-assurance)

---

## 🎯 Executive Summary & Problem Statement

### The Problem with Traditional Spreadsheets

Fast-moving e-commerce retail businesses frequently run on standalone spreadsheets (`Sales_Inventory.xlsx` and `Logistic.xlsx`). While flexible, this approach inevitably collapses under scaling operations:

* **File-Lock Contention**: When multiple staff open or edit workbooks simultaneously, Excel locks files, causing write collisions and corrupted data.
* **Phantom Sellable Stock**: When customer returns or undelivered courier parcels (RTOs) arrive at the warehouse, staff either prematurely re-add uninspected units to active stock (selling damaged goods) or fail to record them altogether (tying up capital).
* **Financial Formula Drift**: Rounding errors between unit prices and total invoice amounts result in penny drift between sales ledgers, bank balances, and tax filings.
* **Lack of Regulatory Audit Trail**: Uncontrolled edits, deleted rows, and missing timestamps make it impossible to audit past operational mutations.

### The Unified Solution

**Divine Enterprise ERP** solves these operational bottlenecks by pairing a high-concurrency **FastAPI backend** and **SQLite WAL-mode relational database** with an **automatic bidirectional Excel & CSV engine**.

* Operators enjoy a blisteringly fast, responsive **React 18 HUD** on desktop and mobile.
* Non-technical stakeholders and accountants can continue reading, sharing, and archiving standard **9-sheet Master Excel workbooks** (`Sales_Inventory.xlsx` & `Logistic.xlsx`) and normalized **3NF flat CSV ledgers**.
* Every mutation triggers zero-drift mathematical reconciliation and is permanently recorded in a cryptographic-ready **activity audit trail**.

---

## 🏛️ Core Architectural Principles

1. **Non-Volatile Dual-Tier Persistence**:
   Every operational mutation (sale, return, purchase, ad expense, bank transaction) writes instantaneously to SQLite with Write-Ahead Logging (`WAL`). An asynchronous background worker then updates the 9-sheet master Excel workbooks and 7 normalized 3NF CSV files with atomic file-flushing.
2. **Quarantine-First Reverse Logistics**:
   Courier undelivered items (RTO) and customer return shipments are **strictly barred** from sellable inventory. Items must progress through physical dock receipt, QC grading, and manual operator approval before restock or scrap write-off.
3. **Zero-Drift Bidirectional Financial Precision**:
   Transactions accept either unit price or total invoice revenue, auto-computing exact bidirectional values to eliminate penny rounding errors across thousands of transactions.
4. **Resilient Local & Remote Multi-Access**:
   Supports native local LAN desktop operations, terminal CLI scripts, and 24/7 encrypted remote access from smartphones over public HTTPS without paid servers or static IPs.
5. **Multi-Subsystem Telemetry Probing**:
   Continuous automated self-inspection validates API uptime, database connectivity, 8 table counts, file sizes, Excel sheet schemas, and mathematical accounting identities.

---

## 🌐 System Architecture & Data Topology

```mermaid
graph TB
    subgraph Clients ["1. CLIENT & INTERFACE LAYER"]
        DesktopHUD["Desktop Web Browser\n(Full HUD, Modals, Waveforms)"]
        MobileHUD["Mobile Smartphone Browser\n(Touch-First Responsive UI)"]
        TerminalCLI["Terminal / Script Integration\n(Automated REST API & CLI)"]
    end

    subgraph Gateway ["2. NETWORKING & GATEWAY LAYER"]
        Ngrok["Ngrok Permanent Fixed Gateway\n(blurred-submerge-underuse.ngrok-free.dev)"]
        Cloudflare["Cloudflare Zero-Trust Tunnel\n(24/7 Free Encrypted HTTPS Gateway)"]
        LocalProxy["Localhost / LAN Reverse Proxy\n(Port 8000 / Port 5173)"]
    end

    subgraph ApplicationLayer ["3. FASTAPI CORE APPLICATION LAYER"]
        MainApp["FastAPI Engine (backend/app/main.py)\n- CORS & Process-Time Timing Headers\n- Lifespan DB Auto-Init\n- Static SPA Asset Server"]
        Routers["11 Modular API Routers:\n/api/sales, /api/procurement, /api/stock, /api/rto\n/api/customer-returns, /api/exchanges, /api/ads\n/api/bank, /api/analytics, /api/audit, /api/status"]
        BackgroundSync["Async Background Worker\n(Non-blocking Task Queue)"]
    end

    subgraph CoreEngines ["4. CORE COMPUTATIONAL ENGINES"]
        FinEngine["Financial Engine (financial_engine.py)\n- 23 Zero-Drift Formulas\n- WAC & Dual-Pricing\n- Continuous Bank Balance"]
        AICopilot["Divine AI Copilot (ai_copilot.py)\n- 5 Heuristic Telemetry Rules\n- Star Velocity & Low Stock Radar"]
        ReverseShield["Quarantine Shield\n- RTO 3-Stage State Machine\n- Physical QC Grading Hub"]
        DiagnosticsEngine["System Health Probes (status.py)\n- Real-time Subsystem Verification"]
    end

    subgraph PersistenceLayer ["5. PERSISTENCE & DUAL-TIER STORAGE"]
        SQLiteDB[("SQLite Database (WAL Mode)\n8 Relational ORM Entities\ndata/app.db")]
        MasterExcel[("Master Excel Workbooks\n- Sales_Inventory.xlsx (9 sheets)\n- Logistic.xlsx (2 sheets)")]
        CSVLedgers[("Standard 3NF Flat CSVs\n7 Normalized Flat Ledgers\n/data/*.csv")]
        AuditStore[("Regulatory Activity Audit Trail\nPersistent Audit Entity & Log")]
    end

    Clients --> Gateway
    Gateway --> ApplicationLayer
    MainApp --> Routers
    Routers --> CoreEngines
    Routers --> BackgroundSync
    CoreEngines --> SQLiteDB
    BackgroundSync --> MasterExcel
    BackgroundSync --> CSVLedgers
    Routers --> AuditStore
```

---

## 🔄 Subsystems & Operational Flows

### Flow 1: Procurement & Supply Intake

```mermaid
sequenceDiagram
    autonumber
    actor Supplier as Factory / Vendor
    actor Operator as Warehouse Manager
    participant App as Procurement Portal
    participant DB as SQLite Database
    participant Stock as Stock Matrix
    participant Excel as Master Excel Sync

    Supplier->>Operator: Deliver Inward Batch (e.g. 100 units Style DR01 @ $12.50)
    Operator->>App: Record Inward Procurement (Date, Style, Units, Rate)
    App->>DB: INSERT into procurement_batches
    DB->>Stock: Update Total Inward Quantity & Recompute WAC
    App->>DB: Log ActivityAuditLog ("PROCUREMENT", Batch ID)
    App-->>Excel: Trigger Async Sync (Logistic.xlsx + procurement_batches.csv)
    App-->>Operator: Confirm Batch Logged & Stock Matrix Refreshed
```

---

### Flow 2: Order Fulfillment & Sales Dispatch

```mermaid
sequenceDiagram
    autonumber
    actor Customer as E-commerce Customer
    actor Ops as Dispatch Operator
    participant App as Sales Modal & Ledger
    participant Stock as Stock Matrix
    participant Fin as Financial Engine
    participant DB as SQLite Database

    Customer->>Ops: New Order (e.g. 2 units DR01 @ $45.00)
    Ops->>App: Open Global Fast Record Sale Modal
    App->>Stock: Check Usable Stock (e.g. 48 units available)
    App->>Fin: Instant Preview (Revenue: $90, COGS: $25, Profit: $65, Margin: 72.2%)
    Ops->>App: Confirm Dispatch
    App->>DB: INSERT into sales_orders
    DB->>Stock: Deduct 2 units from Usable Sellable Stock
    App->>DB: Log ActivityAuditLog ("SALE", Order ID)
    App-->>Ops: Instant Order Recorded & Live Stock Updated
```

---

### Flow 3: Courier RTO (Return to Origin) 3-Stage Pipeline

*Courier returns (undelivered / customer refused COD) must never immediately enter active inventory.*

```
[ Stage 1: IN_TRANSIT ]
  - Courier marks package non-delivered.
  - Recorded in RTO Pipeline.
  - Active sellable stock is NOT touched.
       │
       ▼ (Parcel arrives at warehouse dock)
[ Stage 2: RECEIVED (Quarantined) ]
  - Warehouse scans barcode & clicks "Receive".
  - Units enter Protected RTO Dock Holding Buffer.
  - Physical package is unboxed & inspected.
       │
       ├────────────────────────────────────────┐
       ▼ (Item in pristine condition)           ▼ (Item damaged / lost)
[ Stage 3a: RESTOCKED ]                  [ Stage 3b: DAMAGED / SCRAP ]
  - Operator clicks "Restock".             - Operator clicks "Damage".
  - Stock Matrix: Usable Stock +1.         - Marked as inventory loss write-off.
  - Cleared from Quarantine Dock.          - Stock is NOT credited.
```

---

### Flow 4: Customer Returns & QC Grading Hub

*Delivered items returned by customers require rigorous physical QC inspection.*

```mermaid
graph TD
    CR1["1. Customer Return In Transit\nRecorded with Reason & Tracking ID"] --> CR2["2. Received at QC Dock\nQuarantined in cr_holding_units"]
    CR2 --> QC{"3. Physical QC Inspection"}
    QC -->|Grade A: Pristine Condition| RestockA["Restocked to Active Sellable Inventory\nStock Matrix Updated (+units)"]
    QC -->|Grade B: Minor Box Damage| RestockB["Discount Outlet / Repackaging Restock\nAdded to Secondary Inventory"]
    QC -->|Damaged / Used| Scrap["Scrap Loss Write-Off\nCOGS Absorbed as Return Loss"]
    QC -->|Dispute / Missing Item| Dispute["Courier / Customer Claim Filed\nEscalated in Audit Trail"]
```

---

### Flow 5: Item Exchanges & Replacement Swaps

An exchange requires a synchronized **two-legged inventory transaction**:

1. **Replacement Item Outflow**: Deducts the newly requested replacement unit from active stock immediately to fulfill the replacement order.
2. **Original Item Inflow & Quarantine**: Places the inbound returned item into the exchange staging buffer until physically verified, inspected, and restocked.

---

### Flow 6: Treasury & Bank Reconciliation

Provides continuous reconciliation between bank statements and ERP transaction flows:

* **Credit Entries (+)**: Customer prepaid remittances, COD courier cash disbursements, owner capital injections.
* **Debit Entries (-)**: Supplier procurement payments, advertising invoices, logistics shipping charges, facility overhead.
* **Continuous Running Balance**: Recalculates exact closing balance with zero rounding drift:
  $$
  \text{Running Balance} = \sum \text{Credits} - \sum \text{Debits}
  $$

---

### Flow 7: Marketing Attribution & Blended ROAS

Tracks ad spend across channels (Meta Ads, Google Ads, TikTok, Influencers):

* **Blended ROAS Calculation**:
  $$
  \text{Blended ROAS} = \frac{\text{Total System Revenue}}{\text{Total Advertising Spend}}
  $$
* **ROAS Performance Tiers**:
  * $\ge 4.0\times$: **Exceptional** (Green) — Scale spend aggressively.
  * $2.5\times - 3.99\times$: **Profitable** (Blue) — Sustainable growth.
  * $1.5\times - 2.49\times$: **Marginal** (Yellow) — Monitor product margins closely.
  * $< 1.5\times$: **Sub-threshold** (Red) — Cut underperforming ad sets immediately.

---

### Flow 8: Dual-Tier Excel & 3NF CSV Synchronization

To prevent file-locking crashes when users open spreadsheets in Microsoft Excel, the synchronization engine leverages non-blocking asynchronous workers:

```
FastAPI Mutation (Sale, RTO, Procurement, Bank)
       │
       ▼
1. Commit to SQLite (data/app.db) with WAL journal mode (< 5ms)
       │
       ▼
2. Trigger FastAPI BackgroundTask (Non-blocking response to user)
       │
       ▼
3. Excel & CSV Sync Worker (excel_sync.py)
   ├── Load ORM entities
   ├── Regenerate 9 formatted sheets in Sales_Inventory.xlsx
   ├── Regenerate 2 sheets in Logistic.xlsx
   ├── Atomically flush 7 flat 3NF CSVs in data/
   └── If file is locked by Excel: Exponential backoff retry (0.5s, 1s, 2s)
```

---

### Flow 9: System Health & Multi-Subsystem Diagnostics

*Real-time probe accessible at `/status` (HTML Dashboard) and `/api/status` (JSON API).*

The diagnostic engine automatically runs 6 comprehensive tests:

1. **API Runtime Probe**: Validates uptime, RAM usage (RSS), PID, Python runtime, and diagnostic latency.
2. **SQLite Database Probe**: Pings the DB (`SELECT 1`), measures latency in ms, verifies DB file size on disk, and counts records across all 8 relational tables.
3. **Master Excel Workbooks Probe**: Verifies existence, byte sizes, and sheet tab integrity for `Sales_Inventory.xlsx` and `Logistic.xlsx`.
4. **Standard 3NF CSV Ledgers Probe**: Confirms existence and row counts of all 7 CSV files in `data/`.
5. **Zero-Drift Financial Identity Probe**: Re-validates the mathematical identity $\text{Gross Profit} \equiv \text{Revenue} - \text{COGS}$, checks realized revenue bounds, and verifies bank continuous balance matching.
6. **Quarantine Buffer Probe**: Measures units held in courier RTO docks, customer return intake, and exchange buffers to ensure sellable inventory is 100% protected.

---

### Flow 10: Zero-Cost 24/7 Remote Mobile Access

Allows store managers and business owners to securely monitor and manage operations from their mobile smartphones 24/7 without paid cloud hosting or static IPs:

* **Permanent Fixed Link (Ngrok)**: Launches with [`deploy/run_with_fixed_url.bat`](<file:///d:/Business%20Website/deploy/run_with_fixed_url.bat>) at `https://blurred-submerge-underuse.ngrok-free.dev` (never changes).
* **Zero-Config Quick Tunnel (Cloudflare)**: Launches with [`deploy/run_with_tunnel.bat`](<file:///d:/Business%20Website/deploy/run_with_tunnel.bat>) for instant zero-registration temporary URLs.

```
[ Smartphone on 5G / Wi-Fi anywhere in the world ]
       │  (Encrypted HTTPS)
       ▼
[ Ngrok Fixed Edge / Cloudflare Global Network ]
       │  (Secure Zero-Trust Encrypted Tunnel)
       ▼
[ ngrok.exe / cloudflared.exe Daemon running locally ]
       │  (Forwarding traffic over localhost:8000)
       ▼
[ FastAPI Server on port 8000 ]
       ├── Serves pre-compiled React 18 HUD
       └── Executes SQLite & Excel sync operations
```

---

### Flow 11: Interactive Playable Manual & System Tour (Dual-Tier)

An embedded, interactive onboarding and operations engine with live play simulators directly inside the web interface:

```mermaid
graph LR
    Launcher["Interactive Launcher\nTopBar / Dashboard / Sidebar"] --> TourModal["Interactive Tour HUD\nDimmed Glassmorphic Spotlight"]
    TourModal --> Mode{"Tour Mode Selection"}
    Mode -->|🌟 Master Platform Tour| MultiTab["11 Sequential Stages\nAuto-Navigates Tabs Live\n(Dashboard ➔ Sales ➔ Stock ➔ RTO ➔ ...)"]
    Mode -->|💡 Tab-Specific Guide| DeepDive["Contextual View Guide\n(Deep-dive tips, features & actions)"]
    MultiTab --> Sim["Interactive Play Simulators\n• Live Sales Profit & Margin Calc\n• Dynamic Stock Inward-Outward Equation\n• RTO 3-Stage State Selector\n• Marketing Blended ROAS Tier Scaler\n• Customer Returns QC Grading Matrix"]
```

#### Dual-Tier Architectural Features:
1. **Master System Tour (Multi-Tab)**:
   - **Auto-Navigates Tabs**: Advancing to the next step automatically switches the active tab in the background so operators see the real screen corresponding to the explanation.
   - **11 Covered Subsystems**: Executive Overview, Sales Fulfillment, Stock Matrix, Courier RTO Quarantine, Customer Returns QC, Exchanges, Procurement Batches, Ads Spend & ROAS, Bank Treasury, Audit Trail, and System Health Diagnostics.
2. **Tab-Specific Deep-Dive Guides**:
   - Every active tab features a contextual guide providing operator tips, edge case instructions, and operational heuristics.
3. **Special Interactive Features & Playable Simulators**:
   - **Live Sales Profit Preview**: Adjust quantity and selling price to see gross revenue, COGS, gross profit, and margin % computed in real time.
   - **Dynamic Stock Equation**: Test inward, dispatched, and restocked counts with auto-updating 4-tier stock health status badges (*Star*, *Adequate*, *Low*, *Depleted*).
   - **RTO 3-Stage Pipeline Switcher**: Click through *In-Transit*, *Dock Quarantine*, *Restocked (+1)*, and *Damaged Loss* to observe warehouse inventory reactions.
   - **Blended ROAS Scaler**: Test ad spend vs revenue with dynamic tier badges (*Exceptional* $\ge 4.0\text{x}$, *Profitable*, *Marginal*, *Sub-threshold*).
   - **Customer Return QC Decision Hub**: Test *Grade A Pristine*, *Grade B Repackage*, *Damaged Write-off*, and *Dispute Claim*.
   - **Controls & Accessibility**: Full keyboard support (`[ESC]` to exit, `[←]` / `[→]` arrows to navigate), clickable progress dots, and glowing progress bar.

---

### Flow 12: Excel-Style Column Sorting & Multi-Filter Engine (All Tables)

Every tabular view across the platform features native, high-performance **Excel-grade AutoFilter and interactive sorting** across all data columns, bringing spreadsheet fluidity directly to the web HUD without compromising non-volatile relational database integrity:

```mermaid
graph TD
    UserAction["Operator Action on Any Table Column"] --> Decision{"Click Target"}
    Decision -->|Click Header Text| DirectSort["Direct Quick Sort\nAscending (▲) ➔ Descending (▼) ➔ None"]
    Decision -->|Click Funnel Icon 🔽| OpenFilter["Excel AutoFilter Popover Menu\n(Full Column Controls)"]
    
    OpenFilter --> SortControls["Sort Controls\n• 🔼 Sort Ascending (A to Z / Low to High)\n• 🔽 Sort Descending (Z to A / High to Low)\n• 🔄 Clear Sort"]
    OpenFilter --> QuickActions["Bulk Selection Actions\n• 'Select All' (Include all values)\n• 'Clear All' (Deselect all)\n• 'Reset' (Clear column filter)"]
    OpenFilter --> SearchBox["Real-Time Search Input\nFilter checklist by typing"]
    OpenFilter --> CheckboxList["Auto-Populated Value Checklist\n• (Select All) with indeterminate state\n• Unique values with exact count badges (e.g., '14')\n• ⚡ 'only' 1-click filter button on hover"]
    
    DirectSort --> TableEngine["Client-Side Presentation Engine\n(useTableControls.js Hook)"]
    CheckboxList --> TableEngine
    TableEngine --> Render["Instant Re-Render of Filtered Table\n• Multi-Column Stacking (AND Logic)\n• Real-Time Recalculation of Totals & Averages\n• Active Filter Badges ('Filters (N) ✕' Button)"]
```

#### Core Features & Capabilities:
1. **Interactive Column-Level Sorting**:
   - Every data column header can be clicked to cycle: `None ➔ Ascending ➔ Descending ➔ None`.
   - Direction chevrons (`▲` / `▼`) provide instant visual state with high-contrast active blue indicator.
   - Automatically handles numeric, currency, date, and string comparisons with correct type-aware algorithms.
2. **Excel-Grade AutoFilter Dropdown**:
   - **Integrated Sort Actions**: Ascending and Descending sort buttons directly inside the popover.
   - **Live Value Search**: Instantly filter down large lists of unique SKUs, dates, statuses, or channels by typing.
   - **(Select All) Support**: Checkbox reflects complete, empty, or indeterminate/partial selection state.
   - **Exact Record Counts**: Displays how many rows match each value (e.g., `Style-101 (18)`).
   - **1-Click "only" Hover Filter**: Hovering over any item displays an `only` link that immediately isolates that single value with one click.
3. **Multi-Column Filtering (Stackable AND Logic)**:
   - Operators can filter by multiple columns simultaneously (e.g., `Status = "In Transit"` AND `Style SKU = "DENIM-01"`).
   - Filtered column headers highlight their funnel icon in bright blue with an active indicator badge.
4. **1-Click "Filters (N) ✕" Toolbar Reset**:
   - When one or more column filters are active, a glowing toolbar button appears displaying the active count and allowing all column filters to be cleared in a single click.
5. **Dynamic Summary Footer Recalculation**:
   - All table footers (e.g. Total Units, Average Cost, Gross Spend, Total Margin) automatically recompute in real time based only on the currently filtered/visible dataset.
6. **Zero Data Mutation**:
   - Sorting and filtering occur entirely in the client-side presentation layer; database records and background Excel/CSV synchronization remain 100% pristine and unaltered.

#### Complete Table & Column Coverage Matrix (9 Tables, 82 Data Columns):

| View / Ledger | Total Data Columns | All Sortable | All Filterable | Covered Column Keys |
| :--- | :---: | :---: | :---: | :--- |
| **Sales Order Ledger** | 10 | ✅ Yes | ✅ Yes | `sl_no`, `date`, `style_no`, `quantity_sold`, `selling_price`, `total_revenue`, `cogs`, `profit`, `profit_margin`, `reference` |
| **Warehouse Stock Matrix** | 13 | ✅ Yes | ✅ Yes | `style_no`, `total_purchased`, `total_sold`, `exch_out`, `rto_restocked`, `cr_restocked`, `exch_restocked`, `stock_on_hand`, `unit_cost`, `stock_valuation`, `total_revenue`, `total_profit`, `status` |
| **Procurement Batches** | 6 | ✅ Yes | ✅ Yes | `id`, `date`, `style_no`, `inventory`, `purchase_rate`, `total_value` |
| **Procurement Daily Summary** | 5 | ✅ Yes | ✅ Yes | `date`, `style_count`, `total_units`, `daily_gross_total`, `avg_purchase_rate` |
| **Bank Treasury Register** | 5 | ✅ Yes | ✅ Yes | `sl_no`, `date`, `type`, `amount`, `running_balance` |
| **Courier RTO Pipeline** | 9 | ✅ Yes | ✅ Yes | `date`, `style_no`, `quantity`, `sale_price`, `courier_fee`, `tracking_no`, `status`, `received_date`, `restocked_date` |
| **Customer Returns QC Hub** | 11 | ✅ Yes | ✅ Yes | `date`, `style_no`, `quantity`, `refund_amount`, `reverse_fee`, `primary_reason`, `secondary_reason`, `reverse_awb`, `status`, `received_date`, `restocked_date` |
| **Item Exchanges Ledger** | 13 | ✅ Yes | ✅ Yes | `date`, `original_style`, `exchanged_style`, `quantity`, `standard_price`, `reverse_fee`, `net_settlement`, `primary_reason`, `secondary_reason`, `reverse_awb`, `return_status`, `received_date`, `restocked_date` |
| **Marketing Ads Spend** | 4 | ✅ Yes | ✅ Yes | `date`, `platform`, `amount`, `notes` |
| **Activity Audit Trail** | 6 | ✅ Yes | ✅ Yes | `timestamp`, `category`, `action`, `summary`, `source`, `status` |

---

## 🧮 Financial Mathematics & Calculation Engine (23 Formulas)

Every metric in Divine Enterprise ERP is governed by strict mathematical specifications implemented in [`backend/app/services/financial_engine.py`](<file:///d:/Business%20Website/backend/app/services/financial_engine.py>):

| No. | Metric / Function Name | Mathematical Specification | Business Significance |
| :--- | :--- | :--- | :--- |
| **1** | **Usable Stock on Hand** (`calculate_usable_stock`) | $S_{\text{usable}} = S_{\text{purchased}} - S_{\text{sold}} - S_{\text{exch-out}} + S_{\text{rto-restocked}} + S_{\text{cr-restocked}} + S_{\text{exch-restocked}}$ | **The single true source of sellable stock**. Prevents overselling. |
| **2** | **Warehouse Stock Valuation** (`calculate_stock_valuation`) | $V_{\text{inventory}} = \max(0, S_{\text{usable}}) \times \text{Unit Cost}$ | True asset cost valuation of active warehouse stock. |
| **3** | **Procurement Portfolio Value** (`calculate_total_portfolio_value`) | $V_{\text{portfolio}} = \sum (\text{Units}_i \times \text{Purchase Rate}_i)$ | Gross historical capital invested in factory procurement. |
| **4** | **Weighted Average Cost (WAC)** (`calculate_weighted_average_cost`) | $\text{WAC} = \frac{\sum (\text{Units}_i \times \text{Rate}_i)}{\sum \text{Units}_i}$ | Blended cost per unit across multiple inward production batches. |
| **5** | **Gross Revenue & Dual-Pricing** (`calculate_gross_revenue`) | $R = Q \times P \quad\text{or}\quad P = \frac{\text{Invoice Total}}{Q}$ | Bidirectional price/revenue resolution eliminating rounding errors. |
| **6** | **Global System Revenue** (`calculate_total_system_revenue`) | $R_{\text{sys}} = R_{\text{sales}} + \max(0, R_{\text{exch}} - R_{\text{sync}})$ | Unified system revenue with strict anti-double-counting logic. |
| **7** | **Cost of Goods Sold (COGS)** (`calculate_cogs`) | $\text{COGS} = Q \times \text{Unit Cost}$ | Direct procurement cost of dispatched customer merchandise. |
| **8** | **Gross Profit** (`calculate_gross_profit`) | $\text{GP} = R_{\text{sys}} - \text{COGS}_{\text{sys}}$ | Core operational profit before marketing, reverse fees, and overhead. |
| **9** | **Gross Profit Margin %** (`calculate_gross_profit_margin`) | $\text{Margin}_{\text{GP}} = \frac{\text{GP}}{R_{\text{sys}}} \times 100$ | Baseline unit commercial yield percentage. |
| **10** | **Average Order Value (AOV)** (`calculate_aov`) | $\text{AOV} = \frac{R_{\text{sales}}}{\text{Total Dispatched Orders}}$ | Average gross monetary basket size per fulfillment dispatch. |
| **11** | **Adjusted Realized Revenue** (`calculate_adjusted_revenue`) | $R_{\text{adj}} = \max(0, R_{\text{sys}} - R_{\text{rto-rev}} - \text{Refunds}_{\text{cr}})$ | True settled cash after deducting returned and refunded orders. |
| **12** | **Adjusted Units Sold** (`calculate_adjusted_units_sold`) | $U_{\text{adj}} = \max(0, U_{\text{sold}} + U_{\text{unsync-exch}} - U_{\text{rto-rcvd}} - U_{\text{cr-arrived}})$ | Physical units permanently retained by paying customers. |
| **13** | **Recovered Inventory COGS** (`calculate_recovered_cogs`) | $\text{COGS}_{\text{rec}} = \sum (U_{\text{restocked}} \times \text{Unit Cost})$ | Cost value of returned merchandise restored to sellable inventory. |
| **14** | **Damaged Inventory COGS Loss** (`calculate_damaged_cogs_loss`) | $\text{Loss}_{\text{dmg}} = \sum (U_{\text{damaged}} \times \text{Unit Cost})$ | Inventory asset write-off absorbed from transit or wear damage. |
| **15** | **Reversed Profit Deductions** (`calculate_reversed_profit`) | $\text{Profit}_{\text{rev}} = \text{Reversed Revenue} - \text{Recovered COGS}$ | Margin adjustment reversing initial dispatched profit on returned goods. |
| **16** | **Dispatched Net Profit** (`calculate_dispatched_net_profit`) | $\text{NP}_{\text{disp}} = \text{GP} - \text{Ad Spend} - \text{Courier Fees}_{\text{rto}} - \text{Reverse Fees}_{\text{cr}}$ | Interim net profit amortizing ads and reverse shipping fees. |
| **17** | **Net Realized Profit (5-Tier)** (`calculate_net_realized_profit`) | $\text{NP}_{\text{real}} = \text{NP}_{\text{disp}} - \text{RevProfit}_{\text{rto}} - \text{DmgCOGS}_{\text{rto}} - \text{RevProfit}_{\text{cr}} - \text{DmgCOGS}_{\text{cr}}$ | **True bottom-line cash earnings** after all 5 operational tiers. |
| **18** | **Net Realized Margin %** (`calculate_net_realized_margin`) | $\text{Margin}_{\text{net}} = \frac{\text{NP}_{\text{real}}}{R_{\text{adj}}} \times 100$ | True bottom-line commercial profit margin ratio. |
| **19** | **Reverse Logistics Rates** (`calculate_reverse_logistics_rates`) | $\text{Rate}_x = \frac{\text{Units}_x}{\text{Total Units Sold}} \times 100 \quad (x \in \{\text{RTO}, \text{CR}, \text{Exch}\})$ | Return and exchange benchmark percentages against gross dispatches. |
| **20** | **Item Exchange Net Settlement** (`calculate_exchange_settlement`) | $\text{Settlement} = (\text{Replacement Price} \times Q) - \text{Reverse Shipping Fee}$ | Net cash remittance for item size/color replacement orders. |
| **21** | **Return on Ad Spend (ROAS)** (`calculate_roas`) | $\text{ROAS}_{\text{disp}} = \frac{R_{\text{sys}}}{\text{Ad Spend}}, \quad \text{ROAS}_{\text{adj}} = \frac{R_{\text{adj}}}{\text{Ad Spend}}$ | Multi-channel advertising attribution and marketing yield. |
| **22** | **Continuous Bank Running Balance** (`calculate_bank_running_balance`) | $\text{Balance}_t = \text{Balance}_{t-1} + \text{Credit} - \text{Debit}$ | Exact continuous cash treasury balance with zero penny drift. |
| **23** | **Dynamic Price Markup Formula** (`calculate_dynamic_markup_price`) | $P_{\text{rec}} = \text{Unit Cost} \times (1 + \text{MarkupFraction})$ | Instant pricing recommender based on target margin multipliers. |

> [!NOTE]
> **Stock Health Tier Systems**:
> * **Backend Health Engine** (`get_inventory_health_badge`): `In Stock` ($> 5$ units) \| `Low Stock` ($1-5$ units) \| `Out of Stock` ($0$ units) \| `Over Sold` ($< 0$ units).
> * **Matrix UI & Guided Tour HUD**: `Star` ($\ge 30$ units) \| `Adequate` ($10-29$ units) \| `Low` ($1-9$ units) \| `Depleted` ($0$ units).

---

## 🤖 Divine AI Copilot Engine (5 Heuristic Rules)

Implemented in [`backend/app/services/ai_copilot.py`](<file:///d:/Business%20Website/backend/app/services/ai_copilot.py>), the copilot monitors real-time transaction telemetry to deliver proactive business guidance:

```
                                  [ Divine AI Copilot Engine ]
                                                │
         ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
         ▼                  ▼                   ▼                   ▼                  ▼
     [ RULE 1 ]         [ RULE 2 ]          [ RULE 3 ]          [ RULE 4 ]         [ RULE 5 ]
   Star Performer     Inventory Radar     Marketing ROAS      Quarantined Dock    Margin Velocity
   Top Yield SKU      Stockout Warning    Efficiency Tiers    Restock Trigger     & Bottom Line
```

1. **Rule 1: Star Performer Style Identification (`STAR_PERFORMER`)**:
   Scans sales order ledgers across styles to isolate the single highest gross profit-generating apparel SKU, calculating exact realized revenue, units dispatched, and gross margin %.
2. **Rule 2: Inventory Radar & Stockout Warning (`INVENTORY_RADAR`)**:
   Monitors active stock balances and triggers reorder alerts for styles with $\le 5$ units remaining (`LOW_STOCK_THRESHOLD`), providing direct links to the stock matrix for proactive procurement.
3. **Rule 3: Marketing Telemetry & ROAS Efficiency (`MARKETING_TELEMETRY`)**:
   Evaluates blended advertising return across 4 operational tiers:
   * **Organic Mode**: $\$0.00$ ad spend with organic customer sales.
   * **Tier 1: Elite ROAS** ($\ge 4.0\times$): High-yield acquisition; signals scaling ad budgets.
   * **Tier 2: Healthy ROAS** ($\ge 2.0\times - 3.99\times$): Sustainable marketing returns.
   * **Tier 3: Low ROAS** ($< 2.0\times$): Underperforming ad sets; prompts budget reallocation.
4. **Rule 4: Warehouse Staging Opportunity (`WAREHOUSE_STAGING`)**:
   Monitors parcels sitting at courier RTO and Customer Return intake docks. Triggers automated alerts calculating the exact dollar value of quarantined inventory and provides 1-click dock restock actions.
5. **Rule 5: Margin Velocity & Dual-Sync Reconciliation (`MARGIN_VELOCITY`)**:
   Audits the true bottom-line realized net profit ($\text{NP}_{\text{real}}$) against gross margins and reconciles treasury continuous bank balances to ensure zero ledger discrepancy.

---

## 🗄️ Database Schema & ORM Entities

The system uses SQLAlchemy 2.0 ORM models in [`backend/app/models/entities.py`](<file:///d:/Business%20Website/backend/app/models/entities.py>) mapped to SQLite tables:

```
┌─────────────────────────┐       ┌─────────────────────────┐
│   procurement_batches   │       │      sales_orders       │
├─────────────────────────┤       ├─────────────────────────┤
│ id (PK, Integer)        │       │ id (PK, Integer)        │
│ date (String, IDX)      │       │ sl_no (Integer, Opt)    │
│ style_no (String, IDX)  │──┐ ┌──│ date (String, IDX)      │
│ inventory (Integer)     │  │ │  │ style_no (String, IDX)  │
│ purchase_rate (Float)   │  │ │  │ quantity_sold (Integer) │
│ total_value (Float)     │  │ │  │ selling_price (Float)   │
└─────────────────────────┘  │ │  │ total_revenue (Float)   │
                             │ │  │ unit_purchase_cost      │
┌─────────────────────────┐  │ │  │ cogs (Float)            │
│      rto_pipeline       │  │ │  │ profit (Float)          │
├─────────────────────────┤  │ │  │ profit_margin (Float)   │
│ id (PK, Integer)        │  │ │  │ reference (String, Opt) │
│ rto_id (String, IDX)    │  │ │  └─────────────────────────┘
│ tracking_no (String)    │  │ │  
│ style_no (String, IDX)  │──┤ │  ┌─────────────────────────┐
│ quantity (Integer)      │  │ │  │    customer_returns     │
│ sale_price (Float)      │  │ │  ├─────────────────────────┤
│ reversed_revenue (Float)│  │ │  │ id (PK, Integer)        │
│ courier_fee (Float)     │  │ │  │ return_id (String, IDX) │
│ status (In Transit,     │  │ └──│ style_no (String, IDX)  │
│         Received,       │  │    │ quantity (Integer)      │
│         Restocked,      │  │    │ refund_amount (Float)   │
│         Damaged)        │  │    │ qc_grade (Grade A/B/Dmg)│
└─────────────────────────┘  │    │ status (String, IDX)    │
                             │    └─────────────────────────┘
┌─────────────────────────┐  │    
│     item_exchanges      │  │    ┌─────────────────────────┐
├─────────────────────────┤  │    │        ad_spends        │
│ id (PK, Integer)        │  │    ├─────────────────────────┤
│ exchange_id (String)    │  │    │ id (PK, Integer)        │
│ original_style (String) │──┘    │ date (String, IDX)      │
│ exchanged_style (String)│       │ platform (Meta/Google)  │
│ quantity (Integer)      │       │ amount (Float)          │
│ status (return/exchange)│       │ notes (Text, Opt)       │
└─────────────────────────┘       └─────────────────────────┘
                           
┌─────────────────────────┐       ┌─────────────────────────┐
│    bank_transactions    │       │   activity_audit_logs   │
├─────────────────────────┤       ├─────────────────────────┤
│ id (PK, Integer)        │       │ id (PK, Integer)        │
│ sl_no (Integer, Opt)    │       │ timestamp (String, IDX) │
│ date (String, IDX)      │       │ category (SALE/RTO/etc) │
│ type (Credit / Debit)   │       │ action (CREATE/UPDATE)  │
│ amount (Float)          │       │ summary (String)        │
│ running_balance (Float) │       │ status (SUCCESS/WARN)   │
└─────────────────────────┘       └─────────────────────────┘
```

---

## 📂 Project Structure & Codebase Map

```
d:/Business Website/
├── README.md                           # Master Architecture, Flow & Operations Guide (This file)
├── Dockerfile                          # Multi-stage production container (Node 20 + Python 3.11)
├── docker-compose.yml                  # 1-command container orchestration with persistent data volume
├── Sales_Inventory.xlsx                # 9-sheet Master Sales, Inventory, RTO, Ads & Bank Workbook
├── Logistic.xlsx                       # 2-sheet Sourcing & Procurement Master Workbook
├── TASKS.md                            # Comprehensive 38-step implementation & verification roadmap
│
├── backend/                            # FastAPI Python Backend Application
│   ├── requirements.txt                # Production dependencies (fastapi, uvicorn, openpyxl, sqlalchemy)
│   ├── app/
│   │   ├── main.py                     # ASGI application entrypoint, CORS, static mounting & routes
│   │   ├── db/
│   │   │   ├── session.py              # SQLite engine configuration (WAL mode) & session lifecycle
│   │   │   └── init_db.py              # Schema generation & cold-start Excel seed data ingestion
│   │   ├── models/
│   │   │   └── entities.py             # 8 SQLAlchemy 2.0 ORM entity definitions
│   │   ├── schemas/
│   │   │   └── schemas.py              # Pydantic v2 validation schemas for REST payloads
│   │   ├── services/
│   │   │   ├── financial_engine.py     # 23 zero-drift financial formulas & metric calculators
│   │   │   ├── ai_copilot.py           # 5 heuristic business telemetry rules & recommendation engine
│   │   │   └── excel_sync.py           # Bidirectional sync engine (SQLite ⇄ OpenPyXL ⇄ 3NF CSVs)
│   │   └── api/                        # 11 Modular REST API Routers
│   │       ├── procurement.py          # Sourcing & inward batch management
│   │       ├── sales.py                # Sales order creation, stock deduction & fast preview
│   │       ├── stock.py                # Stock balance matrix query & manual sync trigger
│   │       ├── rto.py                  # Courier RTO 3-stage pipeline transitions & bulk restock
│   │       ├── customer_returns.py     # Returns intake, QC grading (Grade A/B/Damage), bulk restock
│   │       ├── exchanges.py            # Item swaps, replacement deduction, dock restock
│   │       ├── ads.py                  # Advertising spend logging & channel attribution
│   │       ├── bank.py                 # Bank credit/debit entries & continuous running balance
│   │       ├── analytics.py            # KPI cards, trend waveforms (7D, 30D, ALL), copilot insights
│   │       ├── audit.py                # Regulatory activity audit trail queries, CSV export & archive
│   │       └── status.py               # Real-time System Health & Subsystem Diagnostics Engine
│   └── tests/                          # Automated Pytest Test Suites
│       ├── test_api_routes.py          # Integration tests for all REST endpoints
│       ├── test_excel_sync.py          # Parity tests for Excel & CSV export consistency
│       └── test_financial_engine.py    # Zero-drift mathematical precision verification
│
├── frontend/                           # React 18 + Vite + TailwindCSS Frontend Application
│   ├── package.json                    # Dependencies (Lucide icons, Tailwind, SheetJS)
│   ├── vite.config.js                  # Vite bundler configuration & local dev server proxy
│   ├── dist/                           # Compiled production static bundle (served by FastAPI)
│   └── src/
│       ├── App.jsx                     # Root application shell, tab routing & modal controller
│       ├── components/                 # Core Reusable HUD Components
│       │   ├── AICopilotBanner.jsx     # Heuristic intelligence alert carousel & fast actions
│       │   ├── Header.jsx              # Responsive header bar
│       │   ├── InteractiveTour.jsx     # 11-stage spotlight tour & playable simulators HUD
│       │   ├── Sidebar.jsx             # Responsive dockable sidebar with live badges & WAL indicator
│       │   ├── SortableHeader.jsx      # Reusable interactive table header with sort indicators & Excel-style AutoFilter menu
│       │   ├── TopBar.jsx              # Command HUD, sync trigger & master Excel export button
│       │   └── TrendWaveforms.jsx      # Multi-horizon (7D, 30D, ALL) SVG financial charts
│       ├── views/                      # 13 Modular Operational Views
│       │   ├── DashboardView.jsx       # Executive KPI cards, waveform charts, copilot alert banner
│       │   ├── SalesView.jsx           # Sales order ledger with style autocomplete & inline editing
│       │   ├── StockView.jsx           # Real-time stock matrix with 4-tier health status badges
│       │   ├── RTOView.jsx             # Courier RTO 3-stage pipeline & bulk restock buttons
│       │   ├── ReturnsView.jsx         # Customer returns with physical QC grading modal
│       │   ├── ExchangesView.jsx       # Replacement swaps & reverse intake buffer
│       │   ├── ProcurementView.jsx     # Factory sourcing batches & purchase cost tracking
│       │   ├── AdsView.jsx             # Marketing campaign spend & blended ROAS analytics
│       │   ├── BankView.jsx            # Treasury credit/debit register & continuous running balance
│       │   ├── AnalyticsView.jsx       # Daily sales & ad spend tables with gross margin trends
│       │   ├── AuditView.jsx           # Live regulatory event trail with category filtering & CSV export
│       │   ├── StatusView.jsx          # Live System Health Dashboard with subsystem probe cards
│       │   └── TasksView.jsx           # Interactive 38/38 verified tasks & delivery checklist
│       ├── modals/                     # Fast Data-Entry & QC Modals
│       │   ├── EditModals.jsx          # 6 contextual edit modals (Sales, RTO, Returns, Exchanges, Ads, Bank)
│       │   └── GlobalRecordSaleModal.jsx # Quick order dispatcher with live stock & markup preview
│       ├── services/
│       │   └── api.js                  # Unified Axios/Fetch API client for all backend endpoints
│       └── utils/                      # Utilities & Operational Knowledge Base
│           ├── exportUtils.js          # SheetJS client-side master Excel workbook generation
│           ├── formatters.js           # Currency, numbers, and percentage formatting helpers
│           ├── tourSteps.js            # 11-stage master tour definitions & operational knowledge base
│           └── useTableControls.js     # Custom React hook managing multi-column filter sets, sorting & value counts
│
├── data/                               # Standardized 3NF Flat CSV Ledgers & SQLite DB (Auto-synchronized)
│   ├── app.db                          # Core SQLite relational database (WAL journal mode)
│   ├── procurement_batches.csv
│   ├── sales_orders.csv
│   ├── rto_pipeline.csv
│   ├── customer_returns.csv
│   ├── item_exchanges.csv
│   ├── ad_spends.csv
│   └── bank_transactions.csv
│
└── deploy/                             # Production Deployment Runbooks & Utilities
    ├── bin/
    │   ├── cloudflared.exe             # Portable Cloudflare Zero-Trust Tunnel executable
    │   └── ngrok.exe                   # Portable Ngrok tunnel executable for permanent URL
    ├── run_dev.bat                     # 1-click Windows native launch script
    ├── run_dev.sh                      # 1-click Linux/macOS native launch script
    ├── run_with_fixed_url.bat          # 1-click startup for server + permanent fixed Ngrok URL
    ├── run_with_tunnel.bat             # 1-click startup for server + Cloudflare quick tunnel
    ├── run_ngrok.bat                   # Dedicated Ngrok tunnel process runner
    ├── run_tunnel.bat                  # Dedicated Cloudflare tunnel process runner
    ├── backup_data.py                  # Automated SQLite Online Backup & zip retention pruner
    ├── render.yaml                     # Render.com Blueprint configuration
    ├── deploy_render.md                # Step-by-step guide for Render deployment
    ├── deploy_railway.md               # Step-by-step guide for Railway deployment
    ├── deploy_vps.md                   # VPS guide with systemd and Caddy HTTPS
    ├── Caddyfile                       # Automatic SSL reverse proxy configuration
    └── enterprise-ops.service          # Linux systemd daemon service definition
```

---

## 🚀 Installation, Setup & How to Run

### Prerequisites

* **Python**: `3.11`, `3.12`, `3.13`, or `3.14`
* **Node.js**: `v18.0.0` or higher & `npm` (for building the frontend)
* **Operating System**: Windows 10/11, macOS, or Linux

---

### Method 1: Native Local Runner (Quickstart)

The simplest way to start the system locally on your workstation:

#### On Windows:

Double-click [`deploy/run_dev.bat`](<file:///d:/Business%20Website/deploy/run_dev.bat>) or run in PowerShell / Command Prompt:

```bat
deploy\run_dev.bat
```

#### On Linux / macOS:

```bash
chmod +x deploy/run_dev.sh
./deploy/run_dev.sh
```

This script will automatically:

1. Activate your Python virtual environment (`.venv`).
2. Run database initialization and verify seed data (`backend.app.db.init_db`).
3. Start the production FastAPI application on `http://127.0.0.1:8000`.
4. Serve the compiled React web application, REST API, and System Status page.

---

### Method 2: Developer Mode (Hot-Reloading)

If you are developing features and want instant hot-reloading for both backend and frontend:

#### Terminal 1 — Start Backend Server:

```bash
# 1. Create and activate virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Start FastAPI server with live auto-reload
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

* Backend API is live at: `http://127.0.0.1:8000`
* Interactive API Documentation: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Start Frontend Dev Server:

```bash
cd frontend
npm install
npm run dev
```

* Frontend Hot-Reload HUD is live at: `http://localhost:5173`

---

### Method 3: Multi-Stage Production Docker

Deploy as a standalone, self-healing Docker container with persistent volumes:

```bash
# 1. Build and run container in detached mode
docker compose up -d --build

# 2. View container logs
docker compose logs -f

# 3. Stop container
docker compose down
```

The container automatically:

* Compiles the React frontend using a Node 20 Alpine builder.
* Bundles static assets into a slim Python 3.11 production container.
* Mounts `./data` to `/app/data` to ensure **zero data loss** across container restarts.
* Exposes the complete platform on `http://localhost:8000`.

---

### Method 4: Permanent Fixed URL via Ngrok (24/7 Smartphone Access)

> [!TIP]
> **Permanent Public Address — Never Changes!**
> Launches the backend and immediately binds to your reserved permanent URL without exposing open router ports or requiring paid cloud hosting.

* **On Windows**: Simply double-click [`deploy/run_with_fixed_url.bat`](<file:///d:/Business%20Website/deploy/run_with_fixed_url.bat>) or run in terminal:
  ```bat
  deploy\run_with_fixed_url.bat
  ```
* Your permanent address is:  
  👉 **`https://blurred-submerge-underuse.ngrok-free.dev`**
* You can also run the dedicated Ngrok tunnel process independently via [`deploy/run_ngrok.bat`](<file:///d:/Business%20Website/deploy/run_ngrok.bat>).

---

### Method 5: Zero-Cost 24/7 Cloudflare Tunnel (Remote Mobile Phone)

> [!TIP]
> **Zero-Registration Quick Tunnel!**
> Access your platform on your smartphone from anywhere in the world using the included, pre-configured portable Cloudflare Tunnel without needing to register an account.

* **On Windows**: Double-click [`deploy/run_with_tunnel.bat`](<file:///d:/Business%20Website/deploy/run_with_tunnel.bat>) or run:
  ```bash
  # Start the live encrypted public HTTPS tunnel:
  deploy\bin\cloudflared.exe tunnel --url http://127.0.0.1:8000
  ```

Cloudflare will output a temporary live HTTPS URL (for example, `https://xxxx.trycloudflare.com`). Open that URL on any mobile phone browser to monitor inventory, dispatch sales, inspect returns, or check system health.

---

### Method 6: Cloud Hosting (Render / Railway / VPS)

For full deployment runbooks on cloud providers, refer to the guides in [`deploy/`](<file:///d:/Business%20Website/deploy>):

* **Render.com**: Follow [`deploy/deploy_render.md`](<file:///d:/Business%20Website/deploy/deploy_render.md>) (uses included `render.yaml`).
* **Railway.app**: Follow [`deploy/deploy_railway.md`](<file:///d:/Business%20Website/deploy/deploy_railway.md>).
* **Linux VPS (Ubuntu / Debian)**: Follow [`deploy/deploy_vps.md`](<file:///d:/Business%20Website/deploy/deploy_vps.md>) (includes pre-configured `enterprise-ops.service` and `Caddyfile` for automated HTTPS).

---

## 🛡️ System Health Diagnostics & Endpoints Reference

The platform provides a dedicated health check and diagnostic system accessible via browser and API:

| URL Endpoint | Method | Format | Permanent Fixed URL (Ngrok) | Localhost Clickable URL | Purpose |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **`/status`** | `GET` | HTML | [https://blurred-submerge-underuse.ngrok-free.dev/status](https://blurred-submerge-underuse.ngrok-free.dev/status) | [`http://localhost:8000/status`](http://localhost:8000/status) | **Dedicated Visual Status Dashboard**: Dark-mode telemetry monitor displaying real-time health across all 6 core subsystems. |
| **`/api/status`** | `GET` | JSON | [https://blurred-submerge-underuse.ngrok-free.dev/api/status](https://blurred-submerge-underuse.ngrok-free.dev/api/status) | [`http://localhost:8000/api/status`](http://localhost:8000/api/status) | **Raw JSON Diagnostics API**: Returns full telemetry data, memory stats, ping latencies, and table counts for monitoring tools. |
| **`/?tab=status`** | `GET` | React | [https://blurred-submerge-underuse.ngrok-free.dev/?tab=status](https://blurred-submerge-underuse.ngrok-free.dev/?tab=status) | [`http://localhost:8000/?tab=status`](http://localhost:8000/?tab=status) | **Integrated In-App HUD View**: Accessible directly via the sidebar under *Core Intelligence ➔ System Health & Checks*. |
| **`/health`** | `GET` | JSON | [https://blurred-submerge-underuse.ngrok-free.dev/health](https://blurred-submerge-underuse.ngrok-free.dev/health) | [`http://localhost:8000/health`](http://localhost:8000/health) | **Lightweight Liveness Probe**: Used by Docker, Kubernetes, and uptime checkers. |
| **`/docs`** | `GET` | HTML | [https://blurred-submerge-underuse.ngrok-free.dev/docs](https://blurred-submerge-underuse.ngrok-free.dev/docs) | [`http://localhost:8000/docs`](http://localhost:8000/docs) | **Interactive OpenAPI (Swagger) UI**: Full interactive API sandbox to test every endpoint. |

### Diagnostic Telemetry Output Example (`/api/status`):

```json
{
  "overall_status": "HEALTHY",
  "checks_passed": 6,
  "total_checks": 6,
  "diagnostic_latency_ms": 18.5,
  "api_service": {
    "status": "PASS",
    "service_name": "Divine Enterprise ERP Engine",
    "version": "2.4.0",
    "uptime_human": "2h 45m 12s",
    "memory_rss_mb": 54.2,
    "process_id": 36384,
    "python_version": "3.14.2"
  },
  "database": {
    "status": "PASS",
    "ping_latency_ms": 1.2,
    "file_size": "144.0 KB",
    "total_records": 178,
    "tables": {
      "procurement_batches": 43,
      "sales_orders": 66,
      "rto_pipeline": 10,
      "customer_returns": 5,
      "item_exchanges": 1,
      "ad_spends": 28,
      "bank_transactions": 11,
      "activity_audit_logs": 14
    }
  },
  "excel_workbooks": {
    "status": "PASS",
    "sales_inventory_workbook": { "exists": true, "sheet_count": 9 },
    "logistic_workbook": { "exists": true, "sheet_count": 2 }
  },
  "financial_engine": {
    "status": "PASS",
    "gross_profit_identity": { "verified": true },
    "bank_ledger_continuity": { "verified": true }
  },
  "quarantine_shield": {
    "status": "PASS",
    "total_quarantined_units": 16
  }
}
```

---

## 🛠️ Management, Operations & Disaster Recovery

### Daily Operational Routine

1. **Morning Intake**:
   * Record new factory deliveries in the **Procurement & POs** tab to inject stock and calculate WAC.
2. **Fulfillment**:
   * Click **Fast Record Sale** (or press `Alt + S`) to dispatch orders. Live stock balances and margins update instantaneously.
3. **Midday Reverse Logistics Check**:
   * Open **Courier RTO Dock** and **Customer Returns**. Scan delivered parcels, click **Received**, perform QC inspection, and either restock or record damage write-offs.
4. **Evening Financial Balancing**:
   * Log daily ad spend across channels in **Marketing & ROAS**.
   * Reconcile bank transactions in **Bank Treasury** to confirm cash ledger parity.
   * Check **System Health & Checks** (`/status`) to confirm all 6 diagnostic probes pass.

### Automated Backup & Disaster Recovery

A dedicated backup utility is included in [`deploy/backup_data.py`](<file:///d:/Business%20Website/deploy/backup_data.py>). It uses the **SQLite Online Backup API** to capture a hot snapshot without locking database writes:

```bash
# Run manual backup:
python deploy/backup_data.py
```

* Creates timestamped, zip-compressed archives in `data/backups/` (`enterprise_backup_YYYYMMDD_HHMMSS.zip`).
* Archives the complete SQLite database (`app.db`) and all 7 flat CSV ledgers in `data/`.
* Automatically prunes snapshots older than 30 days (`MAX_BACKUPS_TO_KEEP = 30`) to optimize disk space.

---

## 🧪 Testing, Verification & Quality Assurance

The codebase includes an automated test suite verifying mathematical precision, API route contracts, and Excel synchronization consistency:

```bash
# Run the complete test suite with pytest:
pytest backend/tests/ -v
```

### Verified Test Results:

* `backend/tests/test_api_routes.py`: Verifies CRUD, stock deduction, and status transitions across all 11 API routers.
* `backend/tests/test_excel_sync.py`: Verifies that SQLite entity states match Excel workbooks and 3NF CSV files with zero missing rows.
* `backend/tests/test_financial_engine.py`: Verifies zero-drift mathematical accuracy across all 23 core financial formulas.

```text
============================= test session starts =============================
platform win32 -- Python 3.14.2, pytest-9.1.1, pluggy-1.6.0
collected 18 items

backend/tests/test_api_routes.py ..........                              [ 55%]
backend/tests/test_excel_sync.py ...                                     [ 72%]
backend/tests/test_financial_engine.py .....                             [100%]

======================= 18 passed in 4.65s ====================================
```

---

## 📜 License & Enterprise Attribution

**Divine Enterprise ERP & Financial Intelligence Platform**
Copyright © 2024–2026 Divine Enterprise. All rights reserved.
Engineered for ultra-reliable, zero-drift multi-channel retail operations.
