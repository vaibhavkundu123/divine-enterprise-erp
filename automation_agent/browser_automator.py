import argparse
import sys
import time
from pathlib import Path
from typing import Optional

# Configuration
WEB_APP_URL = "http://localhost:8000"


def fill_sale_modal_playwright(
    page,
    style_no: str,
    quantity: int = 1,
    price: Optional[float] = None,
    revenue: Optional[float] = None,
    reference: str = "Sale",
):
    """Fills the GlobalRecordSaleModal on the live React HUD."""
    print(f"Opening Record Sale modal for {style_no}...")
    # Click Global "Record Sale" button on top bar or dashboard
    page.click("button:has-text('Record Sale')")
    page.wait_for_selector("text=Record New Sale Order")

    # Fill Style SKU
    page.fill("input#sale-style-input, input[placeholder*='DE26001G']", style_no)

    # Fill Quantity
    page.fill("input#sale-quantity-input, input[type='number']", str(quantity))

    # Fill Price or Revenue
    if price is not None:
        page.fill("input#sale-price-input", str(price))
    elif revenue is not None:
        page.fill("input#sale-revenue-input", str(revenue))

    # Fill Reference
    if reference:
        page.fill("input#sale-ref-input", reference)

    time.sleep(1)  # Allow live preview calculation to update

    # Submit form
    page.click("button[type='submit']:has-text('Confirm Dispatch')")
    print(f"Submitted sale order for {style_no}!")


def run_browser_automation(
    action: str = "sale",
    url: str = WEB_APP_URL,
    headless: bool = False,
    **kwargs,
):
    """Launches Playwright Chromium to visually perform form operations on the frontend."""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("\n[!] Playwright is not installed in the current environment.")
        print("To enable visual browser form automation, run:")
        print("    pip install playwright")
        print("    playwright install chromium")
        print("\nNote: You can also use the high-speed REST API FormFiller via:")
        print("    python agent_cli.py sale --style DE26001G --qty 2 --price 295.00")
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context()
        page = context.new_page()

        print(f"Navigating to Divine Enterprise ERP HUD at {url}...")
        page.goto(url, wait_until="networkidle")

        if action == "sale":
            fill_sale_modal_playwright(
                page,
                style_no=kwargs.get("style", "DE26001G"),
                quantity=kwargs.get("qty", 1),
                price=kwargs.get("price", 295.0),
                reference=kwargs.get("ref", "Agent Sale"),
            )

        time.sleep(2)
        browser.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Divine ERP Browser Form Automator")
    parser.add_argument("--action", default="sale", choices=["sale"], help="Form action")
    parser.add_argument("--style", default="DE26001G", help="Product SKU")
    parser.add_argument("--qty", type=int, default=1, help="Quantity")
    parser.add_argument("--price", type=float, default=295.0, help="Selling price")
    parser.add_argument("--url", default=WEB_APP_URL, help="Website URL")
    parser.add_argument("--headless", action="store_true", help="Run without UI window")
    args = parser.parse_args()

    run_browser_automation(
        action=args.action,
        url=args.url,
        headless=args.headless,
        style=args.style,
        qty=args.qty,
        price=args.price,
    )
