FROM python:3
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY . /code/
RUN python -m venv venv && . venv/bin/activate
RUN pip install --upgrade pip
RUN pip install -r requirements.txt