# Use the official Python image from the Docker Hub
# FROM python:3.11-slim
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (for yt-dlp and Flask)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install the Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the port that your Flask app will run on
EXPOSE 3000

# Run the Flask application
CMD ["python", "bot.py"]

# Run the Flask Telegram bot
# CMD ["python", "angel.py"]
