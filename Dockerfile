# Python বেস ইমেজ
FROM python:3.10-slim

# কাজের ডিরেক্টরি সেট করা
WORKDIR /app

# Assume you download yt-dlp to /app
RUN chmod +x /app/yt-dlp

# প্যাকেজ ইনস্টল করতে requirements.txt কপি করা
COPY requirements.txt /app/

# প্যাকেজ ইনস্টল করা
RUN pip install --no-cache-dir -r requirements.txt

# সোর্স কোড কপি করা (index.html সহ)
COPY . /app/

# পোর্ট এক্সপোজ করা
EXPOSE 3000

# অ্যাপ্লিকেশন চালানো
CMD ["python", "bot.py"]
