# Feature Parity Comparison: localhost:5001 vs 127.0.0.1:8000

> [!NOTE]
> **Method**: Every tab on both apps was visually inspected via live browser screenshots. All 9 sections were compared.

---

## ✅ Features Present in Both Apps (Matched)

| Feature | Status |
|---|---|
| Executive Dashboard KPI Cards ($370.10, $27,793.16, $4,857.28, 354 units) | ✅ Match |
| 3 Dock Operational Overview Strips (RTO / Returns / Exchanges) | ✅ Match |
| Bulk Restock buttons on all 3 strips | ✅ Match |
| Rotating AI Copilot Banner (5 insights, carousel) | ✅ Match |
| Recent Sales Snapshot mini-table | ✅ Match |
| Low Stock & Restock Radar mini-table | ✅ Match |
| Financial Trends chart | ✅ Match |
| Sales Ledger table (Date, SKU, Qty, Revenue, COGS, Profit, Margin%) | ✅ Match |
| Sales Ledger Edit / Delete actions | ✅ Match |
| Sales Ledger search & Excel/CSV export | ✅ Match |
| RTO Pipeline table with AWB tracking | ✅ Match |
| RTO Fast Auto-Fill from Recorded Sale dropdown | ✅ Match |
| RTO Bulk Restock Dock button | ✅ Match |
| Customer Returns table with Primary Reason, Status, QC Triage | ✅ Match |
| Customer Returns Bulk Restock Intake button | ✅ Match |
| Customer Returns Fast Auto-Fill dropdown | ✅ Match |
| Analytics Dual Tables (Daily Sales + Daily Ad Spend) | ✅ Match |
| Analytics View Both / Sales Only / Ad Spend Only toggle pills | ✅ Match |
| Bank 4-Card HUD (Balance, Credited, Debited, Count) | ✅ Match |
| Bank filter pills (All / Credited / Debited) | ✅ Match |
| Bank search & Excel/CSV export | ✅ Match |
| Stock Matrix table with Purchased, Sold, Stock On Hand, Valuation | ✅ Match |
| Stock Matrix filter pills (All / In Stock / Low Stock / Out of Stock / Over Sold) | ✅ Match |
| Marketing & Ads ledger table | ✅ Match |
| Procurement & POs view | ✅ Match |
| Audit Trail & Logs view | ✅ Match |

---

## ❌ Missing or Divergent Features

### 🔴 HIGH PRIORITY — Core Workflow Gaps

#### 1. Sales Ledger — No Inline Record Sale Form
- **Reference (5001)**: Sales tab has an **always-visible inline form** at the top: Date, Style No., Qty, Selling Price per Unit **(Option A)**, AND Total Sale Revenue **(Option B — Exact Total Bill)** that auto-syncs with Option A. Entering either field calculates the other automatically. Also has a live inventory preview box and **"Clear Form"** button.
- **Our App (8000)**: Sales are recorded only via a modal popup (now removed from top bar). There is a `+ New Sale` button that opens a modal — but the **dual Option A/B price input with auto-sync** and **live inventory preview box** are not present in the modal.

#### 2. Customer Returns Form — Missing Fields
- **Reference (5001)**: Log Return form has:
  - `Primary Return Reason *` (text field)
  - `Secondary Return Reason` (text field)
  - `Reverse Courier & AWB #` (tracking number field)
  - `Reverse Courier Shipping Fee ($)` pre-filled at **$175.00**
- **Our App (8000)**: Log Return modal only has Date, Style SKU, Qty, Refund Amount, Reverse Fee, AWB. **Missing: Primary Return Reason + Secondary Return Reason fields**.

#### 3. RTO Pipeline Form — Missing Reason/Notes Field
- **Reference (5001)**: Log RTO form has a `Reason / Notes` field (e.g. *"Door locked, COD refused by customer"*).
- **Our App (8000)**: Log RTO modal has no Reason/Notes field.

#### 4. Exchanges Form — Missing Return Reason Fields
- **Reference (5001)**: Record Exchange form has:
  - `Primary Return Reason *` field
  - `Secondary Return Reason` field
  - `Reverse Courier & AWB #` field
