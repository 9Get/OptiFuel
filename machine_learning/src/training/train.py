import pandas as pd
import logging
import joblib
import shutil
from pathlib import Path

# Моделі
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

# Метрики
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Візуалізація
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Налаштування логування
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Визначення шляхів ---
# Використовуємо __file__ для визначення шляхів відносно поточного файлу
BASE_DIR = Path(__file__).parents[2]
PROCESSED_DATA_DIR = BASE_DIR / 'data/processed'
ARTIFACTS_DIR = BASE_DIR / 'artifacts'
RESULTS_DIR = BASE_DIR / 'results'

def load_data(data_dir: Path):
    """Завантажує оброблені дані з файлів."""
    logging.info(f"Завантаження даних з директорії {data_dir}...")
    try:
        X_train = pd.read_csv(data_dir / 'X_train.csv')
        y_train = pd.read_csv(data_dir / 'y_train.csv').values.ravel()
        X_test = pd.read_csv(data_dir / 'X_test.csv')
        y_test = pd.read_csv(data_dir / 'y_test.csv').values.ravel()
        logging.info("Дані успішно завантажено.")
        return X_train, X_test, y_train, y_test
    except FileNotFoundError as e:
        logging.error(f"Помилка: {e}. Запустіть скрипт передпроцесингу.")
        raise

def evaluate_model(y_true, y_pred):
    """Розраховує та повертає метрики якості моделі."""
    metrics = {
        "MAE": mean_absolute_error(y_true, y_pred),
        "RMSE": np.sqrt(mean_squared_error(y_true, y_pred)),
        "R-squared": r2_score(y_true, y_pred)
    }
    return metrics

def plot_predictions_vs_actual(y_true, y_pred, model_name: str, output_dir: Path):
    """Візуалізує 'Прогноз vs. Факт'."""
    plt.figure(figsize=(8, 8))
    sns.scatterplot(x=y_true, y=y_pred, alpha=0.6)
    plt.plot([y_true.min(), y_true.max()], [y_true.min(), y_true.max()], '--r', linewidth=2)
    plt.xlabel("Фактичне споживання палива")
    plt.ylabel("Прогнозоване споживання палива")
    plt.title(f"Прогноз vs. Факт для моделі: {model_name}")
    plt.grid(True)
    plt.savefig(output_dir / f"{model_name.replace(' ', '_')}_predictions_vs_actual.png")
    plt.close()

def plot_feature_importance(model, feature_names, model_name: str, output_dir: Path):
    """Візуалізує важливість ознак для моделі."""
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        title = f"Важливість ознак: {model_name}"
    elif hasattr(model, 'coef_'):
        importances = np.abs(model.coef_)
        title = f"Абсолютні коефіцієнти ознак: {model_name}"
    else:
        logging.warning(f"Модель {model_name} не підтримує відображення важливості ознак.")
        return

    feature_imp = pd.DataFrame(sorted(zip(importances, feature_names)), columns=['Value','Feature'])
    
    plt.figure(figsize=(10, 8))
    sns.barplot(x="Value", y="Feature", data=feature_imp.sort_values(by="Value", ascending=False).head(15))
    plt.title(title)
    plt.tight_layout()
    plt.savefig(output_dir / f"{model_name.replace(' ', '_')}_feature_importance.png")
    plt.close()

def main():
    """Головна функція для запуску навчання та оцінки моделей."""
    # Створення директорій
    ARTIFACTS_DIR.mkdir(exist_ok=True)
    RESULTS_DIR.mkdir(exist_ok=True)

    # Завантаження даних
    X_train, X_test, y_train, y_test = load_data(PROCESSED_DATA_DIR)

    # Визначення моделей
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, random_state=42)
    }

    results = {}
    best_model = None
    best_rmse = float('inf')
    best_model_name = ""

    # Цикл навчання та оцінки
    for name, model in models.items():
        logging.info(f"--- Навчання моделі: {name} ---")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = evaluate_model(y_test, y_pred)
        results[name] = metrics

        logging.info(f"Метрики для {name}: {metrics}")
        plot_predictions_vs_actual(y_test, y_pred, name, RESULTS_DIR)
        plot_feature_importance(model, X_train.columns, name, RESULTS_DIR)

        if metrics["RMSE"] < best_rmse:
            best_rmse = metrics["RMSE"]
            best_model = model
            best_model_name = name
            logging.info(f"Знайдено нову найкращу модель: {name} з RMSE={best_rmse:.4f}")

    # Збереження найкращої моделі та артефактів
    if best_model:
        logging.info(f"Збереження найкращої моделі '{best_model_name}' та артефактів...")
        joblib.dump(best_model, ARTIFACTS_DIR / 'best_model.joblib')

        # Копіюємо скейлер і порядок ознак з папки processed до artifacts
        for artifact in ['scaler.joblib', 'feature_order.joblib']:
            try:
                shutil.copy(PROCESSED_DATA_DIR / artifact, ARTIFACTS_DIR / artifact)
                logging.info(f"Артефакт '{artifact}' скопійовано до {ARTIFACTS_DIR}")
            except FileNotFoundError as e:
                logging.error(f"Помилка: {e}. Запустіть скрипт передпроцесингу.")
                raise
    
    # Вивід та збереження підсумкових результатів
    results_df = pd.DataFrame(results).T
    logging.info("\n--- Підсумкова таблиця результатів ---")
    print(results_df)
    results_df.to_csv(RESULTS_DIR / 'model_comparison_results.csv')

if __name__ == '__main__':
    main()