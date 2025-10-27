FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ml_service /app/ml_service
COPY ./artifacts /app/artifacts

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--app-dir", "ml_service"]