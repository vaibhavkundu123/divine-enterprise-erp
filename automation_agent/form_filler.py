import csv
import json
import logging
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import httpx

from automation_agent.config import (
    API_BASE_URL,
    HEALTH_URL,
    INBOX_DIR,
    LOGS_DIR,
    MAX_RETRIES,
    PERMANENT_REMOTE_URL,
    REQUEST_TIMEOUT_SECONDS,
    RETRY_BACKOFF_FACTOR,
)
from automation_agent.schemas import (
    AdSpendInput,
    BankTransactionInput,
    CustomerReturnInput,
    ItemExchangeInput,
    ProcurementInput,
    RTOInput,
    SaleInput,
)

# Setup agent logger
log_file = LOGS_DIR / f"agent_activity_{datetime.now().strftime('%Y%m%d')}.log"
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
logger = logging.getLogger("DivineAgent")


class FormFiller:
    """Automated Form Processing Agent for Divine Enterprise ERP.

    Handles data validation, zero-drift calculation verification,
    and automated form submission across all ERP subsystems.
    """

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or API_BASE_URL).rstrip("/")
        self.client = httpx.Client(timeout=REQUEST_TIMEOUT_SECONDS)
        self._ensure_server_online()

    def _ensure_server_online(self) -> bool:
        """Verifies if the target ERP server is alive, falling back to remote if needed."""
        try:
            res = self.client.get(f"{self.base_url}/status")
            if res.status_code == 200:
                logger.info(f"Connected to Divine ERP backend at: {self.base_url}")
                return True
        except Exception:
            pass

        # Try health URL
        try:
            health_test = self.base_url.replace("/api", "/health")
            res = self.client.get(health_test)
            if res.status_code == 200:
                logger.info(f"Connected to Divine ERP health probe at: {health_test}")
                return True
        except Exception:
            pass

        # Test remote permanent Ngrok fallback
        try:
            res = self.client.get(f"{PERMANENT_REMOTE_URL}/status")
            if res.status_code == 200:
                logger.warning(
                    f"Local server unreachable. Falling back to permanent Ngrok: {PERMANENT_REMOTE_URL}"
                )
                self.base_url = PERMANENT_REMOTE_URL
                return True
        except Exception:
            pass

        logger.warning(
            f"ERP Backend is currently offline at {self.base_url}. "
            "Please start the server (e.g. deploy\\run_dev.bat) before submitting forms."
        )
        return False

    def check_health(self) -> Dict[str, Any]:
        """Queries the live system status and diagnostics."""
        url = f"{self.base_url}/status"
        try:
            res = self.client.get(url)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            logger.error(f"Health check failed on {url}: {e}")
            return {"status": "OFFLINE", "error": str(e)}

    def _post(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Internal HTTP POST helper with automatic retry logic."""
        url = f"{self.base_url}{endpoint}"
        last_error = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                res = self.client.post(url, json=payload)
                if res.status_code in (200, 201):
                    logger.info(f"SUCCESS [{endpoint}] -> Response: {res.status_code}")
                    return res.json()
                elif res.status_code == 400:
                    detail = res.json().get("detail", res.text)
                    logger.error(f"BAD REQUEST [{endpoint}]: {detail}")
                    raise ValueError(f"Form Validation Rejected: {detail}")
                else:
                    res.raise_for_status()
            except (httpx.ConnectError, httpx.TimeoutException) as e:
                last_error = e
                logger.warning(f"Attempt {attempt}/{MAX_RETRIES} failed connecting to {url}: {e}")
                time.sleep(RETRY_BACKOFF_FACTOR * attempt)
            except Exception as e:
                logger.error(f"Failed posting to {url}: {e}")
                raise e

        raise ConnectionError(f"Failed to communicate with {url} after {MAX_RETRIES} retries: {last_error}")

    # ==================================================================
    # 1. SALES ORDER FORM FILLER
    # ==================================================================
    def fill_sales_order(self, data: Union[Dict[str, Any], SaleInput]) -> Dict[str, Any]:
        """Validates and automatically submits a new Sales Order form."""
        if isinstance(data, dict):
            validated = SaleInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(
            f"Submitting Sales Order for SKU: {validated.style_no} (Qty: {validated.quantity_sold})"
        )
        result = self._post("/sales", payload)
        return result

    def preview_sale(self, style_no: str, quantity: int = 1, price: Optional[float] = None, revenue: Optional[float] = None) -> Dict[str, Any]:
        """Calculates live margin, gross profit, and stock availability before submitting."""
        payload = {
            "style_no": style_no.strip().upper(),
            "quantity_sold": quantity,
        }
        if price:
            payload["selling_price"] = price
        if revenue:
            payload["total_revenue"] = revenue
        return self._post("/sales/preview", payload)

    # ==================================================================
    # 2. PROCUREMENT INWARD BATCH FORM FILLER
    # ==================================================================
    def fill_procurement_batch(self, data: Union[Dict[str, Any], ProcurementInput]) -> Dict[str, Any]:
        """Validates and logs an inward manufacturing batch from factory."""
        if isinstance(data, dict):
            validated = ProcurementInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(
            f"Submitting Procurement Batch: {validated.style_no} (+{validated.inventory} units @ ${validated.purchase_rate})"
        )
        return self._post("/procurement", payload)

    # ==================================================================
    # 3. COURIER RTO PIPELINE FORM FILLER
    # ==================================================================
    def fill_rto_entry(self, data: Union[Dict[str, Any], RTOInput]) -> Dict[str, Any]:
        """Records a new courier undelivered RTO parcel."""
        if isinstance(data, dict):
            validated = RTOInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(f"Submitting RTO Pipeline Entry for SKU: {validated.style_no} (AWB: {validated.tracking_no})")
        return self._post("/rto", payload)

    def advance_rto_stage(self, rto_id: int, action: str) -> Dict[str, Any]:
        """Advances RTO through its 3-stage quarantine pipeline: 'receive', 'restock', 'damage'."""
        endpoint = f"/rto/{rto_id}/{action.lower()}"
        logger.info(f"Advancing RTO #{rto_id} -> Action: {action}")
        return self._post(endpoint, {})

    def bulk_restock_rto(self) -> Dict[str, Any]:
        """Restocks all verified received RTO parcels at the warehouse dock in bulk."""
        logger.info("Executing Bulk RTO Restock on dock holding buffer...")
        return self._post("/rto/bulk-restock", {})

    # ==================================================================
    # 4. CUSTOMER RETURNS & QC GRADING FORM FILLER
    # ==================================================================
    def fill_customer_return(self, data: Union[Dict[str, Any], CustomerReturnInput]) -> Dict[str, Any]:
        """Submits customer return intake with reason and courier tracking."""
        if isinstance(data, dict):
            validated = CustomerReturnInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(f"Submitting Customer Return for SKU: {validated.style_no} (Reason: {validated.primary_reason})")
        return self._post("/customer-returns", payload)

    def qc_grade_return(self, return_id: int, grade: str, notes: str = "") -> Dict[str, Any]:
        """Performs QC grading: 'Grade A' (pristine), 'Grade B' (discount), 'Damaged'."""
        url = f"{self.base_url}/customer-returns/{return_id}/qc?grade={grade}"
        if notes:
            url += f"&notes={notes}"
        logger.info(f"QC Grading Return #{return_id}: {grade}")
        res = self.client.post(url)
        res.raise_for_status()
        return res.json()

    def restock_customer_return(self, return_id: int) -> Dict[str, Any]:
        """Restocks an inspected customer return to sellable inventory."""
        return self._post(f"/customer-returns/{return_id}/restock", {})

    def bulk_restock_returns(self) -> Dict[str, Any]:
        """Restocks all Grade A customer returns at dock."""
        return self._post("/customer-returns/bulk-restock", {})

    # ==================================================================
    # 5. ITEM EXCHANGES FORM FILLER
    # ==================================================================
    def fill_item_exchange(self, data: Union[Dict[str, Any], ItemExchangeInput]) -> Dict[str, Any]:
        """Submits a two-legged item exchange (outward swap + inbound quarantine)."""
        if isinstance(data, dict):
            validated = ItemExchangeInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(
            f"Submitting Item Exchange: {validated.original_style} ➔ {validated.exchanged_style} (Qty: {validated.quantity})"
        )
        return self._post("/exchanges", payload)

    # ==================================================================
    # 6. MARKETING AD SPEND FORM FILLER
    # ==================================================================
    def fill_ad_spend(self, data: Union[Dict[str, Any], AdSpendInput]) -> Dict[str, Any]:
        """Logs daily advertising expenditures for ROAS tracking."""
        if isinstance(data, dict):
            validated = AdSpendInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(f"Submitting Ad Spend: {validated.platform} (${validated.amount}) on {validated.date}")
        return self._post("/ads", payload)

    # ==================================================================
    # 7. BANK TREASURY FORM FILLER
    # ==================================================================
    def fill_bank_transaction(self, data: Union[Dict[str, Any], BankTransactionInput]) -> Dict[str, Any]:
        """Records bank credit (+) or debit (-) entry with running balance reconciliation."""
        if isinstance(data, dict):
            validated = BankTransactionInput(**data)
        else:
            validated = data

        payload = validated.model_dump(exclude_none=True)
        logger.info(f"Submitting Bank Transaction: {validated.type} (${validated.amount})")
        return self._post("/bank", payload)

    # ==================================================================
    # 8. MASTER EXCEL & CSV SYNCHRONIZATION TRIGGER
    # ==================================================================
    def trigger_sync(self) -> Dict[str, Any]:
        """Explicitly flushes and synchronizes Sales_Inventory.xlsx, Logistic.xlsx & flat CSVs."""
        logger.info("Triggering Master Excel and 3NF CSV full synchronization...")
        return self._post("/stock/sync", {})

    # ==================================================================
    # BATCH & INBOX PROCESSORS
    # ==================================================================
    def process_file(self, file_path: Union[str, Path]) -> Dict[str, Any]:
        """Automatically detects file format and form type, and submits all records."""
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Input file not found: {path}")

        logger.info(f"Processing input file: {path.name}")
        results = {"success": 0, "failed": 0, "errors": []}

        if path.suffix.lower() == ".json":
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            if isinstance(data, dict):
                # Format: {"type": "sales", "records": [...]}
                form_type = data.get("type")
                records = data.get("records", [data])
            elif isinstance(data, list):
                form_type = self._infer_form_type_from_filename(path.name)
                records = data
            else:
                raise ValueError("JSON must contain an object or array of objects")

            for idx, item in enumerate(records, start=1):
                try:
                    self._dispatch_record(form_type, item)
                    results["success"] += 1
                except Exception as e:
                    results["failed"] += 1
                    results["errors"].append({"record_index": idx, "data": item, "error": str(e)})

        elif path.suffix.lower() == ".csv":
            form_type = self._infer_form_type_from_filename(path.name)
            with open(path, "r", encoding="utf-8", newline="") as f:
                reader = csv.DictReader(f)
                for idx, row in enumerate(reader, start=1):
                    # Filter out empty string keys/values
                    cleaned = {k.strip(): v.strip() for k, v in row.items() if k and v is not None and v.strip() != ""}
                    try:
                        self._dispatch_record(form_type, cleaned)
                        results["success"] += 1
                    except Exception as e:
                        results["failed"] += 1
                        results["errors"].append({"row_number": idx, "data": cleaned, "error": str(e)})
        else:
            raise ValueError(f"Unsupported file format: {path.suffix}. Please use .csv or .json")

        logger.info(f"Completed processing {path.name}: {results['success']} succeeded, {results['failed']} failed")
        return results

    def _infer_form_type_from_filename(self, filename: str) -> str:
        """Infers the form type from the filename prefix."""
        lower = filename.lower()
        if "sale" in lower:
            return "sales"
        elif "procure" in lower or "batch" in lower or "logistic" in lower:
            return "procurement"
        elif "rto" in lower:
            return "rto"
        elif "return" in lower:
            return "returns"
        elif "exch" in lower:
            return "exchanges"
        elif "ad" in lower or "market" in lower:
            return "ads"
        elif "bank" in lower or "treasury" in lower:
            return "bank"
        raise ValueError(f"Could not automatically detect form type from filename '{filename}'. "
                         "Please name file like 'sales_*.csv', 'procurement_*.csv', etc., or specify form type.")

    def _dispatch_record(self, form_type: str, record: Dict[str, Any]):
        """Dispatches a single record to its corresponding form filler."""
        ft = form_type.lower()
        if "sale" in ft:
            return self.fill_sales_order(record)
        elif "procure" in ft:
            return self.fill_procurement_batch(record)
        elif "rto" in ft:
            return self.fill_rto_entry(record)
        elif "return" in ft:
            return self.fill_customer_return(record)
        elif "exch" in ft:
            return self.fill_item_exchange(record)
        elif "ad" in ft:
            return self.fill_ad_spend(record)
        elif "bank" in ft:
            return self.fill_bank_transaction(record)
        else:
            raise ValueError(f"Unknown form type: '{form_type}'")

    def process_inbox(self) -> Dict[str, Any]:
        """Scans inputs/inbox/ directory for dropped CSV or JSON files and processes them all."""
        inbox_files = list(INBOX_DIR.glob("*.csv")) + list(INBOX_DIR.glob("*.json"))
        if not inbox_files:
            logger.info(f"No files found in inbox: {INBOX_DIR}")
            return {"files_processed": 0, "details": []}

        summary = {"files_processed": len(inbox_files), "details": []}
        for file_path in inbox_files:
            try:
                res = self.process_file(file_path)
                summary["details"].append({"file": file_path.name, "result": res})
                # Move to completed folder or append .done extension
                done_path = file_path.with_name(f"{file_path.name}.done")
                file_path.rename(done_path)
            except Exception as e:
                logger.error(f"Error processing {file_path.name}: {e}")
                summary["details"].append({"file": file_path.name, "error": str(e)})

        return summary
