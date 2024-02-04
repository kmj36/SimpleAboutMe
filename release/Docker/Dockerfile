FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt update
RUN apt install -y gunicorn
RUN apt clean

WORKDIR /django_app
COPY requirements.txt .
RUN python -m venv venv && . venv/bin/activate
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . .