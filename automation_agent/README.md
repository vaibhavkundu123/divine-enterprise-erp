# 🤖 Divine Enterprise ERP — Automation Agent & Form Filler

Welcome to the **Divine Enterprise ERP Automation Agent**! This automated agent was created inside `automation_agent/` to automatically fill forms, ingest bulk data, and run operations on your ERP platform without modifying or risking any existing files in the project.

---

## ⚡ Quick Summary: How You Can Give Information to the Agent

You have **4 simple ways** to provide information or command the agent to fill forms:

### Method 1: Just Tell Me in Plain English (Chat Mode)
You can directly chat with me and tell me what you want to record in plain English. For example:
> *"Record a sale of 2 units of DE26001G at $295.00 for today from Shopify."*  
> *"Add a procurement batch of 50 units of DE26030B at $205.00 cost rate."*  
> *"Customer returned 1 unit of DE26001G with refund $290.29 due to Size Too Small, tracking AWB-12345."*  
> *"Log Meta Ads spend of $1,500.00 for today."*  
> *"Record a bank credit of $50,000 for today."*

I will extract the details, validate them, perform margin/profit calculations, and automatically submit the form for you!

---

### Method 2: Drop CSV / Excel Files into `inputs/inbox/` (Bulk Auto-Ingestion)
1. Go to `automation_agent/inputs/templates/` and choose the template you need:
   - `sales_template.csv` — for sales orders
   - `procurement_template.csv` — for factory intake batches
   - `rto_template.csv` — for courier undelivered parcels
   - `returns_template.csv` — for customer returns
   - `exchanges_template.csv` — for item exchanges
   - `ads_template.csv` — for ad spends
   - `bank_template.csv` — for bank transactions
2. Paste your data into the CSV file and drop it into **`automation_agent/inputs/inbox/`**.
3. Run:
   ```powershell
   .\.venv\Scripts\python.exe automation_agent\agent_cli.py inbox
   ```
   The agent automatically reads all files in `inbox/`, validates every row, submits each form, renames completed files to `.done`, and logs the results in `logs/`!

---

### Method 3: Use the Step-by-Step Interactive Wizard (CLI)
If you like interactive prompts, run:
```powershell
.\.venv\Scripts\python.exe automation_agent\agent_cli.py interactive
```
The agent presents a menu (Sales, Procurement, RTO, Returns, Exchanges, Ads, Bank, Sync) and prompts you for each field one by one, showing live margin previews before confirming!

---

### Method 4: 1-Line CLI Commands
For instant execution from PowerShell or terminal:
```powershell
# 1. Record a Sale
.\.venv\Scripts\python.exe automation_agent\agent_cli.py sale --style DE26001G --qty 2 --price 295.00 --ref "Shopify #1042"

# 2. Record Inward Procurement Batch
.\.venv\Scripts\python.exe automation_agent\agent_cli.py procurement --style DE26001G --units 25 --rate 219.00

# 3. Record Courier RTO (Undelivered)
.\.venv\Scripts\python.exe automation_agent\agent_cli.py rto --style DE26001G --price 290.00 --tracking "Valmo AWB-VL00852"

# 4. Record Customer Return
.\.venv\Scripts\python.exe automation_agent\agent_cli.py return --style DE26001G --refund 290.00 --reason "Size Too Small / Fit Issue" --awb "REV-123"

# 5. Record Item Exchange
.\.venv\Scripts\python.exe automation_agent\agent_cli.py exchange --orig DE26001G --new DE26001P --price 290.00

# 6. Record Marketing Ad Spend
.\.venv\Scripts\python.exe automation_agent\agent_cli.py ad --platform "Meta Ads" --amount 1500.00 --notes "Advantage+ Shopping"

# 7. Record Bank Credit / Debit
.\.venv\Scripts\python.exe automation_agent\agent_cli.py bank --type Credit --amount 50000.00

# 8. Check ERP Health Status
.\.venv\Scripts\python.exe automation_agent\agent_cli.py status

# 9. Trigger Master Excel & CSV Sync
.\.venv\Scripts\python.exe automation_agent\agent_cli.py sync
```

---

## 📌 Where to Take Information From (Data Sources)

Here is a simple cheat sheet on where to find the data required for each form:

| Form | Real-World Source | What to Extract |
| :--- | :--- | :--- |
| **Sales Orders** | Shopify, WooCommerce, Amazon, WhatsApp order receipts | • Order Date (`date`)<br>• Product SKU (`style_no`, e.g. `DE26001G`)<br>• Quantity (`quantity_sold`)<br>• Selling Price (`selling_price` or `total_revenue`)<br>• Order ID (`reference`) |
| **Procurement Batches** | Factory delivery receipts, Vendor packing slips | • Delivery Date (`date`)<br>• Garment Style Code (`style_no`)<br>• Total Inward Units (`inventory`)<br>• Unit Cost Price (`purchase_rate`) |
| **Courier RTO** | Courier manifest / portal (Delhivery, Valmo, Shadowfax) | • Incident Date (`date`)<br>• Undelivered SKU (`style_no`)<br>• Original Sale Value (`sale_price`)<br>• Courier AWB Number (`tracking_no`) |
| **Customer Returns** | Return requests / WhatsApp customer service chats | • Request Date (`date`)<br>• Returned SKU (`style_no`)<br>• Refund Given (`refund_amount`)<br>• Return Reason (`primary_reason`)<br>• Reverse Tracking (`reverse_awb`) |
| **Item Exchanges** | Customer support exchange requests | • Date (`date`)<br>• Returned SKU (`original_style`)<br>• Replacement SKU (`exchanged_style`)<br>• Price of replacement (`standard_price`) |
| **Marketing Ads** | Meta Ads Manager, Google Ads, TikTok Ads dashboard | • Spend Date (`date`)<br>• Platform name (`platform`)<br>• Daily spend (`amount`) |
| **Bank Treasury** | Bank statement / Online banking transactions | • Transaction Date (`date`)<br>• Credit (Inflow) or Debit (Outflow) (`type`)<br>• Monetary Amount (`amount`) |

---

## 📂 Folder Contents in `automation_agent/`

```
automation_agent/
├── AGENTS.md                  # Master rules, safety guardrails & form specifications
├── agents.md                  # Reference link to AGENTS.md
├── README.md                  # User guide (this file)
├── config.py                  # API endpoints, URLs, timeouts, and paths
├── schemas.py                 # Pydantic data schemas validating inputs before submission
├── form_filler.py             # Core Python automation engine (handles all 7 form workflows)
├── agent_cli.py               # CLI tool & interactive form wizard
├── browser_automator.py       # Visual browser automation script (Playwright)
├── inputs/                    # Data intake folder
│   ├── inbox/                 # Drop CSV or JSON files here for auto-ingestion
│   ├── templates/             # 7 ready-to-use CSV templates with sample data
│   │   ├── sales_template.csv
│   │   ├── procurement_template.csv
│   │   ├── rto_template.csv
│   │   ├── returns_template.csv
│   │   ├── exchanges_template.csv
│   │   ├── ads_template.csv
│   │   └── bank_template.csv
│   └── samples/               # Sample JSON files for API automation
│       └── sample_sales.json
└── logs/                      # Activity logs showing timestamped submissions & errors
```

---

## 🛡️ Safety Guarantee
- **No Overwriting**: All existing files in `backend/`, `frontend/`, `data/`, and root are untouched.
- **Zero-Drift Sync**: Whenever the agent fills a form, the ERP automatically commits to SQLite and updates `Sales_Inventory.xlsx`, `Logistic.xlsx`, and flat CSVs in `data/`.
