from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns


def generate_visualizations(df: pd.DataFrame, output_dir: Path) -> list[Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    sns.set_theme(style="whitegrid")

    created_files: list[Path] = []

    plt.figure(figsize=(8, 5))
    sns.scatterplot(data=df, x="CGPA", y="Stress_Level", hue="Burnout_Category", alpha=0.75)
    plt.title("Stress Level vs CGPA")
    plt.tight_layout()
    stress_vs_cgpa = output_dir / "stress_vs_cgpa.png"
    plt.savefig(stress_vs_cgpa, dpi=150)
    plt.close()
    created_files.append(stress_vs_cgpa)

    plt.figure(figsize=(8, 5))
    sns.countplot(data=df, x="Sleep_Quality", hue="Burnout_Category")
    plt.title("Sleep Quality vs Burnout")
    plt.tight_layout()
    sleep_vs_burnout = output_dir / "sleep_quality_vs_burnout.png"
    plt.savefig(sleep_vs_burnout, dpi=150)
    plt.close()
    created_files.append(sleep_vs_burnout)

    plt.figure(figsize=(8, 5))
    sns.boxplot(data=df, x="Burnout_Category", y="Financial_Stress")
    plt.title("Financial Stress vs Burnout")
    plt.tight_layout()
    financial_vs_burnout = output_dir / "financial_stress_vs_burnout.png"
    plt.savefig(financial_vs_burnout, dpi=150)
    plt.close()
    created_files.append(financial_vs_burnout)

    return created_files
