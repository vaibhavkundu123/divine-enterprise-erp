# AGENTS.md — Divine Enterprise ERP Autonomous Operations & Form Agent

> **System**: Divine Enterprise ERP & Financial Intelligence Platform  
> **Role**: Autonomous Form Automation, Batch Data Ingestion & Ledger Operations  
> **Workspace Scope**: Strictly contained within the `automation_agent/` directory.

---

## 1. 🛡️ Cardinal Safety Guardrails & Principles

1. **Strict File Isolation**:
   - The agent MUST NEVER modify, overwrite, delete, or reformat any existing source code, configuration, or data outside the `automation_agent/` folder (such as `backend/`, `frontend/`, `data/`, `deploy/`, `Dockerfile`, etc.).
   - All agent logic, CLI tools, scrapers, schemas, templates, logs, and temporary states must reside strictly inside `automation_agent/`.

2. **Quarantine-First Reverse Logistics Principle**:
   - Returned items (Courier RTO or Customer Returns) **must NEVER be directly added to sellable stock upon intake**.
   - They MUST always enter the designated staging buffer (`status: "In Transit"` or `"Received"`).
   - Only physical QC grading or warehouse dock restock triggers can transfer quarantined units into active sellable inventory (`"Restocked"`).

3. **Zero-Drift Financial Precision**:
   - All monetary calculations must adhere to the ERP's mathematical specifications:
     $$\text{Selling Price} \times \text{Quantity} = \text{Revenue}$$
     $$\text{COGS} = \text{Quantity} \times \text{Unit Cost}$$
     $$\text{Gross Profit} = \text{Revenue} - \text{COGS}$$
   - When entering sales orders, provide either `selling_price` OR `total_revenue`. The engine computes the dual value with zero penny rounding error.

4. **Schema Validation Prior to Submission**:
   - Every transaction payload must be validated against `schemas.py` and backend Pydantic models before submission.
   - Inward dates must follow `YYYY-MM-DD` ISO-8601 format. Quantities must be $\ge 1$. Prices must be positive numbers.

5. **Audit Logging Requirement**:
   - Every automated action must log to `automation_agent/logs/` with timestamp, status, payload summary, and error trace if any.

---

## 2. 📋 Form Specifications & Field Matrix

The Divine Enterprise ERP platform contains 7 distinct data-entry forms. Below is the precise operational schema for each form:

### Form 1: Sales Order Form
* **UI Location**: Global Top Bar `[+ Record Sale]` Button, `SalesView.jsx`, or API `POST /api/sales`
* **Purpose**: Fulfill dispatched customer orders, deduct sellable inventory, record revenue & COGS.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Dispatch date (`YYYY-MM-DD`). Defaults to today. |
  | `style_no` | String | Yes | Product SKU (e.g. `DE26001G`, `DE26003W`, `DE26030B`). Must be uppercase. |
  | `quantity_sold` | Integer | Yes | Units sold ($\ge 1$). Default: `1`. |
  | `selling_price` | Float | Conditional | Unit retail price. (Required if `total_revenue` is omitted). |
  | `total_revenue` | Float | Conditional | Total order amount. (Required if `selling_price` is omitted). |
  | `reference` | String | No | Channel or order tag (e.g. `Shopify #1042`, `WhatsApp`, `Website`). |
* **Behavior**:
  - Validates available stock.
  - Automatically fetches Weighted Average Cost (WAC) to compute COGS.
  - Generates Gross Profit & Profit Margin.
  - Triggers non-blocking Excel (`Sales_Inventory.xlsx`) and CSV (`data/sales_orders.csv`) background sync.

---

### Form 2: Procurement Inward Batch Form
* **UI Location**: `ProcurementView.jsx` or API `POST /api/procurement`
* **Purpose**: Record incoming merchandise from factories/vendors, restock inventory, and update WAC cost basis.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Inward receipt date (`YYYY-MM-DD`). |
  | `style_no` | String | Yes | Product SKU received from factory. |
  | `inventory` | Integer | Yes | Inward unit quantity received ($\ge 1$). |
  | `purchase_rate` | Float | Yes | Factory cost price per unit ($> 0$). |
  | `total_value` | Float | No | Auto-calculated as `inventory * purchase_rate`. |
