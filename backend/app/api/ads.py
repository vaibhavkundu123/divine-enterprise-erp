from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.models.entities import AdSpend
from backend.app.schemas.schemas import AdSpendCreate, AdSpendUpdate, AdSpendOut
from backend.app.services.excel_sync import sync_all
from backend.app.api.deps import log_audit

router = APIRouter(prefix="/api/ads", tags=["Marketing & Ad Spend"])

@router.get("", response_model=List[AdSpendOut])
def list_ad_spends(
    platform: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(AdSpend)
    if platform:
        query = query.filter(AdSpend.platform.ilike(f"%{platform.strip()}%"))
    if date:
        query = query.filter(AdSpend.date == date)
    return query.order_by(AdSpend.date.asc(), AdSpend.id.asc()).all()

@router.post("", response_model=AdSpendOut)
def create_ad_spend(
    payload: AdSpendCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ad = AdSpend(
        date=payload.date,
        platform=payload.platform.strip(),
        amount=round(payload.amount, 2),
        notes=payload.notes,
    )
    db.add(ad)
    db.commit()
    db.refresh(ad)

    log_audit(
        db,
        category="AD_SPEND",
        action="CREATE",
        summary=f"Logged ad spend: ${ad.amount:,.2f} on {ad.platform}",
    )
    background_tasks.add_task(sync_all)
    return ad

@router.put("/{ad_id}", response_model=AdSpendOut)
def update_ad_spend(
    ad_id: int,
    payload: AdSpendUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ad = db.query(AdSpend).filter(AdSpend.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad spend record not found")

    if payload.date is not None:
        ad.date = payload.date
    if payload.platform is not None:
        ad.platform = payload.platform.strip()
    if payload.amount is not None:
        ad.amount = round(payload.amount, 2)
    if payload.notes is not None:
        ad.notes = payload.notes

    db.commit()
    db.refresh(ad)

    log_audit(
        db,
        category="AD_SPEND",
        action="UPDATE",
        summary=f"Updated ad spend ID {ad.id} on {ad.platform}",
    )
    background_tasks.add_task(sync_all)
    return ad

@router.delete("/{ad_id}")
def delete_ad_spend(
    ad_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    ad = db.query(AdSpend).filter(AdSpend.id == ad_id).first()
    if not ad:
        raise HTTPException(status_code=404, detail="Ad spend record not found")

    amt = ad.amount
    plat = ad.platform
    db.delete(ad)
    db.commit()

    log_audit(
        db,
        category="AD_SPEND",
        action="DELETE",
        summary=f"Deleted ad spend entry ID {ad_id} (${amt:,.2f} on {plat})",
        status="WARNING",
    )
    background_tasks.add_task(sync_all)
    return {"message": "Ad spend entry deleted"}

@router.get("/summary")
def get_ad_summary(db: Session = Depends(get_db)):
    ads = db.query(AdSpend).all()
    by_platform = {}
    by_date = {}

    for a in ads:
        # Platform aggregation
        p = a.platform.strip()
        by_platform[p] = round(by_platform.get(p, 0.0) + a.amount, 2)

        # Date aggregation
        if a.date not in by_date:
            by_date[a.date] = {"date": a.date, "campaign_count": 0, "platforms": set(), "total_amount": 0.0}
        by_date[a.date]["campaign_count"] += 1
        by_date[a.date]["platforms"].add(a.platform)
        by_date[a.date]["total_amount"] += a.amount

    daily_list = []
    for d in sorted(by_date.keys(), reverse=True):
        entry = by_date[d]
        daily_list.append({
            "date": d,
            "campaign_count": entry["campaign_count"],
            "platforms_used": ", ".join(sorted(entry["platforms"])),
            "total_ad_spend": round(entry["total_amount"], 2),
        })

    return {
        "total_spend": round(sum(a.amount for a in ads), 2),
        "by_platform": by_platform,
        "daily_breakdown": daily_list,
    }
