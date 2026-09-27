import argparse
import json
import sys
from datetime import date
from pathlib import Path

# Ensure automation_agent is on sys.path
BASE_DIR = Path(__file__).resolve().parent
PARENT_DIR = BASE_DIR.parent
if str(PARENT_DIR) not in sys.path:
    sys.path.insert(0, str(PARENT_DIR))

from automation_agent.form_filler import FormFiller


def get_today_str() -> str:
    return date.today().isoformat()


def run_interactive(filler: FormFiller):
    print("\n" + "=" * 60)
    print(" 🤖  DIVINE ENTERPRISE ERP - INTERACTIVE FORM AGENT")
    print("=" * 60)
    print("Select a form to fill:")
    print(" 1) Sales Order Form (Customer Purchase & Dispatch)")
    print(" 2) Procurement Batch Form (Factory Intake & Cost Update)")
    print(" 3) Courier RTO Pipeline Form (Undelivered Parcel Intake)")
    print(" 4) Customer Return & QC Form (Return with Reason/Grading)")
    print(" 5) Item Exchange Form (Swap Outflow & Inward Staging)")
    print(" 6) Marketing Ad Spend Form (Campaign Spend & ROAS)")
    print(" 7) Bank Treasury Form (Credit/Debit Ledger Entry)")
    print(" 8) Process All Files in 'inputs/inbox/' Folder")
    print(" 9) Trigger Master Excel & 3NF CSV Full Sync")
    print(" 0) Exit")
    print("-" * 60)

    choice = input("Enter choice (0-9): ").strip()
    if choice == "0":
        print("Goodbye!")
        return

    today = get_today_str()

    try:
        if choice == "1":
            print("\n--- RECORD NEW SALE ---")
            dt = input(f"Date [{today}]: ").strip() or today
            style = input("Product Style SKU (e.g. DE26001G): ").strip().upper()
            qty = int(input("Quantity [1]: ").strip() or "1")
            price_input = input("Unit Selling Price (press enter if providing Total Revenue): ").strip()
            rev_input = input("Total Revenue (press enter if provided Unit Price): ").strip()

            price = float(price_input) if price_input else None
            rev = float(rev_input) if rev_input else None
            ref = input("Order Reference/Channel [Sale]: ").strip() or "Sale"

            # Show live preview
            try:
                preview = filler.preview_sale(style, qty, price, rev)
                print("\n📊 Pre-Submission Margin Preview:")
                print(f"   • Calculated Revenue: ${preview.get('total_revenue', 0):.2f}")
                print(f"   • Dispatched COGS:    ${preview.get('cogs', 0):.2f}")
                print(f"   • Estimated Profit:   ${preview.get('profit', 0):.2f}")
                print(f"   • Gross Margin:       {preview.get('profit_margin', 0):.1f}%")
                print(f"   • Current Stock:      {preview.get('stock_on_hand', 0)} units available")
                confirm = input("\nProceed with submission? (Y/n): ").strip().lower()
                if confirm in ("n", "no"):
                    print("Submission cancelled.")
                    return
            except Exception as e:
                print(f"Preview note: {e}")

            res = filler.fill_sales_order({
                "date": dt,
                "style_no": style,
                "quantity_sold": qty,
                "selling_price": price,
                "total_revenue": rev,
                "reference": ref,
            })
            print("\n✅ Sales Order successfully created!")
            print(f"   Order ID: #{res.get('id')}, Style: {res.get('style_no')}, Profit: ${res.get('profit', 0):.2f}")

        elif choice == "2":
            print("\n--- RECORD INWARD PROCUREMENT BATCH ---")
            dt = input(f"Date [{today}]: ").strip() or today
            style = input("Product Style SKU (e.g. DE26001G): ").strip().upper()
            units = int(input("Units Received (inventory): ").strip())
            rate = float(input("Cost Price Per Unit (purchase_rate): ").strip())

            res = filler.fill_procurement_batch({
                "date": dt,
                "style_no": style,
                "inventory": units,
                "purchase_rate": rate,
            })
            print("\n✅ Procurement Batch logged!")
            print(f"   Batch ID: #{res.get('id')}, Total Value: ${res.get('total_value', 0):.2f}")

        elif choice == "3":
            print("\n--- RECORD COURIER RTO PARCEL ---")
            dt = input(f"Date [{today}]: ").strip() or today
            style = input("Product Style SKU: ").strip().upper()
            qty = int(input("Quantity [1]: ").strip() or "1")
            price = float(input("Original Sale Price: ").strip())
            courier_fee = float(input("Courier Shipping Fee [0.0]: ").strip() or "0.0")
            tracking = input("Courier Tracking / AWB No: ").strip()

            res = filler.fill_rto_entry({
                "date": dt,
                "style_no": style,
                "quantity": qty,
                "sale_price": price,
                "courier_fee": courier_fee,
                "tracking_no": tracking,
            })
            print("\n✅ RTO parcel placed into Stage 1 (In Transit quarantine)!")
            print(f"   RTO ID: {res.get('rto_id')}, AWB: {res.get('tracking_no')}")

        elif choice == "4":
            print("\n--- RECORD CUSTOMER RETURN ---")
            dt = input(f"Date [{today}]: ").strip() or today
            style = input("Product Style SKU: ").strip().upper()
            qty = int(input("Quantity [1]: ").strip() or "1")
            refund = float(input("Refund Amount: ").strip())
            fee = float(input("Reverse Courier Fee [175.0]: ").strip() or "175.0")
            print("Select Reason:")
            print(" 1) Size Too Small / Fit Issue")
            print(" 2) Fabric Quality / Color")
            print(" 3) Defective / Stitching")
            print(" 4) Wrong Item Sent")
            print(" 5) Changed Mind")
            rc = input("Reason (1-5) [1]: ").strip() or "1"
            reasons = {
                "1": "Size Too Small / Fit Issue",
                "2": "Fabric Quality / Color",
                "3": "Defective / Stitching",
                "4": "Wrong Item Sent",
                "5": "Changed Mind",
            }
            reason = reasons.get(rc, "Size Too Small / Fit Issue")
            awb = input("Reverse AWB: ").strip()

            res = filler.fill_customer_return({
                "date": dt,
                "style_no": style,
                "quantity": qty,
                "refund_amount": refund,
                "reverse_fee": fee,
                "primary_reason": reason,
                "reverse_awb": awb,
            })
            print("\n✅ Customer Return logged into QC Buffer!")
            print(f"   Return ID: {res.get('return_id')}, Status: {res.get('status')}")

        elif choice == "5":
            print("\n--- RECORD ITEM EXCHANGE ---")
            dt = input(f"Date [{today}]: ").strip() or today
            orig_style = input("Original Style SKU (Returned): ").strip().upper()
            exch_style = input("Exchanged Style SKU (Dispatched Replacement): ").strip().upper()
            qty = int(input("Quantity [1]: ").strip() or "1")
            price = float(input("Standard Retail Price of Replacement: ").strip())
            fee = float(input("Reverse Shipping Fee [175.0]: ").strip() or "175.0")
            awb = input("Reverse AWB: ").strip()

            res = filler.fill_item_exchange({
                "date": dt,
                "original_style": orig_style,
                "exchanged_style": exch_style,
                "quantity": qty,
                "standard_price": price,
                "reverse_fee": fee,
                "reverse_awb": awb,
            })
            print("\n✅ Item Exchange submitted!")
            print(f"   Exchange ID: {res.get('exchange_id')}, Settlement: ${res.get('amount_received', 0):.2f}")

        elif choice == "6":
            print("\n--- RECORD MARKETING AD SPEND ---")
            dt = input(f"Date [{today}]: ").strip() or today
            print("Platforms: Meta Ads, Google Ads, TikTok Ads, Influencer")
            platform = input("Platform [Meta Ads]: ").strip() or "Meta Ads"
            amount = float(input("Spend Amount: ").strip())
            notes = input("Campaign Notes: ").strip()

            res = filler.fill_ad_spend({
                "date": dt,
                "platform": platform,
                "amount": amount,
                "notes": notes,
            })
            print("\n✅ Ad Spend recorded!")
            print(f"   ID: #{res.get('id')}, Platform: {res.get('platform')}, Amount: ${res.get('amount'):.2f}")

        elif choice == "7":
            print("\n--- RECORD BANK TRANSACTION ---")
            dt = input(f"Date [{today}]: ").strip() or today
            t = input("Type (Credit / Debit) [Credit]: ").strip().capitalize() or "Credit"
            amount = float(input("Amount: ").strip())

            res = filler.fill_bank_transaction({
                "date": dt,
                "type": t,
                "amount": amount,
            })
            print("\n✅ Bank Transaction recorded!")
            print(f"   ID: #{res.get('id')}, New Running Balance: ${res.get('running_balance', 0):.2f}")

        elif choice == "8":
            print("\n--- PROCESSING INBOX FOLDER ---")
            summary = filler.process_inbox()
            print(json.dumps(summary, indent=2))

        elif choice == "9":
            print("\n--- TRIGGERING MASTER EXCEL SYNC ---")
            res = filler.trigger_sync()
            print(json.dumps(res, indent=2))

    except Exception as e:
        print(f"\n❌ Error: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Divine Enterprise ERP - Automated Form Filler CLI & Agent Runner"
    )
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Status check
    subparsers.add_parser("status", help="Check live system status and diagnostics")

    # Interactive mode
    subparsers.add_parser("interactive", help="Start step-by-step interactive form filling wizard")

    # Process Inbox
    subparsers.add_parser("inbox", help="Process all CSV/JSON files in 'inputs/inbox/' folder")

    # Process Single File
    file_parser = subparsers.add_parser("file", help="Process a single CSV or JSON file")
    file_parser.add_argument("path", type=str, help="Path to CSV or JSON file")

    # Master Sync
    subparsers.add_parser("sync", help="Trigger master Excel & CSV sync")

    # Single Sales Order
    sale_parser = subparsers.add_parser("sale", help="Submit a new sales order")
    sale_parser.add_argument("--style", required=True, help="Style SKU (e.g. DE26001G)")
    sale_parser.add_argument("--qty", type=int, default=1, help="Quantity sold")
    sale_parser.add_argument("--price", type=float, default=None, help="Unit selling price")
    sale_parser.add_argument("--revenue", type=float, default=None, help="Total revenue")
    sale_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")
    sale_parser.add_argument("--ref", default="Sale", help="Order reference")

    # Single Procurement
    proc_parser = subparsers.add_parser("procurement", help="Submit an inward procurement batch")
    proc_parser.add_argument("--style", required=True, help="Style SKU")
    proc_parser.add_argument("--units", type=int, required=True, help="Inventory units")
    proc_parser.add_argument("--rate", type=float, required=True, help="Purchase rate")
    proc_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    # Single RTO
    rto_parser = subparsers.add_parser("rto", help="Submit a courier RTO entry")
    rto_parser.add_argument("--style", required=True, help="Style SKU")
    rto_parser.add_argument("--qty", type=int, default=1, help="Quantity")
    rto_parser.add_argument("--price", type=float, required=True, help="Sale price")
    rto_parser.add_argument("--fee", type=float, default=0.0, help="Courier penalty fee")
    rto_parser.add_argument("--tracking", default=None, help="Tracking AWB")
    rto_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    # Single Return
    ret_parser = subparsers.add_parser("return", help="Submit a customer return")
    ret_parser.add_argument("--style", required=True, help="Style SKU")
    ret_parser.add_argument("--refund", type=float, required=True, help="Refund amount")
    ret_parser.add_argument("--qty", type=int, default=1, help="Quantity")
    ret_parser.add_argument("--fee", type=float, default=175.0, help="Reverse shipping fee")
    ret_parser.add_argument("--reason", default="Size Too Small / Fit Issue", help="Return reason")
    ret_parser.add_argument("--awb", default=None, help="Reverse AWB tracking")
    ret_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    # Single Exchange
    exch_parser = subparsers.add_parser("exchange", help="Submit an item exchange")
    exch_parser.add_argument("--orig", required=True, help="Original style SKU")
    exch_parser.add_argument("--new", required=True, help="Replacement style SKU")
    exch_parser.add_argument("--price", type=float, required=True, help="Standard price")
    exch_parser.add_argument("--qty", type=int, default=1, help="Quantity")
    exch_parser.add_argument("--fee", type=float, default=175.0, help="Reverse shipping fee")
    exch_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    # Single Ad
    ad_parser = subparsers.add_parser("ad", help="Submit an ad spend entry")
    ad_parser.add_argument("--platform", required=True, help="Platform (e.g. Meta Ads, Google Ads)")
    ad_parser.add_argument("--amount", type=float, required=True, help="Spend amount")
    ad_parser.add_argument("--notes", default=None, help="Campaign notes")
    ad_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    # Single Bank
    bank_parser = subparsers.add_parser("bank", help="Submit a bank credit or debit")
    bank_parser.add_argument("--type", choices=["Credit", "Debit"], required=True, help="Credit or Debit")
    bank_parser.add_argument("--amount", type=float, required=True, help="Amount")
    bank_parser.add_argument("--date", default=get_today_str(), help="Date (YYYY-MM-DD)")

    args = parser.parse_args()
    filler = FormFiller()

    if not args.command:
        # Default to interactive if no command provided
        run_interactive(filler)
        return

    if args.command == "interactive":
        run_interactive(filler)
    elif args.command == "status":
        print(json.dumps(filler.check_health(), indent=2))
    elif args.command == "inbox":
        print(json.dumps(filler.process_inbox(), indent=2))
    elif args.command == "file":
        print(json.dumps(filler.process_file(args.path), indent=2))
    elif args.command == "sync":
        print(json.dumps(filler.trigger_sync(), indent=2))
    elif args.command == "sale":
        res = filler.fill_sales_order({
            "date": args.date,
            "style_no": args.style,
            "quantity_sold": args.qty,
            "selling_price": args.price,
            "total_revenue": args.revenue,
            "reference": args.ref,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "procurement":
        res = filler.fill_procurement_batch({
            "date": args.date,
            "style_no": args.style,
            "inventory": args.units,
            "purchase_rate": args.rate,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "rto":
        res = filler.fill_rto_entry({
            "date": args.date,
            "style_no": args.style,
            "quantity": args.qty,
            "sale_price": args.price,
            "courier_fee": args.fee,
            "tracking_no": args.tracking,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "return":
        res = filler.fill_customer_return({
            "date": args.date,
            "style_no": args.style,
            "quantity": args.qty,
            "refund_amount": args.refund,
            "reverse_fee": args.fee,
            "primary_reason": args.reason,
            "reverse_awb": args.awb,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "exchange":
        res = filler.fill_item_exchange({
            "date": args.date,
            "original_style": args.orig,
            "exchanged_style": args.new,
            "quantity": args.qty,
            "standard_price": args.price,
            "reverse_fee": args.fee,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "ad":
        res = filler.fill_ad_spend({
            "date": args.date,
            "platform": args.platform,
            "amount": args.amount,
            "notes": args.notes,
        })
        print(json.dumps(res, indent=2))
    elif args.command == "bank":
        res = filler.fill_bank_transaction({
            "date": args.date,
            "type": args.type,
            "amount": args.amount,
        })
        print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