* **Behavior**:
  - Immediately increases usable stock on hand.
  - Recomputes Weighted Average Cost (WAC):  
    $$\text{WAC} = \frac{\sum (\text{Units}_i \times \text{Rate}_i)}{\sum \text{Units}_i}$$
  - Asynchronously syncs `Logistic.xlsx` and `data/procurement_batches.csv`.

---

### Form 3: Courier RTO (Return to Origin) Pipeline Form
* **UI Location**: `RTOView.jsx` or API `POST /api/rto`
* **Purpose**: Log failed deliveries / refused COD parcels from couriers (Delhivery, Valmo, Shadowfax).
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Incident/courier notification date (`YYYY-MM-DD`). |
  | `style_no` | String | Yes | SKU of returned item. |
  | `quantity` | Integer | Yes | Units in parcel (default: `1`). |
  | `sale_price` | Float | Yes | Original invoice selling price of the item. |
  | `courier_fee` | Float | No | Return shipping penalty charged by courier (default `0.0`). |
  | `tracking_no` | String | Yes | Courier AWB tracking number (e.g. `Valmo AWB-VL008521...`). |
  | `status` | String | No | Initial status: `"In Transit"` (Default). |
  | `notes` | String | No | Courier remarks or notes. |
* **Quarantine Pipeline Actions**:
  - Stage 1: `POST /api/rto` (In Transit — active stock is **untouched**).
  - Stage 2: `POST /api/rto/{id}/receive` (Mark arrived at dock — enters quarantine buffer).
  - Stage 3a: `POST /api/rto/{id}/restock` (Restocked — intact item restored to usable stock).
  - Stage 3b: `POST /api/rto/{id}/damage` (Damage/Lost — written off as scrap loss).
  - Bulk Action: `POST /api/rto/bulk-restock` (Restocks all dock-received parcels).

---

### Form 4: Customer Returns & QC Hub Form
* **UI Location**: `ReturnsView.jsx` or API `POST /api/customer-returns`
* **Purpose**: Process customer-initiated returns with reasons and physical QC grading.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Return request date (`YYYY-MM-DD`). |
  | `style_no` | String | Yes | Product SKU returned. |
  | `quantity` | Integer | Yes | Units returned (default: `1`). |
  | `refund_amount` | Float | Yes | Money refunded to the customer ($\ge 0$). |
  | `reverse_fee` | Float | No | Reverse logistics courier charge (default: `175.0`). |
  | `primary_reason` | String | Yes | Choose from: `"Size Too Small / Fit Issue"`, `"Fabric Quality / Color"`, `"Defective / Stitching"`, `"Wrong Item Sent"`, `"Changed Mind"`. |
  | `secondary_reason`| String | No | Customer's specific remarks. |
  | `reverse_awb` | String | No | Reverse pickup tracking code. |
  | `qc_grade` | String | No | `"Grade A"` (Pristine), `"Grade B"` (Minor box damage), `"Damaged"`. |
* **QC Operations**:
  - `POST /api/customer-returns/{id}/qc?grade=Grade A` -> sets physical grade.
  - `POST /api/customer-returns/{id}/restock` -> restores to sellable inventory.

---

### Form 5: Item Exchanges Form
* **UI Location**: `ExchangesView.jsx` or API `POST /api/exchanges`
* **Purpose**: Two-legged size/color replacement transactions.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Exchange date (`YYYY-MM-DD`). |
  | `original_style` | String | Yes | Inward SKU being returned by customer. |
  | `exchanged_style`| String | Yes | Outward replacement SKU dispatched to customer. |
  | `quantity` | Integer | Yes | Quantity exchanged (default: `1`). |
  | `standard_price` | Float | Yes | Catalog retail price of replacement item. |
  | `reverse_fee` | Float | No | Exchange courier fee (default `175.0`). |
  | `reverse_awb` | String | No | Return shipment tracking code. |
* **Behavior**:
  - Deducts `exchanged_style` immediately from active sellable inventory.
  - Places `original_style` into quarantine staging until verified.

---