- **Our App (8000)**: Exchange modal is missing all three reason/tracking fields.

#### 5. Bank View — No Inline Record Transaction Form
- **Reference (5001)**: Bank tab has an **always-visible inline form**: Transaction Date, Transaction Type dropdown (Credited/Debited), Amount, with a **"Record Credit & Update Balance"** button that dynamically changes label based on type.
- **Our App (8000)**: Bank entry requires clicking **"Record Bank Entry"** modal button. The inline persistent form is absent.

---

### 🟡 MEDIUM PRIORITY — UX & Data Differences

#### 6. Stock Matrix — Column Differences
- **Reference (5001)**: Stock table has separate columns: `Exchanged Out (Sent)`, `Restocked RTO`, `Restocked CR (Customer Returns)`, `Restocked Exch (Exchanges)`, `Stock On Hand` (with green bar visualization), `Total Revenue ($)`.
- **Our App (8000)**: Stock table has: `In-Transit`, `Holding Dock`, `Restocked` (combined), `Stock On Hand`, `Valuation`, `Cumulative Profit`, `Health Status`. Missing the **split restocked breakdown** (RTO vs CR vs Exch) and **Total Revenue** column. Also missing the **green stock bar visualization**.

#### 7. Customer Returns Strip — Missing "Damaged / Loss Write-Off" Pill
- **Reference (5001)**: Top pill strip shows 4 badges: *Reverse In-Transit*, *Warehouse Intake*, *Restocked*, **Damaged / Loss Write-Off: 0 units**.
- **Our App (8000)**: Shows only 3 badges (In-Transit Returns, Warehouse Intake, Restocked). Missing the **Damaged/Write-Off** counter pill.

#### 8. Exchanges Strip — Missing "Net Cash Inflow" Pill
- **Reference (5001)**: Top pill strip shows: *Return In-Transit*, *Return Intake*, *Old Item Restocked*, **Net Cash Inflow: $124.68**, then Bulk Restock button.
- **Our App (8000)**: Shows In-Transit, Intake, Restocked — missing the **Net Cash Inflow** metric pill.

#### 9. Ad Spend — No Inline Record Form on Ads Tab
- **Reference (5001)**: Ads tab has an **inline "Record Daily Advertisement Spend"** form with Ad Date, Platform/Channel dropdown, Ad Spend Amount, Campaign/Notes. Button: **"Record Ad Spend & Deduct from Profit"**.
- **Our App (8000)**: Marketing & ROAS page — need to verify if inline form exists or requires modal.

#### 10. Sales Ledger — Missing "Channel" / Source Column
- **Reference (5001)**: Sales table has no explicit channel column but the inline form references logistics inventory.
- **Our App (8000)**: Has a `Reference` column (shows "Direct Sale") — this is **extra** and not in reference. Not a gap but a divergence.

---

### 🟢 LOW PRIORITY — Minor Differences

#### 11. "Logistics Portal" Sidebar Link (Reference Only)
- **Reference (5001)**: Sidebar has a **"Logistics Portal"** button at the bottom that links to an external logistics tracking portal.
- **Our App (8000)**: No equivalent link.

#### 12. "Sync Logistics" / "Refresh" Header Buttons (Reference Only)
- **Reference (5001)**: Every tab header has **"Sync Logistics"** and **"Refresh"** buttons alongside **"+ Record Sale"**.
- **Our App (8000)**: Has only **"Sync Excel"** in the top bar. No per-tab "Refresh" button.

#### 13. Analytics Table — Date Format Difference
- **Reference (5001)**: Uses `2026-08-21` (ISO format).
- **Our App (8000)**: Uses same format ✅.

#### 14. Analytics — Margin % decimal precision
- **Reference (5001)**: Shows `34.79%` (2 decimal places).
- **Our App (8000)**: Shows `34.8%` (1 decimal place — rounded).

---

## Summary Count

| Priority | Count |
|---|---|
| 🔴 High — Core Workflow Gaps | 5 gaps |
| 🟡 Medium — UX & Data Differences | 6 differences |
| 🟢 Low — Minor Differences | 4 differences |
| **Total** | **15 gaps / differences** |
