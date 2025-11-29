import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from pathlib import Path
import os

# Шляхи (ми будемо запускати це всередині контейнера, тому шляхи абсолютні)
# Ми закинемо CSV файл прямо в корінь робочої директорії контейнера
DATA_PATH = Path("ship_fuel_efficiency.csv") 
ARTIFACTS_DIR = Path("/app/artifacts")

# Переконаємося, що папка існує
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

def retrain():
    print("🚀 Starting re-training inside Docker...")

    if not DATA_PATH.exists():
        print(f"Error: {DATA_PATH} not found inside container. Please copy it first.")
        return

    # 1. Завантаження
    print("Loading raw data...")
    df = pd.read_csv(DATA_PATH)

    # 2. Очищення (видалення CO2, якщо є, щоб уникнути витоку даних)
    if 'CO2_emissions' in df.columns:
        df = df.drop('CO2_emissions', axis=1)

    # 3. Препроцесинг (копіюємо логіку, щоб вона співпадала з main.py)
    print("Preprocessing...")
    
    # Weather Encoding
    weather_mapping = {'Calm': 0, 'Moderate': 1, 'Stormy': 2}
    df['weather_conditions'] = df['weather_conditions'].map(weather_mapping)

    # Cyclic Month
    # Спочатку мапимо назви місяців на числа (якщо вони текстом)
    month_map = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
        'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
    }
    # Перевірка: якщо місяць вже число, map поверне NaN, тому робимо перевірку
    if df['month'].dtype == 'O': # Object (string)
        df['month_num'] = df['month'].map(month_map)
    else:
        df['month_num'] = df['month']

    df['month_sin'] = np.sin(2 * np.pi * df['month_num'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month_num'] / 12)
    
    # Видаляємо проміжні колонки
    cols_to_drop = ['ship_id', 'month', 'month_num']
    df = df.drop([c for c in cols_to_drop if c in df.columns], axis=1)

    # One-Hot Encoding
    categorical_cols = ['ship_type', 'route_id', 'fuel_type']
    df = pd.get_dummies(df, columns=categorical_cols, drop_first=False) 
    # Важливо: drop_first=False або True має співпадати з вашою логікою. 
    # У вашому main.py використовується просто pd.get_dummies без drop_first, 
    # тому тут я теж прибрав drop_first, щоб кількість колонок зійшлася.

    # Видалення цільової змінної
    X = df.drop('fuel_consumption', axis=1)
    y = df['fuel_consumption']

    # Зберігаємо порядок ознак (це критично для main.py)
    feature_order = list(X.columns)
    print(f"Saving feature order ({len(feature_order)} features)...")
    joblib.dump(feature_order, ARTIFACTS_DIR / "feature_order.joblib")

    # 4. Масштабування
    print("Scaling...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, ARTIFACTS_DIR / "scaler.joblib")

    # 5. Навчання (Gradient Boosting, бо він був найкращим)
    print("Training GradientBoostingRegressor...")
    model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    joblib.dump(model, ARTIFACTS_DIR / "best_model.joblib")

    print("Done! All artifacts updated successfully.")

if __name__ == "__main__":
    retrain()