### Form 6: Marketing Ad Spend Form
* **UI Location**: `AdsView.jsx` or API `POST /api/ads`
* **Purpose**: Record advertising expenditures to compute blended ROAS and ad efficiency tiers.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Date of ad expenditure (`YYYY-MM-DD`). |
  | `platform` | String | Yes | Channel: `"Meta Ads"`, `"Google Ads"`, `"TikTok Ads"`, `"Influencer"`, `"Other"`. |
  | `amount` | Float | Yes | Monetary spend amount ($> 0$). |
  | `notes` | String | No | Campaign name or objective notes. |

---

### Form 7: Bank Treasury Register Form
* **UI Location**: `BankView.jsx` or API `POST /api/bank`
* **Purpose**: Maintain reconciled ledger with continuous running bank balance.
* **Fields**:
  | Field Name | Type | Mandatory? | Description / Allowed Values |
  | :--- | :---: | :---: | :--- |
  | `date` | String | Yes | Transaction date (`YYYY-MM-DD`). |
  | `type` | String | Yes | `"Credit"` (+) for inflows or `"Debit"` (-) for outflows. |
  | `amount` | Float | Yes | Positive monetary amount. |

---

## 3. 🤖 How the Agent Ingests Information & Executes

The agent supports 5 flexible interaction channels:

```
[ User Data Source ]
   │
   ├─► 1. Natural Language Prompt in Chat
   │      e.g. "Record sale of 2 units of DE26001G at $295 today"
   │      ──► Agent parses, previews margin, and executes API call
   │
   ├─► 2. File Drop-in to 'automation_agent/inputs/inbox/'
   │      e.g. Drop 'sales_today.csv' or 'batch_intake.json'
   │      ──► Run 'python agent_cli.py inbox' to auto-ingest all files
   │
   ├─► 3. Single Command Execution
   │      e.g. 'python agent_cli.py sale --style DE26001G --qty 2 --price 295.00'
   │
   ├─► 4. Interactive Step-by-Step Wizard
   │      e.g. 'python agent_cli.py interactive' (Guides user through every prompt)
   │
   └─► 5. Visual Browser Automation
          e.g. 'python browser_automator.py --action sale --style DE26001G'
```

---

## 4. 📂 Where to Take Information From

When the user wants to populate ERP forms from external sources, use this mapping:

1. **Shopify / E-Commerce Orders**:
   - Extract: `Order Date` ➔ `date`, `Lineitem SKU` ➔ `style_no`, `Quantity` ➔ `quantity_sold`, `Price` ➔ `selling_price`, `Order Name` ➔ `reference`.
2. **Courier Portals (Delhivery / Valmo / Shadowfax / Shiprocket)**:
   - For undelivered parcels: Extract `AWB` ➔ `tracking_no`, `Product SKU` ➔ `style_no`, `Invoice Value` ➔ `sale_price`, `Status: RTO` ➔ RTO Form.
3. **Factory Purchase Invoices**:
   - Extract: `Invoice Date` ➔ `date`, `Garment Style / Model` ➔ `style_no`, `Pieces Produced` ➔ `inventory`, `Unit Manufacturing Cost` ➔ `purchase_rate`.
4. **Ad Manager Dashboards (Meta Ads / Google Ads)**:
   - Extract: `Day` ➔ `date`, `Campaign Platform` ➔ `platform`, `Amount Spent` ➔ `amount`.
5. **Bank Account Statements**:
   - Extract: `Value Date` ➔ `date`, `Credit/Debit Indicator` ➔ `type`, `Transaction Amount` ➔ `amount`.

---

## 5. 🛠️ Execution & Diagnostics Commands

- **Check System Health**:
  ```powershell
  .\.venv\Scripts\python.exe automation_agent\agent_cli.py status
  ```
- **Run Interactive Agent**:
  ```powershell
  .\.venv\Scripts\python.exe automation_agent\agent_cli.py interactive
  ```
- **Process Inbox Drop-Ins**:
  ```powershell
  .\.venv\Scripts\python.exe automation_agent\agent_cli.py inbox
  ```
- **Trigger Master Excel Sync**:
  ```powershell
  .\.venv\Scripts\python.exe automation_agent\agent_cli.py sync
  ```
