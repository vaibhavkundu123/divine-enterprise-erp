from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import BankTransaction
from backend.app.schemas.schemas import BankTransactionCreate, BankTransactionUpdate, BankTransactionOut
from backend.app.services.financial_engine import calculate_bank_running_balance
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/bank", tags=["Bank Reconciliation"])

def recalculate_all_bank_balances(db: Session) -> float:
    """Recalculates running balances chronologically across all transactions"""
    txs = db.query(BankTransaction).order_by(BankTransaction.date.asc(), BankTransaction.id.asc()).all()
    balance = 0.0
    for idx, tx in enumerate(txs, start=1):
        tx.sl_no = idx
        is_credit = "credit" in tx.type.lower() or "(+)" in tx.type
        credit = tx.amount if is_credit else 0.0
        debit = tx.amount if not is_credit else 0.0
        balance = calculate_bank_running_balance(balance, credit_amount=credit, debit_amount=debit)
        tx.running_balance = round(balance, 2)
    db.commit()
    return balance

@router.get("", response_model=List[BankTransactionOut])
def list_bank_transactions(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(BankTransaction)
    if type:
        query = query.filter(BankTransaction.type.ilike(f"%{type.strip()}%"))
    return query.order_by(BankTransaction.date.asc(), BankTransaction.sl_no.asc(), BankTransaction.id.asc()).all()

@router.post("", response_model=BankTransactionOut)
def create_bank_transaction(
    payload: BankTransactionCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    tx = BankTransaction(
        date=payload.date,
        type=payload.type.strip(),
        amount=round(payload.amount, 2),
        running_balance=0.0,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    # Recalculate all running balances
    recalculate_all_bank_balances(db)
    db.refresh(tx)

    log_audit(
        db,
        category="BANK",
        action="CREATE",
        summary=f"Logged bank transaction: {tx.type} of ${tx.amount:,.2f} on {tx.date}",
        details=f"Current Balance: ${tx.running_balance:,.2f}",
    )
    background_tasks.add_task(sync_all)
    return tx

@router.put("/{tx_id}", response_model=BankTransactionOut)
def update_bank_transaction(
    tx_id: int,
    payload: BankTransactionUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    tx = db.query(BankTransaction).filter(BankTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Bank transaction not found")

    if payload.date is not None:
        tx.date = payload.date
    if payload.type is not None:
        tx.type = payload.type.strip()
    if payload.amount is not None:
        tx.amount = round(payload.amount, 2)

    db.commit()
    recalculate_all_bank_balances(db)
    db.refresh(tx)

    log_audit(
        db,
        category="BANK",
        action="UPDATE",
        summary=f"Updated bank transaction #{tx.sl_no}",
    )
    background_tasks.add_task(sync_all)
    return tx

@router.delete("/{tx_id}")
def delete_bank_transaction(
    tx_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    tx = db.query(BankTransaction).filter(BankTransaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Bank transaction not found")

    sl = tx.sl_no
    db.delete(tx)
    db.commit()
    recalculate_all_bank_balances(db)

    log_audit(
        db,
        category="BANK",
        action="DELETE",
        summary=f"Deleted bank transaction #{sl}",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Bank transaction deleted and running balances updated"}
