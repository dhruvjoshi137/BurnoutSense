from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.db_models import DailyProgress, User
from app.models.schemas import DailyProgressCreateRequest, DailyProgressResponse, RiskSummaryResponse
from app.services.abi import classify_risk, compute_abi
from app.services.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["User Progress"])


def _to_response(model: DailyProgress) -> DailyProgressResponse:
    return DailyProgressResponse(
        id=model.id,
        entry_date=model.entry_date,
        sleep_hours=model.sleep_hours,
        study_hours=model.study_hours,
        screen_time=model.screen_time,
        stress_level=model.stress_level,
        mood_level=model.mood_level,
        notes=model.notes,
        burnout_score=model.burnout_score,
        risk_level=model.risk_level,
        created_at=model.created_at,
    )


@router.post("", response_model=DailyProgressResponse)
def create_or_update_progress(
    payload: DailyProgressCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DailyProgressResponse:
    entry_date = payload.entry_date or date.today()

    score, _ = compute_abi(
        sleep_hours=payload.sleep_hours,
        study_hours=payload.study_hours,
        screen_time=payload.screen_time,
        stress_level=payload.stress_level,
        mood_level=payload.mood_level,
    )
    risk = classify_risk(score)

    existing = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == current_user.id, DailyProgress.entry_date == entry_date)
        .first()
    )

    if existing:
        existing.sleep_hours = payload.sleep_hours
        existing.study_hours = payload.study_hours
        existing.screen_time = payload.screen_time
        existing.stress_level = payload.stress_level
        existing.mood_level = payload.mood_level
        existing.notes = payload.notes
        existing.burnout_score = score
        existing.risk_level = risk
        db.commit()
        db.refresh(existing)
        return _to_response(existing)

    progress = DailyProgress(
        user_id=current_user.id,
        entry_date=entry_date,
        sleep_hours=payload.sleep_hours,
        study_hours=payload.study_hours,
        screen_time=payload.screen_time,
        stress_level=payload.stress_level,
        mood_level=payload.mood_level,
        notes=payload.notes,
        burnout_score=score,
        risk_level=risk,
    )
    db.add(progress)
    db.commit()
    db.refresh(progress)

    return _to_response(progress)


@router.get("", response_model=list[DailyProgressResponse])
def list_progress(
    from_date: date | None = Query(default=None),
    to_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[DailyProgressResponse]:
    query = db.query(DailyProgress).filter(DailyProgress.user_id == current_user.id)

    if from_date:
        query = query.filter(DailyProgress.entry_date >= from_date)
    if to_date:
        query = query.filter(DailyProgress.entry_date <= to_date)

    records = query.order_by(DailyProgress.entry_date.asc()).all()
    return [_to_response(record) for record in records]


@router.get("/latest", response_model=DailyProgressResponse)
def latest_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DailyProgressResponse:
    record = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == current_user.id)
        .order_by(DailyProgress.entry_date.desc())
        .first()
    )
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No progress entries found")

    return _to_response(record)


@router.get("/summary", response_model=RiskSummaryResponse)
def risk_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> RiskSummaryResponse:
    records = (
        db.query(DailyProgress)
        .filter(DailyProgress.user_id == current_user.id)
        .order_by(DailyProgress.entry_date.asc())
        .all()
    )

    if not records:
        return RiskSummaryResponse(
            total_entries=0,
            latest_score=None,
            latest_risk_level=None,
            avg_last_7_days=None,
            high_risk_count_last_7_days=0,
            improving_trend=False,
        )

    latest = records[-1]
    seven_days_ago = date.today() - timedelta(days=6)
    last_week = [r for r in records if r.entry_date >= seven_days_ago]

    avg_last_7_days = round(sum(r.burnout_score for r in last_week) / len(last_week), 2) if last_week else None
    high_count = sum(1 for r in last_week if r.risk_level == "high")

    improving = False
    if len(records) >= 3:
        last_three = records[-3:]
        improving = (
            last_three[2].burnout_score <= last_three[1].burnout_score
            and last_three[1].burnout_score <= last_three[0].burnout_score
        )

    return RiskSummaryResponse(
        total_entries=len(records),
        latest_score=latest.burnout_score,
        latest_risk_level=latest.risk_level,
        avg_last_7_days=avg_last_7_days,
        high_risk_count_last_7_days=high_count,
        improving_trend=improving,
    )
