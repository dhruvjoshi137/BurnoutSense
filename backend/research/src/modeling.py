from __future__ import annotations

from dataclasses import dataclass
from typing import Dict

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .config import CATEGORICAL_FEATURES, NUMERIC_FEATURES


@dataclass
class TrainedArtifacts:
    model: Pipeline
    feature_names: list[str]


def _build_preprocessor() -> ColumnTransformer:
    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, NUMERIC_FEATURES),
            ("cat", categorical_pipeline, CATEGORICAL_FEATURES),
        ]
    )


def build_random_forest_pipeline() -> Pipeline:
    classifier = RandomForestClassifier(
        n_estimators=500,
        max_depth=18,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features="sqrt",
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )
    return Pipeline(
        steps=[
            ("preprocessor", _build_preprocessor()),
            ("classifier", classifier),
        ]
    )


def build_logistic_regression_pipeline() -> Pipeline:
    classifier = LogisticRegression(
        random_state=42,
        max_iter=1200,
        C=1.5,
        solver="lbfgs",
        class_weight="balanced",
    )
    return Pipeline(
        steps=[
            ("preprocessor", _build_preprocessor()),
            ("classifier", classifier),
        ]
    )


def build_model_pipeline() -> Pipeline:
    return build_random_forest_pipeline()
