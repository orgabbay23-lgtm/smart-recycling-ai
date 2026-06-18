FROM python:3.12-slim

ENV PIP_NO_CACHE_DIR=1
ENV PORT=7860
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-api.txt .

RUN python -m pip install --upgrade pip \
    && python -m pip install --index-url https://download.pytorch.org/whl/cpu torch torchvision \
    && python -m pip install -r requirements-api.txt

COPY backend ./backend
COPY models/checkpoints/efficientnetv2_waste_best.pth ./models/checkpoints/efficientnetv2_waste_best.pth
COPY models/checkpoints/efficientnetv2_freshness_best.pth ./models/checkpoints/efficientnetv2_freshness_best.pth

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
