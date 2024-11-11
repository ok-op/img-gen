# Python base image ব্যবহার করা হচ্ছে
FROM python:3.10-slim

# কাজের ডিরেক্টরি সেট করা
WORKDIR /app

# প্রয়োজনীয় প্যাকেজগুলোর ইনস্টল করা
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# কোড কপি করা
COPY . .

# Flask পরিবেশ ভেরিয়েবল সেট করা
ENV FLASK_APP=bot.py
ENV FLASK_ENV=production
ENV FLASK_DEBUG=0

# Gunicorn দিয়ে Flask অ্যাপ রান করা
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "bot:app"]
