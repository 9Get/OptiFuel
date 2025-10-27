import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from pathlib import Path
import logging
import joblib

# Налаштування логування для відстеження процесу
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class FuelDataProcessor:
    """
    Клас для повного циклу передпроцесингу даних про ефективність палива на суднах.
    """
    def __init__(self, raw_data_path: Path, processed_data_dir: Path):
        self.raw_data_path = raw_data_path
        self.processed_data_dir = processed_data_dir
        self.raw_df = None
        self.processed_df = None
        self.X_train, self.X_test, self.y_train, self.y_test = [None] * 4
        self.scaler = StandardScaler()
        self.feature_order = None

    def execute(self, target_column: str, test_size: float = 0.2, random_state: int = 42):
        """Запускає повний конвеєр обробки даних."""
        self._load_data()
        self._preprocess()
        self._split_and_scale_data(target_column, test_size, random_state)
        self._save_artifacts()

    def _load_data(self):
        """Завантажує дані з CSV-файлу."""
        logging.info(f"Завантаження даних з {self.raw_data_path}...")
        try:
            self.raw_df = pd.read_csv(self.raw_data_path)
            logging.info("Дані успішно завантажено.")
        except FileNotFoundError:
            logging.error(f"Файл не знайдено за шляхом: {self.raw_data_path}")
            raise

    def _preprocess(self):
        """Виконує обробку даних: кодування, інжиніринг ознак, обробку мультиколінеарності."""
        logging.info("Початок передпроцесингу даних...")
        df = self.raw_df.copy()
        
        df = self._encode_categorical(df)
        df = self._engineer_features(df)
        df = self._handle_multicollinearity(df)

        # Видаляємо ID, він не потрібен для моделі
        self.processed_df = df.drop(columns=['ship_id'])
        logging.info("Передпроцесинг завершено.")

    def _encode_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
        """Кодує категоріальні ознаки."""
        logging.info("Кодування категоріальних ознак...")
        weather_mapping = {'Calm': 0, 'Moderate': 1, 'Stormy': 2}
        df['weather_conditions'] = df['weather_conditions'].map(weather_mapping)
        df = pd.get_dummies(df, columns=['ship_type', 'route_id', 'fuel_type'], drop_first=True)
        return df

    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Створює нові, більш інформативні ознаки."""
        logging.info("Інжиніринг ознак...")
        month_map = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
            'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
        }
        df['month_num'] = df['month'].map(month_map)
        df['month_sin'] = np.sin(2 * np.pi * df['month_num'] / 12)
        df['month_cos'] = np.cos(2 * np.pi * df['month_num'] / 12)
        return df.drop(columns=['month', 'month_num'])

    def _handle_multicollinearity(self, df: pd.DataFrame) -> pd.DataFrame:
        """Видаляє висококорельовані ознаки."""
        logging.info("Обробка мультиколінеарності (видалення CO2_emissions)...")
        return df.drop(columns=['CO2_emissions'])

    def _split_and_scale_data(self, target_column: str, test_size: float, random_state: int):
        """Розділяє дані та масштабує ознаки."""
        logging.info("Розділення даних на тренувальну та тестову вибірки...")
        X = self.processed_df.drop(columns=[target_column])
        y = self.processed_df[target_column]
        
        # <--- ВАЖЛИВО: Зберігаємо порядок колонок ДО масштабування
        self.feature_order = X.columns.tolist()

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )

        logging.info("Масштабування числових ознак...")
        self.X_train = pd.DataFrame(self.scaler.fit_transform(self.X_train), columns=self.X_train.columns)
        self.X_test = pd.DataFrame(self.scaler.transform(self.X_test), columns=self.X_test.columns)

    def _save_artifacts(self):
        """Зберігає оброблені дані та артефакти (скейлер, порядок ознак)."""
        logging.info(f"Збереження артефактів у директорію {self.processed_data_dir}...")
        self.processed_data_dir.mkdir(parents=True, exist_ok=True)

        # Збереження датасетів
        self.X_train.to_csv(self.processed_data_dir / 'X_train.csv', index=False)
        self.X_test.to_csv(self.processed_data_dir / 'X_test.csv', index=False)
        self.y_train.to_csv(self.processed_data_dir / 'y_train.csv', index=False, header=True)
        self.y_test.to_csv(self.processed_data_dir / 'y_test.csv', index=False, header=True)

        # Збереження скейлера та порядку ознак
        joblib.dump(self.scaler, self.processed_data_dir / 'scaler.joblib')
        joblib.dump(self.feature_order, self.processed_data_dir / 'feature_order.joblib')

        logging.info("Всі артефакти передпроцесингу успішно збережено.")

if __name__ == '__main__':
    # --- Блок конфігурації для запуску цього файлу напряму ---
    BASE_ML_SERVICE_DIR = Path(__file__).parents[2]

    RAW_DATA_PATH = BASE_ML_SERVICE_DIR / 'data/raw/ship_fuel_efficiency.csv'
    PROCESSED_DATA_DIR = BASE_ML_SERVICE_DIR / 'data/processed'
    TARGET_COLUMN = 'fuel_consumption'

    # --- Запуск конвеєра обробки ---
    try:
        processor = FuelDataProcessor(
            raw_data_path=RAW_DATA_PATH,
            processed_data_dir=PROCESSED_DATA_DIR
        )
        processor.execute(target_column=TARGET_COLUMN)
        
        print(f"\nКонвеєр обробки даних успішно завершено.")
        print(f"Збережено у: {PROCESSED_DATA_DIR.resolve()}")
    except Exception as e:
        logging.error(f"Під час виконання сталася помилка: {e}", exc_info=True)