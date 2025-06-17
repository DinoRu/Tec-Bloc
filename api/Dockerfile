# -------- 🏗️ Étape 1 : builder --------
FROM python:3.12-slim as builder

WORKDIR /app

# Dépendances système pour compilation
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        gcc && \
    rm -rf /var/lib/apt/lists/*

# Copie + install des dépendances dans un dossier temporaire
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# -------- 🧼 Étape 2 : image finale propre --------
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Client PostgreSQL (utile à l'exécution uniquement si tu utilises psql)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Copie des dépendances préinstallées depuis le builder
COPY --from=builder /install /usr/local

COPY . .

EXPOSE 8000
